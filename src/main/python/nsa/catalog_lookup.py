"""NSA Catalog Lookup Functions

Provides utilities for querying the NSA v0.1.2 FITS catalog.
Note: NSA uses NSAID as primary identifier, not PGC.
"""

import os
from pathlib import Path
from typing import Optional, Dict, Any
import numpy as np
from astropy.io import fits


def get_nsa_galaxy_info(
    pgc: Optional[int] = None,
    ra: Optional[float] = None,
    dec: Optional[float] = None,
    nsaid: Optional[int] = None,
    catalog_path: Optional[Path] = None,
) -> Dict[str, Any]:
    """
    Look up galaxy metadata in the NSA catalog.

    WARNING: NSA v0.1.2 does NOT include PGC identifiers.
    You can search by:
    - NSAID (NSA catalog ID) - primary identifier
    - RA/Dec coordinates (fuzzy match within ~1 arcmin)
    - PGC (will search by RA/Dec if available in combined pipeline)

    Args:
        pgc: PGC number (not in NSA; for reference/cross-matching)
        ra: Right ascension in decimal degrees
        dec: Declination in decimal degrees
        nsaid: NSA catalog ID
        catalog_path: Path to NSA FITS file (defaults to research/nsa_v0_1_2.fits)

    Returns:
        Dictionary with galaxy metadata:
        {
            'iauname': str,      # J-format name (JHHMMSS.SS±DDMMSS.S)
            'subdir': str,       # SDSS archive path (e.g., "00h/p40/...")
            'pid': int,          # SDSS Photo ID
            'nsaid': int,        # NSA catalog ID
            'ra': float,         # Right ascension (degrees)
            'dec': float,        # Declination (degrees)
            'z': float,          # Redshift
            'mag': float,        # Magnitude
            'size': float,       # Size parameter
        }

    Raises:
        ValueError: If galaxy not found or no search criteria provided
        FileNotFoundError: If catalog file not found

    Examples:
        # Search by NSAID (most reliable)
        info = get_nsa_galaxy_info(nsaid=127580)  # Andromeda

        # Search by coordinates (fuzzy)
        info = get_nsa_galaxy_info(ra=10.6846, dec=41.2692)
    """

    # Resolve catalog path
    if catalog_path is None:
        # Try relative to this file's location first (using os.path for Windows compatibility)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        candidate = Path(current_dir).parent.parent.parent.parent / 'research' / 'nsa_v0_1_2.fits'
        if candidate.exists():
            catalog_path = candidate
        else:
            # Fallback to research/ from project root
            candidate = Path('research') / 'nsa_v0_1_2.fits'
            if candidate.exists():
                catalog_path = candidate
            else:
                catalog_path = candidate  # Use the absolute path as fallback

    if not Path(catalog_path).exists():
        raise FileNotFoundError(f"NSA catalog not found: {catalog_path}")

    # Validate search criteria
    if nsaid is None and (ra is None or dec is None) and pgc is None:
        raise ValueError(
            "Must provide either: nsaid, (ra+dec), or pgc"
        )

    with fits.open(str(catalog_path)) as hdul:
        data = hdul[1].data

        # Search by NSAID (most direct)
        if nsaid is not None:
            mask = data['NSAID'] == nsaid
            indices = np.where(mask)[0]
            if len(indices) == 0:
                raise ValueError(f"Galaxy with NSAID {nsaid} not found")
            row_idx = indices[0]

        # Search by RA/Dec (fuzzy, within ~1 arcmin by default)
        elif ra is not None and dec is not None:
            search_radius = 0.01  # ~0.01 degrees = ~36 arcseconds
            ras = data['RA']
            decs = data['DEC']
            dists = np.sqrt((ras - ra)**2 + (decs - dec)**2)
            mask = dists < search_radius
            indices = np.where(mask)[0]
            if len(indices) == 0:
                raise ValueError(
                    f"No galaxies found near RA={ra}, Dec={dec} "
                    f"(within {search_radius} degrees)"
                )
            # Return closest match
            row_idx = indices[np.argmin(dists[indices])]

        # PGC fallback: would need cross-match database
        # For now, user must provide RA/Dec for PGC lookup
        else:
            raise ValueError(
                "PGC lookup not implemented. NSA catalog lacks PGC identifiers. "
                "Use NSAID or (RA, Dec) instead."
            )

        row = data[row_idx]

        # Helper to handle both bytes and strings
        def to_str(val: Any) -> str:
            if isinstance(val, bytes):
                return val.decode().strip()
            return str(val).strip()

        return {
            'iauname': to_str(row['IAUNAME']),
            'subdir': to_str(row['SUBDIR']),
            'pid': int(row['PID']),
            'nsaid': int(row['NSAID']),
            'ra': float(row['RA']),
            'dec': float(row['DEC']),
            'z': float(row['Z']),
            'mag': float(row['MAG']),
            'size': float(row['SIZE']),
        }


