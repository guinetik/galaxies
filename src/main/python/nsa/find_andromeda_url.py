"""Find the correct NSA URL for Andromeda."""
import ssl
import urllib.request
import json

# Disable SSL for testing
ssl._create_default_https_context = ssl._create_unverified_context

# Andromeda properties
# RA: 00:42:44, Dec: +41:16:09 (approximately)
# PGC: 2557
# NGC: 0224 (NGC224)
# SDSS designation varies

# Common alternatives for Andromeda
candidates = [
    # Original attempt
    "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/13/000/atlases/13002/NGC0224-parent-13002.fits.gz",
    # Try with different case/format
    "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/13/atlases/13002/NGC0224-parent-13002.fits.gz",
    # Check if base URL lists available directories
]

print("Testing various URL patterns...\n")

# Try to list base directory
base_urls = [
    "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/",
    "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/13/",
]

for base_url in base_urls:
    try:
        print(f"Checking: {base_url}")
        req = urllib.request.Request(base_url)
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read().decode('utf-8', errors='ignore')
            print(f"  Status: {response.status}")
            # Look for links or directory listings
            if '13/000' in content or '13002' in content:
                print(f"  Found Andromeda-related entries!")
            elif '<a href' in content:
                # HTML directory listing
                import re
                links = re.findall(r'href=["\']?([^"\'>\s]+)["\']?', content)
                print(f"  Available subdirs: {links[:10]}")
            print()
    except Exception as e:
        print(f"  Error: {type(e).__name__}: {str(e)[:60]}\n")

# Try the original URL with different formats
test_urls = [
    "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/13/000/atlases/13002/NGC0224-parent-13002.fits.gz",
    "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/13/000/atlases/13002/ngc0224-parent-13002.fits.gz",  # lowercase
]

print("\nTesting FITS URLs:")
for url in test_urls:
    try:
        print(f"Checking: {url}")
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=10) as response:
            print(f"  Status: {response.status}")
            content = response.read()
            print(f"  Downloaded: {len(content)} bytes")
    except urllib.error.HTTPError as e:
        print(f"  HTTP Error: {e.code}")
    except Exception as e:
        print(f"  Error: {type(e).__name__}")
    print()
