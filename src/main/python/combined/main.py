"""
Combined Galaxy Database: merges CF4 + ALFALFA + FSS/UGC into a unified galaxies.db.

8-stage pipeline:
  1. Load all 3 source databases
  2. FSS direct PGC join (enrich CF4 with morphology, b_mag, name)
  3. Build spatial index for RA/Dec cross-matching
  4. ALFALFA spatial cross-match (30 arcsec radius)
  5. UGC spatial cross-match (30 arcsec radius)
  6. Add unmatched galaxies as new rows
  7. Create unified database
  8. Verify & print stats

Source databases:
  - cosmicflows4.db  (55,877 galaxies + 38,053 groups)
  - alfalfa.db       (31,501 HI-selected galaxies)
  - galaxies_combined.db (3,838 FSS + 14,176 UGC galaxies)

Output: galaxies.db (~88k-98k galaxies + 38,053 groups)

Author: @guinetik
"""

import math
import os
import sqlite3

MPC_TO_MLY = 3.2616  # 1 Megaparsec = 3.2616 Million light-years
MATCH_RADIUS_ARCSEC = 30.0  # Cross-match radius
MATCH_RADIUS_DEG = MATCH_RADIUS_ARCSEC / 3600.0
H0 = 75.0  # Hubble constant for distance estimation (km/s/Mpc)


# ─── Helpers ─────────────────────────────────────────────────────────────────


def angular_separation(ra1, dec1, ra2, dec2):
    """Vincenty formula for angular separation (degrees). Accurate at all scales."""
    ra1, dec1, ra2, dec2 = map(math.radians, (ra1, dec1, ra2, dec2))
    dra = ra2 - ra1
    sin_dra = math.sin(dra)
    cos_dra = math.cos(dra)
    sin_dec1 = math.sin(dec1)
    cos_dec1 = math.cos(dec1)
    sin_dec2 = math.sin(dec2)
    cos_dec2 = math.cos(dec2)

    num1 = cos_dec2 * sin_dra
    num2 = cos_dec1 * sin_dec2 - sin_dec1 * cos_dec2 * cos_dra
    denom = sin_dec1 * sin_dec2 + cos_dec1 * cos_dec2 * cos_dra

    return math.degrees(math.atan2(math.sqrt(num1**2 + num2**2), denom))


def grid_key(ra, dec):
    """Grid cell key for spatial indexing (1-degree cells)."""
    return (int(math.floor(ra)), int(math.floor(dec)))


def neighbor_cells(ra, dec):
    """Return 3x3 grid cells around a point, handling RA wrapping at 0/360."""
    cra, cdec = int(math.floor(ra)), int(math.floor(dec))
    cells = []
    for dra in (-1, 0, 1):
        for ddec in (-1, 0, 1):
            r = (cra + dra) % 360
            d = cdec + ddec
            if -90 <= d <= 90:
                cells.append((r, d))
    return cells


# ─── Stage 1: Load source databases ─────────────────────────────────────────


def load_cf4(db_path):
    """Load CF4 galaxies and groups from cosmicflows4.db."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    galaxies = {}
    for row in cur.execute("SELECT * FROM galaxies"):
        d = dict(row)
        d["source"] = "CF4"
        d["name"] = None
        d["agc"] = None
        d["v_hi"] = None
        d["log_mhi"] = None
        d["e_log_mhi"] = None
        d["log_ms_t"] = None
        d["e_log_ms_t"] = None
        d["log_sfr_nuv"] = None
        d["e_log_sfr_nuv"] = None
        d["morphology"] = None
        d["b_mag"] = None
        d["diameter_arcsec"] = None
        d["axial_ratio"] = None
        d["position_angle"] = None
        d["ba"] = None
        galaxies[d["pgc"]] = d

    groups = []
    for row in cur.execute("SELECT * FROM galaxy_groups"):
        groups.append(dict(row))

    conn.close()
    return galaxies, groups


def load_alfalfa(db_path):
    """Load ALFALFA galaxies from alfalfa.db."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    rows = []
    for row in cur.execute("SELECT agc, ra, dec, v_hi, dist, log_mhi, e_log_mhi, "
                           "log_ms_t, e_log_ms_t, log_sfr_nuv, e_log_sfr_nuv, ba "
                           "FROM galaxies"):
        rows.append(dict(row))

    conn.close()
    return rows


