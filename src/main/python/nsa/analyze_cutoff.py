"""Check how many galaxies and how much data we save cutting <= 408px."""

from pathlib import Path
from PIL import Image

base = Path(r"D:\Developer\galaxies\src\main\images")
folders = [f for f in base.iterdir() if f.is_dir()]

keep_count = 0
cut_count = 0
keep_size = 0
cut_size = 0

for i, folder in enumerate(folders):
    pngs = list(folder.glob("*.png"))
    if not pngs:
        cut_count += 1
        continue
    img = Image.open(pngs[0])
    w, h = img.size
    img.close()
    fsize = sum(f.stat().st_size for f in folder.iterdir() if f.is_file())
    if w <= 408 or h <= 408:
        cut_count += 1
        cut_size += fsize
    else:
        keep_count += 1
        keep_size += fsize
    if (i + 1) % 10000 == 0:
        print(f"  scanned {i+1:,}/{len(folders):,}...")

total = cut_size + keep_size
print(f"\nCut  (<=408px): {cut_count:,} galaxies, {cut_size/(1024**3):.1f} GB")
print(f"Keep (>408px):  {keep_count:,} galaxies, {keep_size/(1024**3):.1f} GB")
print(f"Savings: {cut_size/(1024**3):.1f} GB ({cut_count/len(folders)*100:.0f}% of galaxies, {cut_size/total*100:.0f}% of storage)")
