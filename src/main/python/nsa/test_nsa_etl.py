"""Tests for NSA image ETL pipeline."""

import pytest
from unittest.mock import patch, MagicMock
import gzip
import numpy as np
from io import BytesIO
from pathlib import Path
from astropy.io import fits
from PIL import Image

from nsa_image_etl import fetch_fits, extract_bands, normalize_band, save_webp, save_metadata, BANDS


def test_fetch_fits_returns_bytes():
    """fetch_fits should return gzipped FITS data as bytes."""
    # Mock the urllib to avoid actual network call
    with patch('nsa_image_etl.urllib.request.urlopen') as mock_urlopen:
        mock_response = MagicMock()
        mock_response.read.return_value = b"PK\x03\x04..."  # Fake gzip header
        mock_urlopen.return_value.__enter__.return_value = mock_response
        mock_urlopen.return_value.__exit__.return_value = False

        result = fetch_fits(2557)

        assert isinstance(result, bytes)
        assert len(result) > 0


def test_fetch_fits_raises_for_unknown_pgc():
    """fetch_fits should raise ValueError for unknown PGC."""
    with pytest.raises(ValueError, match="not in hardcoded database"):
        fetch_fits(99999)


def test_fetch_fits_raises_runtime_error_on_http_failure():
    """fetch_fits should raise RuntimeError if HTTP request fails."""
    with patch('nsa_image_etl.urllib.request.urlopen') as mock_urlopen:
        mock_urlopen.side_effect = Exception("Connection refused")

        with pytest.raises(RuntimeError, match="Failed to fetch"):
            fetch_fits(2557)


def test_extract_bands_returns_dict():
    """extract_bands should return dict with u, g, r, i, z keys."""
    # Create fake FITS with proper structure
    # Parent image HDU structure: even = images, odd = inverse variance
    hdul = fits.HDUList()
    for i, band in enumerate(["u", "g", "r", "i", "z"]):
        # Image HDU (even indices)
        img_data = np.random.randint(0, 1000, (100, 100), dtype=np.uint32)
        hdu = fits.ImageHDU(data=img_data, name=f"{band.upper()}")
        hdul.append(hdu)

        # Variance HDU (odd indices)
        var_data = np.random.randint(0, 100, (100, 100), dtype=np.uint32)
        var_hdu = fits.ImageHDU(data=var_data, name=f"{band.upper()}_VAR")
        hdul.append(var_hdu)

    # Save to gzipped bytes
    buffer = BytesIO()
    hdul.writeto(buffer, overwrite=True)
    fits_bytes = gzip.compress(buffer.getvalue())

    result = extract_bands(fits_bytes)

    assert isinstance(result, dict)
    assert set(result.keys()) == set(BANDS)
    for band in BANDS:
        assert isinstance(result[band], np.ndarray)
        assert result[band].shape == (100, 100)
        assert result[band].dtype == np.float32


def test_extract_bands_raises_on_missing_hdu():
    """extract_bands should raise ValueError if required HDU is missing."""
    # Create incomplete FITS (missing some bands)
    hdul = fits.HDUList()
    # Only add u and g bands
    for band in ["u", "g"]:
        img_data = np.random.randint(0, 1000, (100, 100), dtype=np.uint32)
        hdu = fits.ImageHDU(data=img_data, name=f"{band.upper()}")
        hdul.append(hdu)

        var_data = np.random.randint(0, 100, (100, 100), dtype=np.uint32)
        var_hdu = fits.ImageHDU(data=var_data, name=f"{band.upper()}_VAR")
        hdul.append(var_hdu)

    buffer = BytesIO()
    hdul.writeto(buffer, overwrite=True)
    fits_bytes = gzip.compress(buffer.getvalue())

    with pytest.raises(ValueError, match="Missing HDU"):
        extract_bands(fits_bytes)


def test_normalize_band_returns_uint8():
    """normalize_band should convert float to uint8 [0, 255]."""
    # Input: float data with arbitrary range
    input_data = np.array([[0.0, 100.5], [50.25, 200.0]], dtype=np.float32)

    result = normalize_band(input_data)

    assert result.dtype == np.uint8
    assert result.min() >= 0
    assert result.max() <= 255
    assert result.shape == input_data.shape


def test_normalize_band_clips_to_0_255():
    """normalize_band should clip values to [0, 255]."""
    # Input with negative and large values
    input_data = np.array([[-100.0, 0.0], [500.0, 128.0]], dtype=np.float32)

    result = normalize_band(input_data)

    assert np.all(result >= 0)
    assert np.all(result <= 255)


def test_normalize_band_handles_uniform_values():
    """normalize_band should handle case where all values are the same."""
    # All same value
    input_data = np.array([[5.0, 5.0], [5.0, 5.0]], dtype=np.float32)

    result = normalize_band(input_data)

    assert result.dtype == np.uint8
    assert np.all(result == 0)  # Should be zeros when all input is same


