import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { loadGalaxyBandProfile } from '../bandProfileClient'
import type { BandFeatureProfile } from '../bandProfile'

class TestWorker {
  static instances: TestWorker[] = []
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  onmessageerror: (() => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() { TestWorker.instances.push(this) }
}

beforeEach(() => {
  TestWorker.instances = []
  vi.stubGlobal('Worker', TestWorker)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

it('returns the compact profile and releases the analysis worker', async () => {
  const pending = loadGalaxyBandProfile(2429)
  const worker = TestWorker.instances[0]
  expect(worker.postMessage).toHaveBeenCalledWith({ pgc: 2429 })
  const profile = { concentration: 0.42, radialProfile: [] } as unknown as BandFeatureProfile
  worker.onmessage!({ data: { profile } } as MessageEvent)
  await expect(pending).resolves.toEqual(profile)
  expect(worker.terminate).toHaveBeenCalledOnce()
})

it('terminates work when the galaxy scene is disposed, ignoring late results', async () => {
  const controller = new AbortController()
  const pending = loadGalaxyBandProfile(2429, controller.signal)
  const worker = TestWorker.instances[0]
  const lateMessage = worker.onmessage!
  controller.abort()
  lateMessage({ data: { profile: { concentration: 1 } } } as MessageEvent)
  await expect(pending).resolves.toBeNull()
  expect(worker.terminate).toHaveBeenCalledOnce()
})

it('does not start canceled work or fall back to blocking analysis without workers', async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(loadGalaxyBandProfile(2429, controller.signal)).resolves.toBeNull()
  expect(TestWorker.instances).toHaveLength(0)
  vi.stubGlobal('Worker', undefined)
  await expect(loadGalaxyBandProfile(2429)).resolves.toBeNull()
})

it('keeps the procedural galaxy if the worker fails', async () => {
  const pending = loadGalaxyBandProfile(2429)
  TestWorker.instances[0].onerror!({ preventDefault: vi.fn() } as unknown as ErrorEvent)
  await expect(pending).resolves.toBeNull()
  expect(TestWorker.instances[0].terminate).toHaveBeenCalledOnce()
})

it('cleans up a stalled worker instead of retaining the scene indefinitely', async () => {
  vi.useFakeTimers()
  const pending = loadGalaxyBandProfile(2429)
  await vi.advanceTimersByTimeAsync(60_000)
  await expect(pending).resolves.toBeNull()
  expect(TestWorker.instances[0].terminate).toHaveBeenCalledOnce()
})
