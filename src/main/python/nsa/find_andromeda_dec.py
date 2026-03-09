"""Find Andromeda in the NSA directory structure with correct RA/Dec."""
import ssl
import urllib.request
import re

ssl._create_default_https_context = ssl._create_unverified_context

# Andromeda: RA ~00h 42m, Dec ~+41°
# NSA structure: /00h/p40/ or /00h/p42/

dec_bands = ['p38/', 'p40/', 'p42/', 'p44/']

for dec_band in dec_bands:
    url = f"http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/00h/{dec_band}"
    try:
        print(f"\nFetching: {url}")
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read().decode('utf-8', errors='ignore')
            links = re.findall(r'href=["\']?([^"\'>\s]+)["\']?', content)
            links = [l for l in links if l != '../']

            # Look for NGC224 or Andromeda
            matches = [l for l in links if '224' in l or 'andro' in l.lower()]
            if matches:
                print(f"Found matches: {matches}")

            # Show first 20 to understand structure
            print(f"First 20 entries: {links[:20]}")

    except urllib.error.HTTPError as e:
        print(f"  404 - Not found")
    except Exception as e:
        print(f"  Error: {type(e).__name__}")
