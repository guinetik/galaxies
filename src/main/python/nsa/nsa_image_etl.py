"""
NSA Galaxy Image ETL: Fetch FITS data, extract bands, save as 16-bit PNG + WebP.

Saves the raw FITS file for future reprocessing, generates 16-bit PNGs for
full dynamic range (65536 levels), and 8-bit WebPs for preview/thumbnails.

Usage:
  python nsa_image_etl.py --pgc 2557 --ra 10.685 --dec 41.269
  python nsa_image_etl.py --pgc 2557 --fits-file /path/to/local.fits.gz

Output:
  public/galaxy-img/[pgc]/parent.fits.gz          (raw FITS archive)
  public/galaxy-img/[pgc]/u.png, g.png, ...        (16-bit grayscale PNGs)
  public/galaxy-img/[pgc]/u.webp, g.webp, ...      (8-bit preview WebPs)
  public/galaxy-img/[pgc]/metadata.json
"""

import os
import sys
import json
import gzip
import argparse
import urllib.request
import ssl
import time
from pathlib import Path
from typing import Dict, Tuple, Optional, List
from io import BytesIO
from datetime import datetime

try:
    from astropy.io import fits
    from PIL import Image
    import numpy as np
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install astropy numpy Pillow")
    sys.exit(1)

from catalog_lookup import get_nsa_galaxy_info


# ─── Constants ─────────────────────────────────────────────────────────────

BANDS = ["u", "g", "r", "i", "z", "nuv"]
FITS_BASE_URL = "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1"

FITS_MIRRORS = [
    FITS_BASE_URL,
    "https://www.nsatlas.org/data/detect/v0_1",
]


# ─── FITS Download ─────────────────────────────────────────────────────────

def fetch_fits(url: str, max_retries: int = 3) -> bytes:
    """Download gzipped FITS file, trying mirrors on failure.

    Args:
        url: Primary URL to the .fits.gz file
        max_retries: Retry attempts per mirror

    Returns:
        Raw gzipped FITS bytes
    """
    ssl_context = ssl._create_unverified_context()

    # Extract relative path for mirror fallback
    relative_path = None
    for base in FITS_MIRRORS:
        if url.startswith(base):
            relative_path = url[len(base):].lstrip("/")
            break
    if relative_path is None:
        marker = "v0_1/"
        idx = url.find(marker)
        if idx >= 0:
            relative_path = url[idx + len(marker):]

    # Build URL list: original first, then mirrors
    urls = [url]
    if relative_path:
        for mirror in FITS_MIRRORS:
            candidate = f"{mirror}/{relative_path}"
            if candidate not in urls:
                urls.append(candidate)

    errors = []
    for try_url in urls:
        print(f"  Trying: {try_url}")
        req = urllib.request.Request(try_url, headers={
            "User-Agent": "Mozilla/5.0 (galaxies-etl/1.0; astronomy research)"
        })
        for attempt in range(1, max_retries + 1):
            try:
                with urllib.request.urlopen(req, timeout=120, context=ssl_context) as response:
                    data = response.read()
                    print(f"  Downloaded {len(data) / (1024*1024):.1f} MB")
                    return data
            except Exception as e:
                errors.append(f"{try_url} (attempt {attempt}): {e}")
                if attempt < max_retries:
                    wait = 2 ** attempt
                    print(f"    Attempt {attempt}/{max_retries} failed, retrying in {wait}s...")
                    time.sleep(wait)

    raise RuntimeError(
        "Failed to fetch FITS from all mirrors.\nErrors:\n" +
        "\n".join(f"  - {e}" for e in errors)
    )


def build_fits_url(galaxy_info: Dict) -> str:
    """Build the FITS download URL from galaxy catalog info."""
    return (
        f"{FITS_BASE_URL}/{galaxy_info['subdir']}/atlases/"
        f"{galaxy_info['pid']}/{galaxy_info['iauname']}-parent-{galaxy_info['pid']}.fits.gz"
    )


# ─── FITS Processing ──────────────────────────────────────────────────────

