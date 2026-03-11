"""Tests for orientation fields in the combined galaxy ETL."""

import sqlite3

from main import GALAXIES_COLUMNS, add_unmatched_fss, create_database, fss_pgc_join, load_fss_ugc


def test_load_fss_ugc_preserves_position_angle(tmp_path):
    """load_fss_ugc should include FSS position_angle from the source DB."""
    db_path = tmp_path / "galaxies_combined.db"
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE galaxies (
            id INTEGER PRIMARY KEY,
            catalog TEXT,
            name TEXT,
            ra REAL,
            dec REAL,
            velocity REAL,
            pgc INTEGER,
            morphology TEXT,
            b_mag REAL,
            diameter_arcsec INTEGER,
            axial_ratio REAL,
            position_angle INTEGER
        )
        """
    )
    cur.execute(
        """
        INSERT INTO galaxies (
            id, catalog, name, ra, dec, velocity, pgc, morphology,
            b_mag, diameter_arcsec, axial_ratio, position_angle
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (1, "FSS", "PGC 1", 10.0, 20.0, 1500.0, 1, "Sb", 12.3, 45, 0.42, 73),
    )
    cur.execute(
        """
        INSERT INTO galaxies (
            id, catalog, name, ra, dec, velocity, pgc, morphology,
            b_mag, diameter_arcsec, axial_ratio, position_angle
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (2, "UGC", "UGC 1", 11.0, 21.0, 1600.0, None, None, None, None, None, None),
    )
    conn.commit()
    conn.close()

    fss_rows, _ugc_rows = load_fss_ugc(db_path)

    assert fss_rows == [{
        "id": 1,
        "name": "PGC 1",
        "ra": 10.0,
        "dec": 20.0,
        "velocity": 1500.0,
        "pgc": 1,
        "morphology": "Sb",
        "b_mag": 12.3,
        "diameter_arcsec": 45,
        "axial_ratio": 0.42,
        "position_angle": 73,
    }]


def test_fss_pgc_join_copies_position_angle():
    """fss_pgc_join should copy FSS position_angle onto matched CF4 rows."""
    cf4 = {
        1: {
            "pgc": 1,
            "name": None,
            "morphology": None,
            "b_mag": None,
            "diameter_arcsec": None,
            "axial_ratio": None,
            "position_angle": None,
        }
    }

    matched, unmatched = fss_pgc_join(cf4, [{
        "pgc": 1,
        "name": "PGC 1",
        "morphology": "Sb",
        "b_mag": 12.3,
        "diameter_arcsec": 45,
        "axial_ratio": 0.42,
        "position_angle": 73,
    }])

    assert matched == 1
    assert unmatched == []
    assert cf4[1]["position_angle"] == 73


def test_add_unmatched_fss_copies_position_angle():
    """add_unmatched_fss should preserve position_angle on new FSS rows."""
    cf4 = {}

    added, skipped = add_unmatched_fss(cf4, [{
        "pgc": 10,
        "ra": 10.0,
        "dec": 20.0,
        "velocity": 1500.0,
        "name": "PGC 10",
        "morphology": "Sb",
        "b_mag": 12.3,
        "diameter_arcsec": 45,
        "axial_ratio": 0.42,
        "position_angle": 73,
    }])

    assert added == 1
    assert skipped == 0
    assert cf4[10]["position_angle"] == 73


def test_final_schema_includes_position_angle():
    """GALAXIES_COLUMNS should expose position_angle in the shipped DB schema."""
    assert ("position_angle", "INTEGER") in GALAXIES_COLUMNS


def test_create_database_writes_position_angle(tmp_path):
    """create_database should persist position_angle in the final SQLite output."""
    db_path = tmp_path / "galaxies.db"
    galaxies = {
        1: {
            "pgc": 1,
            "group_pgc": None,
            "t17": None,
            "vcmb": 1000,
            "dm": 30.0,
            "e_dm": None,
            "dm_snia": None,
            "e_dm_snia": None,
            "dm_tf": None,
            "e_dm_tf": None,
            "dm_fp": None,
            "e_dm_fp": None,
            "dm_sbf": None,
            "e_dm_sbf": None,
            "dm_snii": None,
            "e_dm_snii": None,
            "dm_trgb": None,
            "e_dm_trgb": None,
            "dm_ceph": None,
            "e_dm_ceph": None,
            "dm_mas": None,
            "e_dm_mas": None,
            "ra": 10.0,
            "dec": 20.0,
            "glon": None,
            "glat": None,
            "sgl": None,
            "sgb": None,
            "distance_mpc": 10.0,
            "distance_mly": 32.6,
            "source": "FSS",
            "name": "PGC 1",
            "agc": None,
            "v_hi": None,
            "log_mhi": None,
            "e_log_mhi": None,
            "log_ms_t": None,
            "e_log_ms_t": None,
            "log_sfr_nuv": None,
            "e_log_sfr_nuv": None,
            "morphology": "Sb",
            "b_mag": 12.3,
            "diameter_arcsec": 45,
            "axial_ratio": 0.42,
            "position_angle": 73,
            "ba": None,
        }
    }

    create_database(galaxies, [], db_path)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    stored_value = cur.execute(
        "SELECT position_angle FROM galaxies WHERE pgc = 1"
    ).fetchone()[0]
    conn.close()

    assert stored_value == 73
