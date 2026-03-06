<template>
  <div class="im">
    <div class="im-panels">
      <div class="im-panel">
        <div class="im-panel-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L17.18 19 12 15.27 6.82 19l2.09-6.26L3.82 9l6.09-.74z" />
          </svg>
          <span>{{ spaceLabel }}</span>
        </div>
        <div class="im-panel-content">
          <slot name="space" />
        </div>
      </div>
      <div class="im-panel">
        <div class="im-panel-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
          <span>{{ instrumentLabel }}</span>
        </div>
        <div class="im-panel-content">
          <slot name="instrument" />
        </div>
      </div>
      <div class="im-panel">
        <div class="im-panel-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>{{ dataLabel }}</span>
        </div>
        <div class="im-panel-content">
          <slot name="data" />
        </div>
      </div>
    </div>
    <div v-if="$slots.controls" class="im-controls">
      <slot name="controls" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * IntuitionMachine — three-panel layout for interactive astronomy visualizations.
 * Panels: Space (the phenomenon), Instrument (how we measure), Data (the reading).
 */
withDefaults(
  defineProps<{
    spaceLabel?: string
    instrumentLabel?: string
    dataLabel?: string
  }>(),
  {
    spaceLabel: 'Space',
    instrumentLabel: 'Instrument',
    dataLabel: 'Data',
  },
)
</script>

<style scoped>
.im {
  width: 100%;
  margin-top: 1rem;
}

.im-panels {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .im-panels {
    grid-template-columns: repeat(3, 1fr);
  }
}

.im-panel {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.im-panel-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.625rem;
  font-family: ui-monospace, monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(34, 211, 238, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  user-select: none;
}

.im-panel-content {
  flex: 1;
  min-height: 140px;
}

.im-panel-content :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.im-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}
</style>
