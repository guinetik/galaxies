"""
NSA Galaxy Image ETL: Fetch FITS data, extract bands, convert to WebP.

Usage:
  python nsa_image_etl.py --pgc 2557

Output:
  public/galaxy-img/[pgc]/u.webp, g.webp, r.webp, i.webp, z.webp, nuv.webp
  public/galaxy-img/[pgc]/metadata.json
"""

import os
import sys
import json
import gzip
import argparse
import urllib.request
import ssl
from pathlib import Path
from typing import Dict, Tuple, Optional
from io import BytesIO
from datetime import datetime

try:
    from astropy.io import fits
    from PIL import Image
    import numpy as np
except ImportError as e:
    print(f"Missing dependency: {e}")
    sys.exit(1)

from catalog_lookup import get_nsa_galaxy_info


# ─── Constants ─────────────────────────────────────────────────────────────

BANDS = ["u", "g", "r", "i", "z", "nuv"]
FITS_BASE_URL = "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1"


# ─── Main Functions ────────────────────────────────────────────────────────

def fetch_fits(ra: float, dec: float) -> Tuple[bytes, Dict]:
    """Fetch gzipped FITS file from NSA servers using catalog lookup.

    Args:
        ra: Right ascension in decimal degrees
        dec: Declination in decimal degrees

    Returns:
        Tuple of (gzipped FITS file content as bytes, galaxy_info dict)

    Raises:
        ValueError: If galaxy not found in catalog
        RuntimeError: If fetch fails
    """
    # Look up galaxy in NSA catalog
    print(f"Looking up NSA metadata for RA={ra}, Dec={dec}...")
    galaxy_info = get_nsa_galaxy_info(ra=ra, dec=dec)

    # URL pattern: base/subdir/atlases/pid/iauname-parent-pid.fits.gz
    url = f"{FITS_BASE_URL}/{galaxy_info['subdir']}/atlases/{galaxy_info['pid']}/{galaxy_info['iauname']}-parent-{galaxy_info['pid']}.fits.gz"

    print(f"Fetching: {url}")

    try:
        # Create SSL context that doesn't verify certificates
        # (necessary on some systems with certificate issues)
        ssl_context = ssl._create_unverified_context()

        with urllib.request.urlopen(url, timeout=30, context=ssl_context) as response:
            return response.read(), galaxy_info
    except Exception as e:
        raise RuntimeError(f"Failed to fetch {url}: {e}")


def extract_pixel_scale(header) -> float:
    """Derive pixel scale in arcseconds/pixel from a FITS header.

    Checks CD matrix first, then falls back to CDELT keywords.

    Args:
        header: astropy FITS header object

    Returns:
        Pixel scale in arcseconds per pixel (always positive).
        Defaults to 1.0 arcsec/px if no WCS keywords are found.
    """
    DEFAULT_SCALE = 1.0  # arcsec, conservative fallback for NSA v0

    if "CD1_1" in header:
        scale_deg = abs(header["CD1_1"])
    elif "CDELT1" in header:
        scale_deg = abs(header["CDELT1"])
    else:
        print(f"  Warning: No WCS pixel scale in header, defaulting to {DEFAULT_SCALE} arcsec/px")
        return DEFAULT_SCALE

    return scale_deg * 3600.0


def extract_bands(fits_data: bytes) -> Tuple[Dict[str, np.ndarray], float]:
    """Extract u, g, r, i, z, nuv bands from gzipped FITS parent image.

    NSA parent image structure (for parent images):
    - HDU 0: PRIMARY - u image
    - HDU 1: g image
    - HDU 2: r image
    - HDU 3: i image
    - HDU 4: z image
    - HDU 5: nuv image (GALEX Near-UV)

    Args:
        fits_data: Gzipped FITS file content as bytes

    Returns:
        Tuple of (bands dict mapping name to float32 array, pixel_scale in arcsec/px)

    Raises:
        ValueError: If required band HDU is missing or empty
    """
    # Decompress FITS
    with gzip.GzipFile(fileobj=BytesIO(fits_data)) as f:
        fits_buffer = BytesIO(f.read())

    # Open FITS
    with fits.open(fits_buffer, memmap=False) as hdul:
        pixel_scale = extract_pixel_scale(hdul[0].header)
        print(f"  Pixel scale: {pixel_scale:.4f} arcsec/px")

        bands = {}

        # Extract image HDUs (sequential indices: 0, 1, 2, 3, 4)
        for idx, band in enumerate(BANDS):
            hdu_index = idx  # 0, 1, 2, 3, 4
            if hdu_index >= len(hdul):
                raise ValueError(f"Missing HDU for band {band} at index {hdu_index}")

            img_data = hdul[hdu_index].data
            if img_data is None:
                raise ValueError(f"Band {band} HDU is empty")

            # Convert to float32 for processing
            bands[band] = img_data.astype(np.float32)

        return bands, pixel_scale


