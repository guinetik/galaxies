"""
NSA Galaxy Enrichment ETL

Post-processes galaxies.db to add NSA catalog identifiers (IAUNAME, SUBDIR, PID).

Usage:
  python enrich_galaxies_with_nsa.py --db-path ../../site/public/data/galaxies.db

This script should be run AFTER src/main/python/combined/main.py
"""

import argparse
import logging
import sqlite3
import sys
import time
from pathlib import Path
from typing import Optional, Dict, Tuple

from catalog_lookup import get_nsa_galaxy_info

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Constants
DB_DEFAULT_PATH = "../../site/public/data/galaxies.db"


def ensure_nsa_columns(db_path: str) -> None:
    """Ensure galaxies.db has NSA columns. Add if missing."""
    conn = sqlite3.connect(db_path, timeout=30.0)
    cur = conn.cursor()

    # Check if columns exist
    cur.execute("PRAGMA table_info(galaxies)")
    columns = {row[1] for row in cur.fetchall()}

    # Add missing columns
    if 'nsa_iauname' not in columns:
        cur.execute("ALTER TABLE galaxies ADD COLUMN nsa_iauname TEXT")
        logger.info("[+] Added nsa_iauname column")

    if 'nsa_subdir' not in columns:
        cur.execute("ALTER TABLE galaxies ADD COLUMN nsa_subdir TEXT")
        logger.info("[+] Added nsa_subdir column")

    if 'nsa_pid' not in columns:
        cur.execute("ALTER TABLE galaxies ADD COLUMN nsa_pid INTEGER")
        logger.info("[+] Added nsa_pid column")

    conn.commit()
    conn.close()


def match_galaxy(pgc: int, ra: float, dec: float) -> Optional[Dict]:
    """
    Match a single galaxy to NSA catalog.

    Returns:
        Dict with {iauname, subdir, pid} or None if no match
    """
    try:
        info = get_nsa_galaxy_info(ra=ra, dec=dec)
        logger.debug(f"PGC {pgc}: Matched to {info['iauname']}")
        return {
            'iauname': info['iauname'],
            'subdir': info['subdir'],
            'pid': info['pid']
        }
    except ValueError as e:
        # No match found - normal case
        return None
    except Exception as e:
        logger.warning(f"PGC {pgc} (RA {ra:.4f}, Dec {dec:.4f}) lookup error: {e}")
        return None


def format_time(seconds: float) -> str:
    """Format seconds to human-readable time."""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds/60:.1f}m"
    else:
        return f"{seconds/3600:.1f}h"


def process_galaxies(db_path: str) -> Tuple[int, int]:
    """
    Process all galaxies in database, match to NSA, update columns.

    Returns:
        (matched_count, total_count)
    """
    # Collect all matches first (avoiding concurrent DB access)
    matches_to_update = []

    conn = sqlite3.connect(db_path, timeout=30.0)
    cur = conn.cursor()

    # Get all galaxies with RA/Dec
    cur.execute("""
        SELECT pgc, ra, dec
        FROM galaxies
        WHERE ra IS NOT NULL AND dec IS NOT NULL
    """)
    rows = cur.fetchall()
    total = len(rows)
    matched = 0
    errors = 0

    conn.close()

    logger.info(f"Starting matching phase: {total:,} galaxies to process")
    start_time = time.time()
    last_report_time = start_time

    # First pass: match all galaxies (without DB writes)
    for i, (pgc, ra, dec) in enumerate(rows):
        result = match_galaxy(pgc, ra, dec)

        if result:
            matches_to_update.append((pgc, result['iauname'], result['subdir'], result['pid']))
            matched += 1

        # Progress reporting every 500 galaxies or every 5 seconds
        elapsed = time.time() - start_time
        if (i + 1) % 500 == 0 or (time.time() - last_report_time >= 5.0):
            rate = (i + 1) / elapsed
            remaining = (total - (i + 1)) / rate if rate > 0 else 0
            progress_pct = ((i + 1) / total * 100)
            match_rate = (matched / (i + 1) * 100) if (i + 1) > 0 else 0

            logger.info(
                f"Progress: {i+1:,}/{total:,} ({progress_pct:.1f}%) | "
                f"Matched: {matched:,} ({match_rate:.1f}%) | "
                f"Rate: {rate:.1f} gal/sec | "
                f"ETA: {format_time(remaining)}"
            )
            last_report_time = time.time()

    elapsed_matching = time.time() - start_time
    logger.info(f"Matching phase completed in {format_time(elapsed_matching)}")
    logger.info(f"Matched {matched:,} galaxies ({matched/total*100:.1f}%)")

    # Second pass: batch write all matches
    logger.info(f"Writing {matched:,} matches to database...")
    conn = sqlite3.connect(db_path, timeout=30.0)
    cur = conn.cursor()

    write_start = time.time()
    for idx, (pgc, iauname, subdir, pid) in enumerate(matches_to_update):
        cur.execute("""
            UPDATE galaxies
            SET nsa_iauname=?, nsa_subdir=?, nsa_pid=?
            WHERE pgc=?
        """, (iauname, subdir, pid, pgc))

        if (idx + 1) % 1000 == 0:
            logger.debug(f"  Written {idx+1:,}/{matched:,} matches")

    conn.commit()
    conn.close()

    elapsed_write = time.time() - write_start
    logger.info(f"Database write completed in {format_time(elapsed_write)}")

    return matched, total


def main():
    parser = argparse.ArgumentParser(description="Enrich galaxies.db with NSA identifiers")
    parser.add_argument("--db-path", default=DB_DEFAULT_PATH, help="Path to galaxies.db (input)")

    args = parser.parse_args()

    # Validate database exists
    if not Path(args.db_path).exists():
        logger.error(f"Database not found: {args.db_path}")
        logger.error(f"Run combined/main.py first to generate galaxies.db")
        sys.exit(1)

    # Output to galaxies_enriched.db instead
    enriched_path = str(Path(args.db_path).parent / "galaxies_enriched.db")

    logger.info("="*60)
    logger.info("NSA Galaxy Enrichment ETL")
    logger.info("="*60)
    logger.info(f"Input:  {args.db_path}")
    logger.info(f"Output: {enriched_path}")

    # Copy input to enriched version
    logger.info(f"Copying database to enriched version...")
    import shutil
    copy_start = time.time()
    shutil.copy(args.db_path, enriched_path)
    copy_time = time.time() - copy_start
    logger.info(f"[✓] Copied to {enriched_path} ({format_time(copy_time)})")

    # Ensure columns exist on enriched copy
    logger.info("Ensuring NSA columns exist...")
    ensure_nsa_columns(enriched_path)

    # Process galaxies on enriched copy
    total_start = time.time()
    matched, total = process_galaxies(enriched_path)
    total_elapsed = time.time() - total_start

    # Report results
    percentage = (matched / total * 100) if total > 0 else 0
    logger.info("="*60)
    logger.info("ENRICHMENT RESULTS:")
    logger.info(f"  Matched:     {matched:,}")
    logger.info(f"  Unmatched:   {total - matched:,}")
    logger.info(f"  Total:       {total:,}")
    logger.info(f"  Success Rate: {percentage:.1f}%")
    logger.info(f"  Total Time:  {format_time(total_elapsed)}")
    logger.info("="*60)


if __name__ == "__main__":
    main()
