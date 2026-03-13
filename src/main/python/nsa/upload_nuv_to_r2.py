"""
Upload only NUV band files (nuv.png + updated metadata.json) to Cloudflare R2.

This is a targeted upload script for galaxies that already have their 5 optical
bands uploaded. It only uploads nuv.png and metadata.json (which was updated to
include the NUV band info).

Usage:
  python upload_nuv_to_r2.py [--images-dir PATH] [--prefix PREFIX] [--dry-run] [--workers N]
  python upload_nuv_to_r2.py --dry-run   # preview what would be uploaded
"""

import argparse
import logging
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

import boto3
from botocore.config import Config
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

IMAGES_DEFAULT_DIR = r"D:\Developer\galaxies\src\main\images"

stats_lock = Lock()
stats = {"uploaded": 0, "skipped": 0, "failed": 0}

CONTENT_TYPES = {
    ".png": "image/png",
    ".json": "application/json",
}


def get_r2_client():
    """Create an S3 client configured for Cloudflare R2."""
    account_id = os.environ.get("R2_ACCOUNT_ID")
    access_key = os.environ.get("R2_ACCESS_KEY_ID")
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")

    missing = []
    if not account_id:
        missing.append("R2_ACCOUNT_ID")
    if not access_key:
        missing.append("R2_ACCESS_KEY_ID")
    if not secret_key:
        missing.append("R2_SECRET_ACCESS_KEY")

    if missing:
        logger.error(f"Missing environment variables: {', '.join(missing)}")
        sys.exit(1)

    return boto3.client(
        "s3",
        endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(retries={"max_attempts": 3, "mode": "adaptive"}),
        region_name="auto",
    )


def upload_file(client, bucket: str, local_path: Path, key: str, dry_run: bool) -> str:
    """Upload a single file to R2."""
    content_type = CONTENT_TYPES.get(local_path.suffix, "application/octet-stream")

    if dry_run:
        logger.info(f"[DRY RUN] Would upload: {key} ({content_type})")
        return "DRY"

    client.upload_file(
        str(local_path),
        bucket,
        key,
        ExtraArgs={
            "ContentType": content_type,
            "CacheControl": "public, max-age=31536000, immutable",
        },
    )
    return "OK"


def upload_galaxy_nuv(client, bucket: str, galaxy_dir: Path, prefix: str,
                      dry_run: bool) -> tuple:
    """Upload nuv.png + metadata.json for a single galaxy. Returns (pgc, status, count)."""
    pgc = galaxy_dir.name
    nuv_path = galaxy_dir / "nuv.png"

    if not nuv_path.exists():
        return (pgc, "SKIP", 0)

    uploaded = 0
    # Upload nuv.png and metadata.json (metadata was updated with NUV info)
    for filename in ["nuv.png", "metadata.json"]:
        file_path = galaxy_dir / filename
        if not file_path.exists():
            continue

        key = f"{prefix}/{pgc}/{filename}" if prefix else f"{pgc}/{filename}"

        try:
            status = upload_file(client, bucket, file_path, key, dry_run)
            if status == "OK":
                uploaded += 1
            elif status == "DRY":
                uploaded += 1
        except Exception as e:
            logger.error(f"PGC {pgc}/{filename}: {e}")
            return (pgc, "FAIL", uploaded)

    return (pgc, "OK", uploaded)


def format_time(seconds: float) -> str:
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds / 60:.1f}m"
    else:
        return f"{seconds / 3600:.1f}h"


def main():
    parser = argparse.ArgumentParser(description="Upload NUV band files to Cloudflare R2")
    parser.add_argument("--images-dir", default=IMAGES_DEFAULT_DIR, help="Path to images directory")
    parser.add_argument("--prefix", default="", help="Key prefix in bucket")
    parser.add_argument("--dry-run", action="store_true", help="Preview without uploading")
    parser.add_argument("--workers", type=int, default=8, help="Parallel workers (default: 8)")

    args = parser.parse_args()

    script_dir = Path(__file__).parent
    load_dotenv(script_dir / ".env")

    images_dir = Path(args.images_dir)
    if not images_dir.is_absolute():
        images_dir = script_dir / images_dir

    if not images_dir.exists():
        logger.error(f"Images directory not found: {images_dir}")
        sys.exit(1)

    bucket = os.environ.get("R2_BUCKET_NAME", "galaxy-img")

    # Only include galaxy dirs that have nuv.png
    galaxy_dirs = sorted([
        d for d in images_dir.iterdir()
        if d.is_dir() and (d / "nuv.png").exists()
    ])
    total_galaxies = len(galaxy_dirs)

    if total_galaxies == 0:
        logger.warning("No galaxy directories with nuv.png found. Run batch_generate_nuv.py first.")
        sys.exit(0)

    logger.info("=" * 70)
    logger.info("Cloudflare R2 — NUV Upload")
    logger.info("=" * 70)
    logger.info(f"Source:     {images_dir}")
    logger.info(f"Bucket:     {bucket}")
    logger.info(f"Prefix:     {args.prefix or '(none)'}")
    logger.info(f"Galaxies:   {total_galaxies:,} (with nuv.png)")
    logger.info(f"Workers:    {args.workers}")
    logger.info(f"Dry run:    {args.dry_run}")
    logger.info("=" * 70)

    client = get_r2_client()

    start_time = time.time()
    completed = 0
    last_report_time = start_time

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(
                upload_galaxy_nuv, client, bucket, gdir, args.prefix, args.dry_run
            ): gdir.name
            for gdir in galaxy_dirs
        }

        for future in as_completed(futures):
            pgc = futures[future]
            completed += 1

            try:
                pgc_id, status, file_count = future.result()

                with stats_lock:
                    if status == "OK":
                        stats["uploaded"] += 1
                    elif status == "SKIP":
                        stats["skipped"] += 1
                    elif status == "FAIL":
                        stats["failed"] += 1

                if status == "OK" and not args.dry_run:
                    logger.info(f"✓ PGC {pgc_id}: {file_count} files uploaded")

            except Exception as e:
                with stats_lock:
                    stats["failed"] += 1
                logger.error(f"✗ PGC {pgc}: {e}")

            elapsed = time.time() - start_time
            if (completed % 25 == 0) or (time.time() - last_report_time >= 10.0):
                rate = completed / elapsed if elapsed > 0 else 0
                remaining = (total_galaxies - completed) / rate if rate > 0 else 0
                pct = completed / total_galaxies * 100

                with stats_lock:
                    logger.info(
                        f"[{completed:,}/{total_galaxies:,}] ({pct:.1f}%) | "
                        f"Uploaded: {stats['uploaded']:,} | "
                        f"Skipped: {stats['skipped']:,} | "
                        f"Failed: {stats['failed']:,} | "
                        f"Rate: {rate:.1f}/s | ETA: {format_time(remaining)}"
                    )
                last_report_time = time.time()

    total_elapsed = time.time() - start_time

    logger.info("=" * 70)
    logger.info("NUV UPLOAD COMPLETE:")
    logger.info(f"  Uploaded: {stats['uploaded']:,}")
    logger.info(f"  Skipped:  {stats['skipped']:,}")
    logger.info(f"  Failed:   {stats['failed']:,}")
    logger.info(f"  Time:     {format_time(total_elapsed)}")
    logger.info("=" * 70)

    sys.exit(0 if stats["failed"] == 0 else 1)


if __name__ == "__main__":
    main()
