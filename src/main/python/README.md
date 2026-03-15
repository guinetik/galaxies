# Python ETL Pipeline

Builds `galaxies.db` from four astronomical catalogs: Cosmicflows-4, ALFALFA, FSS, and UGC.

## Quick Start

```bash
pip install -r requirements.txt
python build.py
```

With deploy to site:

```bash
python build.py --deploy
```

## Layout

| Directory      | Purpose                          | Output                    |
|----------------|----------------------------------|---------------------------|
| `cosmicflows/` | Cosmicflows-4 distance catalog   | `cosmicflows4.db`         |
| `alfalfa/`     | ALFALFA-SDSS HI catalog          | `alfalfa.db`              |
| `fss/`         | FSS + UGC combined               | `galaxies_combined.db`     |
| `combined/`    | Merge all → unified schema       | `galaxies.db`             |
| `nsa/`         | NSA image enrichment (optional)  | Updates `galaxies.db`     |

**Scripts:** `optimize_images.py` — converts images in `site/public/` to WebP (runs before build). See [docs/optimize-images.md](../../../docs/optimize-images.md).

## Data Sources

Source files live under `research/` at the project root. See [docs/python-etl-rebuild-guide.md](../../../docs/python-etl-rebuild-guide.md) for:

- Required file paths
- VizieR download links
- Decompression steps (e.g. ALFALFA `.dat.gz`)
- Troubleshooting
