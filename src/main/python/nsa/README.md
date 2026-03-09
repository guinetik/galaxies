# NSA Galaxy Image ETL Pipeline

Convert astronomical galaxy data from the NASA-Sloan Atlas (NSA) FITS format into web-ready WebP images and metadata.

This pipeline downloads multi-band CCD observations from the Sloan Digital Sky Survey (SDSS), extracts photometric bands (u, g, r, i, z), normalizes the data to 8-bit grayscale, and produces compressed WebP files suitable for web display.

## Quick Start

### Installation

1. Install Python dependencies:
```bash
pip install astropy pillow numpy
```

2. Ensure the NSA v0.1.2 catalog FITS file is available at `research/nsa_v0_1_2.fits` (relative to the project root).

### Basic Usage

Process Andromeda (PGC 2557) as a test:

```bash
python nsa_image_etl.py \
  --pgc 2557 \
  --ra 10.6850 \
  --dec 41.2688 \
  --output-base ../../site/public/galaxy-img
```

This generates:
- `public/galaxy-img/2557/u.webp` - Ultraviolet band image
- `public/galaxy-img/2557/g.webp` - Green band image
- `public/galaxy-img/2557/r.webp` - Red band image
- `public/galaxy-img/2557/i.webp` - Near-infrared band image
- `public/galaxy-img/2557/z.webp` - Far-infrared band image
- `public/galaxy-img/2557/metadata.json` - Galaxy metadata and data ranges

### Process Multiple Galaxies

Create a simple Python script to process a batch of galaxies:

```python
import subprocess
import json

galaxies = [
    {"pgc": 2557, "ra": 10.6850, "dec": 41.2688},  # Andromeda
    {"pgc": 224, "ra": 3.0450, "dec": -2.7930},     # M33
    # Add more galaxies...
]

for gal in galaxies:
    cmd = [
        "python", "nsa_image_etl.py",
        "--pgc", str(gal["pgc"]),
        "--ra", str(gal["ra"]),
        "--dec", str(gal["dec"]),
        "--output-base", "../../site/public/galaxy-img"
    ]
    subprocess.run(cmd, check=True)
```

## How It Works

### Architecture Overview

```
NSA Catalog (FITS)
        |
        v
  Catalog Lookup  <-- Query by RA/Dec or NSAID
        |
        v
  Construct URL
        |
        v
  Fetch FITS File  <-- HTTP GET from NSA servers
        |
        v
  Decompress (gzip)
        |
        v
  Parse FITS
        |
        +---> Extract u band (HDU 0)
        |       |
        |       v
        |     Normalize to uint8 [0, 255]
        |       |
        |       v
        |     Convert to WebP
        |
        +---> Extract g band (HDU 1)
        |       ...
        |
        +---> Extract r band (HDU 2)
        |       ...
        |
        +---> Extract i band (HDU 3)
        |       ...
        |
        +---> Extract z band (HDU 4)
                ...
        |
        v
  Save Metadata JSON
        |
        v
  public/galaxy-img/[pgc]/
```

### Data Flow

1. **Catalog Lookup** (`catalog_lookup.py`)
   - Load NSA v0.1.2 FITS catalog from `research/nsa_v0_1_2.fits`
   - Search by NSAID (primary) or RA/Dec coordinates (fuzzy match within ~36 arcseconds)
   - Return galaxy metadata: IAU name, SDSS PID, subdirectory path, redshift, magnitude, size

2. **Fetch FITS** (`nsa_image_etl.py`)
   - Use catalog metadata to construct FITS URL:
     ```
     http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/{subdir}/atlases/{pid}/{iauname}-parent-{pid}.fits.gz
     ```
   - Download gzipped FITS file from NSA servers (30-second timeout)
   - Handle SSL certificate issues automatically

3. **Extract Bands**
   - Decompress gzip to bytes
   - Open FITS HDU list using astropy
   - Extract 5 image HDUs (indices 0-4) corresponding to u, g, r, i, z bands
   - Convert pixel data to float32 for processing

4. **Normalize**
   - Linear scaling: `(band_data - min) / (max - min) * 255`
   - Clamp to uint8 [0, 255]
   - Handle edge cases (uniform values, single pixels)

5. **Save WebP**
   - Convert uint8 numpy array to PIL Image (grayscale mode)
   - Save with WebP codec at quality=85 (balance between file size and visual quality)
   - Typical file size: 40-60 KB per band

6. **Save Metadata JSON**
   - Record PGC number, NSA IAU name, NSAID, RA, Dec
   - Store image dimensions (width, height)
   - Record original data ranges for each band (min, max before normalization)
   - Include fetched date and source FITS URL

