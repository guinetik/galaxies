"""
Cosmicflows-4 ETL pipeline: parses VizieR fixed-width tables into SQLite.

Ingests two tables from Tully+ 2023 (J/ApJ/944/94):
  - table2.dat: 55,877 individual galaxy distances (8 methodologies)
  - table4.dat: 38,053 galaxy group distances & peculiar velocities

The schema mirrors the Cosmicflows data model directly — distance moduli from
each methodology, CMB-frame velocities, and coordinates in equatorial, galactic,
and supergalactic systems. Distance in Mpc and light-years are computed from the
combined distance modulus.

Groups are linked to galaxies via the 1PGC field (dominant galaxy in group).
Table 4 provides the only direct Mpc distances in the dataset, plus peculiar
velocities and supergalactic Cartesian coordinates for 3D mapping.

Source: https://vizier.cds.unistra.fr/viz-bin/VizieR-3?-source=J/ApJ/944/94
Paper: Tully R.B. et al., ApJ 944, 94 (2023)

Author: @guinetik
"""

import math
import os
import sqlite3

MPC_TO_MLY = 3.2616  # 1 Megaparsec = 3.2616 Million light-years


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


def dm_to_mpc(dm):
    """Convert distance modulus (mag) to distance in Megaparsecs."""
    if dm is None:
        return None
    return 10.0 ** ((dm - 25.0) / 5.0)


def dm_to_mly(dm):
    """Convert distance modulus (mag) to distance in Million light-years."""
    mpc = dm_to_mpc(dm)
    if mpc is None:
        return None
    return mpc * MPC_TO_MLY


# ─── Table 2: Individual galaxy distances ─────────────────────────────────────

# Byte positions from ReadMe (1-based → 0-based slicing)
# Format: (start, end, parser)  where line[start:end]

TABLE2_FIELDS = [
    ("pgc",       0,   7,  _parse_int),
    ("group_pgc", 8,  15,  _parse_int),    # 1PGC: dominant galaxy in group
    ("t17",      16,  21,  _parse_int),     # Tempel+ 2017 group ID
    ("vcmb",     22,  27,  _parse_int),     # CMB-frame velocity (km/s)
    ("dm",       28,  34,  _parse_float),   # Combined distance modulus
    ("e_dm",     35,  40,  _parse_float),
    ("dm_snia",  41,  47,  _parse_float),   # SN Ia
    ("e_dm_snia",48,  52,  _parse_float),
    ("dm_tf",    53,  59,  _parse_float),   # Tully-Fisher
    ("e_dm_tf",  60,  64,  _parse_float),
    ("dm_fp",    65,  71,  _parse_float),   # Fundamental Plane
    ("e_dm_fp",  72,  76,  _parse_float),
    ("dm_sbf",   77,  83,  _parse_float),   # Surface Brightness Fluctuations
    ("e_dm_sbf", 84,  89,  _parse_float),
    ("dm_snii",  90,  96,  _parse_float),   # SN II (core collapse)
    ("e_dm_snii",97, 101,  _parse_float),
    ("dm_trgb", 102, 107,  _parse_float),   # Tip of Red Giant Branch
    ("e_dm_trgb",108, 112, _parse_float),
    ("dm_ceph", 113, 119,  _parse_float),   # Cepheids
    ("e_dm_ceph",120, 125, _parse_float),
    ("dm_mas",  126, 131,  _parse_float),   # Geometric masers
    ("e_dm_mas",132, 136,  _parse_float),
    ("ra",      137, 145,  _parse_float),   # RA J2000 (deg)
    ("dec",     146, 154,  _parse_float),   # Dec J2000 (deg)
    ("glon",    155, 163,  _parse_float),   # Galactic longitude
    ("glat",    164, 172,  _parse_float),   # Galactic latitude
    ("sgl",     173, 181,  _parse_float),   # Supergalactic longitude
    ("sgb",     182, 190,  _parse_float),   # Supergalactic latitude
]


def parse_table2(path):
    """Parse table2.dat — individual galaxy distances."""
    rows = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n").ljust(190)
            row = {}
            for name, start, end, parser in TABLE2_FIELDS:
                row[name] = parser(line[start:end])

            # Computed fields
            row["distance_mpc"] = dm_to_mpc(row["dm"])
            row["distance_mly"] = dm_to_mly(row["dm"])

            if row["pgc"] is not None:
                rows.append(row)

    return rows


# ─── Table 4: Group distances & peculiar velocities ──────────────────────────

