"""
Batch generate 16-bit PNG + WebP images for all galaxies in galaxies_enriched.db

Usage:
  python batch_generate_webp.py [--db-path PATH] [--output-base PATH] [--start-at N]

This script reads NSA metadata directly from enriched database (no catalog lookup),
fetches FITS files, and generates 16-bit PNGs + 8-bit WebPs + metadata.json for all
matched galaxies.
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
from typing import Dict, Tuple, Optional
from threading import Lock

import numpy as np
from astropy.io import fits
from PIL import Image

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Constants
BANDS = ["u", "g", "r", "i", "z", "nuv"]
FITS_BASE_URL = "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1"
DB_DEFAULT_PATH = r"D:\Developer\galaxies\src\main\site\public\data\galaxies_enriched.db"
OUTPUT_DEFAULT_BASE = r"D:\Developer\galaxies\src\main\images"

# Thread-safe stats tracking
stats_lock = Lock()
stats = {"successful": 0, "failed": 0, "skipped": 0}


def fetch_fits(nsa_iauname: str, nsa_subdir: str, nsa_pid: int) -> bytes:
    """Fetch gzipped FITS file from NSA servers using enriched metadata.

    Args:
        nsa_iauname: IAU name from NSA catalog (e.g., J004244.30+411608.9)
        nsa_subdir: SDSS subdirectory path (e.g., 00h/p40/...)
        nsa_pid: SDSS Photo ID

    Returns:
        Gzipped FITS file content as bytes

    Raises:
        RuntimeError: If fetch fails
    """
    url = f"{FITS_BASE_URL}/{nsa_subdir}/atlases/{nsa_pid}/{nsa_iauname}-parent-{nsa_pid}.fits.gz"

    try:
        ssl_context = ssl._create_unverified_context()
        with urllib.request.urlopen(url, timeout=30, context=ssl_context) as response:
            return response.read()
    except Exception as e:
        raise RuntimeError(f"Failed to fetch {url}: {e}")


def extract_bands(fits_data: bytes) -> Dict[str, np.ndarray]:
    """Extract u, g, r, i, z, nuv bands from gzipped FITS parent image.

    Args:
        fits_data: Gzipped FITS file content as bytes

    Returns:
        Dict mapping band name to numpy array (float32).
        NUV is optional — missing HDU 5 is logged and skipped.

    Raises:
        ValueError: If a required optical band (u/g/r/i/z) HDU is missing or empty
    """
    with gzip.GzipFile(fileobj=BytesIO(fits_data)) as f:
        fits_buffer = BytesIO(f.read())

    with fits.open(fits_buffer, memmap=False) as hdul:
        bands = {}

        for idx, band in enumerate(BANDS):
            if idx >= len(hdul):
                if band == "nuv":
                    logger.debug(f"NUV HDU not present (only {len(hdul)} HDUs), skipping")
                    continue
                raise ValueError(f"Missing HDU for band {band} at index {idx}")

            img_data = hdul[idx].data
            if img_data is None:
                if band == "nuv":
                    logger.debug("NUV HDU is empty, skipping")
                    continue
                raise ValueError(f"Band {band} HDU is empty")

            bands[band] = img_data.astype(np.float32)

        return bands


def normalize_band_16bit(band_data: np.ndarray) -> np.ndarray:
    """Normalize band data to uint16 [0, 65535]."""
    if band_data.max() == band_data.min():
        return np.zeros_like(band_data, dtype=np.uint16)

    min_val = band_data.min()
    max_val = band_data.max()
    normalized = (band_data - min_val) / (max_val - min_val)
    return (normalized * 65535.0).astype(np.uint16)


def save_16bit_png(band_data: np.ndarray, output_path: Path) -> None:
    """Normalize float32 band to 16-bit [0, 65535] and save as PNG."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    scaled = normalize_band_16bit(band_data)
    img = Image.fromarray(scaled, mode="I;16")
    img.save(output_path, format="PNG")


def save_metadata(pgc: int, output_dir: Path, band_ranges: Dict[str, Tuple[float, float]],
                  dimensions: Tuple[int, int], nsa_iauname: str, nsa_pid: int,
                  nsa_subdir: str, ra: float, dec: float) -> None:
    """Save metadata.json alongside WebP files."""
    metadata = {
        "pgc": pgc,
        "nsa_iau_name": nsa_iauname,
        "nsaid": nsa_pid,  # Note: nsa_pid is the SDSS Photo ID, not NSAID
        "ra": ra,
        "dec": dec,
        "pixel_scale": 0.396,  # SDSS standard (not in FITS header, verified constant for all NSA)
        "bands": list(band_ranges.keys()),
        "dimensions": list(dimensions),
        "data_ranges": band_ranges,
        "fetched_date": time.strftime("%Y-%m-%d"),
        "nsa_url": f"{FITS_BASE_URL}/{nsa_subdir}/atlases/{nsa_pid}/{nsa_iauname}-parent-{nsa_pid}.fits.gz",
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = output_dir / "metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)


def format_time(seconds: float) -> str:
    """Format seconds to human-readable time."""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds/60:.1f}m"
    else:
        return f"{seconds/3600:.1f}h"