## Data Source

### NSA (NASA-Sloan Atlas) v0.1.2

- **Coverage**: ~85,000 nearby galaxies
- **Source**: SDSS Data Release 10 (DR10) multi-band imaging
- **Catalog File**: FITS binary table with galaxy metadata
- **Image Server**: `http://sdss.physics.nyu.edu/mblanton/`
- **Primary Key**: NSAID (NSA Identifier), not PGC

### FITS Structure

NSA parent images are gzip-compressed FITS files with this structure:

| HDU Index | Type | Content |
|-----------|------|---------|
| 0 | ImageHDU | u-band image (CCD counts) |
| 1 | ImageHDU | g-band image (CCD counts) |
| 2 | ImageHDU | r-band image (CCD counts) |
| 3 | ImageHDU | i-band image (CCD counts) |
| 4 | ImageHDU | z-band image (CCD counts) |
| 5+ | (various) | GALEX UV, etc. (not used) |

**Note**: Child images follow a different HDU structure (not supported).

### Photometric Bands

| Band | Wavelength | Description |
|------|------------|-------------|
| u | 354 nm | Ultraviolet |
| g | 477 nm | Green (visual) |
| r | 623 nm | Red (visual) |
| i | 762 nm | Near-infrared |
| z | 913 nm | Far-infrared |

## Output Format

### WebP Images

Each band is saved as a separate grayscale WebP file:

```
public/galaxy-img/2557/
├── u.webp    (UV, ~48 KB)
├── g.webp    (Green, ~45 KB)
├── r.webp    (Red, ~52 KB)
├── i.webp    (Near-IR, ~55 KB)
├── z.webp    (Far-IR, ~50 KB)
└── metadata.json
```

**Encoding**:
- Format: WebP (lossy)
- Quality: 85 (0-100 scale)
- Color Space: Grayscale (8-bit)
- Typical Resolution: 4544×4544 pixels (Andromeda)

**Why WebP?**
- 40-60% smaller than PNG for similar quality
- Supported by all modern browsers
- Efficient for grayscale scientific images

### Metadata JSON

```json
{
  "pgc": 2557,
  "nsa_iau_name": "J004244.30+411608.9",
  "nsaid": 127580,
  "ra": 10.6850296,
  "dec": 41.2687834,
  "bands": ["u", "g", "r", "i", "z"],
  "dimensions": [4544, 4544],
  "data_ranges": {
    "u": [0.0, 1234.5],
    "g": [10.2, 5678.9],
    "r": [25.3, 8901.2],
    "i": [50.1, 7654.3],
    "z": [75.8, 6543.2]
  },
  "fetched_date": "2025-03-09",
  "nsa_url": "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/00h/p40/J004244.30+411608.9/J004244.30+411608.9-parent-0.fits.gz"
}
```

**Fields**:
- `pgc`: Principal Galaxy Catalog number (for reference)
- `nsa_iau_name`: J-format name from NSA catalog
- `nsaid`: NSA internal identifier
- `ra`, `dec`: Celestial coordinates (decimal degrees)
- `bands`: List of extracted photometric bands
- `dimensions`: [width, height] of image in pixels
- `data_ranges`: Original min/max values from FITS before normalization
- `fetched_date`: ISO date when image was fetched
- `nsa_url`: Source FITS file URL for verification/redownload

## Adding More Galaxies

### Step 1: Get Galaxy Coordinates

Find RA and Dec for your galaxy. Common sources:
- **SIMBAD**: http://simbad.u-strasbg.fr/simbad/ (search by name, returns RA/Dec)
- **NASA Extragalactic Database (NED)**: https://ned.ipac.caltech.edu/
- **Local telescope databases**: Check PGC, M numbers, NGC designations

### Step 2: Verify in NSA Catalog

```python
from catalog_lookup import get_nsa_galaxy_info, find_nearby_galaxies

# Check if galaxy exists near those coordinates
nearby = find_nearby_galaxies(ra=your_ra, dec=your_dec, radius_deg=0.1, limit=5)
for gal in nearby:
    print(f"{gal['iauname']} (NSAID={gal['nsaid']}, distance={gal['distance_deg']:.6f}°)")
```

If found, use its NSAID for guaranteed lookup. If not found, you may need to use another image source.

### Step 3: Run Pipeline

```bash
python nsa_image_etl.py \
  --pgc YOUR_PGC_NUMBER \
  --ra YOUR_RA \
  --dec YOUR_DEC \
  --output-base ../../site/public/galaxy-img
```