TABLE4_FIELDS = [
    ("group_pgc",  0,   7, _parse_int),    # 1PGC
    ("dm_zp",      8,  14, _parse_float),  # Weighted-average DM (calibrated)
    ("e_dm_zp",   15,  20, _parse_float),
    ("dist_mpc",  21,  26, _parse_float),  # Luminosity distance (Mpc) — direct!
    ("vh",        27,  32, _parse_int),     # Heliocentric velocity
    ("vls",       33,  38, _parse_int),     # Local Sheet velocity
    ("v3k",       39,  44, _parse_int),     # CMB velocity
    ("fv3k",      45,  50, _parse_int),     # V3K × curvature correction
    ("vpds",      51,  57, _parse_int),     # Peculiar vel (Davis & Scrimgeour)
    ("vpwf",      58,  63, _parse_int),     # Peculiar vel (Watkins & Feldman)
    ("vpec",      64,  69, _parse_int),     # Peculiar vel (ramp eq. 11)
    ("hi",        70,  75, _parse_float),   # Group Hubble parameter
    ("log_hi",    76,  82, _parse_float),
    ("ra",        83,  91, _parse_float),
    ("dec",       92, 100, _parse_float),
    ("glon",     101, 109, _parse_float),
    ("glat",     110, 118, _parse_float),
    ("sgl",      119, 127, _parse_float),
    ("sgb",      128, 136, _parse_float),
    ("sgx",      137, 143, _parse_int),     # Supergalactic Cartesian X
    ("sgy",      144, 150, _parse_int),     # Supergalactic Cartesian Y
    ("sgz",      151, 157, _parse_int),     # Supergalactic Cartesian Z
]


def parse_table4(path):
    """Parse table4.dat — group distances and peculiar velocities."""
    rows = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n").ljust(157)
            row = {}
            for name, start, end, parser in TABLE4_FIELDS:
                row[name] = parser(line[start:end])

            # Computed: distance in Mly from direct Mpc
            if row["dist_mpc"] is not None:
                row["dist_mly"] = row["dist_mpc"] * MPC_TO_MLY
            else:
                row["dist_mly"] = None

            if row["group_pgc"] is not None:
                rows.append(row)

    return rows


# ─── SQLite schema ────────────────────────────────────────────────────────────

GALAXIES_COLUMNS = [
    ("pgc",          "INTEGER PRIMARY KEY"),
    ("group_pgc",    "INTEGER"),
    ("t17",          "INTEGER"),
    ("vcmb",         "INTEGER"),
    ("dm",           "REAL"),
    ("e_dm",         "REAL"),
    ("dm_snia",      "REAL"),
    ("e_dm_snia",    "REAL"),
    ("dm_tf",        "REAL"),
    ("e_dm_tf",      "REAL"),
    ("dm_fp",        "REAL"),
    ("e_dm_fp",      "REAL"),
    ("dm_sbf",       "REAL"),
    ("e_dm_sbf",     "REAL"),
    ("dm_snii",      "REAL"),
    ("e_dm_snii",    "REAL"),
    ("dm_trgb",      "REAL"),
    ("e_dm_trgb",    "REAL"),
    ("dm_ceph",      "REAL"),
    ("e_dm_ceph",    "REAL"),
    ("dm_mas",       "REAL"),
    ("e_dm_mas",     "REAL"),
    ("ra",           "REAL"),
    ("dec",          "REAL"),
    ("glon",         "REAL"),
    ("glat",         "REAL"),
    ("sgl",          "REAL"),
    ("sgb",          "REAL"),
    ("distance_mpc", "REAL"),
    ("distance_mly", "REAL"),
]

GROUPS_COLUMNS = [
    ("group_pgc",  "INTEGER PRIMARY KEY"),
    ("dm_zp",      "REAL"),
    ("e_dm_zp",    "REAL"),
    ("dist_mpc",   "REAL"),
    ("dist_mly",   "REAL"),
    ("vh",         "INTEGER"),
    ("vls",        "INTEGER"),
    ("v3k",        "INTEGER"),
    ("fv3k",       "INTEGER"),
    ("vpds",       "INTEGER"),
    ("vpwf",       "INTEGER"),
    ("vpec",       "INTEGER"),
    ("hi",         "REAL"),
    ("log_hi",     "REAL"),
    ("ra",         "REAL"),
    ("dec",        "REAL"),
    ("glon",       "REAL"),
    ("glat",       "REAL"),
    ("sgl",        "REAL"),
    ("sgb",        "REAL"),
    ("sgx",        "INTEGER"),
    ("sgy",        "INTEGER"),
    ("sgz",        "INTEGER"),
]


# ─── Database creation ────────────────────────────────────────────────────────


