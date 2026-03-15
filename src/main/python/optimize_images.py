#!/usr/bin/env python3
"""
Optimize images in site/public/ by converting PNG, JPG, JPEG to WebP.

Scans the public folder recursively, converts raster images to WebP (with optional resize),
and removes originals. Excludes app assets and directories that require specific formats
(e.g. galaxy-img band data).

Usage:
  cd src/main/python
  pip install -r requirements.txt
  python optimize_images.py [--dry-run]
  python optimize_images.py --optimize-existing   # Resize existing .webp

Runs as part of the site build (prebuild step).
"""

from pathlib import Path
import argparse
import sys

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow is required. Install with: pip install Pillow")
    sys.exit(1)

# Extensions to convert
SOURCE_EXTS = {".png", ".jpg", ".jpeg"}
TARGET_EXT = ".webp"

# Basenames to never convert (referenced by path in code)
EXCLUDE_BASENAMES = frozenset(
    {"og_image", "rendering-morphology", "mapping-celestial-sphere"}
)

# Directories to skip (e.g. galaxy-img has 16-bit band PNGs for NSA scene)
EXCLUDE_DIRS = frozenset({"galaxy-img"})

# WebP quality (0-100). 80 balances size and visual quality.
WEBP_QUALITY = 80

# Default max dimension (longest edge). 640px suits thumbnails at 2x retina.
DEFAULT_MAX_SIZE = 640


def should_skip(path: Path, public_dir: Path) -> bool:
    """True if this path should be skipped."""
    if path.stem in EXCLUDE_BASENAMES:
        return True
    # Skip files inside excluded directories
    try:
        rel = path.relative_to(public_dir)
        for part in rel.parts[:-1]:  # dirs only
            if part in EXCLUDE_DIRS:
                return True
    except ValueError:
        pass
    return False


def collect_conversions(public_dir: Path) -> list[tuple[Path, Path]]:
    """Collect (source, target) pairs for conversion, recursively."""
    pairs: list[tuple[Path, Path]] = []
    for path in public_dir.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in SOURCE_EXTS:
            continue
        if should_skip(path, public_dir):
            continue
        target = path.with_suffix(TARGET_EXT)
        pairs.append((path, target))
    return pairs


def collect_existing_webp(public_dir: Path) -> list[Path]:
    """Collect existing .webp files for resize (excluding excluded dirs)."""
    paths: list[Path] = []
    for path in public_dir.rglob("*.webp"):
        if not path.is_file():
            continue
        if should_skip(path, public_dir):
            continue
        paths.append(path)
    return paths


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
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            elif img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            if max_size:
                img = resize_to_fit(img, max_size)
            dst.parent.mkdir(parents=True, exist_ok=True)
            img.save(dst, format="WEBP", quality=quality)
        return True
    except Exception as e:
        print(f"  Error converting {src}: {e}")
        return False


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Optimize images in site/public/ by converting to WebP."
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
        "--optimize-existing",
        action="store_true",
        help="Resize existing .webp files in place.",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    public_dir = script_dir.parent / "site" / "public"
    if not public_dir.is_dir():
        print(f"Error: public directory not found: {public_dir}")
        sys.exit(1)

    max_size = args.max_size if args.max_size > 0 else None

    if args.optimize_existing:
        webps = collect_existing_webp(public_dir)
        if not webps:
            print("No .webp files found in public/.")
            return
        size_limit = args.max_size if args.max_size > 0 else DEFAULT_MAX_SIZE
        print(f"Found {len(webps)} .webp file(s) to resize (max {size_limit}px):")
        for p in webps:
            print(f"  {p.relative_to(public_dir)}")
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
                print(f"  Resized: {path.relative_to(public_dir)}")
            except Exception as e:
                print(f"  Error resizing {path}: {e}")
        print(f"\nDone. {len(webps)} file(s) processed.")
        return

    pairs = collect_conversions(public_dir)
    if not pairs:
        print("No images (png/jpg/jpeg) found in public/.")
        return

    print(f"Found {len(pairs)} image(s) to convert (max size: {args.max_size}px):")
    for src, dst in pairs:
        status = "exists" if dst.exists() else "new"
        print(f"  {src.relative_to(public_dir)} -> {dst.name} ({status})")

    if args.dry_run:
        print("\nDry run. No files changed.")
        return

    converted = 0
    for src, dst in pairs:
        if dst.exists() and dst != src:
            src.unlink()
            print(f"  Removed original: {src.relative_to(public_dir)}")
            converted += 1
        else:
            if convert_to_webp(src, dst, quality=args.quality, max_size=max_size):
                src.unlink()
                print(f"  Converted & removed: {src.relative_to(public_dir)}")
                converted += 1

    print(f"\nDone. {converted} file(s) processed.")


if __name__ == "__main__":
    main()
