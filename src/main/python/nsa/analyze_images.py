"""Quick analysis of downloaded galaxy images in src/main/images."""

import os
import json
import statistics
from pathlib import Path
from collections import Counter
from PIL import Image

base = Path(r"D:\Developer\galaxies\src\main\images")
folders = [f for f in base.iterdir() if f.is_dir()]

total_size = 0
folder_sizes = []
dimensions = []
band_counts = []
sample_count = 0
errors = 0

for i, folder in enumerate(folders):
    fsize = sum(f.stat().st_size for f in folder.iterdir() if f.is_file())
    folder_sizes.append(fsize)
    total_size += fsize

    # Sample dimensions from first png found
    pngs = list(folder.glob("*.png"))
    if pngs:
        try:
            img = Image.open(pngs[0])
            dimensions.append(img.size)
            img.close()
            sample_count += 1
        except Exception:
            errors += 1

    meta = folder / "metadata.json"
    if meta.exists():
        try:
            m = json.loads(meta.read_text())
            band_counts.append(len(m.get("bands", [])))
        except Exception:
            pass

    if (i + 1) % 5000 == 0:
        print(f"  scanned {i+1:,}/{len(folders):,}...")

folder_sizes_mb = [s / (1024 * 1024) for s in folder_sizes]
widths = [d[0] for d in dimensions]
heights = [d[1] for d in dimensions]

print(f"\n=== Galaxy Image Analysis ===")
print(f"Total folders: {len(folders):,}")
print(f"Total size: {total_size / (1024**3):.1f} GB")

print(f"\n--- Folder Size (MB) ---")
print(f"  Mean:   {statistics.mean(folder_sizes_mb):.1f} MB")
print(f"  Median: {statistics.median(folder_sizes_mb):.1f} MB")
print(f"  Min:    {min(folder_sizes_mb):.2f} MB")
print(f"  Max:    {max(folder_sizes_mb):.1f} MB")
print(f"  StdDev: {statistics.stdev(folder_sizes_mb):.1f} MB")

print(f"\n--- Image Dimensions (sampled {sample_count:,}) ---")
print(f"  Width  - Mean: {statistics.mean(widths):.0f}, Median: {statistics.median(widths):.0f}, Min: {min(widths)}, Max: {max(widths)}")
print(f"  Height - Mean: {statistics.mean(heights):.0f}, Median: {statistics.median(heights):.0f}, Min: {min(heights)}, Max: {max(heights)}")

# Size distribution
size_buckets = {"<1MB": 0, "1-5MB": 0, "5-20MB": 0, "20-50MB": 0, "50-100MB": 0, ">100MB": 0}
for s in folder_sizes_mb:
    if s < 1:
        size_buckets["<1MB"] += 1
    elif s < 5:
        size_buckets["1-5MB"] += 1
    elif s < 20:
        size_buckets["5-20MB"] += 1
    elif s < 50:
        size_buckets["20-50MB"] += 1
    elif s < 100:
        size_buckets["50-100MB"] += 1
    else:
        size_buckets[">100MB"] += 1

print("\n--- Size Distribution ---")
for k, v in size_buckets.items():
    pct = v / len(folders) * 100
    print(f"  {k:>8s}: {v:>6,} ({pct:.1f}%)")

# Dimension distribution
dim_buckets = {"<256": 0, "256-512": 0, "512-1024": 0, "1024-2048": 0, "2048-4096": 0, ">4096": 0}
for w in widths:
    if w < 256:
        dim_buckets["<256"] += 1
    elif w < 512:
        dim_buckets["256-512"] += 1
    elif w < 1024:
        dim_buckets["512-1024"] += 1
    elif w < 2048:
        dim_buckets["1024-2048"] += 1
    elif w < 4096:
        dim_buckets["2048-4096"] += 1
    else:
        dim_buckets[">4096"] += 1

print("\n--- Dimension Distribution (width) ---")
for k, v in dim_buckets.items():
    pct = v / sample_count * 100
    print(f"  {k:>10s}: {v:>6,} ({pct:.1f}%)")

if band_counts:
    print(f"\n--- Bands per galaxy ---")
    for bands, count in sorted(Counter(band_counts).items()):
        print(f"  {bands} bands: {count:,}")

print(f"\n  Errors: {errors}")