def create_database(galaxy_rows, group_rows, db_path):
    """Create a SQLite database from parsed Cosmicflows-4 data."""
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # ── galaxies table ──
    col_defs = ", ".join(f"{col} {typ}" for col, typ in GALAXIES_COLUMNS)
    cur.execute(f"CREATE TABLE galaxies ({col_defs})")

    col_names = [col for col, _ in GALAXIES_COLUMNS]
    placeholders = ", ".join("?" for _ in col_names)
    insert_sql = f"INSERT INTO galaxies ({', '.join(col_names)}) VALUES ({placeholders})"
    cur.executemany(insert_sql, [
        tuple(row.get(c) for c in col_names) for row in galaxy_rows
    ])

    # ── galaxy_groups table ──
    col_defs = ", ".join(f"{col} {typ}" for col, typ in GROUPS_COLUMNS)
    cur.execute(f"CREATE TABLE galaxy_groups ({col_defs})")

    col_names = [col for col, _ in GROUPS_COLUMNS]
    placeholders = ", ".join("?" for _ in col_names)
    insert_sql = f"INSERT INTO galaxy_groups ({', '.join(col_names)}) VALUES ({placeholders})"
    cur.executemany(insert_sql, [
        tuple(row.get(c) for c in col_names) for row in group_rows
    ])

    # ── Indexes ──
    cur.execute("CREATE INDEX idx_galaxies_group ON galaxies (group_pgc)")
    cur.execute("CREATE INDEX idx_galaxies_ra ON galaxies (ra)")
    cur.execute("CREATE INDEX idx_galaxies_dec ON galaxies (dec)")
    cur.execute("CREATE INDEX idx_galaxies_dm ON galaxies (dm)")
    cur.execute("CREATE INDEX idx_galaxies_dist ON galaxies (distance_mpc)")
    cur.execute("CREATE INDEX idx_groups_dist ON galaxy_groups (dist_mpc)")

    conn.commit()
    conn.close()
    print(f"Database written to {db_path}")


# ─── Stats ────────────────────────────────────────────────────────────────────


def print_stats(db_path):
    """Print summary statistics from the Cosmicflows-4 database."""
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    total_gal = cur.execute("SELECT COUNT(*) FROM galaxies").fetchone()[0]
    total_grp = cur.execute("SELECT COUNT(*) FROM galaxy_groups").fetchone()[0]

    print(f"\n{'='*60}")
    print(f"  Cosmicflows-4 Database Summary")
    print(f"{'='*60}")
    print(f"  Galaxies:  {total_gal:,}")
    print(f"  Groups:    {total_grp:,}")

    # Distance range
    r = cur.execute(
        "SELECT MIN(distance_mpc), MAX(distance_mpc), AVG(distance_mpc) "
        "FROM galaxies WHERE distance_mpc IS NOT NULL"
    ).fetchone()
    print(f"\n  --- Distance (individual galaxies) ---")
    print(f"    Range: {r[0]:.1f} – {r[1]:.1f} Mpc")
    print(f"    Range: {r[0]*MPC_TO_MLY:.1f} – {r[1]*MPC_TO_MLY:.1f} Mly")
    print(f"    Mean:  {r[2]:.1f} Mpc ({r[2]*MPC_TO_MLY:.1f} Mly)")

    # Group distance range (direct Mpc from table4)
    r = cur.execute(
        "SELECT MIN(dist_mpc), MAX(dist_mpc), AVG(dist_mpc) "
        "FROM galaxy_groups WHERE dist_mpc IS NOT NULL"
    ).fetchone()
    print(f"\n  --- Distance (groups, direct Mpc) ---")
    print(f"    Range: {r[0]:.1f} – {r[1]:.1f} Mpc")
    print(f"    Range: {r[0]*MPC_TO_MLY:.1f} – {r[1]*MPC_TO_MLY:.1f} Mly")
    print(f"    Mean:  {r[2]:.1f} Mpc ({r[2]*MPC_TO_MLY:.1f} Mly)")

    # Velocity range
    r = cur.execute(
        "SELECT MIN(vcmb), MAX(vcmb), AVG(vcmb) "
        "FROM galaxies WHERE vcmb IS NOT NULL"
    ).fetchone()
    print(f"\n  --- CMB Velocity ---")
    print(f"    Range: {r[0]:,} – {r[1]:,} km/s")
    print(f"    Mean:  {r[2]:,.0f} km/s")

    # Sky coverage
    r = cur.execute(
        "SELECT MIN(dec), MAX(dec) FROM galaxies WHERE dec IS NOT NULL"
    ).fetchone()
    print(f"\n  --- Sky Coverage ---")
    print(f"    Declination: {r[0]:+.1f} to {r[1]:+.1f} deg")

    r = cur.execute(
        "SELECT MIN(ra), MAX(ra) FROM galaxies WHERE ra IS NOT NULL"
    ).fetchone()
    print(f"    Right Ascension: {r[0]:.1f} to {r[1]:.1f} deg")

    # Distance method coverage
    print(f"\n  --- Distance Method Coverage ---")
    methods = [
        ("Tully-Fisher",     "dm_tf"),
        ("Fundamental Plane", "dm_fp"),
        ("SN Ia",            "dm_snia"),
        ("SBF",              "dm_sbf"),
        ("SN II",            "dm_snii"),
        ("TRGB",             "dm_trgb"),
        ("Cepheids",         "dm_ceph"),
        ("Masers",           "dm_mas"),
    ]
    for label, col in methods:
        count = cur.execute(
            f"SELECT COUNT(*) FROM galaxies WHERE {col} IS NOT NULL"
        ).fetchone()[0]
        print(f"    {label:20s} {count:>6,} galaxies")

    # Peculiar velocity coverage (from groups)
    vpec_count = cur.execute(
        "SELECT COUNT(*) FROM galaxy_groups WHERE vpec IS NOT NULL"
    ).fetchone()[0]
    print(f"\n  --- Peculiar Velocities (groups) ---")
    print(f"    {vpec_count:,} groups with Vpec")

    r = cur.execute(
        "SELECT MIN(vpec), MAX(vpec), AVG(vpec) "
        "FROM galaxy_groups WHERE vpec IS NOT NULL"
    ).fetchone()
    if r[0] is not None:
        print(f"    Range: {r[0]:,} – {r[1]:,} km/s")

    print(f"{'='*60}\n")
    conn.close()


