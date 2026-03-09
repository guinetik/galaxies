"""Inspect NSA FITS file to find Andromeda (PGC 2557)."""
from astropy.io import fits
import os

import os
fits_file = os.path.expandvars(os.path.expanduser('~/galaxies/research/nsa_v0_1_2.fits'))
if not os.path.exists(fits_file):
    # Try from environment or set default
    fits_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../research/nsa_v0_1_2.fits'))

if not os.path.exists(fits_file):
    print(f"File not found: {fits_file}")
    exit(1)

print(f"Opening {fits_file}...")
with fits.open(fits_file) as hdul:
    print(f"Number of HDUs: {len(hdul)}")

    for i, hdu in enumerate(hdul):
        print(f"\nHDU {i}: {hdu.name} ({type(hdu).__name__})")
        if hasattr(hdu, 'data') and hdu.data is not None:
            print(f"  Shape: {hdu.data.shape}")
            if hasattr(hdu.data, 'dtype'):
                print(f"  Dtype: {hdu.data.dtype}")
        if hasattr(hdu, 'columns'):
            print(f"  Columns: {hdu.columns.names[:5]}...")  # Show first 5

    # Try to find Andromeda in the data
    if len(hdul) > 1 and hasattr(hdul[1], 'data'):
        data = hdul[1].data
        if 'IAUNAME' in data.dtype.names or 'IAUNAME' in hdul[1].columns.names:
            print("\n\nSearching for Andromeda...")
            for i, row in enumerate(data[:20]):  # First 20 rows
                if hasattr(row, 'IAUNAME'):
                    print(f"Row {i}: {row['IAUNAME']}")
                else:
                    print(f"Row {i}: {dict(row)}")
        else:
            print(f"\nAvailable columns: {hdul[1].columns.names}")
