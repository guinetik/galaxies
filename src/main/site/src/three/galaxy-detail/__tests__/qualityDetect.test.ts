import { expect, it } from 'vitest'
import { rtScale } from '../qualityDetect'

it('budgets effects from the actual render width, including a resized 4K canvas', () => {
  expect(rtScale('desktop', 1920)).toBe(1)
  expect(rtScale('desktop', 3840)).toBe(0.75)
  expect(rtScale('desktop', 5120)).toBe(0.5)
  expect(rtScale('mobile', 1920)).toBe(0.5)
})
