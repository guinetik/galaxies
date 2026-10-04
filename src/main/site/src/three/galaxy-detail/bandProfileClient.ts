import type { BandFeatureProfile } from './bandProfile'

/**
 * Decode and analyze NSA bands off the UI thread. Only the compact profile
 * crosses back; the full-resolution images and scratch arrays stay in the worker.
 */
export function loadGalaxyBandProfile(pgc: number, signal?: AbortSignal): Promise<BandFeatureProfile | null> {
  if (signal?.aborted || typeof Worker === 'undefined') return Promise.resolve(null)

  return new Promise((resolve) => {
    let worker: Worker
    try {
      worker = new Worker(new URL('./bandProfile.worker.ts', import.meta.url), { type: 'module' })
    } catch {
      resolve(null)
      return
    }

    let settled = false
    const finish = (profile: BandFeatureProfile | null) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      signal?.removeEventListener('abort', abort)
      worker.onmessage = null
      worker.onerror = null
      worker.onmessageerror = null
      worker.terminate()
      resolve(profile)
    }
    const abort = () => finish(null)
    const timeout = setTimeout(abort, 60_000)
    signal?.addEventListener('abort', abort, { once: true })
    worker.onmessage = (event: MessageEvent<{ profile: BandFeatureProfile | null }>) => finish(event.data.profile)
    worker.onerror = (event) => {
      event.preventDefault()
      finish(null)
    }
    worker.onmessageerror = abort
    try {
      worker.postMessage({ pgc })
    } catch {
      finish(null)
    }
  })
}
