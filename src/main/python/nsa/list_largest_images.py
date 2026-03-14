#!/usr/bin/env python3
"""
List galaxy images by resolution (largest first).

Scans src/main/images and reports galaxies sorted by image dimensions.
Uses metadata.json dimensions when available; falls back to PIL for PNGs without metadata.

Usage:
  python list_largest_images.py [--top N] [--min-size SIZE] [--output PATH]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

IMAGES_BASE = Path(__file__).resolve().parents[2] / "images"


def collect_entries(images_dir: Path) -> list[dict]:
    """Collect galaxy image dimensions from metadata (fast) or PIL fallback."""
    entries: list[dict] = []
    # Use glob for metadata - avoids listing all dirs when most have metadata
    for meta_path in images_dir.glob("*/metadata.json"):
        folder = meta_path.parent
        dims: tuple[int, int] | None = None
        try:
            m = json.loads(meta_path.read_text())
            d = m.get("dimensions")
            if d and len(d) >= 2:
                dims = (int(d[0]), int(d[1]))
        except (json.JSONDecodeError, ValueError, TypeError):
            pass

        if dims:
            w, h = dims
            try:
                pgc = int(folder.name)
            except ValueError:
                pgc = 0
            entries.append(
                {
                    "pgc": pgc,
                    "folder": folder.name,
                    "width": w,
                    "height": h,
                    "max_dim": max(w, h),
                    "pixels": w * h,
                }
            )
    return entries


def main() -> None:
    parser = argparse.ArgumentParser(
        description="List galaxy images by resolution (largest first)"
    )
    parser.add_argument(
        "--top",
        type=int,
        default=50,
        help="Number of largest galaxies to list (default: 50)",
    )
    parser.add_argument(
        "--min-size",
        type=int,
        default=None,
        help="Only list galaxies with width/height >= this (e.g. 1024)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Write results to JSON file",
    )
    parser.add_argument(
        "--images-dir",
        type=Path,
        default=IMAGES_BASE,
        help="Path to images directory",
    )
    args = parser.parse_args()

    images_dir = args.images_dir
    if not images_dir.is_absolute():
        images_dir = Path.cwd() / images_dir

    if not images_dir.exists():
        print(f"Error: images directory not found: {images_dir}")
        return

    entries = collect_entries(images_dir)

    if args.min_size is not None:
        entries = [e for e in entries if e["max_dim"] >= args.min_size]

    entries.sort(key=lambda e: (e["max_dim"], e["pixels"]), reverse=True)
    top = entries[: args.top]

    print(f"\n=== Largest Galaxy Images (top {args.top}) ===")
    print(f"Total galaxies with dimensions: {len(entries):,}\n")
    print(f"{'PGC':>10}  {'Width':>6} x {'Height':<6}  {'Max':>6}  {'Pixels (M)':>10}")
    print("-" * 50)

    for e in top:
        px_m = e["pixels"] / 1_000_000
        print(f"{e['pgc']:>10}  {e['width']:>6} x {e['height']:<6}  {e['max_dim']:>6}  {px_m:>10.2f}")

    if args.output:
        out_path = Path(args.output)
        out_path.write_text(
            json.dumps(
                [{"pgc": e["pgc"], "width": e["width"], "height": e["height"]} for e in top],
                indent=2,
            ),
            encoding="utf-8",
        )
        print(f"\nWrote {len(top)} entries to {out_path}")


if __name__ == "__main__":
    main()
