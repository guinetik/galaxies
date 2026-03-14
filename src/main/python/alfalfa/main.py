"""
ALFALFA-SDSS ETL pipeline: parses VizieR fixed-width tables into SQLite.

Ingests two tables from Durbala+ 2020 (J/AJ/160/271):
  - table1.dat: 31,501 galaxies — basic optical properties (positions, photometry)
  - table2.dat: 31,501 galaxies — derived properties (stellar mass, SFR, HI mass)

The tables are joined by AGC number into a single 'galaxies' table with 34 columns.
Galaxies without SDSS counterparts (Flag 0/3) have NULL for optical columns.

Source: https://vizier.cds.unistra.fr/viz-bin/VizieR-3?-source=J/AJ/160/271
Paper: Durbala A. et al., AJ 160, 271 (2020)

Author: @guinetik
"""

import gzip
import os
import sqlite3

INT64_MIN = -9223372036854775808  # VizieR sentinel for missing SDSS ObjID


def _open_dat_or_gz(path):
    """Open .dat or .dat.gz; prefer .dat if both exist."""
    if os.path.exists(path):
        return open(path, "r", encoding="utf-8")
    gz_path = path + ".gz"
    if os.path.exists(gz_path):
        return gzip.open(gz_path, "rt", encoding="utf-8")
    raise FileNotFoundError(f"Neither {path} nor {gz_path} found")


# ─── Parsing helpers ──────────────────────────────────────────────────────────


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


def _parse_objid(s):
    """Parse SDSS ObjID, mapping VizieR INT64_MIN sentinel to None."""
    val = _parse_int(s)
    if val is None or val == INT64_MIN:
        return None
    return val


# ─── Table 1: Basic optical properties ───────────────────────────────────────

# Byte positions from ReadMe (1-based inclusive) → Python: line[M-1:N]
# Format: (name, start, end, parser)

TABLE1_FIELDS = [
    ("agc",      0,   6, _parse_int),      # AGC catalog ID
    ("flag",     7,   8, _parse_int),      # Photometry flag (0-3)
    ("sdss_objid", 9, 29, _parse_objid),   # SDSS DR15 Object ID
    ("ra",      30,  40, _parse_float),    # RA J2000 (deg)
    ("dec",     41,  49, _parse_float),    # Dec J2000 (deg)
    ("v_hi",    50,  55, _parse_int),      # HI heliocentric velocity (km/s)
    ("dist",    56,  61, _parse_float),    # Distance (Mpc)
    ("e_dist",  62,  66, _parse_float),    # Distance uncertainty (Mpc)
    ("g_ext",   67,  71, _parse_float),    # g-band Galactic extinction (mag)
    ("i_ext",   72,  76, _parse_float),    # i-band Galactic extinction (mag)
    ("ba",      77,  81, _parse_float),    # Axial ratio b/a
    ("e_ba",    82,  88, _parse_float),    # Axial ratio uncertainty
    ("i_mag",   89,  94, _parse_float),    # SDSS i-band cmodel magnitude
    ("e_i_mag", 95, 103, _parse_float),    # i-band magnitude uncertainty
]


def parse_table1(path):
    """Parse table1.dat — basic optical properties of ALFALFA-SDSS galaxies."""
    rows = []
    with _open_dat_or_gz(path) as f:
        for line in f:
            line = line.rstrip("\n").ljust(103)  # Pad short lines (Flag=0/3)
            row = {}
            for name, start, end, parser in TABLE1_FIELDS:
                row[name] = parser(line[start:end])
            if row["agc"] is not None:
                rows.append(row)
    return rows


# ─── Table 2: Derived properties ─────────────────────────────────────────────

