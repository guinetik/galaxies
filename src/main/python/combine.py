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


if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    fss_path = os.path.join(base_dir, "..", "..", "..", "research", "fss.dat")

    fss_rows = parse_fss(fss_path)
    assert len(fss_rows) == 3838, f"Expected 3838 FSS rows, got {len(fss_rows)}"
    assert fss_rows[0]["name"] == "PGC 00012", f"First name: {fss_rows[0]['name']}"
    assert fss_rows[0]["velocity"] == 6546.0, f"First velocity: {fss_rows[0]['velocity']}"
    print(f"FSS: {len(fss_rows)} rows parsed")
    print(f"  First row: {fss_rows[0]['name']}, RA={fss_rows[0]['ra']:.4f}, Dec={fss_rows[0]['dec']:.4f}")
    print(f"  Last row: {fss_rows[-1]['name']}")
