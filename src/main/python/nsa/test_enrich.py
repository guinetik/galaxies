"""
Tests for NSA galaxy enrichment.
"""

import sqlite3
import tempfile
from pathlib import Path
from enrich_galaxies_with_nsa import ensure_nsa_columns, match_galaxy, process_galaxies


def test_ensure_nsa_columns():
    """Ensure columns are created correctly."""
    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as f:
        db_path = f.name

    try:
        # Create minimal test DB
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute('CREATE TABLE galaxies (pgc INTEGER PRIMARY KEY, ra REAL, dec REAL)')
        conn.commit()
        conn.close()

        # Ensure columns
        ensure_nsa_columns(db_path)

        # Verify
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("PRAGMA table_info(galaxies)")
        columns = {row[1] for row in cur.fetchall()}
        conn.close()

        assert 'nsa_iauname' in columns
        assert 'nsa_subdir' in columns
        assert 'nsa_pid' in columns
        print("[PASS] test_ensure_nsa_columns")

    finally:
        Path(db_path).unlink()


def test_match_andromeda():
    """Test matching Andromeda (PGC 2557)."""
    result = match_galaxy(pgc=2557, ra=10.6850, dec=41.2688)

    assert result is not None, "Andromeda should match"
    assert result['iauname'] == 'J004244.30+411608.9'
    assert '00h/p40' in result['subdir']
    assert result['pid'] == 0
    print("[PASS] test_match_andromeda")


def test_no_match_invalid_coords():
    """Test unmatched galaxy with invalid coordinates."""
    result = match_galaxy(pgc=999999, ra=999.0, dec=999.0)

    assert result is None, "Invalid coordinates should not match"
    print("[PASS] test_no_match_invalid_coords")


if __name__ == "__main__":
    test_ensure_nsa_columns()
    test_match_andromeda()
    test_no_match_invalid_coords()
    print("\n[SUCCESS] All tests passed!")
