"""Test script to check SSL and network connectivity."""
import ssl
import urllib.request
import sys

# Create unverified SSL context for testing
ssl._create_default_https_context = ssl._create_unverified_context

url = 'http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/13/000/atlases/13002/NGC0224-parent-13002.fits.gz'

try:
    print(f'Attempting to fetch: {url}')
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0')
    with urllib.request.urlopen(req, timeout=30) as response:
        print(f'Success! Status: {response.status}')
        data = response.read()
        print(f'Downloaded {len(data)} bytes')
        print('File appears valid')
except Exception as e:
    print(f'Error: {type(e).__name__}: {e}')
    sys.exit(1)
