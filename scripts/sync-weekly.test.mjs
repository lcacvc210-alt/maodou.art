import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fromBea, fromOns, mergeWeek, targetWeek } from './sync-weekly.mjs'

const start = '2026-11-16'
const checked = '2026-11-15'
const onsRelease = {
  uri: '/releases/consumerpriceinflationukoctober2026',
  description: {
    title: 'Consumer price inflation, UK: October 2026',
    release_date: '2026-11-18T07:00:00.000Z',
    finalised: true, cancelled: false, postponed: false,
  },
}

test('Sunday prepares the next week in Beijing, Monday keeps it', () => {
  for (const at of ['2026-11-15T15:59:00Z', '2026-11-15T16:00:00Z']) {
    assert.equal(targetWeek(new Date(at)), start)
  }
})

test('ONS keeps confirmed bulletin, not provisional, cancelled, duplicate time series or next week', () => {
  const releases = [onsRelease,
    { ...onsRelease, description: { ...onsRelease.description, cancelled: true } },
    { ...onsRelease, description: { ...onsRelease.description, finalised: false } },
    { ...onsRelease, description: { ...onsRelease.description, title: onsRelease.description.title + ' time series' } },
    { ...onsRelease, description: { ...onsRelease.description, release_date: '2026-11-22T16:00:00Z' } },
  ]
  const result = fromOns({ breakdown: { total: releases.length }, releases }, start, checked)
  assert.equal(result.length, 1)
  assert.equal(result[0].start_at, '2026-11-18T07:00:00.000Z')
  assert.deepEqual(result[0].expectations, [])
  assert.throws(() => fromOns({ breakdown: { total: 5 }, releases: [] }, start, checked))
})

test('BEA checks feed shape and deduplicates times', () => {
  const dates = ['2026-11-20T13:30:00+00:00', '2026-11-20T13:30:00+00:00']
  const data = {
    'Gross Domestic Product': { release_dates: [] },
    'Personal Income and Outlays': { release_dates: [] },
    'U.S. International Trade in Goods and Services': { release_dates: [] },
    'Activities of U.S. Multinational Enterprises': { release_dates: dates },
  }
  assert.equal(fromBea(data, start, checked).length, 1)
  assert.throws(() => fromBea({}, start, checked))
})

test('merge preserves history, does not advance an empty week and is idempotent', () => {
  const old = { uid: 'manual', start_at: '2026-11-09T01:30:00Z', publication_status: 'published', expectations: ['snapshot'] }
  const data = { week_start: '2026-11-09', checked_on: '2026-11-08', events: [old] }
  const candidates = fromOns({ breakdown: { total: 1 }, releases: [onsRelease] }, start, checked)
  assert.equal(mergeWeek(data, [], start, checked), data)
  const merged = mergeWeek(data, candidates, start, checked)
  assert.equal(merged.week_start, start)
  assert.deepEqual(merged.events[0], old)
  assert.equal(mergeWeek(merged, candidates.map(item => ({ ...item, verified_on: start })), start, start), merged)
})

test('a manual event does not block future releases sharing the same calendar URL', () => {
  const candidate = fromOns({ breakdown: { total: 1 }, releases: [onsRelease] }, start, checked)[0]
  const old = { ...candidate, uid: 'manual', start_at: '2026-10-18T07:00:00Z', verification_method: 'manual_official_page' }
  const data = { week_start: '2026-11-09', events: [old] }
  const merged = mergeWeek(data, [candidate], start, checked)
  assert.equal(merged.events.length, 2)
})
