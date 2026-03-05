<template>
  <div v-if="hasExperiment" class="method-experiment">
    <button
      class="experiment-toggle"
      :class="{ expanded: isExpanded }"
      @click="isExpanded = !isExpanded"
    >
      <span>{{ t('pages.cosmography.experimentTitle') }}</span>
      <span class="toggle-icon">{{ isExpanded ? '▼' : '▶' }}</span>
    </button>
    <Transition name="experiment-slide">
      <div v-show="isExpanded" class="experiment-content">
        <component :is="experimentComponent" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * MethodExperiment
 * Wrapper that picks and renders the appropriate experiment by method key.
 * Collapsible accordion-style section.
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CepheidExperiment from './experiments/CepheidExperiment.vue'
import SBFExperiment from './experiments/SBFExperiment.vue'
import TullyFisherExperiment from './experiments/TullyFisherExperiment.vue'
import SNIaExperiment from './experiments/SNIaExperiment.vue'

const props = defineProps<{
  methodKey: string
}>()

const { t } = useI18n()

const isExpanded = ref(false)

const EXPERIMENT_MAP: Record<string, object> = {
  ceph: CepheidExperiment,
  sbf: SBFExperiment,
  tf: TullyFisherExperiment,
  snia: SNIaExperiment,
}

const experimentComponent = computed(() => EXPERIMENT_MAP[props.methodKey] ?? null)

const hasExperiment = computed(() => !!experimentComponent.value)
</script>

<style scoped>
.method-experiment {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.experiment-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: #22d3ee;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s;
}

.experiment-toggle:hover {
  color: #67e8f9;
}

.toggle-icon {
  font-size: 0.7rem;
  opacity: 0.8;
}

.experiment-content {
  padding: 1rem 0;
  width: 100%;
}

.experiment-slide-enter-active,
.experiment-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.experiment-slide-enter-from,
.experiment-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