TABLE2_FIELDS = [
    ("agc",           0,   6, _parse_int),    # AGC catalog ID
    ("ag",            7,  11, _parse_float),  # g-band internal extinction
    ("ai",           12,  16, _parse_float),  # i-band internal extinction
    ("i_mag_abs",    17,  23, _parse_float),  # Corrected absolute i-band mag
    ("e_i_mag_abs",  24,  29, _parse_float),  # Absolute i-mag uncertainty
    ("g_i",          30,  35, _parse_float),  # Corrected g-i color
    ("e_g_i",        36,  42, _parse_float),  # g-i color uncertainty
    ("log_ms_t",     43,  48, _parse_float),  # log stellar mass (Taylor)
    ("e_log_ms_t",   49,  55, _parse_float),  # Taylor stellar mass uncertainty
    ("log_ms_m",     56,  61, _parse_float),  # log stellar mass (McGaugh)
    ("e_log_ms_m",   62,  66, _parse_float),  # McGaugh stellar mass uncertainty
    ("log_ms_g",     67,  72, _parse_float),  # log stellar mass (GSWLC-2)
    ("e_log_ms_g",   73,  77, _parse_float),  # GSWLC-2 stellar mass uncertainty
    ("log_sfr_22",   78,  83, _parse_float),  # log SFR from 22μm unWISE
    ("e_log_sfr_22", 84,  88, _parse_float),  # SFR 22μm uncertainty
    ("log_sfr_nuv",  89,  94, _parse_float),  # log SFR from GALEX NUV
    ("e_log_sfr_nuv",95, 100, _parse_float),  # SFR NUV uncertainty
    ("log_sfr_g",   101, 106, _parse_float),  # log SFR from GSWLC-2
    ("e_log_sfr_g", 107, 111, _parse_float),  # SFR GSWLC-2 uncertainty
    ("log_mhi",     112, 117, _parse_float),  # log HI mass (solar masses)
    ("e_log_mhi",   118, 122, _parse_float),  # HI mass uncertainty
]


def parse_table2(path):
    """Parse table2.dat — derived properties of ALFALFA-SDSS galaxies."""
    rows = []
    with _open_dat_or_gz(path) as f:
        for line in f:
            line = line.rstrip("\n").ljust(122)
            row = {}
            for name, start, end, parser in TABLE2_FIELDS:
                row[name] = parser(line[start:end])
            if row["agc"] is not None:
                rows.append(row)
    return rows


# ─── Join tables ──────────────────────────────────────────────────────────────


def join_tables(table1_rows, table2_rows):
    """Join table1 and table2 by AGC number into unified dicts."""
    t2_by_agc = {row["agc"]: row for row in table2_rows}
    joined = []
    for t1 in table1_rows:
        agc = t1["agc"]
        merged = dict(t1)  # Start with table1 fields
        t2 = t2_by_agc.get(agc)
        if t2:
            # Add table2 fields (skip 'agc' to avoid overwrite)
            for key, val in t2.items():
                if key != "agc":
                    merged[key] = val
        joined.append(merged)
    return joined


# ─── SQLite schema ────────────────────────────────────────────────────────────

GALAXIES_COLUMNS = [
    # From table1: basic optical properties
    ("agc",          "INTEGER PRIMARY KEY"),
    ("flag",         "INTEGER"),
    ("sdss_objid",   "INTEGER"),
    ("ra",           "REAL"),
    ("dec",          "REAL"),
    ("v_hi",         "INTEGER"),
    ("dist",         "REAL"),
    ("e_dist",       "REAL"),
    ("g_ext",        "REAL"),
    ("i_ext",        "REAL"),
    ("ba",           "REAL"),
    ("e_ba",         "REAL"),
    ("i_mag",        "REAL"),
    ("e_i_mag",      "REAL"),
    # From table2: derived properties
    ("ag",           "REAL"),
    ("ai",           "REAL"),
    ("i_mag_abs",    "REAL"),
    ("e_i_mag_abs",  "REAL"),
    ("g_i",          "REAL"),
    ("e_g_i",        "REAL"),
    ("log_ms_t",     "REAL"),
    ("e_log_ms_t",   "REAL"),
    ("log_ms_m",     "REAL"),
    ("e_log_ms_m",   "REAL"),
    ("log_ms_g",     "REAL"),
    ("e_log_ms_g",   "REAL"),
    ("log_sfr_22",   "REAL"),
    ("e_log_sfr_22", "REAL"),
    ("log_sfr_nuv",  "REAL"),
    ("e_log_sfr_nuv","REAL"),
    ("log_sfr_g",    "REAL"),
    ("e_log_sfr_g",  "REAL"),
    ("log_mhi",      "REAL"),
    ("e_log_mhi",    "REAL"),
]