### Step 4: Verify Output

```bash
ls -lh public/galaxy-img/YOUR_PGC_NUMBER/
cat public/galaxy-img/YOUR_PGC_NUMBER/metadata.json | jq .
```

Check that:
- All 5 WebP files exist and are > 30 KB
- Dimensions are reasonable (typically 4000-5000 pixels)
- Data ranges are non-trivial (not all zeros or very small ranges)

### Batch Processing

For processing multiple galaxies efficiently:

```python
#!/usr/bin/env python3
"""Process a batch of galaxies from CSV."""

import csv
import subprocess
import sys
from pathlib import Path

csv_file = "galaxies_to_process.csv"  # pgc,ra,dec format
output_base = "../../site/public/galaxy-img"

with open(csv_file) as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader, 1):
        pgc = int(row["pgc"])
        ra = float(row["ra"])
        dec = float(row["dec"])

        print(f"\n[{i}] Processing PGC {pgc}...")

        try:
            subprocess.run([
                "python", "nsa_image_etl.py",
                "--pgc", str(pgc),
                "--ra", str(ra),
                "--dec", str(dec),
                "--output-base", output_base
            ], check=True, timeout=60)
        except subprocess.CalledProcessError as e:
            print(f"ERROR: Failed to process PGC {pgc}: {e}", file=sys.stderr)
        except subprocess.TimeoutExpired:
            print(f"ERROR: Timeout processing PGC {pgc}", file=sys.stderr)
```

## Dependencies

### Python Packages

```
astropy>=5.0          # FITS file handling, astronomy utilities
pillow>=9.0           # Image processing
numpy>=1.20           # Numerical arrays
```

Install with:
```bash
pip install astropy pillow numpy
```

Or from requirements file:
```bash
pip install -r requirements.txt
```

### External Files

- **NSA Catalog**: `research/nsa_v0_1_2.fits` (must be present, ~200 MB)
- **Network Access**: Required to fetch FITS files from NSA servers

### System Requirements

- Python 3.8+
- ~500 MB free disk space per 10 galaxies
- Internet connection (for FITS download)

## Usage Reference

### Command-Line Arguments

```bash
python nsa_image_etl.py --pgc PGC --ra RA --dec DEC [--output-base PATH]
```

| Argument | Type | Required | Default | Notes |
|----------|------|----------|---------|-------|
| `--pgc` | int | Yes | — | Principal Galaxy Catalog number (for output folder) |
| `--ra` | float | Yes | — | Right ascension in decimal degrees (0-360) |
| `--dec` | float | Yes | — | Declination in decimal degrees (-90 to +90) |
| `--output-base` | str | No | `src/main/site/public/galaxy-img` | Base output directory |

### Environment Variables

None currently. Configuration is command-line only.

## Testing

### Run Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest test_nsa_etl.py -v

# Run specific test
pytest test_nsa_etl.py::test_normalize_band_returns_uint8 -v