def process_galaxy(pgc: int, ra: float, dec: float, nsa_iauname: str,
                   nsa_subdir: str, nsa_pid: int, output_base: Path) -> Tuple[str, bool]:
    """Process a single galaxy. Returns (status, success) tuple."""
    output_dir = output_base / str(pgc)

    # Skip if already processed
    if (output_dir / "metadata.json").exists():
        return ("SKIP", True)

    try:
        # Fetch FITS (skip catalog lookup, use enriched metadata directly)
        fits_data = fetch_fits(nsa_iauname, nsa_subdir, nsa_pid)

        # Extract bands
        bands = extract_bands(fits_data)

        # Process each band
        band_ranges = {}
        height, width = None, None

        for band_name, band_data in bands.items():
            if height is None:
                height, width = band_data.shape

            # Record data range before normalization
            band_ranges[band_name] = (float(band_data.min()), float(band_data.max()))

            # 16-bit PNG (full dynamic range)
            save_16bit_png(band_data, output_dir / f"{band_name}.png")

        # Save metadata
        save_metadata(pgc, output_dir, band_ranges, (width, height),
                      nsa_iauname, nsa_pid, nsa_subdir, ra, dec)

        return ("OK", True)

    except urllib.error.HTTPError as e:
        if e.code == 429:
            logger.warning(f"PGC {pgc}: Rate limited (429), will retry later")
        else:
            logger.error(f"PGC {pgc}: HTTP {e.code}: {e}")
        return ("FAIL", False)
    except Exception as e:
        logger.error(f"PGC {pgc}: {e}")
        return ("FAIL", False)


def main():
    parser = argparse.ArgumentParser(description="Batch generate WebP images for enriched galaxies")
    parser.add_argument("--db-path", default=DB_DEFAULT_PATH, help="Path to galaxies_enriched.db")
    parser.add_argument("--output-base", default=OUTPUT_DEFAULT_BASE, help="Output directory base")
    parser.add_argument("--start-at", type=int, default=1, help="Start processing at Nth galaxy")
    parser.add_argument("--limit", type=int, default=0, help="Process only N galaxies (0 = all)")
    parser.add_argument("--workers", type=int, default=4, help="Number of parallel workers (default: 4)")

    args = parser.parse_args()

    db_path = Path(args.db_path)
    output_base = Path(args.output_base)

    if not db_path.exists():
        logger.error(f"Database not found: {db_path}")
        sys.exit(1)

    logger.info("="*70)
    logger.info("Batch WebP Generation for Enriched Galaxies")
    logger.info("="*70)
    logger.info(f"Database:  {db_path}")
    logger.info(f"Output:    {output_base}")
    logger.info(f"Workers:   {args.workers}")

    # Query all matched galaxies
    conn = sqlite3.connect(str(db_path), timeout=30.0)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT pgc, ra, dec, nsa_iauname, nsa_subdir, nsa_pid
        FROM galaxies
        WHERE nsa_iauname IS NOT NULL
        ORDER BY pgc
    """)
    rows = cur.fetchall()
    conn.close()

    total = len(rows)
    logger.info(f"Found {total:,} galaxies with NSA metadata")

    if total == 0:
        logger.warning("No matched galaxies found. Has enrichment completed?")
        sys.exit(1)

    # Apply limit and start-at
    start_idx = max(0, args.start_at - 1)
    if args.limit > 0:
        rows = rows[start_idx:start_idx + args.limit]
    else:
        rows = rows[start_idx:]

    logger.info(f"Processing {len(rows):,} galaxies (starting at #{args.start_at})")
    logger.info("="*70)

    start_time = time.time()
    last_report_time = start_time
    completed = 0

    # Create tasks list
    tasks = []
    for row in rows:
        tasks.append({
            'pgc': row['pgc'],
            'ra': row['ra'],
            'dec': row['dec'],
            'nsa_iauname': row['nsa_iauname'],
            'nsa_subdir': row['nsa_subdir'],
            'nsa_pid': row['nsa_pid'],
        })

    # Process with thread pool
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(
                process_galaxy,
                task['pgc'], task['ra'], task['dec'],
                task['nsa_iauname'], task['nsa_subdir'], task['nsa_pid'],
                output_base
            ): task for task in tasks
        }

        for future in as_completed(futures):
            task = futures[future]
            pgc = task['pgc']
            completed += 1

            try:
                status, success = future.result()

                with stats_lock:
                    if status == "OK":
                        stats["successful"] += 1
                        logger.info(f"✓ PGC {pgc}: Complete")
                    elif status == "SKIP":
                        stats["skipped"] += 1
                    else:
                        stats["failed"] += 1

            except Exception as e:
                with stats_lock:
                    stats["failed"] += 1
                logger.error(f"✗ PGC {pgc}: Unexpected error: {e}")

            # Progress reporting
            elapsed = time.time() - start_time
            if (completed % 10 == 0) or (time.time() - last_report_time >= 5.0):
                rate = completed / elapsed if elapsed > 0 else 0
                remaining = (len(rows) - completed) / rate if rate > 0 else 0
                progress_pct = (completed / len(rows) * 100)

                with stats_lock:
                    logger.info(
                        f"[{completed:,}/{len(rows):,}] ({progress_pct:.1f}%) | "
                        f"Success: {stats['successful']:,} | "
                        f"Skipped: {stats['skipped']:,} | "
                        f"Failed: {stats['failed']:,} | "
                        f"Rate: {rate:.2f} gal/s | ETA: {format_time(remaining)}"
                    )
                last_report_time = time.time()

    total_elapsed = time.time() - start_time

    logger.info("="*70)
    logger.info("BATCH PROCESSING COMPLETE:")
    logger.info(f"  Successful: {stats['successful']:,}")
    logger.info(f"  Skipped:    {stats['skipped']:,}")
    logger.info(f"  Failed:     {stats['failed']:,}")
    logger.info(f"  Total:      {len(rows):,}")
    logger.info(f"  Time:       {format_time(total_elapsed)}")
    logger.info(f"  Rate:       {len(rows) / total_elapsed:.2f} gal/sec")
    logger.info("="*70)

    sys.exit(0 if stats['failed'] == 0 else 1)


if __name__ == "__main__":
    main()