def find_nearby_galaxies(
    ra: float,
    dec: float,
    radius_deg: float = 0.5,
    catalog_path: Optional[Path] = None,
    limit: int = 10,
) -> list[Dict[str, Any]]:
    """
    Find all galaxies within a given radius of a coordinate.

    Args:
        ra: Right ascension in decimal degrees
        dec: Declination in decimal degrees
        radius_deg: Search radius in degrees
        catalog_path: Path to NSA FITS file
        limit: Maximum number of results to return

    Returns:
        List of galaxy metadata dicts, sorted by distance
    """

    if catalog_path is None:
        # Try relative to this file's location first (using os.path for Windows compatibility)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        candidate = Path(current_dir).parent.parent.parent.parent / 'research' / 'nsa_v0_1_2.fits'
        if candidate.exists():
            catalog_path = candidate
        else:
            # Fallback to research/ from project root
            candidate = Path('research') / 'nsa_v0_1_2.fits'
            if candidate.exists():
                catalog_path = candidate
            else:
                catalog_path = candidate  # Use the absolute path as fallback

    if not Path(catalog_path).exists():
        raise FileNotFoundError(f"NSA catalog not found: {catalog_path}")

    with fits.open(str(catalog_path)) as hdul:
        data = hdul[1].data

        ras = data['RA']
        decs = data['DEC']
        dists = np.sqrt((ras - ra)**2 + (decs - dec)**2)

        mask = dists < radius_deg
        indices = np.where(mask)[0]

        if len(indices) == 0:
            return []

        # Sort by distance and limit
        sorted_indices = indices[np.argsort(dists[indices])][:limit]

        results = []
        for idx in sorted_indices:
            row = data[idx]

            def to_str(val: Any) -> str:
                if isinstance(val, bytes):
                    return val.decode().strip()
                return str(val).strip()

            results.append({
                'iauname': to_str(row['IAUNAME']),
                'subdir': to_str(row['SUBDIR']),
                'pid': int(row['PID']),
                'nsaid': int(row['NSAID']),
                'ra': float(row['RA']),
                'dec': float(row['DEC']),
                'z': float(row['Z']),
                'mag': float(row['MAG']),
                'size': float(row['SIZE']),
                'distance_deg': float(dists[idx]),
            })

        return results


if __name__ == '__main__':
    # Test: Look up Andromeda (M31)
    print("=== TEST: Andromeda Lookup ===\n")

    try:
        # By NSAID
        info = get_nsa_galaxy_info(nsaid=127580)
        print("By NSAID (127580):")
        for key, val in info.items():
            print(f"  {key}: {val}")

        print("\n" + "="*50 + "\n")

        # By coordinates
        m31_ra = 10.6846
        m31_dec = 41.2692
        info2 = get_nsa_galaxy_info(ra=m31_ra, dec=m31_dec)
        print(f"By RA/Dec ({m31_ra:.4f}, {m31_dec:.4f}):")
        for key, val in info2.items():
            print(f"  {key}: {val}")

        print("\n" + "="*50 + "\n")

        # Nearby galaxies
        nearby = find_nearby_galaxies(m31_ra, m31_dec, radius_deg=0.5, limit=5)
        print(f"Nearby galaxies (within 0.5°):")
        for i, gal in enumerate(nearby, 1):
            print(f"\n  {i}. {gal['iauname']} (distance: {gal['distance_deg']:.6f}°)")
            print(f"     NSAID: {gal['nsaid']}, PID: {gal['pid']}")
            print(f"     SUBDIR: {gal['subdir']}")

    except Exception as e:
        print(f"Error: {e}")