def load_fss_ugc(db_path):
    """Load FSS and UGC galaxies from galaxies_combined.db."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    fss_rows = []
    for row in cur.execute("SELECT id, name, ra, dec, velocity, pgc, morphology, b_mag, "
                           "diameter_arcsec, axial_ratio, position_angle "
                           "FROM galaxies WHERE catalog = 'FSS'"):
        fss_rows.append(dict(row))

    ugc_rows = []
    for row in cur.execute("SELECT id, name, ra, dec, velocity "
                           "FROM galaxies WHERE catalog = 'UGC'"):
        ugc_rows.append(dict(row))

    conn.close()
    return fss_rows, ugc_rows


# ─── Stage 2: FSS direct PGC join ───────────────────────────────────────────


def fss_pgc_join(cf4, fss_rows):
    """Enrich CF4 galaxies with FSS data via direct PGC match."""
    matched = 0
    unmatched = []
    for fss in fss_rows:
        pgc = fss["pgc"]
        if pgc is not None and pgc in cf4:
            cf4[pgc]["morphology"] = fss["morphology"]
            cf4[pgc]["b_mag"] = fss["b_mag"]
            cf4[pgc]["diameter_arcsec"] = fss["diameter_arcsec"]
            cf4[pgc]["axial_ratio"] = fss["axial_ratio"]
            cf4[pgc]["position_angle"] = fss["position_angle"]
            if cf4[pgc]["name"] is None:
                cf4[pgc]["name"] = fss["name"]
            matched += 1
        else:
            unmatched.append(fss)
    return matched, unmatched


# ─── Stage 3: Build spatial index ────────────────────────────────────────────


def build_spatial_index(cf4):
    """Build grid-based spatial index over CF4 galaxies."""
    index = {}
    for pgc, gal in cf4.items():
        ra, dec = gal.get("ra"), gal.get("dec")
        if ra is None or dec is None:
            continue
        key = grid_key(ra, dec)
        if key not in index:
            index[key] = []
        index[key].append(pgc)
    return index


def find_nearest(ra, dec, cf4, spatial_idx, radius_deg):
    """Find nearest CF4 galaxy within radius_deg of (ra, dec)."""
    best_pgc = None
    best_sep = radius_deg
    for cell in neighbor_cells(ra, dec):
        for pgc in spatial_idx.get(cell, []):
            gal = cf4[pgc]
            sep = angular_separation(ra, dec, gal["ra"], gal["dec"])
            if sep < best_sep:
                best_sep = sep
                best_pgc = pgc
    return best_pgc


# ─── Stage 4: ALFALFA spatial cross-match ────────────────────────────────────


def alfalfa_crossmatch(cf4, alfalfa_rows, spatial_idx):
    """Cross-match ALFALFA galaxies to CF4 by position (30 arcsec)."""
    matched = 0
    unmatched = []
    for alf in alfalfa_rows:
        ra, dec = alf.get("ra"), alf.get("dec")
        if ra is None or dec is None:
            unmatched.append(alf)
            continue

        pgc = find_nearest(ra, dec, cf4, spatial_idx, MATCH_RADIUS_DEG)
        if pgc is not None:
            cf4[pgc]["agc"] = alf["agc"]
            cf4[pgc]["v_hi"] = alf["v_hi"]
            cf4[pgc]["log_mhi"] = alf["log_mhi"]
            cf4[pgc]["e_log_mhi"] = alf["e_log_mhi"]
            cf4[pgc]["log_ms_t"] = alf["log_ms_t"]
            cf4[pgc]["e_log_ms_t"] = alf["e_log_ms_t"]
            cf4[pgc]["log_sfr_nuv"] = alf["log_sfr_nuv"]
            cf4[pgc]["e_log_sfr_nuv"] = alf["e_log_sfr_nuv"]
            cf4[pgc]["ba"] = alf["ba"]
            matched += 1
        else:
            unmatched.append(alf)

    return matched, unmatched


# ─── Stage 5: UGC spatial cross-match ───────────────────────────────────────


def ugc_crossmatch(cf4, ugc_rows, spatial_idx):
    """Cross-match UGC galaxies to CF4 by position (30 arcsec)."""
    matched = 0
    unmatched = []
    for ugc in ugc_rows:
        ra, dec = ugc.get("ra"), ugc.get("dec")
        if ra is None or dec is None:
            unmatched.append(ugc)
            continue

        pgc = find_nearest(ra, dec, cf4, spatial_idx, MATCH_RADIUS_DEG)
        if pgc is not None:
            if cf4[pgc]["name"] is None:
                cf4[pgc]["name"] = ugc["name"]
            matched += 1
        else:
            unmatched.append(ugc)

    return matched, unmatched


# ─── Stage 6: Add unmatched galaxies ────────────────────────────────────────


def make_empty_galaxy():
    """Return a galaxy dict with all columns set to None."""
    return {
        "pgc": None, "group_pgc": None, "t17": None, "vcmb": None,
        "dm": None, "e_dm": None,
        "dm_snia": None, "e_dm_snia": None,
        "dm_tf": None, "e_dm_tf": None,
        "dm_fp": None, "e_dm_fp": None,
        "dm_sbf": None, "e_dm_sbf": None,
        "dm_snii": None, "e_dm_snii": None,
        "dm_trgb": None, "e_dm_trgb": None,
        "dm_ceph": None, "e_dm_ceph": None,
        "dm_mas": None, "e_dm_mas": None,
        "ra": None, "dec": None,
        "glon": None, "glat": None,
        "sgl": None, "sgb": None,
        "distance_mpc": None, "distance_mly": None,
        "source": None, "name": None,
        "agc": None, "v_hi": None,
        "log_mhi": None, "e_log_mhi": None,
        "log_ms_t": None, "e_log_ms_t": None,
        "log_sfr_nuv": None, "e_log_sfr_nuv": None,
        "morphology": None, "b_mag": None,
        "diameter_arcsec": None, "axial_ratio": None, "position_angle": None, "ba": None,
    }


def add_unmatched_alfalfa(cf4, unmatched):
    """Add unmatched ALFALFA galaxies with synthetic PGC = 10_000_000 + agc."""
    added = 0
    skipped = 0
    for alf in unmatched:
        agc = alf.get("agc")
        dist = alf.get("dist")
        ra = alf.get("ra")
        dec = alf.get("dec")
        v_hi = alf.get("v_hi")

        if agc is None or ra is None or dec is None:
            skipped += 1
            continue
        if dist is None or dist <= 0:
            skipped += 1
            continue
        if v_hi is not None and v_hi <= 0:
            skipped += 1
            continue

        pgc = 10_000_000 + agc
        if pgc in cf4:
            skipped += 1
            continue

        dm = 5.0 * math.log10(dist) + 25.0

        gal = make_empty_galaxy()
        gal["pgc"] = pgc
        gal["ra"] = ra
        gal["dec"] = dec
        gal["dm"] = round(dm, 3)
        gal["distance_mpc"] = dist
        gal["distance_mly"] = round(dist * MPC_TO_MLY, 3)
        gal["vcmb"] = v_hi
        gal["source"] = "ALFALFA"
        gal["agc"] = agc
        gal["v_hi"] = v_hi
        gal["log_mhi"] = alf.get("log_mhi")
        gal["e_log_mhi"] = alf.get("e_log_mhi")
        gal["log_ms_t"] = alf.get("log_ms_t")
        gal["e_log_ms_t"] = alf.get("e_log_ms_t")
        gal["log_sfr_nuv"] = alf.get("log_sfr_nuv")
        gal["e_log_sfr_nuv"] = alf.get("e_log_sfr_nuv")
        gal["ba"] = alf.get("ba")
        cf4[pgc] = gal
        added += 1

    return added, skipped


def add_unmatched_fss(cf4, unmatched):
    """Add unmatched FSS galaxies using their real PGC numbers."""
    added = 0
    skipped = 0
    for fss in unmatched:
        pgc = fss.get("pgc")
        velocity = fss.get("velocity")
        ra = fss.get("ra")
        dec = fss.get("dec")

        if pgc is None or ra is None or dec is None:
            skipped += 1
            continue
        if velocity is None or velocity <= 0:
            skipped += 1
            continue
        if pgc in cf4:
            skipped += 1
            continue

        dist = velocity / H0
        dm = 5.0 * math.log10(dist) + 25.0

        gal = make_empty_galaxy()
        gal["pgc"] = pgc
        gal["ra"] = ra
        gal["dec"] = dec
        gal["dm"] = round(dm, 3)
        gal["distance_mpc"] = round(dist, 3)
        gal["distance_mly"] = round(dist * MPC_TO_MLY, 3)
        gal["vcmb"] = int(velocity)
        gal["source"] = "FSS"
        gal["name"] = fss.get("name")
        gal["morphology"] = fss.get("morphology")
        gal["b_mag"] = fss.get("b_mag")
        gal["diameter_arcsec"] = fss.get("diameter_arcsec")
        gal["axial_ratio"] = fss.get("axial_ratio")
        gal["position_angle"] = fss.get("position_angle")
        cf4[pgc] = gal
        added += 1

    return added, skipped


def add_unmatched_ugc(cf4, unmatched):
    """Add unmatched UGC galaxies with synthetic PGC = 20_000_000 + row_id."""
    added = 0
    skipped = 0
    for ugc in unmatched:
        row_id = ugc.get("id")
        velocity = ugc.get("velocity")
        ra = ugc.get("ra")
        dec = ugc.get("dec")

        if row_id is None or ra is None or dec is None:
            skipped += 1
            continue
        if velocity is None or velocity <= 0:
            skipped += 1
            continue

        pgc = 20_000_000 + row_id
        if pgc in cf4:
            skipped += 1
            continue

        dist = velocity / H0
        dm = 5.0 * math.log10(dist) + 25.0

        gal = make_empty_galaxy()
        gal["pgc"] = pgc
        gal["ra"] = ra
        gal["dec"] = dec
        gal["dm"] = round(dm, 3)
        gal["distance_mpc"] = round(dist, 3)
        gal["distance_mly"] = round(dist * MPC_TO_MLY, 3)
        gal["vcmb"] = int(velocity)
        gal["source"] = "UGC"
        gal["name"] = ugc.get("name")
        cf4[pgc] = gal
        added += 1

    return added, skipped


# ─── Stage 7: Create unified database ───────────────────────────────────────


GALAXIES_COLUMNS = [
    ("pgc",           "INTEGER PRIMARY KEY"),
    ("group_pgc",     "INTEGER"),
    ("t17",           "INTEGER"),
    ("vcmb",          "INTEGER"),
    ("dm",            "REAL"),
    ("e_dm",          "REAL"),
    ("dm_snia",       "REAL"),
    ("e_dm_snia",     "REAL"),
    ("dm_tf",         "REAL"),
    ("e_dm_tf",       "REAL"),
    ("dm_fp",         "REAL"),
    ("e_dm_fp",       "REAL"),
    ("dm_sbf",        "REAL"),
    ("e_dm_sbf",      "REAL"),
    ("dm_snii",       "REAL"),
    ("e_dm_snii",     "REAL"),
    ("dm_trgb",       "REAL"),
    ("e_dm_trgb",     "REAL"),
    ("dm_ceph",       "REAL"),
    ("e_dm_ceph",     "REAL"),
    ("dm_mas",        "REAL"),
    ("e_dm_mas",      "REAL"),
    ("ra",            "REAL"),
    ("dec",           "REAL"),
    ("glon",          "REAL"),
    ("glat",          "REAL"),
    ("sgl",           "REAL"),
    ("sgb",           "REAL"),
    ("distance_mpc",  "REAL"),
    ("distance_mly",  "REAL"),
    ("source",        "TEXT"),
    ("name",          "TEXT"),
    ("agc",           "INTEGER"),
    ("v_hi",          "INTEGER"),
    ("log_mhi",       "REAL"),
    ("e_log_mhi",     "REAL"),
    ("log_ms_t",      "REAL"),
    ("e_log_ms_t",    "REAL"),
    ("log_sfr_nuv",   "REAL"),
    ("e_log_sfr_nuv", "REAL"),
    ("morphology",    "TEXT"),
    ("b_mag",         "REAL"),
    ("diameter_arcsec", "INTEGER"),
    ("axial_ratio",     "REAL"),
    ("position_angle",  "INTEGER"),
    ("ba",              "REAL"),
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


def create_database(galaxies, groups, db_path):
    """Write unified galaxies.db with galaxies + galaxy_groups tables."""
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

    rows = sorted(galaxies.values(), key=lambda g: g["pgc"])
    cur.executemany(insert_sql, [
        tuple(row.get(c) for c in col_names) for row in rows
    ])

    # ── galaxy_groups table ──
    col_defs = ", ".join(f"{col} {typ}" for col, typ in GROUPS_COLUMNS)
    cur.execute(f"CREATE TABLE galaxy_groups ({col_defs})")

    grp_col_names = [col for col, _ in GROUPS_COLUMNS]
    placeholders = ", ".join("?" for _ in grp_col_names)
    insert_sql = f"INSERT INTO galaxy_groups ({', '.join(grp_col_names)}) VALUES ({placeholders})"
    cur.executemany(insert_sql, [
        tuple(row.get(c) for c in grp_col_names) for row in groups
    ])

    # ── Indexes ──
    cur.execute("CREATE INDEX idx_galaxies_group ON galaxies (group_pgc)")
    cur.execute("CREATE INDEX idx_galaxies_ra ON galaxies (ra)")
    cur.execute("CREATE INDEX idx_galaxies_dec ON galaxies (dec)")
    cur.execute("CREATE INDEX idx_galaxies_dm ON galaxies (dm)")
    cur.execute("CREATE INDEX idx_galaxies_dist ON galaxies (distance_mpc)")
    cur.execute("CREATE INDEX idx_galaxies_source ON galaxies (source)")
    cur.execute("CREATE INDEX idx_groups_dist ON galaxy_groups (dist_mpc)")

    conn.commit()
    conn.close()
    print(f"  Database written to {db_path}")


# ─── Stage 8: Verify & stats ────────────────────────────────────────────────


def verify_and_stats(db_path):
    """Run assertions and print summary statistics."""
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    total = cur.execute("SELECT COUNT(*) FROM galaxies").fetchone()[0]
    groups = cur.execute("SELECT COUNT(*) FROM galaxy_groups").fetchone()[0]

    # Source breakdown
    cf4_count = cur.execute("SELECT COUNT(*) FROM galaxies WHERE source='CF4'").fetchone()[0]
    alf_count = cur.execute("SELECT COUNT(*) FROM galaxies WHERE source='ALFALFA'").fetchone()[0]
    fss_count = cur.execute("SELECT COUNT(*) FROM galaxies WHERE source='FSS'").fetchone()[0]
    ugc_count = cur.execute("SELECT COUNT(*) FROM galaxies WHERE source='UGC'").fetchone()[0]

    # Enrichment counts
    alf_enriched = cur.execute("SELECT COUNT(*) FROM galaxies WHERE source='CF4' AND agc IS NOT NULL").fetchone()[0]
    fss_enriched = cur.execute("SELECT COUNT(*) FROM galaxies WHERE source='CF4' AND morphology IS NOT NULL").fetchone()[0]

    # Spot-check PGC 2
    row = cur.execute("SELECT dm, vcmb, source FROM galaxies WHERE pgc=2").fetchone()

    print(f"\n{'='*60}")
    print(f"  Combined Galaxy Database Summary")
    print(f"{'='*60}")
    print(f"  Total galaxies:     {total:,}")
    print(f"  Galaxy groups:      {groups:,}")
    print(f"\n  --- Source Breakdown ---")
    print(f"    CF4 base:         {cf4_count:,}")
    print(f"    ALFALFA new:      {alf_count:,}")
    print(f"    FSS new:          {fss_count:,}")
    print(f"    UGC new:          {ugc_count:,}")
    print(f"\n  --- Enrichment ---")
    print(f"    CF4 + ALFALFA:    {alf_enriched:,} (agc matched)")
    print(f"    CF4 + FSS morph:  {fss_enriched:,} (morphology matched)")

    # Distance range
    r = cur.execute(
        "SELECT MIN(distance_mpc), MAX(distance_mpc), AVG(distance_mpc) "
        "FROM galaxies WHERE distance_mpc IS NOT NULL"
    ).fetchone()
    print(f"\n  --- Distance ---")
    print(f"    Range: {r[0]:.1f} – {r[1]:.1f} Mpc")
    print(f"    Mean:  {r[2]:.1f} Mpc ({r[2]*MPC_TO_MLY:.1f} Mly)")

    print(f"{'='*60}\n")

    # ── Assertions ──
    assert total >= 55877, f"Must have at least all CF4 galaxies, got {total}"
    assert cf4_count == 55877, f"CF4 count wrong: {cf4_count}"
    assert groups == 38053, f"Groups count wrong: {groups}"

    assert row is not None, "PGC 2 not found"
    assert row[0] == 34.535, f"PGC 2 dm wrong: {row[0]}"
    assert row[2] == "CF4", f"PGC 2 source wrong: {row[2]}"

    assert alf_enriched > 0, "No ALFALFA cross-matches"
    assert fss_enriched > 0, "No FSS cross-matches"

    # No NULL dm/distance/ra/dec (all rows must have these)
    null_dm = cur.execute("SELECT COUNT(*) FROM galaxies WHERE dm IS NULL").fetchone()[0]
    null_dist = cur.execute("SELECT COUNT(*) FROM galaxies WHERE distance_mpc IS NULL").fetchone()[0]
    null_ra = cur.execute("SELECT COUNT(*) FROM galaxies WHERE ra IS NULL").fetchone()[0]
    null_dec = cur.execute("SELECT COUNT(*) FROM galaxies WHERE dec IS NULL").fetchone()[0]
    assert null_dm == 0, f"{null_dm} galaxies have NULL dm"
    assert null_dist == 0, f"{null_dist} galaxies have NULL distance_mpc"
    assert null_ra == 0, f"{null_ra} galaxies have NULL ra"
    assert null_dec == 0, f"{null_dec} galaxies have NULL dec"

    print("All assertions passed!")
    conn.close()


# ─── Main ────────────────────────────────────────────────────────────────────


if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    cf4_db = os.path.join(base_dir, "..", "cosmicflows", "cosmicflows4.db")
    alf_db = os.path.join(base_dir, "..", "alfalfa", "alfalfa.db")
    fss_db = os.path.join(base_dir, "..", "fss", "galaxies_combined.db")
    out_db = os.path.join(base_dir, "galaxies.db")

    # ── Stage 1: Load ──
    print("Stage 1: Loading source databases...")
    cf4, groups = load_cf4(cf4_db)
    print(f"  CF4: {len(cf4):,} galaxies, {len(groups):,} groups")

    alfalfa_rows = load_alfalfa(alf_db)
    print(f"  ALFALFA: {len(alfalfa_rows):,} galaxies")

    fss_rows, ugc_rows = load_fss_ugc(fss_db)
    print(f"  FSS: {len(fss_rows):,} galaxies")
    print(f"  UGC: {len(ugc_rows):,} galaxies")

    # ── Stage 2: FSS direct PGC join ──
    print("\nStage 2: FSS direct PGC join...")
    fss_matched, fss_unmatched = fss_pgc_join(cf4, fss_rows)
    print(f"  Matched: {fss_matched:,}, Unmatched: {len(fss_unmatched):,}")

    # ── Stage 3: Build spatial index ──
    print("\nStage 3: Building spatial index...")
    spatial_idx = build_spatial_index(cf4)
    print(f"  Grid cells: {len(spatial_idx):,}")

    # ── Stage 4: ALFALFA cross-match ──
    print("\nStage 4: ALFALFA spatial cross-match (30 arcsec)...")
    alf_matched, alf_unmatched = alfalfa_crossmatch(cf4, alfalfa_rows, spatial_idx)
    print(f"  Matched: {alf_matched:,}, Unmatched: {len(alf_unmatched):,}")

    # ── Stage 5: UGC cross-match ──
    print("\nStage 5: UGC spatial cross-match (30 arcsec)...")
    ugc_matched, ugc_unmatched = ugc_crossmatch(cf4, ugc_rows, spatial_idx)
    print(f"  Matched: {ugc_matched:,}, Unmatched: {len(ugc_unmatched):,}")

    # ── Stage 6: Add unmatched ──
    print("\nStage 6: Adding unmatched galaxies...")
    alf_added, alf_skipped = add_unmatched_alfalfa(cf4, alf_unmatched)
    print(f"  ALFALFA: added {alf_added:,}, skipped {alf_skipped:,}")

    fss_added, fss_skipped = add_unmatched_fss(cf4, fss_unmatched)
    print(f"  FSS: added {fss_added:,}, skipped {fss_skipped:,}")

    ugc_added, ugc_skipped = add_unmatched_ugc(cf4, ugc_unmatched)
    print(f"  UGC: added {ugc_added:,}, skipped {ugc_skipped:,}")

    print(f"\n  Total galaxies: {len(cf4):,}")

    # ── Stage 7: Create database ──
    print("\nStage 7: Creating unified database...")
    create_database(cf4, groups, out_db)

    # ── Stage 8: Verify & stats ──
    print("\nStage 8: Verification...")
    verify_and_stats(out_db)

    # File size
    size_mb = os.path.getsize(out_db) / (1024 * 1024)
    print(f"Database size: {size_mb:.1f} MB")
