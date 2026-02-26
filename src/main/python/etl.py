"""ETL pipeline: UGC VOTable XML -> SQLite database."""

from astropy.io.votable import parse
import numpy as np
import os
import sqlite3


def extract_votable(xml_path: str):
    """Parse a VOTable XML file and return the first table as an astropy Table."""
    votable = parse(xml_path)
    table = votable.get_first_table().to_table()
    return table


COLUMN_MAP = [
    ("row", "id", "INTEGER PRIMARY KEY"),
    ("prefname", "name", "TEXT NOT NULL"),
    ("equ_j2000_lon_s", "ra_sexagesimal", "TEXT"),
    ("equ_j2000_lat_s", "dec_sexagesimal", "TEXT"),
    ("ra", "ra", "REAL"),
    ("dec", "dec", "REAL"),
    ("z", "redshift", "REAL"),
    ("velocity", "velocity", "REAL"),
    ("zflag", "z_flag", "TEXT"),
    ("ptype", "phys_type", "TEXT"),
    ("emtype", "em_region", "TEXT"),
    ("n_crosref", "references", "INTEGER"),
    ("n_notes", "notes", "INTEGER"),
    ("n_gphot", "photometry", "INTEGER"),
    ("n_posd", "positions", "INTEGER"),
    ("n_zdf", "redshifts", "INTEGER"),
    ("n_ddf", "diameters", "INTEGER"),
    ("n_dist", "distances", "INTEGER"),
    ("n_class", "classifications", "INTEGER"),
    ("n_images", "images", "INTEGER"),
    ("n_spectra", "spectra", "INTEGER"),
]


def _convert_value(val):
    """Convert astropy/numpy values to Python-native types for sqlite3."""
    if val is None or val is np.ma.masked:
        return None
    if isinstance(val, (np.integer,)):
        return int(val)
    if isinstance(val, (np.floating,)):
        v = float(val)
        return None if np.isnan(v) else v
    if isinstance(val, (bytes,)):
        return val.decode("utf-8").strip() or None
    if isinstance(val, (str,)):
        return val.strip() or None
    return val


def load_to_sqlite(table, db_path: str):
    """Transform astropy Table and load into SQLite database."""
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Create schema
    col_defs = ", ".join(f'"{sql_col}" {sql_type}' for _, sql_col, sql_type in COLUMN_MAP)
    cur.execute(f"CREATE TABLE galaxies ({col_defs})")

    # Insert rows
    placeholders = ", ".join("?" for _ in COLUMN_MAP)
    sql_cols = ", ".join(f'"{sql_col}"' for _, sql_col, _ in COLUMN_MAP)
    votable_cols = [vot_col for vot_col, _, _ in COLUMN_MAP]

    rows = []
    for row in table:
        values = tuple(_convert_value(row[col]) for col in votable_cols)
        rows.append(values)
    cur.executemany(f"INSERT INTO galaxies ({sql_cols}) VALUES ({placeholders})", rows)

    # Create indexes
    cur.execute("CREATE INDEX idx_ra ON galaxies (ra)")
    cur.execute("CREATE INDEX idx_dec ON galaxies (dec)")
    cur.execute("CREATE INDEX idx_redshift ON galaxies (redshift)")
    cur.execute("CREATE INDEX idx_phys_type ON galaxies (phys_type)")

    # Create FTS5 virtual table
    cur.execute("CREATE VIRTUAL TABLE galaxies_fts USING fts5(name, content=galaxies, content_rowid=id)")
    cur.execute("INSERT INTO galaxies_fts(rowid, name) SELECT id, name FROM galaxies")

    conn.commit()
    conn.close()
    print(f"Database written to {db_path}")


if __name__ == "__main__":
    xml_path = os.path.join(
        os.path.dirname(__file__), "..", "..", "..", "research", "1973UGCC0000N.xml"
    )
    db_path = os.path.join(os.path.dirname(__file__), "galaxies.db")

    # Extract
    table = extract_votable(xml_path)
    print(f"Loaded {len(table)} rows, {len(table.columns)} columns")
    print(f"Columns: {table.colnames}")
    assert len(table) == 14176, f"Expected 14176 rows, got {len(table)}"
    assert len(table.columns) == 21, f"Expected 21 columns, got {len(table.columns)}"
    print("Extract phase: OK")

    # Transform + Load
    load_to_sqlite(table, db_path)

    # Verify
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    row_count = cur.execute("SELECT COUNT(*) FROM galaxies").fetchone()[0]
    assert row_count == 14176, f"Expected 14176 rows in DB, got {row_count}"

    first_name = cur.execute("SELECT name FROM galaxies WHERE id = 1").fetchone()[0]
    assert first_name == "UGC 00002", f"Expected 'UGC 00002', got '{first_name}'"

    fts_results = cur.execute(
        "SELECT COUNT(*) FROM galaxies_fts WHERE galaxies_fts MATCH 'UGC 00002'"
    ).fetchone()[0]
    assert fts_results >= 1, f"FTS search for 'UGC 00002' returned {fts_results} results"

    indexes = cur.execute(
        "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='galaxies'"
    ).fetchall()
    index_names = {row[0] for row in indexes}
    for expected in ["idx_ra", "idx_dec", "idx_redshift", "idx_phys_type"]:
        assert expected in index_names, f"Missing index: {expected}"

    conn.close()
    print(f"Load phase: OK ({row_count} rows, FTS working, indexes verified)")
