<template>
  <div class="local-group-plaque">
    <div class="local-group-plaque-mark" />
    <div class="local-group-plaque-copy">
      <p class="local-group-plaque-caption">{{ caption }}</p>
      <h1 class="local-group-plaque-title">{{ title }}</h1>
      <p class="local-group-plaque-subtitle">{{ subtitle }}</p>
      <p class="local-group-plaque-credit">{{ credit }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  caption: string
  credit: string
}>()
</script>

<style scoped>
.local-group-plaque {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  gap: 14px;
  width: min(420px, calc(100vw - 40px));
  padding: 18px 18px 18px 16px;
  border: 1px solid rgba(106, 206, 255, 0.22);
  background:
    linear-gradient(180deg, rgba(2, 12, 20, 0.92), rgba(1, 6, 13, 0.82)),
    radial-gradient(circle at top left, rgba(92, 201, 255, 0.12), transparent 55%);
  box-shadow:
    0 14px 48px rgba(0, 0, 0, 0.36),
    inset 0 0 0 1px rgba(184, 235, 255, 0.06);
  backdrop-filter: blur(14px);
}

.local-group-plaque-mark {
  margin-top: 5px;
  min-height: 84px;
  background:
    linear-gradient(180deg, rgba(143, 233, 255, 1), rgba(25, 123, 187, 0.2)),
    linear-gradient(90deg, rgba(143, 233, 255, 0.3), rgba(143, 233, 255, 0));
  box-shadow: 0 0 24px rgba(72, 190, 255, 0.35);
}

.local-group-plaque-caption,
.local-group-plaque-credit {
  margin: 0;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(167, 220, 241, 0.66);
}

.local-group-plaque-title {
  margin: 4px 0 6px;
  font-family: "Orbitron", "Trebuchet MS", sans-serif;
  font-size: clamp(1.7rem, 2vw, 2.4rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #56c7ff;
  text-shadow: 0 0 18px rgba(86, 199, 255, 0.22);
}

.local-group-plaque-subtitle {
  margin: 0 0 10px;
  max-width: 34ch;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(214, 241, 252, 0.82);
}

.local-group-plaque-credit {
  color: rgba(145, 198, 219, 0.56);
}
</style>