# ─── Database creation ────────────────────────────────────────────────────────


def create_database(rows, db_path):
    """Create a SQLite database from joined ALFALFA-SDSS data."""
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Create table
    col_defs = ", ".join(f"{col} {typ}" for col, typ in GALAXIES_COLUMNS)
    cur.execute(f"CREATE TABLE galaxies ({col_defs})")

    # Insert rows
    col_names = [col for col, _ in GALAXIES_COLUMNS]
    placeholders = ", ".join("?" for _ in col_names)
    insert_sql = f"INSERT INTO galaxies ({', '.join(col_names)}) VALUES ({placeholders})"
    cur.executemany(insert_sql, [
        tuple(row.get(c) for c in col_names) for row in rows
    ])

    # Indexes
    cur.execute("CREATE INDEX idx_galaxies_ra ON galaxies (ra)")
    cur.execute("CREATE INDEX idx_galaxies_dec ON galaxies (dec)")
    cur.execute("CREATE INDEX idx_galaxies_v_hi ON galaxies (v_hi)")
    cur.execute("CREATE INDEX idx_galaxies_dist ON galaxies (dist)")
    cur.execute("CREATE INDEX idx_galaxies_flag ON galaxies (flag)")

    conn.commit()
    conn.close()
    print(f"Database written to {db_path}")


# ─── Stats ────────────────────────────────────────────────────────────────────


def print_stats(db_path):
    """Print summary statistics from the ALFALFA-SDSS database."""
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    total = cur.execute("SELECT COUNT(*) FROM galaxies").fetchone()[0]

    print(f"\n{'='*60}")
    print(f"  ALFALFA-SDSS Database Summary")
    print(f"{'='*60}")
    print(f"  Total galaxies: {total:,}")

    # Flag breakdown
    print(f"\n  --- Flag Breakdown ---")
    flag_labels = {
        0: "Outside SDSS footprint",
        1: "Good SDSS photometry",
        2: "Bad SDSS photometry",
        3: "No SDSS counterpart",
    }
    for flag_val, label in flag_labels.items():
        count = cur.execute(
            "SELECT COUNT(*) FROM galaxies WHERE flag = ?", (flag_val,)
        ).fetchone()[0]
        print(f"    Flag {flag_val}: {count:>6,}  {label}")

    # Distance range
    r = cur.execute(
        "SELECT MIN(dist), MAX(dist), AVG(dist) "
        "FROM galaxies WHERE dist IS NOT NULL"
    ).fetchone()
    print(f"\n  --- Distance ---")
    print(f"    Range: {r[0]:.1f} – {r[1]:.1f} Mpc")
    print(f"    Mean:  {r[2]:.1f} Mpc")

    # Velocity range
    r = cur.execute(
        "SELECT MIN(v_hi), MAX(v_hi), AVG(v_hi) "
        "FROM galaxies WHERE v_hi IS NOT NULL"
    ).fetchone()
    print(f"\n  --- HI Velocity ---")
    print(f"    Range: {r[0]:,} – {r[1]:,} km/s")
    print(f"    Mean:  {r[2]:,.0f} km/s")

    # Sky coverage
    r = cur.execute(
        "SELECT MIN(dec), MAX(dec) FROM galaxies WHERE dec IS NOT NULL"
    ).fetchone()
    print(f"\n  --- Sky Coverage ---")
    print(f"    Declination: {r[0]:+.2f} to {r[1]:+.2f} deg")

    r = cur.execute(
        "SELECT MIN(ra), MAX(ra) FROM galaxies WHERE ra IS NOT NULL"
    ).fetchone()
    print(f"    Right Ascension: {r[0]:.2f} to {r[1]:.2f} deg")

    # Column coverage
    print(f"\n  --- Column Coverage ---")
    col_names = [col for col, _ in GALAXIES_COLUMNS if col != "agc"]
    for col in col_names:
        count = cur.execute(
            f"SELECT COUNT(*) FROM galaxies WHERE {col} IS NOT NULL"
        ).fetchone()[0]
        pct = 100.0 * count / total
        print(f"    {col:20s} {count:>6,} ({pct:5.1f}%)")

    print(f"{'='*60}\n")
    conn.close()


