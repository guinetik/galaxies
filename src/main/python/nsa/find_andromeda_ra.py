"""Find Andromeda in the NSA RA-based directory structure."""
import ssl
import urllib.request
import re

ssl._create_default_https_context = ssl._create_unverified_context

# Andromeda RA: 00h 42m 44s = 0.6793 hours = between 00h and 01h
# In NSA: likely in 00h directory

base = "http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/00h/"

try:
    print(f"Fetching directory: {base}")
    req = urllib.request.Request(base)
    req.add_header('User-Agent', 'Mozilla/5.0')
    with urllib.request.urlopen(req, timeout=10) as response:
        content = response.read().decode('utf-8', errors='ignore')

        # Extract directory links
        links = re.findall(r'href=["\']?([^"\'>\s]+)["\']?', content)

        # Filter for reasonable entries (not ..)
        subdirs = [link for link in links if link != '../' and link.endswith('/')]
        print(f"Found {len(subdirs)} subdirectories")
        print(f"First 30: {subdirs[:30]}")

        # Look for Andromeda-related entries
        for subdir in subdirs:
            if any(x in subdir.lower() for x in ['224', '2557', 'andro', 'ngc']):
                print(f"Potential match: {subdir}")

except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")

# Let's also try looking in a specific sub-directory
# NSA might organize by declination bands within each RA hour
print("\n\nTrying specific Dec bands in 00h:")

dec_band = "040/"  # Dec +40 area where Andromeda is
try:
    url = f"http://sdss.physics.nyu.edu/mblanton/v0/detect/v0_1/00h/{dec_band}"
    print(f"Fetching: {url}")
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0')
    with urllib.request.urlopen(req, timeout=10) as response:
        content = response.read().decode('utf-8', errors='ignore')
        links = re.findall(r'href=["\']?([^"\'>\s]+)["\']?', content)
        matches = [link for link in links if '224' in link or '2557' in link or 'ngc' in link.lower()]
        print(f"Found {len(matches)} NGC0224/Andromeda matches:")
        for m in matches:
            print(f"  {m}")
        if not matches:
            print(f"All entries: {[l for l in links if l != '../'][:20]}")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
