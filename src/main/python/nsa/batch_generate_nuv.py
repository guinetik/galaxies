"""
Batch generate NUV (GALEX Near-UV) band PNGs for all galaxies that already have
the 5 optical bands (u, g, r, i, z) processed.

This script re-fetches the FITS parent images but only extracts HDU 5 (NUV).
It updates existing metadata.json to include the NUV band and data range.

Usage:
  python batch_generate_nuv.py [--db-path PATH] [--output-base PATH] [--start-at N]
  python batch_generate_nuv.py --workers 4 --limit 100   # test with 100 galaxies
"""

import argparse
import gzip
import json
import logging
import sqlite3
import sys
import time
import urllib.request
import ssl
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
from threading import Lock

import numpy as np
from astropy.io import fits
from PIL import Image

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

NUV_HDU_INDEX = 5
FITS_BASE_URL = "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1"
DB_DEFAULT_PATH = r"D:\Developer\galaxies\src\main\site\public\data\galaxies_enriched.db"
OUTPUT_DEFAULT_BASE = r"D:\Developer\galaxies\src\main\images"

stats_lock = Lock()
stats = {"successful": 0, "failed": 0, "skipped": 0, "no_nuv": 0}


def fetch_fits(nsa_iauname: str, nsa_subdir: str, nsa_pid: int) -> bytes:
    """Fetch gzipped FITS file from NSA servers."""
    url = f"{FITS_BASE_URL}/{nsa_subdir}/atlases/{nsa_pid}/{nsa_iauname}-parent-{nsa_pid}.fits.gz"
    ssl_context = ssl._create_unverified_context()
    with urllib.request.urlopen(url, timeout=30, context=ssl_context) as response:
        return response.read()


def extract_nuv(fits_data: bytes):
    """Extract NUV band (HDU 5) from gzipped FITS. Returns array or None."""
    with gzip.GzipFile(fileobj=BytesIO(fits_data)) as f:
        fits_buffer = BytesIO(f.read())

    with fits.open(fits_buffer, memmap=False) as hdul:
        if len(hdul) <= NUV_HDU_INDEX:
            return None

        img_data = hdul[NUV_HDU_INDEX].data
        if img_data is None:
            return None

        return img_data.astype(np.float32)