def test_save_webp_creates_file():
    """save_webp should create a WebP file at the specified path."""
    import tempfile

    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = Path(tmpdir) / "test.webp"

        # Create test data
        test_data = np.array([[0, 128, 255], [64, 192, 32]], dtype=np.uint8)

        save_webp(test_data, output_path)

        assert output_path.exists()
        assert output_path.suffix == ".webp"
        assert output_path.stat().st_size > 0


def test_save_webp_preserves_dimensions():
    """save_webp should preserve image dimensions."""
    import tempfile

    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = Path(tmpdir) / "test.webp"

        # Create test data (100x100)
        test_data = np.random.randint(0, 256, (100, 100), dtype=np.uint8)

        save_webp(test_data, output_path)

        # Verify dimensions
        with Image.open(output_path) as img:
            assert img.size == (100, 100)


def test_save_webp_creates_parent_directories():
    """save_webp should create parent directories if they don't exist."""
    import tempfile

    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = Path(tmpdir) / "deep" / "nested" / "dirs" / "test.webp"

        test_data = np.array([[100, 200]], dtype=np.uint8)

        save_webp(test_data, output_path)

        assert output_path.exists()
        assert output_path.parent.exists()


def test_save_metadata_creates_json():
    """save_metadata should create metadata.json file."""
    import tempfile
    import json

    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir)

        band_ranges = {
            "u": (0.0, 1000.0),
            "g": (50.0, 2000.0),
            "r": (100.0, 3000.0),
            "i": (150.0, 2500.0),
            "z": (200.0, 2000.0),
        }
        dimensions = (512, 512)

        save_metadata(2557, output_dir, band_ranges, dimensions)

        metadata_file = output_dir / "metadata.json"
        assert metadata_file.exists()

        # Verify JSON content
        with open(metadata_file) as f:
            data = json.load(f)

        assert data["pgc"] == 2557
        assert data["name"] == "Andromeda"
        assert data["dimensions"] == [512, 512]
        assert "data_ranges" in data
        assert set(data["bands"]) == set(BANDS)


def test_save_metadata_contains_nsa_url():
    """save_metadata should include NSA URL in metadata."""
    import tempfile
    import json

    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir)
        band_ranges = {band: (0.0, 1000.0) for band in BANDS}
        dimensions = (256, 256)

        save_metadata(2557, output_dir, band_ranges, dimensions)

        with open(output_dir / "metadata.json") as f:
            data = json.load(f)

        assert "nsa_url" in data
        assert data["nsa_url"].startswith("http")
        assert "NGC0224" in data["nsa_url"]


def test_save_metadata_raises_for_unknown_pgc():
    """save_metadata should raise ValueError for unknown PGC."""
    import tempfile

    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir)
        band_ranges = {band: (0.0, 1000.0) for band in BANDS}

        with pytest.raises(ValueError, match="not in database"):
            save_metadata(99999, output_dir, band_ranges, (256, 256))


def test_main_pipeline_andromeda():
    """Full pipeline: fetch → extract → normalize → save WebP + metadata."""
    import tempfile
    import json
    import sys
    from nsa_image_etl import main

    with tempfile.TemporaryDirectory() as tmpdir:
        # Create mock FITS data with proper structure
        hdul = fits.HDUList()
        for i, band in enumerate(BANDS):
            img_data = np.random.randint(100, 500, (256, 256), dtype=np.uint32)
            hdu = fits.ImageHDU(data=img_data, name=f"{band.upper()}")
            hdul.append(hdu)

            var_data = np.random.randint(1, 50, (256, 256), dtype=np.uint32)
            var_hdu = fits.ImageHDU(data=var_data, name=f"{band.upper()}_VAR")
            hdul.append(var_hdu)

        buffer = BytesIO()
        hdul.writeto(buffer, overwrite=True)
        fits_bytes = gzip.compress(buffer.getvalue())

        # Mock fetch_fits to return this data
        with patch('nsa_image_etl.fetch_fits', return_value=fits_bytes):
            # Call main with mocked argv
            test_args = ['nsa_image_etl.py', '--pgc', '2557', '--output-base', tmpdir]
            with patch.object(sys, 'argv', test_args):
                main()

            # Verify all files exist
            output_dir = Path(tmpdir) / "2557"
            for band in BANDS:
                assert (output_dir / f"{band}.webp").exists(), f"Missing {band}.webp"
            assert (output_dir / "metadata.json").exists(), "Missing metadata.json"

            # Verify metadata content
            with open(output_dir / "metadata.json") as f:
                metadata = json.load(f)
            assert metadata["pgc"] == 2557
            assert metadata["dimensions"] == [256, 256]
            assert set(metadata["bands"]) == set(BANDS)
            assert "data_ranges" in metadata
