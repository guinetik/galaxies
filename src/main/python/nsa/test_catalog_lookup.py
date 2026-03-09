"""Tests for NSA catalog lookup functionality"""

import pytest
from nsa.catalog_lookup import get_nsa_galaxy_info, find_nearby_galaxies


class TestNSACatalogLookup:
    """Test NSA catalog lookup functions"""

    def test_andromeda_by_nsaid(self):
        """Test finding Andromeda (M31) by NSAID"""
        info = get_nsa_galaxy_info(nsaid=127580)

        assert info['iauname'] == 'J004244.30+411608.9'
        assert info['subdir'] == '00h/p40/J004244.30+411608.9'
        assert info['pid'] == 0
        assert info['nsaid'] == 127580
        assert abs(info['ra'] - 10.6850296) < 0.0001
        assert abs(info['dec'] - 41.2687834) < 0.0001
        assert abs(info['z'] - (-0.001001)) < 0.00001
        assert abs(info['mag'] - 4.36) < 0.01

    def test_andromeda_by_coordinates(self):
        """Test finding Andromeda by RA/Dec coordinates"""
        # Well-known Andromeda coordinates
        info = get_nsa_galaxy_info(ra=10.6846, dec=41.2692)

        assert info['iauname'] == 'J004244.30+411608.9'
        assert info['nsaid'] == 127580
        # Coordinates should match
        assert abs(info['ra'] - 10.6850296) < 0.0001

    def test_invalid_search_criteria(self):
        """Test that search without criteria raises ValueError"""
        with pytest.raises(ValueError):
            get_nsa_galaxy_info()

    def test_nonexistent_nsaid(self):
        """Test that searching for nonexistent NSAID raises ValueError"""
        with pytest.raises(ValueError):
            get_nsa_galaxy_info(nsaid=999999)

    def test_nonexistent_coordinates(self):
        """Test that searching outside catalog range raises ValueError"""
        with pytest.raises(ValueError):
            # Far outside any galaxy
            get_nsa_galaxy_info(ra=180.0, dec=89.0)

    def test_nearby_galaxies(self):
        """Test finding nearby galaxies"""
        nearby = find_nearby_galaxies(ra=10.6846, dec=41.2692, radius_deg=0.5, limit=5)

        assert len(nearby) >= 1
        assert nearby[0]['iauname'] == 'J004244.30+411608.9'
        assert nearby[0]['nsaid'] == 127580
        # Results should be sorted by distance
        assert nearby[0]['distance_deg'] < nearby[1]['distance_deg']

    def test_nearby_galaxies_empty(self):
        """Test finding nearby galaxies in empty region"""
        nearby = find_nearby_galaxies(ra=180.0, dec=89.0, radius_deg=0.1)
        assert len(nearby) == 0

    def test_nearby_galaxies_limit(self):
        """Test that limit parameter works"""
        nearby = find_nearby_galaxies(ra=10.6846, dec=41.2692, radius_deg=1.0, limit=1)
        assert len(nearby) == 1


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
