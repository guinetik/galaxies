"""
Upload galaxy images to Cloudflare R2.

Setup:
  1. Create a Cloudflare R2 bucket (e.g., "galaxy-img")
  2. In R2 dashboard, create an API token with read/write access
  3. Create a .env file in this directory (or set env vars):

     R2_ACCOUNT_ID=your_cloudflare_account_id
     R2_ACCESS_KEY_ID=your_access_key_id
     R2_SECRET_ACCESS_KEY=your_secret_access_key
     R2_BUCKET_NAME=galaxy-img

  4. pip install boto3 python-dotenv
  5. python upload_to_r2.py

Usage:
  python upload_to_r2.py [--images-dir PATH] [--prefix PREFIX] [--dry-run] [--workers N]

The script uploads files to: {bucket}/{prefix}/{pgc}/{file}
e.g., galaxy-img/2557/g.webp

To serve via custom domain or R2 public URL, update the frontend
base URL from "/galaxy-img/" to your R2 public endpoint.
"""

import argparse
import logging
import mimetypes
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

IMAGES_DEFAULT_DIR = "../../images"

# Thread-safe counters
stats_lock = Lock()
stats = {"uploaded": 0, "skipped": 0, "failed": 0}

# Content types for our files
CONTENT_TYPES = {
    ".webp": "image/webp",
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
        logger.error("Set them in a .env file or export them in your shell.")
        sys.exit(1)

    return boto3.client(
        "s3",
        endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(
            retries={"max_attempts": 3, "mode": "adaptive"},
        ),
        region_name="auto",
    )


def list_existing_keys(client, bucket: str, prefix: str) -> set:
    """List all keys already in the bucket under the given prefix."""
    logger.info("Listing existing objects in bucket (this may take a moment)...")
    existing = set()
    paginator = client.get_paginator("list_objects_v2")

    for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
        for obj in page.get("Contents", []):
            existing.add(obj["Key"])

    logger.info(f"Found {len(existing):,} existing objects in bucket")
    return existing


def upload_file(client, bucket: str, local_path: Path, key: str, dry_run: bool) -> str:
    """Upload a single file to R2. Returns status string."""
    content_type = CONTENT_TYPES.get(local_path.suffix, "application/octet-stream")

    if dry_run:
        logger.info(f"[DRY RUN] Would upload: {key} ({content_type})")
        return "SKIP"

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


def upload_galaxy(client, bucket: str, galaxy_dir: Path, prefix: str,
                  existing_keys: set, dry_run: bool) -> tuple:
    """Upload all files for a single galaxy. Returns (pgc, status, file_count)."""
    pgc = galaxy_dir.name

    files = list(galaxy_dir.iterdir())
    if not files:
        return (pgc, "EMPTY", 0)

    uploaded = 0
    for f in files:
        if not f.is_file():
            continue

        key = f"{prefix}/{pgc}/{f.name}" if prefix else f"{pgc}/{f.name}"

        if key in existing_keys:
            continue

        try:
            status = upload_file(client, bucket, f, key, dry_run)
            if status == "OK":
                uploaded += 1
        except Exception as e:
            logger.error(f"PGC {pgc}/{f.name}: {e}")
            return (pgc, "FAIL", uploaded)

    if uploaded == 0:
        return (pgc, "SKIP", 0)

    return (pgc, "OK", uploaded)


def format_time(seconds: float) -> str:
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds / 60:.1f}m"
    else:
        return f"{seconds / 3600:.1f}h"


def main():
    parser = argparse.ArgumentParser(description="Upload galaxy images to Cloudflare R2")
    parser.add_argument("--images-dir", default=IMAGES_DEFAULT_DIR, help="Path to images directory")
    parser.add_argument("--prefix", default="", help="Key prefix in bucket (e.g., 'galaxy-img')")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be uploaded without uploading")
    parser.add_argument("--workers", type=int, default=8, help="Number of parallel upload workers (default: 8)")
    parser.add_argument("--skip-existing-check", action="store_true",
                        help="Skip listing existing objects (faster start, may re-upload)")

    args = parser.parse_args()

    # Load .env from script directory
    script_dir = Path(__file__).parent
    load_dotenv(script_dir / ".env")

    images_dir = Path(args.images_dir)
    if not images_dir.is_absolute():
        images_dir = script_dir / images_dir

    if not images_dir.exists():
        logger.error(f"Images directory not found: {images_dir}")
        sys.exit(1)

    bucket = os.environ.get("R2_BUCKET_NAME", "galaxy-img")

    # Collect galaxy directories
    galaxy_dirs = sorted([d for d in images_dir.iterdir() if d.is_dir()])
    total_galaxies = len(galaxy_dirs)

    if total_galaxies == 0:
        logger.warning("No galaxy directories found")
        sys.exit(0)

    logger.info("=" * 70)
    logger.info("Cloudflare R2 Upload")
    logger.info("=" * 70)
    logger.info(f"Source:     {images_dir}")
    logger.info(f"Bucket:    {bucket}")
    logger.info(f"Prefix:    {args.prefix or '(none)'}")
    logger.info(f"Galaxies:  {total_galaxies:,}")
    logger.info(f"Workers:   {args.workers}")
    logger.info(f"Dry run:   {args.dry_run}")
    logger.info("=" * 70)

    client = get_r2_client()

    # Check existing objects to skip re-uploads
    if args.skip_existing_check:
        existing_keys = set()
    else:
        existing_keys = list_existing_keys(client, bucket, args.prefix)

    start_time = time.time()
    completed = 0
    last_report_time = start_time

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(
                upload_galaxy, client, bucket, gdir, args.prefix, existing_keys, args.dry_run
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

                if status == "OK":
                    logger.info(f"✓ PGC {pgc_id}: {file_count} files uploaded")

            except Exception as e:
                with stats_lock:
                    stats["failed"] += 1
                logger.error(f"✗ PGC {pgc}: {e}")

            # Progress report
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
                        f"Rate: {rate:.1f} gal/s | ETA: {format_time(remaining)}"
                    )
                last_report_time = time.time()

    total_elapsed = time.time() - start_time

    logger.info("=" * 70)
    logger.info("UPLOAD COMPLETE:")
    logger.info(f"  Uploaded: {stats['uploaded']:,}")
    logger.info(f"  Skipped:  {stats['skipped']:,}")
    logger.info(f"  Failed:   {stats['failed']:,}")
    logger.info(f"  Time:     {format_time(total_elapsed)}")
    logger.info("=" * 70)

    sys.exit(0 if stats["failed"] == 0 else 1)


if __name__ == "__main__":
    main()