def extract_pixel_scale(header) -> float:
    """Derive pixel scale in arcseconds/pixel from a FITS header."""
    if "CD1_1" in header:
        return abs(header["CD1_1"]) * 3600.0
    elif "CDELT1" in header:
        return abs(header["CDELT1"]) * 3600.0
    else:
        print(f"  Warning: No WCS pixel scale in header, using SDSS default 0.396 arcsec/px")
        return 0.396


def extract_bands(fits_data: bytes, is_gzipped: bool = True) -> Tuple[Dict[str, np.ndarray], float]:
    """Extract u, g, r, i, z, nuv bands from FITS parent image.

    NSA parent image HDU layout:
      HDU 0: u band
      HDU 1: g band
      HDU 2: r band
      HDU 3: i band
      HDU 4: z band
      HDU 5: nuv band (GALEX Near-UV, if present)

    Returns:
        Tuple of (bands dict mapping name to float32 array, pixel_scale)
    """
    if is_gzipped:
        try:
            with gzip.GzipFile(fileobj=BytesIO(fits_data)) as f:
                fits_buffer = BytesIO(f.read())
        except gzip.BadGzipFile:
            fits_buffer = BytesIO(fits_data)
    else:
        fits_buffer = BytesIO(fits_data)

    with fits.open(fits_buffer, memmap=False) as hdul:
        pixel_scale = extract_pixel_scale(hdul[0].header)
        print(f"  Pixel scale: {pixel_scale:.4f} arcsec/px")
        print(f"  FITS has {len(hdul)} HDUs")

        bands = {}
        for idx, band in enumerate(BANDS):
            if idx >= len(hdul):
                print(f"  Warning: HDU {idx} not present, skipping band {band}")
                continue

            img_data = hdul[idx].data
            if img_data is None:
                print(f"  Warning: Band {band} HDU is empty, skipping")
                continue

            band_float = img_data.astype(np.float32)
            bands[band] = band_float
            print(f"  Band {band}: shape={img_data.shape}, range=[{band_float.min():.4f}, {band_float.max():.4f}]")

        return bands, pixel_scale


# ─── Image Output ─────────────────────────────────────────────────────────

def save_16bit_png(band_data: np.ndarray, output_path: Path) -> None:
    """Normalize float32 band to 16-bit [0, 65535] and save as PNG."""
    min_val = float(band_data.min())
    max_val = float(band_data.max())

    if max_val == min_val:
        scaled = np.zeros_like(band_data, dtype=np.uint16)
    else:
        normalized = (band_data - min_val) / (max_val - min_val)
        scaled = (normalized * 65535.0).astype(np.uint16)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray(scaled, mode="I;16")
    img.save(output_path, format="PNG")

    size_kb = output_path.stat().st_size / 1024
    print(f"  Saved 16-bit PNG: {output_path.name} ({size_kb:.0f} KB)")


def save_webp(band_data: np.ndarray, output_path: Path) -> None:
    """Normalize float32 band to 8-bit [0, 255] and save as WebP preview."""
    min_val = float(band_data.min())
    max_val = float(band_data.max())

    if max_val == min_val:
        scaled = np.zeros_like(band_data, dtype=np.uint8)
    else:
        normalized = (band_data - min_val) / (max_val - min_val)
        scaled = (normalized * 255).astype(np.uint8)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray(scaled, mode="L")
    img.save(output_path, format="WEBP", quality=85)

    print(f"  Saved WebP: {output_path.name}")


# ─── Metadata ─────────────────────────────────────────────────────────────

