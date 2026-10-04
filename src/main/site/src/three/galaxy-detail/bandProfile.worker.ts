import { loadGalaxyBandAnalysis } from './bandAssetLoader'

// Keep the existing band normalization and morphology feature math unchanged.
// Terminating this per-scene worker also cancels outstanding fetches and releases
// its image buffers when the user navigates away.
self.onmessage = async (event: MessageEvent<{ pgc: number }>) => {
  try {
    const analysis = await loadGalaxyBandAnalysis(event.data.pgc)
    self.postMessage({ profile: analysis?.profile ?? null })
  } catch {
    self.postMessage({ profile: null })
  }
}