# Run catalog lookup tests (requires NSA catalog file)
pytest test_catalog_lookup.py -v
```

### Test Suite

**`test_nsa_etl.py`** (15+ tests)
- `test_extract_bands_returns_dict` - Band extraction returns proper dict
- `test_extract_bands_raises_on_missing_hdu` - Validates FITS structure
- `test_normalize_band_returns_uint8` - Normalization produces uint8
- `test_normalize_band_handles_uniform_values` - Edge case: constant pixels
- `test_save_webp_creates_file` - WebP file creation
- `test_save_webp_preserves_dimensions` - Image dimensions preserved
- `test_save_webp_creates_parent_directories` - Directory creation
- `test_save_metadata_creates_json` - Metadata JSON generation
- `test_main_pipeline_andromeda` - Full pipeline integration test

**`test_catalog_lookup.py`** (8 tests)
- `test_andromeda_by_nsaid` - Lookup by NSAID (primary key)
- `test_andromeda_by_coordinates` - Lookup by RA/Dec (fuzzy)
- `test_invalid_search_criteria` - Error handling
- `test_nonexistent_nsaid` - Error handling
- `test_nonexistent_coordinates` - Error handling
- `test_nearby_galaxies` - Radius search functionality
- `test_nearby_galaxies_empty` - Empty region handling
- `test_nearby_galaxies_limit` - Result limiting

## Architecture

### Module Overview

**`nsa_image_etl.py`** - Main ETL pipeline
- `fetch_fits(ra, dec)` - Download gzipped FITS from NSA servers
- `extract_bands(fits_data)` - Extract u,g,r,i,z bands from FITS
- `normalize_band(band_data)` - Linear normalization to [0, 255]
- `save_webp(band_data, output_path)` - Save as WebP
- `save_metadata(pgc, output_dir, band_ranges, dimensions, galaxy_info)` - Write metadata.json
- `main()` - CLI entry point

**`catalog_lookup.py`** - NSA catalog queries
- `get_nsa_galaxy_info(pgc=None, ra=None, dec=None, nsaid=None, catalog_path=None)` - Look up galaxy metadata
- `find_nearby_galaxies(ra, dec, radius_deg=0.5, catalog_path=None, limit=10)` - Radius search

### Key Design Decisions

1. **Catalog Lookup**: Query NSA v0.1.2 FITS directly (no intermediate SQLite)
   - Reason: Catalog is relatively small (~85k rows), FITS random access is efficient

2. **FITS Streaming**: Decompress gzip in memory, not to disk
   - Reason: Faster, cleaner, no temp file cleanup needed

3. **Band Normalization**: Linear scaling, not log or histogram equalization
   - Reason: Preserves relative brightness, suitable for scientific visualization

4. **WebP Encoding**: Quality=85 (not max quality)
   - Reason: 40-60% file size reduction vs. quality=100, imperceptible difference

5. **Separate Module**: `catalog_lookup.py` independent of ETL
   - Reason: Catalog queries useful for other tools (e.g., galaxy browser)

## Troubleshooting

### Common Issues

**"NSA catalog not found"**
```
FileNotFoundError: NSA catalog not found: research/nsa_v0_1_2.fits
```
Solution: Ensure NSA FITS file exists at `research/nsa_v0_1_2.fits` relative to project root.

**"No galaxies found near RA=X, Dec=Y"**
```
ValueError: No galaxies found near RA=..., Dec=... (within 0.01 degrees)
```
Solutions:
1. Verify RA/Dec are correct (check SIMBAD)
2. Increase search radius: `catalog_lookup.py` uses fixed 0.01° (~36 arcsec)
3. Verify NSA catalog includes that region (mostly nearby galaxies < z 0.05)

**"Missing HDU for band X"**
```
ValueError: Missing HDU for band g at index 1
```
Possible causes:
1. Galaxy image is not a "parent" image (child images have different structure)
2. FITS file corrupted or incomplete download
Try re-running; network issues are common.

**"Failed to fetch: SSL: CERTIFICATE_VERIFY_FAILED"**
```
RuntimeError: Failed to fetch ...: SSL: CERTIFICATE_VERIFY_FAILED
```
Solution: Pipeline handles this automatically. If error persists, check:
1. Internet connectivity
2. NSA server status (http://sdss.physics.nyu.edu/)
3. System date/time correct

**WebP file is too small or corrupt**
```
ls: u.webp is 512 bytes (expected > 30 KB)
```
Cause: Band was all zeros or nearly uniform (e.g., no astronomical data)
Check: metadata.json data_ranges for that band

**"Missing dependency: No module named 'astropy'"**
```
ImportError: No module named 'astropy'
```
Solution:
```bash
pip install astropy pillow numpy
```

### Debug Mode

Enable verbose output by modifying `nsa_image_etl.py`:

```python
# Add after imports
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Then use logger.debug() for troubleshooting
logger.debug(f"FITS URL: {url}")
logger.debug(f"Band shape: {bands['g'].shape}")
logger.debug(f"Data range: {band_data.min()}-{band_data.max()}")
```

Or add print statements for quick debugging:

```bash
python -u nsa_image_etl.py --pgc 2557 --ra 10.6850 --dec 41.2688
```

(The `-u` flag ensures unbuffered output for real-time display)

## Performance

### Typical Metrics

| Operation | Time | Notes |
|-----------|------|-------|
| Catalog lookup | 100-200 ms | FITS random access |
| FITS download | 2-10 s | Network dependent, ~100-300 MB file |
| Decompression | 500-1000 ms | gzip → in-memory |
| Band extraction | 200-500 ms | Float32 conversion |
| Normalization | 100-300 ms | Linear scaling per band |
| WebP encoding | 1-3 s | PIL encoder, all bands parallel |
| Total | 4-15 s | Typical end-to-end |

### Optimization Tips

1. **Batch Processing**: Download multiple galaxies in parallel
   ```bash
   for pgc in 2557 224 4321; do
     python nsa_image_etl.py --pgc $pgc --ra X --dec Y &
   done
   wait
   ```

2. **Network**: Use faster ISP or run from institution with good connectivity

3. **Disk**: Use SSD for output directory (faster WebP write)

4. **Memory**: Current implementation is efficient; few optimization opportunities

## Contributing

### Code Style

- Python 3.8+ syntax
- Type hints for function signatures
- Docstrings for public functions
- 100-character line limit (approximate)

### Adding Features

- Add new functions to appropriate module (ETL vs. catalog)
- Write unit tests in corresponding `test_*.py` file
- Update this README with new usage examples

### Reporting Issues

Include:
1. Python version (`python --version`)
2. Error message and traceback
3. Command used
4. NSA catalog file size (`ls -lh research/nsa_v0_1_2.fits`)

## License

Same as parent project (see root `LICENSE` file)

## References

- **NSA Homepage**: http://sdss.physics.nyu.edu/mblanton/
- **NSA Paper**: Blanton et al. 2011, AJ 142:31 (https://arxiv.org/abs/1105.3975)
- **SDSS Photometry**: http://www.sdss.org/dr10/imaging/
- **FITS Standard**: https://fits.gsfc.nasa.gov/
- **WebP Format**: https://developers.google.com/speed/webp/

## NSA Galaxy Enrichment

After generating `galaxies.db` with the combined ETL, enrich it with NSA catalog identifiers:

### Usage

```bash
cd src/main/python/nsa
python enrich_galaxies_with_nsa.py --db-path ../../site/public/data/galaxies.db
```

### What It Does

1. Queries NSA catalog (v0.1.2) for each galaxy
2. Cross-matches by RA/Dec (±36 arcseconds)
3. Stores IAUNAME, SUBDIR, PID in database
4. Reports matching statistics

### Output

```
NSA Galaxy Enrichment ETL
Database: ../../site/public/data/galaxies.db

