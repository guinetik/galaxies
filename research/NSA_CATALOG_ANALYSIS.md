# NSA v0.1.2 Catalog Analysis

## Summary

Successfully explored the NSA (NASA-Sloan Atlas) v0.1.2 FITS catalog and created a Python lookup function for galaxy metadata extraction.

**File location:** `research/nsa_v0_1_2.fits` (510 MB)

**Catalog stats:**
- 145,155 galaxies
- 143 data columns
- Binary FITS table format

## Critical Finding: No PGC Identifiers

**The NSA catalog does NOT include PGC (Principal Galaxies Catalogue) identifiers.** This means:
- Cannot directly cross-match galaxies by PGC number in NSA
- Must use alternative identifiers: NSAID (primary), IAUNAME, or RA/Dec coordinates
- For PGC-to-NSA lookups, need external cross-match database or coordinate conversion

## Key Columns

| Column | Type | Purpose |
|--------|------|---------|
| **NSAID** | Integer | Primary NSA catalog ID (unique) |
| **IAUNAME** | String (19 chars) | Standard J2000 format name (JHHMMSS.SS±DDMMSS.S) |
| **SUBDIR** | String (27 chars) | SDSS image archive path (e.g., `00h/p40/J004244.30+411608.9`) |
| **PID** | Integer | SDSS Photo ID (0 = primary observation) |
| **RA** | Double | Right ascension in decimal degrees |
| **DEC** | Double | Declination in decimal degrees |
| **Z** | Float | Redshift (negative = blueshift) |
| **MAG** | Float | Magnitude (SDSS r-band) |
| **SIZE** | Float | Size parameter |

Additional columns: 135+ spectroscopic, photometric, and structural parameters (velocity dispersion, metallicity, star formation, morphology, etc.)

## Andromeda (M31) Lookup Results

**Search method:** RA/Dec coordinates (10.6846°, 41.2692°)

| Field | Value |
|-------|-------|
| **IAUNAME** | J004244.30+411608.9 |
| **SUBDIR** | 00h/p40/J004244.30+411608.9 |
| **PID** | 0 |
| **NSAID** | 127580 |
| **RA** | 10.685029600287073° |
| **DEC** | 41.26878343829933° |
| **Z (redshift)** | -0.001001 (blueshift due to local motion) |
| **Magnitude** | 4.360 |
| **Size** | 0.5 |

**Match quality:** RA/Dec accurate to 0.0006° (~2.2 arcseconds)

## Directory Structure

```
research/
├── nsa_v0_1_2.fits          # 510 MB NSA catalog (FITS binary table)
├── NSA_CATALOG_ANALYSIS.md  # This document
└── Preparing-Red-Green-Blue-Images-from-CCD-Data/
    └── [documentation on SDSS imaging]

src/main/python/nsa/
├── __init__.py
├── catalog_lookup.py        # NEW: Lookup functions
├── test_catalog_lookup.py   # NEW: Unit tests
├── nsa_image_etl.py         # Existing: Image fetching pipeline
└── [other ETL modules]
```

## API: Catalog Lookup Functions

### `get_nsa_galaxy_info()`

Look up a single galaxy in the NSA catalog.

```python
from catalog_lookup import get_nsa_galaxy_info

# By NSAID (most reliable)
info = get_nsa_galaxy_info(nsaid=127580)

# By RA/Dec coordinates (fuzzy, ~36 arcsecond search radius)
info = get_nsa_galaxy_info(ra=10.6846, dec=41.2692)

# Returns dict with keys:
# - iauname, subdir, pid, nsaid, ra, dec, z, mag, size
```

### `find_nearby_galaxies()`

Find all galaxies within a given radius.

```python
from catalog_lookup import find_nearby_galaxies

nearby = find_nearby_galaxies(
    ra=10.6846,
    dec=41.2692,
    radius_deg=0.5,
    limit=10
)
# Returns list of dicts, sorted by distance
```

## Integration Points

### ETL Pipeline (`nsa_image_etl.py`)

The lookup function enables:
1. **Galaxy identification:** Find NSA metadata for a known RA/Dec
2. **Image URL construction:** Use SUBDIR to build SDSS archive paths
3. **Data enrichment:** Combine NSA spectroscopy with combined pipeline catalog

Example usage:
```python
# Given a galaxy from combined pipeline with RA/Dec
info = get_nsa_galaxy_info(ra=galaxy['ra'], dec=galaxy['dec'])

# Fetch image using SUBDIR
image_url = f"https://sdss.org/dr17/sas/sdsswork/{info['subdir']}.fits"

# Combine metadata
galaxy_enriched = {
    **galaxy,
    'nsa_id': info['nsaid'],
    'nsa_image_path': info['subdir'],
    'redshift_spec': info['z'],
}
```

## Column Summary (All 143 Columns)

**Identifiers (1-3):**
- IAUNAME, SUBDIR, RA, DEC

**SDSS imaging (5-18):**
- ISDSS, INED, ISIXDF, IALFALFA, IZCAT, ITWODF
- RUN, CAMCOL, FIELD, RERUN, XPOS, YPOS

**Redshift (8-23):**
- Z, ZSRC, ZLG, ZDIST, ZDIST_ERR
- ZSDSSLINE

**Photometry (11-51):**
- MAG, NMGY, NMGY_IVAR, OK, RNMGY
- PETROFLUX, PETROFLUX_IVAR, FIBERFLUX, FIBERFLUX_IVAR
- ABSMAG, AMIVAR, EXTINCTION, KCORRECT, KCOEFF, MTOL

**Structure (52-70):**
- BA50, PHI50, BA90, PHI90
- SERSIC_* (flux, ivar, n, ba, phi)
- ASYMMETRY, CLUMPY

**Spectroscopy (77-133+):**
- VDISP, D4000, D4000ERR, FA, FAERR
- Line fluxes: S2, HA, HB, N2, O1, O2, O3
- Equivalent widths (EW) for each line
- Velocity measurements (VMEAS, VMERR) for each line

**Calibration (134-143):**
- PLATE, FIBERID, MJD, COEFF, AV
- SURVEY, PROGRAMNAME, PLATEQUALITY, TILE, PLUG_RA, PLUG_DEC

## Next Steps

1. **Cross-match NSA to combined pipeline:** Use RA/Dec matching to link NSA spectroscopy to galaxies in the combined database
2. **Image fetching:** Integrate SUBDIR paths into image ETL pipeline
3. **Data enrichment:** Add NSA columns (redshift, spectra, morphology) to combined database
4. **PGC mapping:** Create mapping table if PGC-to-NSA correspondence needed for legacy catalogs

## References

- NSA catalog: https://www.nsatlas.org/
- SDSS DR17: https://www.sdss4.org/dr17/
- FITS format: https://fits.gsfc.nasa.gov/
