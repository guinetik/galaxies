#!/usr/bin/env python3
"""
Orchestrates the full galaxies.db rebuild pipeline.

Runs ETL stages in order:
  1. cosmicflows/main.py  → cosmicflows4.db
  2. alfalfa/main.py     → alfalfa.db
  3. fss/combine.py      → galaxies_combined.db
  4. combined/main.py    → galaxies.db

Optionally copies the output to site/public/data/ with --deploy.

Usage:
  python build.py           # Build to combined/galaxies.db
  python build.py --deploy # Build and copy to site/public/data/

Author: @guinetik
"""

import argparse
import os
import shutil
import subprocess
import sys

# Project layout: build.py lives in src/main/python/
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# research/ is at project root (3 levels up from src/main/python/)
RESEARCH_DIR = os.path.normpath(
    os.path.join(SCRIPT_DIR, "..", "..", "..", "research")
)

REQUIRED_FILES = [
    ("Cosmicflows-4", "cosmicflows-4/table2.dat", "cosmicflows-4/table4.dat"),
    ("ALFALFA", "alfalfa/table1.dat", "alfalfa/table2.dat"),
    ("FSS", "fss/fss.dat",),
    ("UGC", "ugc/1973UGCC0000N.xml",),
]


def check_sources() -> list[str]:
    """
    Check that required source files exist. ALFALFA .dat.gz is accepted.

    Returns:
        List of missing file descriptions.
    """
    missing = []
    for catalog, *rel_paths in REQUIRED_FILES:
        for rel in rel_paths:
            path = os.path.join(RESEARCH_DIR, rel)
            if os.path.exists(path):
                continue
            # ALFALFA: accept .dat.gz
            if "alfalfa" in rel and rel.endswith(".dat"):
                gz = path + ".gz"
                if os.path.exists(gz):
                    continue
            missing.append(f"  {catalog}: {rel}")
    return missing


def run_stage(name: str, script_path: str) -> bool:
    """
    Run a Python script as a subprocess.

    Args:
        name: Human-readable stage name for logging.
        script_path: Path to the script (relative to SCRIPT_DIR or absolute).

    Returns:
        True if the subprocess exited with 0, False otherwise.
    """
    if not os.path.isabs(script_path):
        script_path = os.path.join(SCRIPT_DIR, script_path)
    if not os.path.exists(script_path):
        print(f"\n[FAIL] Script not found: {script_path}", file=sys.stderr)
        return False
    cmd = [sys.executable, script_path]
    print(f"\n{'='*60}")
    print(f"  Stage: {name}")
    print(f"  $ python {os.path.basename(script_path)}")
    print(f"{'='*60}\n")
    result = subprocess.run(cmd, cwd=SCRIPT_DIR)
    return result.returncode == 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Rebuild galaxies.db from source catalogs"
    )
    parser.add_argument(
        "--deploy",
        action="store_true",
        help="Copy galaxies.db to site/public/data/ after build",
    )
    parser.add_argument(
        "--skip-check",
        action="store_true",
        help="Skip pre-flight source file check (use if you have partial/custom setup)",
    )
    args = parser.parse_args()

    if not args.skip_check:
        missing = check_sources()
        if missing:
            print("\n[FAIL] Missing source files in research/:\n", file=sys.stderr)
            for m in missing:
                print(m, file=sys.stderr)
            print(
                "\nSee docs/python-etl-rebuild-guide.md for download links and setup.",
                file=sys.stderr,
            )
            return 1

    stages = [
        ("Cosmicflows-4", "cosmicflows/main.py"),
        ("ALFALFA-SDSS", "alfalfa/main.py"),
        ("FSS + UGC", "fss/combine.py"),
        ("Combined merge", "combined/main.py"),
    ]

    for name, script in stages:
        if not run_stage(name, script):
            print(f"\n[FAIL] Stage '{name}' failed. Aborting.", file=sys.stderr)
            return 1

    out_db = os.path.join(SCRIPT_DIR, "combined", "galaxies.db")
    if not os.path.exists(out_db):
        print(f"\n[FAIL] Output not found: {out_db}", file=sys.stderr)
        return 1

    size_mb = os.path.getsize(out_db) / (1024 * 1024)
    print(f"\n[OK] galaxies.db built successfully ({size_mb:.1f} MB)")

    if args.deploy:
        dest = os.path.join(SCRIPT_DIR, "..", "site", "public", "data", "galaxies.db")
        dest = os.path.normpath(dest)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(out_db, dest)
        print(f"[OK] Deployed to {dest}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
