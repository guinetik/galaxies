#!/usr/bin/env python3
"""
Convert tour galaxy images (PNG, JPG, JPEG) in public/ to WebP and remove originals.

Resizes images to fit within --max-size on the longest edge (optimized for 320px carousel
thumbnails at 2x retina). Only processes files whose base name is purely numeric (PGC numbers).

Usage:
  cd src/main/site
  pip install Pillow
  python scripts/convert-tour-images-to-webp.py [--dry-run]
  python scripts/convert-tour-images-to-webp.py --resize-existing   # Resize existing .webp

Options:
  --dry-run         List conversions without writing or deleting files.
  --max-size N      Max pixels on longest edge (default: 640, good for thumbnails).
  --resize-existing Resize existing .webp files in place (no conversion).
"""

from pathlib import Path
import argparse
import re
import sys

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow is required. Install with: pip install Pillow")
    sys.exit(1)

# Extensions to convert
SOURCE_EXTS = {".png", ".jpg", ".jpeg"}
TARGET_EXT = ".webp"

# Files to never touch (app assets, not tour galaxies)
EXCLUDE_BASENAMES = frozenset(
    {"og_image", "rendering-morphology", "mapping-celestial-sphere"}
)

# WebP quality (0-100). 80 balances size and visual quality for thumbnails.
WEBP_QUALITY = 80

# Default max dimension (longest edge). 640px suits 320px cards at 2x retina.
DEFAULT_MAX_SIZE = 640


def is_pgc_filename(path: Path) -> bool:
    """True if the file is a PGC-numbered galaxy image (e.g. 2557.jpg)."""
    stem = path.stem
    if stem in EXCLUDE_BASENAMES:
        return False
    return bool(re.fullmatch(r"\d+", stem))


def collect_conversions(public_dir: Path) -> list[tuple[Path, Path]]:
    """Collect (source, target) pairs for conversion."""
    pairs: list[tuple[Path, Path]] = []
    for path in public_dir.iterdir():
        if not path.is_file():
            continue
        if path.suffix.lower() not in SOURCE_EXTS:
            continue
        if not is_pgc_filename(path):
            continue
        target = path.with_suffix(TARGET_EXT)
        if target.exists() and target != path:
            # Already have webp; we'll replace originals only
            pairs.append((path, target))
        else:
            pairs.append((path, target))
    return pairs


def resize_to_fit(img: Image.Image, max_size: int) -> Image.Image:
    """Resize image so longest edge is at most max_size. Returns new image."""
    w, h = img.size
    if w <= max_size and h <= max_size:
        return img
    if w >= h:
        new_w = max_size
        new_h = int(h * max_size / w)
    else:
        new_h = max_size
        new_w = int(w * max_size / h)
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def convert_to_webp(
    src: Path,
    dst: Path,
    quality: int = WEBP_QUALITY,
    max_size: int | None = None,
) -> bool:
    """Convert image to WebP, optionally resizing. Returns True on success."""
    try:
        with Image.open(src) as img:
            # Convert to RGB if necessary (e.g. RGBA, P)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            elif img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            if max_size:
                img = resize_to_fit(img, max_size)
            img.save(dst, format="WEBP", quality=quality)
        return True
    except Exception as e:
        print(f"  Error converting {src.name}: {e}")
        return False


def collect_existing_webp(public_dir: Path) -> list[Path]:
    """Collect existing PGC-numbered .webp files for resize."""
    paths: list[Path] = []
    for path in public_dir.iterdir():
        if not path.is_file() or path.suffix.lower() != ".webp":
            continue
        if not is_pgc_filename(path):
            continue
        paths.append(path)
    return paths


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert tour galaxy images to WebP and remove originals."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="List conversions without writing or deleting.",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=WEBP_QUALITY,
        metavar="N",
        help=f"WebP quality 0-100 (default: {WEBP_QUALITY})",
    )
    parser.add_argument(
        "--max-size",
        type=int,
        default=DEFAULT_MAX_SIZE,
        metavar="N",
        help=f"Resize longest edge to N px (default: {DEFAULT_MAX_SIZE}, 0=no resize)",
    )
    parser.add_argument(
        "--resize-existing",
        action="store_true",
        help="Resize existing .webp files in place (no conversion from png/jpg).",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    public_dir = script_dir.parent / "public"
    if not public_dir.is_dir():
        print(f"Error: public directory not found: {public_dir}")
        sys.exit(1)

    max_size = args.max_size if args.max_size > 0 else None

    if args.resize_existing:
        # Resize existing webp files
        webps = collect_existing_webp(public_dir)
        if not webps:
            print("No PGC-numbered .webp files found in public/.")
            return
        size_limit = args.max_size if args.max_size > 0 else DEFAULT_MAX_SIZE
        print(f"Found {len(webps)} .webp file(s) to resize (max {size_limit}px):")
        for p in webps:
            print(f"  {p.name}")
        if args.dry_run:
            print("\nDry run. No files changed.")
            return
        for path in webps:
            try:
                with Image.open(path) as img:
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    elif img.mode not in ("RGB", "L"):
                        img = img.convert("RGB")
                    resized = resize_to_fit(img, size_limit)
                    resized.save(path, format="WEBP", quality=args.quality)
                print(f"  Resized: {path.name}")
            except Exception as e:
                print(f"  Error resizing {path.name}: {e}")
        print(f"\nDone. {len(webps)} file(s) processed.")
        return

    pairs = collect_conversions(public_dir)
    if not pairs:
        print("No PGC-numbered images (png/jpg/jpeg) found in public/.")
        return

    print(f"Found {len(pairs)} image(s) to convert (max size: {args.max_size}px):")
    for src, dst in pairs:
        status = "exists" if dst.exists() else "new"
        print(f"  {src.name} -> {dst.name} ({status})")

    if args.dry_run:
        print("\nDry run. No files changed.")
        return

    converted = 0
    for src, dst in pairs:
        if dst.exists() and dst != src:
            # WebP already exists; just remove original
            src.unlink()
            print(f"  Removed original: {src.name}")
            converted += 1
        else:
            if convert_to_webp(src, dst, quality=args.quality, max_size=max_size):
                src.unlink()
                print(f"  Converted & removed: {src.name} -> {dst.name}")
                converted += 1

    print(f"\nDone. {converted} file(s) processed.")


if __name__ == "__main__":
    main()
