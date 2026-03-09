"""Find the actual FITS file for Andromeda."""
import ssl
import urllib.request
import re
import urllib.parse

ssl._create_default_https_context = ssl._create_unverified_context

# The NSA designates objects by their J2000 coordinates
# Andromeda: RA 00h 42m 44.3s, Dec +41° 16' 09"
# In SDSS J-notation: J004244.3+411609

# Try these variations
candidates = [
    'J004244.30%2B411609.0',
    'J004244.30%2B411608.9',
    'J004244%2B411609',
]

base_url = "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/00h/p40/"

for candidate in candidates:
    url = f"{base_url}{candidate}/"
    try:
        print(f"\nTrying: {url}")
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read().decode('utf-8', errors='ignore')
            files = re.findall(r'href=["\']?([^"\'>\s]+\.fits\.gz)["\']?', content)
            if files:
                print(f"  Found FITS files: {files}")
                for f in files:
                    full_url = f"{base_url}{candidate}/{f}"
                    print(f"  Full path: {full_url}")
            else:
                # Show what's in the directory
                links = re.findall(r'href=["\']?([^"\'>\s]+)["\']?', content)
                links = [l for l in links if l != '../']
                print(f"  Directory contents: {links[:10]}")

    except urllib.error.HTTPError as e:
        print(f"  404")
    except Exception as e:
        print(f"  Error: {type(e).__name__}: {e}")
