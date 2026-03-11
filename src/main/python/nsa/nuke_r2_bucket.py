"""
Nuke all objects in the R2 bucket.

Usage:
  python nuke_r2_bucket.py              # dry run (shows what would be deleted)
  python nuke_r2_bucket.py --confirm    # actually delete everything

Requires same .env as upload_to_r2.py:
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
"""

import logging
import os
import sys
import time
from pathlib import Path

import boto3
from botocore.config import Config
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def get_r2_client():
    account_id = os.environ.get("R2_ACCOUNT_ID")
    access_key = os.environ.get("R2_ACCESS_KEY_ID")
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")

    missing = [v for v in ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"] if not os.environ.get(v)]
    if missing:
        logger.error(f"Missing env vars: {', '.join(missing)}")
        sys.exit(1)

    return boto3.client(
        "s3",
        endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(retries={"max_attempts": 3, "mode": "adaptive"}),
        region_name="auto",
    )


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Delete all objects in R2 bucket")
    parser.add_argument("--confirm", action="store_true", help="Actually delete (without this flag, dry run only)")
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    load_dotenv(script_dir / ".env")

    bucket = os.environ.get("R2_BUCKET_NAME", "galaxy-img")
    client = get_r2_client()

    logger.info(f"Bucket: {bucket}")
    if not args.confirm:
        logger.info("DRY RUN — pass --confirm to actually delete")

    paginator = client.get_paginator("list_objects_v2")
    total_deleted = 0
    total_size = 0
    batch = []

    start = time.time()

    for page in paginator.paginate(Bucket=bucket):
        for obj in page.get("Contents", []):
            total_size += obj.get("Size", 0)
            batch.append({"Key": obj["Key"]})

            if len(batch) == 1000:
                if args.confirm:
                    client.delete_objects(Bucket=bucket, Delete={"Objects": batch})
                total_deleted += len(batch)
                logger.info(f"  {'Deleted' if args.confirm else 'Found'}: {total_deleted:,} objects ({total_size / (1024**3):.1f} GB)")
                batch = []

    # Final batch
    if batch:
        if args.confirm:
            client.delete_objects(Bucket=bucket, Delete={"Objects": batch})
        total_deleted += len(batch)

    elapsed = time.time() - start
    action = "Deleted" if args.confirm else "Would delete"
    logger.info(f"\n{action}: {total_deleted:,} objects, {total_size / (1024**3):.1f} GB in {elapsed:.1f}s")


if __name__ == "__main__":
    main()
