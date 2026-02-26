"""Combined ETL pipeline: UGC VOTable + FSS fixed-width -> unified SQLite database."""

import os
import sqlite3

from etl import extract_votable, _convert_value

SPEED_OF_LIGHT = 299792.458  # km/s

COMBINED_COLUMNS = [
    ("id", "INTEGER PRIMARY KEY AUTOINCREMENT"),
    ("catalog", "TEXT NOT NULL"),
    ("name", "TEXT NOT NULL"),
    ("ra_sexagesimal", "TEXT"),
    ("dec_sexagesimal", "TEXT"),
    ("ra", "REAL"),
    ("dec", "REAL"),
    ("redshift", "REAL"),
    ("velocity", "REAL"),
    ("z_flag", "TEXT"),
    ("phys_type", "TEXT"),
    ("em_region", "TEXT"),
    ("references", "INTEGER"),
    ("notes", "INTEGER"),
    ("photometry", "INTEGER"),
    ("positions", "INTEGER"),
    ("redshifts", "INTEGER"),
    ("diameters", "INTEGER"),
    ("distances", "INTEGER"),
    ("classifications", "INTEGER"),
    ("images", "INTEGER"),
    ("spectra", "INTEGER"),
    ("pgc", "INTEGER"),
    ("morphology", "TEXT"),
    ("u_mag", "REAL"),
    ("b_mag", "REAL"),
    ("r_mag", "REAL"),
    ("i_mag", "REAL"),
    ("j_mag", "REAL"),
    ("h_mag", "REAL"),
    ("k_mag", "REAL"),
    ("diameter_arcsec", "INTEGER"),
    ("axial_ratio", "REAL"),
    ("neighbor_count", "INTEGER"),
    ("position_angle", "INTEGER"),
    ("activity_class", "TEXT"),
    ("fss_notes", "TEXT"),
]


def _parse_float(s):
    """Parse a string as float, returning None if blank or invalid."""
    s = s.strip()
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None


def _parse_int(s):
    """Parse a string as int, returning None if blank or invalid."""
    s = s.strip()
    if not s:
        return None
    try:
        return int(s)
    except ValueError:
        return None