# ─── Main ─────────────────────────────────────────────────────────────────────


if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    research_dir = os.path.join(base_dir, "..", "..", "..", "..", "research", "cosmicflows-4")
    db_path = os.path.join(base_dir, "cosmicflows4.db")

    table2_path = os.path.join(research_dir, "table2.dat")
    table4_path = os.path.join(research_dir, "table4.dat")

    # Parse
    print("Parsing table2.dat (individual galaxies)...")
    galaxy_rows = parse_table2(table2_path)
    print(f"  {len(galaxy_rows):,} galaxies parsed")

    print("Parsing table4.dat (group distances & peculiar velocities)...")
    group_rows = parse_table4(table4_path)
    print(f"  {len(group_rows):,} groups parsed")

    # Validate counts
    assert len(galaxy_rows) == 55877, f"Expected 55877 galaxies, got {len(galaxy_rows)}"
    assert len(group_rows) == 38053, f"Expected 38053 groups, got {len(group_rows)}"

    # Spot-check first row of table2 (PGC 2, DM=34.535, Vcmb=4726)
    first = galaxy_rows[0]
    assert first["pgc"] == 2, f"First PGC: {first['pgc']}"
    assert first["dm"] == 34.535, f"First DM: {first['dm']}"
    assert first["vcmb"] == 4726, f"First Vcmb: {first['vcmb']}"

    # Spot-check first row of table4 (1PGC=12, Dist=99.8 Mpc)
    first_grp = group_rows[0]
    assert first_grp["group_pgc"] == 12, f"First group PGC: {first_grp['group_pgc']}"
    assert first_grp["dist_mpc"] == 99.8, f"First Dist: {first_grp['dist_mpc']}"

    # Check computed distances
    expected_mpc = 10.0 ** ((34.535 - 25.0) / 5.0)
    assert abs(first["distance_mpc"] - expected_mpc) < 0.01, \
        f"Distance Mpc mismatch: {first['distance_mpc']} vs {expected_mpc}"

    # Build database
    print("\nCreating database...")
    create_database(galaxy_rows, group_rows, db_path)

    # Verify
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    gal_count = cur.execute("SELECT COUNT(*) FROM galaxies").fetchone()[0]
    grp_count = cur.execute("SELECT COUNT(*) FROM galaxy_groups").fetchone()[0]
    assert gal_count == 55877, f"Expected 55877 galaxy rows, got {gal_count}"
    assert grp_count == 38053, f"Expected 38053 group rows, got {grp_count}"

    # Verify join works: galaxies → groups via group_pgc
    joined = cur.execute(
        "SELECT COUNT(*) FROM galaxies g "
        "JOIN galaxy_groups gg ON g.group_pgc = gg.group_pgc"
    ).fetchone()[0]
    print(f"Galaxies with group data: {joined:,} / {gal_count:,}")

    # Verify no null distances
    null_dm = cur.execute(
        "SELECT COUNT(*) FROM galaxies WHERE dm IS NULL"
    ).fetchone()[0]
    assert null_dm == 0, f"{null_dm} galaxies have NULL distance modulus"

    conn.close()
    print("All assertions passed!")

    # Print summary
    print_stats(db_path)