# ─── Main ─────────────────────────────────────────────────────────────────────


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    research_dir = os.path.join(base_dir, "..", "..", "..", "..", "research", "alfalfa")
    db_path = os.path.join(base_dir, "alfalfa.db")

    table1_path = os.path.join(research_dir, "table1.dat")
    table2_path = os.path.join(research_dir, "table2.dat")

    # Parse
    print("Parsing table1.dat (basic optical properties)...")
    table1_rows = parse_table1(table1_path)
    print(f"  {len(table1_rows):,} rows parsed")

    print("Parsing table2.dat (derived properties)...")
    table2_rows = parse_table2(table2_path)
    print(f"  {len(table2_rows):,} rows parsed")

    # Validate counts
    assert len(table1_rows) == 31501, f"Expected 31501 table1 rows, got {len(table1_rows)}"
    assert len(table2_rows) == 31501, f"Expected 31501 table2 rows, got {len(table2_rows)}"

    # Spot-check first row of table1 (AGC=1, Flag=1, Dist=82.8)
    first = table1_rows[0]
    assert first["agc"] == 1, f"First AGC: {first['agc']}"
    assert first["flag"] == 1, f"First Flag: {first['flag']}"
    assert first["dist"] == 82.8, f"First Dist: {first['dist']}"
    assert first["v_hi"] == 5839, f"First v_hi: {first['v_hi']}"
    assert first["sdss_objid"] == 1237679455462228052, \
        f"First ObjID: {first['sdss_objid']}"

    # Spot-check first row of table2 (AGC=1, logMHI=9.67)
    first_t2 = table2_rows[0]
    assert first_t2["agc"] == 1, f"First t2 AGC: {first_t2['agc']}"
    assert first_t2["log_mhi"] == 9.67, f"First logMHI: {first_t2['log_mhi']}"

    # Spot-check a Flag=0 row — should have NULL ObjID and optical columns
    flag0 = [r for r in table1_rows if r["flag"] == 0][0]
    assert flag0["sdss_objid"] is None, f"Flag=0 ObjID should be None: {flag0['sdss_objid']}"
    assert flag0["g_ext"] is None, f"Flag=0 g_ext should be None: {flag0['g_ext']}"

    # Join tables
    print("\nJoining tables by AGC number...")
    joined = join_tables(table1_rows, table2_rows)
    assert len(joined) == 31501, f"Expected 31501 joined rows, got {len(joined)}"

    # Verify join: first row should have both table1 and table2 fields
    assert joined[0]["dist"] == 82.8, "Join lost table1 dist"
    assert joined[0]["log_mhi"] == 9.67, "Join lost table2 log_mhi"

    # Build database
    print("Creating database...")
    create_database(joined, db_path)

    # Verify
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    row_count = cur.execute("SELECT COUNT(*) FROM galaxies").fetchone()[0]
    assert row_count == 31501, f"Expected 31501 rows, got {row_count}"

    # Verify a specific row
    row = cur.execute(
        "SELECT dist, log_mhi, flag FROM galaxies WHERE agc = 1"
    ).fetchone()
    assert row == (82.8, 9.67, 1), f"AGC=1 row mismatch: {row}"

    # Verify Flag=0 row has NULL optical columns
    row = cur.execute(
        "SELECT sdss_objid, g_ext, i_mag FROM galaxies WHERE flag = 0 LIMIT 1"
    ).fetchone()
    assert row[0] is None, f"Flag=0 ObjID should be NULL: {row[0]}"
    assert row[1] is None, f"Flag=0 g_ext should be NULL: {row[1]}"

    conn.close()
    print("All assertions passed!")

    # Print summary
    print_stats(db_path)