[+] Added nsa_iauname column
[+] Added nsa_subdir column
[+] Added nsa_pid column

Processing 88,432 galaxies...
  1000/88432 processed, 512 matched so far
  ...
==================================================
Results:
  Matched:   45,230
  Unmatched: 43,202
  Total:     88,432
  Success:   51.2%
==================================================
```

### Integration with Image ETL

The enriched database can now be used directly by the image ETL:

```bash
cd src/main/python/nsa
python nsa_image_etl.py --pgc 2557 --output-base ../../site/public/galaxy-img
# Now reads nsa_iauname, nsa_subdir, nsa_pid directly from DB
```

### Performance

- **Stateless**: Can be run multiple times on same database
- **One-time operation**: ~30-60 minutes for 88k galaxies (depending on system)
- **Network-free**: Uses local NSA catalog file (`research/nsa_v0_1_2.fits`)
- **Best effort**: Unmatched galaxies are left with NULL values

### Database Schema

Three new columns are added to the `galaxies` table:

| Column | Type | Description |
|--------|------|-------------|
| `nsa_iauname` | TEXT | IAU name from NSA (e.g., J004244.30+411608.9) or NULL |
| `nsa_subdir` | TEXT | SDSS archive subdirectory path (e.g., 00h/p40/...) or NULL |
| `nsa_pid` | INTEGER | SDSS Photo ID or NULL |

### Testing

Run the test suite:

```bash
cd src/main/python/nsa
python test_enrich.py
```

Expected output:
```
[PASS] test_ensure_nsa_columns
[PASS] test_match_andromeda
[PASS] test_no_match_invalid_coords

[SUCCESS] All tests passed!
```

### Workflow

1. **Step 1**: Generate base database (existing)
   ```bash
   cd src/main/python/combined
   python main.py
   # Creates: ../../site/public/data/galaxies.db
   ```

2. **Step 2**: Enrich with NSA metadata (new)
   ```bash
   cd ../nsa
   python enrich_galaxies_with_nsa.py
   # Updates: galaxies.db with NSA columns
   ```

3. **Step 3**: Generate galaxy images (optional)
   ```bash
   python nsa_image_etl.py --pgc [PGC] --output-base ../../site/public/galaxy-img
   # Uses enriched DB columns to fetch FITS data
   ```

### Troubleshooting

**"Database not found" error**
- Solution: Run `src/main/python/combined/main.py` first to generate base database

**Low match rate (< 30%)**
- Check if galaxy RA/Dec coordinates are accurate
- NSA coverage is limited; not all galaxies will have matches
- Verify coordinates are in degrees (not radians or other units)

**Script is slow**
- This is normal for 88k+ galaxies
- Network requests to NSA catalog are cached locally
- Run in background: `python enrich_galaxies_with_nsa.py &`

---

**Last Updated**: 2025-03-09
**Pipeline Version**: 1.0
**NSA Catalog**: v0.1.2
