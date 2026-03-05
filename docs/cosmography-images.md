# Cosmography Images

## TelescopeLens Assets

Telescope and observation images are loaded from `public/` and mapped in `CosmographyView.vue`.

### Format

All images are optimized as **WebP** (quality 85) for smaller size and faster loading.

### Conversion (ImageMagick)

```bash
# Convert JPG/PNG to WebP
magick input.jpg -quality 85 output.webp
magick input.png -quality 85 output.webp
```

### Mapping

| Method | Telescope | Observation |
|--------|-----------|-------------|
| ceph | hubble.webp | cepheid.webp |
| trgb | jwt.webp | trgb.webp |
| mas | alma.webp | masers.webp |
| sbf | gemni.webp | sbf.webp |
| snii | telescope.webp | supernova.webp |
| tf | arecibo.webp | tullyfisher.webp |
| fp | sdss.webp | sdss_experiment.webp |
| snia | ctio.webp | supernovaIa.webp |

### Adding New Images

1. Place source image in `public/`
2. Convert: `magick source.jpg -quality 85 name.webp`
3. Update `TELESCOPE_SRC` or `OBSERVATION_SRC` in `CosmographyView.vue`

