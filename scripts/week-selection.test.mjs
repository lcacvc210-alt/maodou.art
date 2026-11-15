import { test } from 'node:test'
import assert from 'node:assert/strict'
import { preferredWeek, preferredOffset } from '../public/weekly/week-selection.mjs'

test('Beijing Saturday to Sunday switches to next week without waiting for a job', () => {
  assert.equal(preferredWeek(new Date('2026-11-14T15:59:59Z')), '2026-11-09')
  assert.equal(preferredWeek(new Date('2026-11-14T16:00:00Z')), '2026-11-16')
  assert.equal(preferredOffset('2026-11-09', new Date('2026-11-15T03:00:00Z')), 1)
})

test('Monday keeps the same week; stale JSON cannot control the displayed week', () => {
  assert.equal(preferredWeek(new Date('2026-11-15T16:00:00Z')), '2026-11-16')
  assert.equal(preferredOffset('2026-11-02', new Date('2026-11-16T03:00:00Z')), 2)
})