def save_metadata(
    pgc: int,
    output_dir: Path,
    band_ranges: Dict[str, Tuple[float, float]],
    available_bands: List[str],
    dimensions: Tuple[int, int],
    galaxy_info: Dict,
    pixel_scale: float,
    nsa_url: str,
) -> None:
    """Save metadata.json with accurate FITS-derived data ranges."""
    metadata = {
        "pgc": pgc,
        "nsa_iau_name": galaxy_info["iauname"],
        "nsaid": galaxy_info["nsaid"],
        "ra": galaxy_info["ra"],
        "dec": galaxy_info["dec"],
        "pixel_scale": pixel_scale,
        "bands": available_bands,
        "dimensions": list(dimensions),
        "data_ranges": band_ranges,
        "fetched_date": datetime.now().strftime("%Y-%m-%d"),
        "nsa_url": nsa_url,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = output_dir / "metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"  Saved metadata: {metadata_path}")


# ─── Main ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="NSA Galaxy Image ETL")
    parser.add_argument("--pgc", type=int, required=True, help="PGC number")
    parser.add_argument("--ra", type=float, help="Right ascension (degrees)")
    parser.add_argument("--dec", type=float, help="Declination (degrees)")
    parser.add_argument("--fits-file", type=str, help="Local .fits.gz file (skips download)")
    parser.add_argument("--output-base", default=r"D:\Developer\galaxies\src\main\images", help="Output base dir")

    args = parser.parse_args()
    output_dir = Path(args.output_base) / str(args.pgc)

    try:
        print(f"Processing PGC {args.pgc}...")

        # ── Step 1: Get FITS data ──
        if args.fits_file:
            fits_path = Path(args.fits_file)
            if not fits_path.exists():
                raise FileNotFoundError(f"FITS file not found: {fits_path}")
            print(f"Loading local FITS: {fits_path}")
            with open(fits_path, "rb") as f:
                fits_data = f.read()
            is_gzipped = fits_path.suffix == ".gz" or str(fits_path).endswith(".fits.gz")
            galaxy_info = None
            nsa_url = str(fits_path)
        else:
            if args.ra is None or args.dec is None:
                raise ValueError("--ra and --dec required when not using --fits-file")

            print(f"Looking up NSA catalog for RA={args.ra}, Dec={args.dec}...")
            galaxy_info = get_nsa_galaxy_info(ra=args.ra, dec=args.dec)
            nsa_url = build_fits_url(galaxy_info)

            print(f"Fetching FITS...")
            fits_data = fetch_fits(nsa_url)

        # ── Step 2: Save raw FITS (disabled — large files, save separately if needed) ──
        output_dir.mkdir(parents=True, exist_ok=True)
        # fits_archive_path = output_dir / "parent.fits.gz"
        # with open(fits_archive_path, "wb") as f:
        #     f.write(fits_data)
        # print(f"  Saved FITS archive: {fits_archive_path} ({len(fits_data) / (1024*1024):.1f} MB)")

        # ── Step 3: Extract bands ──
        print("Extracting bands...")
        is_gzipped = args.fits_file is None or (args.fits_file and args.fits_file.endswith(".gz"))
        bands, pixel_scale = extract_bands(fits_data, is_gzipped=is_gzipped)

        # ── Step 4: Generate images ──
        band_ranges = {}
        available_bands = []
        height, width = None, None

        for band_name, band_data in bands.items():
            print(f"Processing band {band_name}...")

            if height is None:
                height, width = band_data.shape

            band_ranges[band_name] = [float(band_data.min()), float(band_data.max())]
            available_bands.append(band_name)

            # 16-bit PNG (full dynamic range)
            save_16bit_png(band_data, output_dir / f"{band_name}.png")

        # ── Step 5: Save metadata ──
        if galaxy_info is None:
            # Loading from local FITS — read existing metadata for galaxy info
            existing_meta_path = output_dir / "metadata.json"
            if existing_meta_path.exists():
                with open(existing_meta_path) as f:
                    existing = json.load(f)
                galaxy_info = {
                    "iauname": existing.get("nsa_iau_name", ""),
                    "nsaid": existing.get("nsaid", 0),
                    "ra": existing.get("ra", 0),
                    "dec": existing.get("dec", 0),
                }
            else:
                galaxy_info = {"iauname": "", "nsaid": 0, "ra": args.ra or 0, "dec": args.dec or 0}

        save_metadata(args.pgc, output_dir, band_ranges, available_bands,
                      (width, height), galaxy_info, pixel_scale, nsa_url)

        print(f"\nComplete! Output: {output_dir}")
        print(f"  16-bit PNGs:  {', '.join(b + '.png' for b in available_bands)}")

    except Exception as e:
        print(f"\nError processing PGC {args.pgc}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