def save_16bit_png(band_data: np.ndarray, output_path: Path) -> None:
    """Normalize float32 band to 16-bit [0, 65535] and save as PNG."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if band_data.max() == band_data.min():
        scaled = np.zeros_like(band_data, dtype=np.uint16)
    else:
        min_val = band_data.min()
        max_val = band_data.max()
        normalized = (band_data - min_val) / (max_val - min_val)
        scaled = (normalized * 65535.0).astype(np.uint16)

    img = Image.fromarray(scaled, mode="I;16")
    img.save(output_path, format="PNG")


def update_metadata(output_dir: Path, nuv_range: tuple) -> None:
    """Update existing metadata.json to include NUV band and data range."""
    metadata_path = output_dir / "metadata.json"
    if not metadata_path.exists():
        return

    with open(metadata_path, "r") as f:
        metadata = json.load(f)

    # Add nuv to bands list if not present
    if "nuv" not in metadata.get("bands", []):
        metadata["bands"].append("nuv")

    # Add nuv data range
    metadata.setdefault("data_ranges", {})
    metadata["data_ranges"]["nuv"] = list(nuv_range)

    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)


def process_galaxy(pgc: int, nsa_iauname: str, nsa_subdir: str,
                   nsa_pid: int, output_base: Path) -> str:
    """Process a single galaxy for NUV only. Returns status string."""
    output_dir = output_base / str(pgc)
    nuv_path = output_dir / "nuv.png"

    # Skip if NUV already exists
    if nuv_path.exists():
        return "SKIP"

    # Skip if base bands haven't been processed yet
    if not (output_dir / "metadata.json").exists():
        return "SKIP"

    try:
        fits_data = fetch_fits(nsa_iauname, nsa_subdir, nsa_pid)
        nuv_data = extract_nuv(fits_data)

        if nuv_data is None:
            return "NO_NUV"

        # Save NUV PNG
        nuv_range = (float(nuv_data.min()), float(nuv_data.max()))
        save_16bit_png(nuv_data, nuv_path)

        # Update metadata
        update_metadata(output_dir, nuv_range)

        return "OK"

    except urllib.error.HTTPError as e:
        if e.code == 429:
            logger.warning(f"PGC {pgc}: Rate limited (429)")
        else:
            logger.error(f"PGC {pgc}: HTTP {e.code}: {e}")
        return "FAIL"
    except Exception as e:
        logger.error(f"PGC {pgc}: {e}")
        return "FAIL"


def format_time(seconds: float) -> str:
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds/60:.1f}m"
    else:
        return f"{seconds/3600:.1f}h"


def main():
    parser = argparse.ArgumentParser(description="Batch generate NUV band PNGs")
    parser.add_argument("--db-path", default=DB_DEFAULT_PATH, help="Path to galaxies_enriched.db")
    parser.add_argument("--output-base", default=OUTPUT_DEFAULT_BASE, help="Output directory base")
    parser.add_argument("--start-at", type=int, default=1, help="Start at Nth galaxy")
    parser.add_argument("--limit", type=int, default=0, help="Process only N galaxies (0 = all)")
    parser.add_argument("--workers", type=int, default=4, help="Parallel workers (default: 4)")

    args = parser.parse_args()

    db_path = Path(args.db_path)
    output_base = Path(args.output_base)

    if not db_path.exists():
        logger.error(f"Database not found: {db_path}")
        sys.exit(1)

    logger.info("=" * 70)
    logger.info("Batch NUV Band Generation")
    logger.info("=" * 70)
    logger.info(f"Database:  {db_path}")
    logger.info(f"Output:    {output_base}")
    logger.info(f"Workers:   {args.workers}")

    conn = sqlite3.connect(str(db_path), timeout=30.0)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT pgc, nsa_iauname, nsa_subdir, nsa_pid
        FROM galaxies
        WHERE nsa_iauname IS NOT NULL
        ORDER BY pgc
    """)
    rows = cur.fetchall()
    conn.close()

    total = len(rows)
    logger.info(f"Found {total:,} galaxies with NSA metadata")

    if total == 0:
        logger.warning("No matched galaxies found.")
        sys.exit(1)

    start_idx = max(0, args.start_at - 1)
    if args.limit > 0:
        rows = rows[start_idx:start_idx + args.limit]
    else:
        rows = rows[start_idx:]

    logger.info(f"Processing {len(rows):,} galaxies (starting at #{args.start_at})")
    logger.info("=" * 70)

    start_time = time.time()
    last_report_time = start_time
    completed = 0

    tasks = [
        {
            'pgc': row['pgc'],
            'nsa_iauname': row['nsa_iauname'],
            'nsa_subdir': row['nsa_subdir'],
            'nsa_pid': row['nsa_pid'],
        }
        for row in rows
    ]

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(
                process_galaxy,
                task['pgc'], task['nsa_iauname'], task['nsa_subdir'],
                task['nsa_pid'], output_base
            ): task for task in tasks
        }

        for future in as_completed(futures):
            task = futures[future]
            pgc = task['pgc']
            completed += 1

            try:
                status = future.result()

                with stats_lock:
                    if status == "OK":
                        stats["successful"] += 1
                        logger.info(f"✓ PGC {pgc}: NUV saved")
                    elif status == "SKIP":
                        stats["skipped"] += 1
                    elif status == "NO_NUV":
                        stats["no_nuv"] += 1
                    else:
                        stats["failed"] += 1

            except Exception as e:
                with stats_lock:
                    stats["failed"] += 1
                logger.error(f"✗ PGC {pgc}: {e}")

            elapsed = time.time() - start_time
            if (completed % 10 == 0) or (time.time() - last_report_time >= 5.0):
                rate = completed / elapsed if elapsed > 0 else 0
                remaining = (len(rows) - completed) / rate if rate > 0 else 0
                pct = completed / len(rows) * 100

                with stats_lock:
                    logger.info(
                        f"[{completed:,}/{len(rows):,}] ({pct:.1f}%) | "
                        f"OK: {stats['successful']:,} | "
                        f"Skip: {stats['skipped']:,} | "
                        f"No NUV: {stats['no_nuv']:,} | "
                        f"Fail: {stats['failed']:,} | "
                        f"Rate: {rate:.2f}/s | ETA: {format_time(remaining)}"
                    )
                last_report_time = time.time()

    total_elapsed = time.time() - start_time

    logger.info("=" * 70)
    logger.info("NUV BATCH COMPLETE:")
    logger.info(f"  Successful:  {stats['successful']:,}")
    logger.info(f"  Skipped:     {stats['skipped']:,}")
    logger.info(f"  No NUV data: {stats['no_nuv']:,}")
    logger.info(f"  Failed:      {stats['failed']:,}")
    logger.info(f"  Total:       {len(rows):,}")
    logger.info(f"  Time:        {format_time(total_elapsed)}")
    logger.info(f"  Rate:        {len(rows) / total_elapsed:.2f} gal/sec")
    logger.info("=" * 70)

    sys.exit(0 if stats['failed'] == 0 else 1)


if __name__ == "__main__":
    main()