def parse_fss(dat_path):
    """Parse FSS fixed-width data file and return list of dicts."""
    rows = []
    with open(dat_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n").ljust(204)

            pgc = _parse_int(line[0:5])
            if pgc is None:
                continue

            rah = _parse_int(line[6:8])
            ram = _parse_int(line[9:11])
            ras = _parse_float(line[12:16])
            de_sign = line[17]
            ded = _parse_int(line[18:20])
            dem = _parse_int(line[21:23])
            des = _parse_int(line[24:26])

            hrv = _parse_int(line[27:32])
            u_mag = _parse_float(line[33:38])
            b_mag = _parse_float(line[39:44])
            r_mag = _parse_float(line[45:50])
            i_mag = _parse_float(line[51:56])
            j_mag = _parse_float(line[57:62])
            h_mag = _parse_float(line[63:68])
            k_mag = _parse_float(line[69:74])

            mtype = line[75:79].strip() or None
            diameter = _parse_int(line[80:83])
            ba_ratio = _parse_float(line[84:88])
            ng = _parse_int(line[89:90])
            pa = _parse_int(line[91:94])
            ac = line[95:128].strip() or None
            notes = line[129:204].strip() or None

            # Convert sexagesimal to decimal degrees
            if rah is not None and ram is not None and ras is not None:
                ra_deg = (rah + ram / 60.0 + ras / 3600.0) * 15.0
                ra_sex = f"{rah:02d}h{ram:02d}m{ras:04.1f}s"
            else:
                ra_deg = None
                ra_sex = None

            sign = -1.0 if de_sign == "-" else 1.0
            if ded is not None and dem is not None and des is not None:
                dec_deg = sign * (ded + dem / 60.0 + des / 3600.0)
                dec_sex = f"{de_sign}{ded:02d}d{dem:02d}m{des:02d}s"
            else:
                dec_deg = None
                dec_sex = None

            velocity = float(hrv) if hrv is not None else None
            redshift = hrv / SPEED_OF_LIGHT if hrv is not None else None

            row = {
                "catalog": "FSS",
                "name": f"PGC {pgc:05d}",
                "ra_sexagesimal": ra_sex,
                "dec_sexagesimal": dec_sex,
                "ra": ra_deg,
                "dec": dec_deg,
                "redshift": redshift,
                "velocity": velocity,
                "pgc": pgc,
                "morphology": mtype,
                "u_mag": u_mag,
                "b_mag": b_mag,
                "r_mag": r_mag,
                "i_mag": i_mag,
                "j_mag": j_mag,
                "h_mag": h_mag,
                "k_mag": k_mag,
                "diameter_arcsec": diameter,
                "axial_ratio": ba_ratio,
                "neighbor_count": ng,
                "position_angle": pa,
                "activity_class": ac,
                "fss_notes": notes,
            }
            rows.append(row)

    return rows


# Mapping from UGC VOTable column names to combined schema column names
_UGC_FIELD_MAP = {
    "prefname": "name",
    "equ_j2000_lon_s": "ra_sexagesimal",
    "equ_j2000_lat_s": "dec_sexagesimal",
    "ra": "ra",
    "dec": "dec",
    "z": "redshift",
    "velocity": "velocity",
    "zflag": "z_flag",
    "ptype": "phys_type",
    "emtype": "em_region",
    "n_crosref": "references",
    "n_notes": "notes",
    "n_gphot": "photometry",
    "n_posd": "positions",
    "n_zdf": "redshifts",
    "n_ddf": "diameters",
    "n_dist": "distances",
    "n_class": "classifications",
    "n_images": "images",
    "n_spectra": "spectra",
}


def prepare_ugc_rows(table):
    """Convert astropy Table to list of dicts matching the combined schema."""
    rows = []
    for row in table:
        d = {"catalog": "UGC"}
        for vot_col, combined_col in _UGC_FIELD_MAP.items():
            d[combined_col] = _convert_value(row[vot_col])
        rows.append(d)
    return rows


def load_combined(ugc_rows, fss_rows, db_path):
    """Load UGC and FSS rows into a unified SQLite database."""
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Create schema (skip 'id' — it's AUTOINCREMENT)
    col_defs = ", ".join(
        f'"{col}" {sql_type}' for col, sql_type in COMBINED_COLUMNS
    )
    cur.execute(f"CREATE TABLE galaxies ({col_defs})")

    # Prepare insert statement (skip 'id')
    insert_cols = [col for col, _ in COMBINED_COLUMNS if col != "id"]
    placeholders = ", ".join("?" for _ in insert_cols)
    col_names = ", ".join(f'"{c}"' for c in insert_cols)
    insert_sql = f"INSERT INTO galaxies ({col_names}) VALUES ({placeholders})"

    def rows_to_tuples(rows):
        return [tuple(row.get(c) for c in insert_cols) for row in rows]

    cur.executemany(insert_sql, rows_to_tuples(ugc_rows))
    cur.executemany(insert_sql, rows_to_tuples(fss_rows))

    # Create indexes
    cur.execute("CREATE INDEX idx_catalog ON galaxies (catalog)")
    cur.execute("CREATE INDEX idx_ra ON galaxies (ra)")
    cur.execute("CREATE INDEX idx_dec ON galaxies (dec)")
    cur.execute("CREATE INDEX idx_redshift ON galaxies (redshift)")
    cur.execute("CREATE INDEX idx_phys_type ON galaxies (phys_type)")
    cur.execute("CREATE INDEX idx_morphology ON galaxies (morphology)")

    # Create FTS5 virtual table
    cur.execute(
        "CREATE VIRTUAL TABLE galaxies_fts USING fts5(name, content=galaxies, content_rowid=id)"
    )
    cur.execute("INSERT INTO galaxies_fts(rowid, name) SELECT id, name FROM galaxies")

    conn.commit()
    conn.close()
    print(f"Combined database written to {db_path}")


if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    research_dir = os.path.join(base_dir, "..", "..", "..", "research")
    fss_path = os.path.join(research_dir, "fss.dat")
    xml_path = os.path.join(research_dir, "1973UGCC0000N.xml")
    db_path = os.path.join(base_dir, "galaxies_combined.db")

    # Parse FSS
    fss_rows = parse_fss(fss_path)
    assert len(fss_rows) == 3838, f"Expected 3838 FSS rows, got {len(fss_rows)}"
    assert fss_rows[0]["name"] == "PGC 00012", f"First name: {fss_rows[0]['name']}"
    assert fss_rows[0]["velocity"] == 6546.0, f"First velocity: {fss_rows[0]['velocity']}"
    print(f"FSS: {len(fss_rows)} rows parsed")

    # Parse UGC
    table = extract_votable(xml_path)
    ugc_rows = prepare_ugc_rows(table)
    assert len(ugc_rows) == 14176, f"Expected 14176 UGC rows, got {len(ugc_rows)}"
    print(f"UGC: {len(ugc_rows)} rows parsed")

    # Load combined
    load_combined(ugc_rows, fss_rows, db_path)

    # Verify
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    total = cur.execute("SELECT COUNT(*) FROM galaxies").fetchone()[0]
    assert total == 18014, f"Expected 18014 total rows, got {total}"

    ugc_count = cur.execute(
        "SELECT COUNT(*) FROM galaxies WHERE catalog = 'UGC'"
    ).fetchone()[0]
    assert ugc_count == 14176, f"Expected 14176 UGC rows, got {ugc_count}"

    fss_count = cur.execute(
        "SELECT COUNT(*) FROM galaxies WHERE catalog = 'FSS'"
    ).fetchone()[0]
    assert fss_count == 3838, f"Expected 3838 FSS rows, got {fss_count}"

    first_ugc = cur.execute(
        "SELECT name FROM galaxies WHERE catalog = 'UGC' ORDER BY id LIMIT 1"
    ).fetchone()[0]
    assert first_ugc == "UGC 00002", f"First UGC name: {first_ugc}"

    first_fss = cur.execute(
        "SELECT name FROM galaxies WHERE catalog = 'FSS' ORDER BY id LIMIT 1"
    ).fetchone()[0]
    assert first_fss == "PGC 00012", f"First FSS name: {first_fss}"

    # FTS search
    ugc_fts = cur.execute(
        "SELECT COUNT(*) FROM galaxies_fts WHERE galaxies_fts MATCH 'UGC'"
    ).fetchone()[0]
    assert ugc_fts > 0, "FTS search for 'UGC' returned no results"

    pgc_fts = cur.execute(
        "SELECT COUNT(*) FROM galaxies_fts WHERE galaxies_fts MATCH 'PGC'"
    ).fetchone()[0]
    assert pgc_fts > 0, "FTS search for 'PGC' returned no results"

    # Verify indexes
    indexes = cur.execute(
        "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='galaxies'"
    ).fetchall()
    index_names = {row[0] for row in indexes}
    for expected in ["idx_catalog", "idx_ra", "idx_dec", "idx_redshift", "idx_phys_type", "idx_morphology"]:
        assert expected in index_names, f"Missing index: {expected}"

    # FSS rows have b_mag populated; UGC rows have pgc as NULL
    fss_bmag = cur.execute(
        "SELECT COUNT(*) FROM galaxies WHERE catalog = 'FSS' AND b_mag IS NOT NULL"
    ).fetchone()[0]
    assert fss_bmag > 0, "No FSS rows have b_mag"

    ugc_pgc = cur.execute(
        "SELECT COUNT(*) FROM galaxies WHERE catalog = 'UGC' AND pgc IS NOT NULL"
    ).fetchone()[0]
    assert ugc_pgc == 0, f"UGC rows should have NULL pgc, but {ugc_pgc} have values"

    conn.close()
    print(f"All assertions passed: {total} total rows ({ugc_count} UGC + {fss_count} FSS)")
