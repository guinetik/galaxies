"""ETL pipeline: UGC VOTable XML -> SQLite database."""

from astropy.io.votable import parse
import os


def extract_votable(xml_path: str):
    """Parse a VOTable XML file and return the first table as an astropy Table."""
    votable = parse(xml_path)
    table = votable.get_first_table().to_table()
    return table


if __name__ == "__main__":
    xml_path = os.path.join(
        os.path.dirname(__file__), "..", "..", "..", "research", "1973UGCC0000N.xml"
    )
    table = extract_votable(xml_path)
    print(f"Loaded {len(table)} rows, {len(table.columns)} columns")
    print(f"Columns: {table.colnames}")
    assert len(table) == 14176, f"Expected 14176 rows, got {len(table)}"
    assert len(table.columns) == 21, f"Expected 21 columns, got {len(table.columns)}"
    print("Extract phase: OK")