def normalize_band(band_data: np.ndarray) -> np.ndarray:
    """Normalize band data to uint8 [0, 255].

    Linear scaling from [min, max] to [0, 255].

    Args:
        band_data: Float32 numpy array with arbitrary range

    Returns:
        Uint8 numpy array with values in [0, 255]
    """
    # Handle edge case: all zeros or constant value
    if band_data.max() == band_data.min():
        return np.zeros_like(band_data, dtype=np.uint8)

    # Linear scale to [0, 1]
    min_val = band_data.min()
    max_val = band_data.max()
    normalized = (band_data - min_val) / (max_val - min_val)

    # Scale to [0, 255] and convert to uint8
    scaled = (normalized * 255).astype(np.uint8)

    return scaled


def save_webp(band_data: np.ndarray, output_path: Path) -> None:
    """Convert numpy uint8 array to WebP and save.

    Args:
        band_data: Uint8 numpy array (2D for single band)
        output_path: Path where WebP file should be saved
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Convert to PIL Image (grayscale)
    img = Image.fromarray(band_data, mode="L")

    # Save as WebP with quality setting
    img.save(output_path, format="WEBP", quality=85)

    print(f"Saved: {output_path}")


def save_metadata(pgc: int, output_dir: Path, band_ranges: Dict[str, Tuple[float, float]], dimensions: Tuple[int, int], galaxy_info: Dict, pixel_scale: float) -> None:
    """Save metadata.json alongside WebP files.

    Args:
        pgc: Principal Galaxy Catalog number (for reference)
        output_dir: Directory where metadata.json will be saved
        band_ranges: Dict mapping band name to (min, max) data values
        dimensions: Tuple of (width, height)
        galaxy_info: Galaxy metadata dict from catalog_lookup
        pixel_scale: Image pixel scale in arcseconds per pixel

    Raises:
        ValueError: If galaxy_info is missing required fields
    """
    required_fields = ['iauname', 'subdir', 'pid', 'nsaid', 'ra', 'dec']
    if not all(field in galaxy_info for field in required_fields):
        raise ValueError(f"Missing required fields in galaxy_info: {galaxy_info}")

    metadata = {
        "pgc": pgc,
        "nsa_iau_name": galaxy_info["iauname"],
        "nsaid": galaxy_info["nsaid"],
        "ra": galaxy_info["ra"],
        "dec": galaxy_info["dec"],
        "pixel_scale": pixel_scale,
        "bands": BANDS,
        "dimensions": list(dimensions),
        "data_ranges": band_ranges,
        "fetched_date": datetime.now().strftime("%Y-%m-%d"),
        "nsa_url": f"{FITS_BASE_URL}/{galaxy_info['subdir']}/atlases/{galaxy_info['pid']}/{galaxy_info['iauname']}-parent-{galaxy_info['pid']}.fits.gz",
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = output_dir / "metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Saved metadata: {metadata_path}")


def main():
    """Fetch NSA galaxy data, extract bands, save as WebP + metadata."""
    parser = argparse.ArgumentParser(description="NSA Galaxy Image ETL")
    parser.add_argument("--pgc", type=int, required=True, help="PGC number of galaxy (for output folder naming)")
    parser.add_argument("--ra", type=float, required=True, help="Right ascension in decimal degrees")
    parser.add_argument("--dec", type=float, required=True, help="Declination in decimal degrees")
    parser.add_argument("--output-base", default="src/main/site/public/galaxy-img", help="Output directory base")

    args = parser.parse_args()

    pgc = args.pgc
    ra = args.ra
    dec = args.dec
    output_base = Path(args.output_base)
    output_dir = output_base / str(pgc)

    try:
        print(f"Processing PGC {pgc} (RA={ra}, Dec={dec})...")

        # Fetch FITS with catalog lookup
        print(f"Fetching FITS data...")
        fits_data, galaxy_info = fetch_fits(ra, dec)

        # Extract bands and pixel scale from FITS header
        print(f"Extracting bands...")
        bands, pixel_scale = extract_bands(fits_data)

        # Create output directory
        output_dir.mkdir(parents=True, exist_ok=True)

        # Process each band
        band_ranges = {}
        height, width = None, None

        for band_name, band_data in bands.items():
            print(f"Processing band {band_name}...")

            if height is None:
                height, width = band_data.shape

            # Record data range before normalization
            band_ranges[band_name] = (float(band_data.min()), float(band_data.max()))

            # Normalize and save
            normalized = normalize_band(band_data)
            save_webp(normalized, output_dir / f"{band_name}.webp")

        # Save metadata
        print(f"Saving metadata...")
        save_metadata(pgc, output_dir, band_ranges, (width, height), galaxy_info, pixel_scale)

        print(f"✓ Complete! Output: {output_dir}")

    except Exception as e:
        print(f"✗ Error processing PGC {pgc}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
