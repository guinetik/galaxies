"""Test different NSA URL structures."""
import ssl
import urllib.request

ssl._create_default_https_context = ssl._create_unverified_context

# Try to find the correct path for Andromeda
urls_to_try = [
    'http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/13/000/',
    'http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/',
]

for url in urls_to_try:
    try:
        print(f'Trying: {url}')
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=10) as response:
            print(f'  Status: {response.status}')
    except Exception as e:
        print(f'  Error: {type(e).__name__}: {e}')
