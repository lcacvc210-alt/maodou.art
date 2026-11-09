import { readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

const DAY = 86_400_000
const WEEK = 7 * DAY
const BEA_FEED = 'https://apps.bea.gov/API/signup/release_dates.json'
const ONS_FEED = 'https://api.beta.ons.gov.uk/v1/search/releases'
const BEA_SERIES = {
  'Gross Domestic Product': ['gdp', '美国 GDP', '经济增长'],
  'Personal Income and Outlays': ['pce', '美国个人收入与支出（含 PCE）', '通胀'],
  'U.S. International Trade in Goods and Services': ['trade', '美国商品与服务贸易', '贸易'],
  'Activities of U.S. Multinational Enterprises': ['multinational', '美国跨国企业活动统计', '企业统计'],
}
const ONS_SERIES = [
  [/^UK Labour Market:/i, '英国劳动力市场报告', '就业数据'],
  [/^Consumer price inflation, UK:/i, '英国消费者价格指数', '通胀'],
  [/^Producer price inflation, UK:/i, '英国生产者价格指数', '通胀'],
  [/^Retail sales, Great Britain:/i, '英国零售销售', '消费'],
  [/^GDP first quarterly estimate, UK:/i, '英国季度 GDP 初值', '经济增长'],
]

const dayKey = (date, timeZone = 'Asia/Shanghai') =>
  new Intl.DateTimeFormat('sv-SE', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
const isoDay = ms => new Date(ms).toISOString().slice(0, 10)
const dayMs = date => Date.parse(date + 'T00:00:00Z')

export function targetWeek(now) {
  const local = dayMs(dayKey(now))
  const weekday = new Date(local).getUTCDay()
  return isoDay(local + (weekday === 0 ? 1 : 1 - weekday) * DAY)
}

function instant(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?(?:Z|\+00:00)$/.test(value)) return null
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? null : date
}

const inWeek = (date, start) => {
  const day = dayMs(dayKey(date))
  return day >= dayMs(start) && day < dayMs(start) + WEEK
}

function event({ uid, title, tag, date, source_id, source_name, source_url, source_timezone }, checked) {
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: source_timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short',
  }).format(date)
  return {
    uid, start_at: date.toISOString(), category: 'finance', title,
    summary: `按 ${source_name} 的官方发布日历同步，实际安排以发布方为准。`,
    tag, level: 2, status: '官方已排期', publication_status: 'published',
    source_id, source_name, source_url, source_timezone,
    original_time: `${dayKey(date, source_timezone)} ${time}`,
    expectations: [], verified_on: checked, verification_method: 'official_calendar_sync',
  }
}

export function fromBea(data, start, checked) {
  if (!Object.keys(BEA_SERIES).every(title => Array.isArray(data?.[title]?.release_dates))) {
    throw new Error('Unexpected BEA calendar format')
  }
  return Object.entries(BEA_SERIES).flatMap(([series, [key, title, tag]]) =>
    [...new Set(data[series].release_dates)].flatMap(value => {
      const date = instant(value)
      if (!date || !inWeek(date, start)) return []
      return [event({
        uid: `bea-${key}-${dayKey(date)}`, title, tag, date,
        source_id: 'bea', source_name: '美国经济分析局 BEA',
        source_url: 'https://www.bea.gov/news/schedule/', source_timezone: 'America/New_York',
      }, checked)]
    }))
}

export function fromOns(data, start, checked) {
  if (!Number.isInteger(data?.breakdown?.total) ||
      (data.breakdown.total !== 0 && (!Array.isArray(data.releases) || data.releases.length < data.breakdown.total))) {
    throw new Error('Unexpected or truncated ONS calendar')
  }
  return (data.releases || []).flatMap(({ uri, description }) => {
    const record = description || {}
    const rule = ONS_SERIES.find(([pattern]) => pattern.test(record.title || ''))
    const date = instant(record.release_date)
    if (!rule || !date || !inWeek(date, start) || record.finalised !== true ||
        record.cancelled || record.postponed || /time series/i.test(record.title) ||
        typeof uri !== 'string' || !/^\/releases\/[a-z0-9-]+$/.test(uri)) return []
    return [event({
      uid: `ons-${uri.split('/').pop()}`, title: rule[1], tag: rule[2], date,
      source_id: 'ons', source_name: '英国国家统计局 ONS',
      source_url: `https://www.ons.gov.uk${uri}`, source_timezone: 'Europe/London',
    }, checked)]
  })
}

export function mergeWeek(data, candidates, start, checked) {
  if (!Array.isArray(data.events)) throw new Error('Invalid existing calendar')
  if (start < data.week_start) return data
  const manualUrls = new Set(data.events
    .filter(item => item.verification_method !== 'official_calendar_sync')
    .map(item => item.source_url))
  const events = new Map(data.events.map(item => [item.uid, item]))
  let changed = false
  for (const item of candidates) {
    if (manualUrls.has(item.source_url)) continue
    const prior = events.get(item.uid)
    if (prior && prior.verification_method !== 'official_calendar_sync') continue
    // Keep an unchanged event's original check date and any sourced estimates.
    const next = { ...item, expectations: prior?.start_at === item.start_at ? prior.expectations || [] : [] }
    if (prior && JSON.stringify(prior) === JSON.stringify({ ...next, verified_on: prior.verified_on })) continue
    events.set(item.uid, next)
    changed = true
  }
  const hasWeek = [...events.values()].some(item => item.publication_status === 'published' && inWeek(new Date(item.start_at), start))
  if (!hasWeek || (!changed && start === data.week_start)) return data
  return { ...data, week_start: start, checked_on: checked, events: [...events.values()] }
}

async function getJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000), headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`${new URL(url).hostname}: HTTP ${response.status}`)
  return response.json()
}

async function main() {
  const { values } = parseArgs({ options: { week: { type: 'string' }, write: { type: 'boolean' } } })
  const now = new Date()
  const start = values.week || targetWeek(now)
  if (!/^\d{4}-\d\d-\d\d$/.test(start) || !Number.isFinite(dayMs(start)) ||
      isoDay(dayMs(start)) !== start || new Date(dayMs(start)).getUTCDay() !== 1) {
    throw new Error('--week must be a Monday in YYYY-MM-DD format')
  }
  const end = isoDay(dayMs(start) + WEEK)
  const checked = dayKey(now)
  const file = resolve('public/weekly/data/events.json')
  const data = JSON.parse(await readFile(file, 'utf8'))
  // Include already-published releases so reruns during a week do not lose them.
  const onsUrl = type => `${ONS_FEED}?release-type=type-${type}&fromDate=${start}&toDate=${end}&limit=100`
  const [bea, upcoming, published] = await Promise.all([getJson(BEA_FEED), getJson(onsUrl('upcoming')), getJson(onsUrl('published'))])
  const candidates = [...fromBea(bea, start, checked), ...fromOns(upcoming, start, checked), ...fromOns(published, start, checked)]
  const next = mergeWeek(data, candidates, start, checked)
  console.log(JSON.stringify({
    week_start: start, candidates: candidates.map(({ title, start_at, source_url }) => ({ title, start_at, source_url })),
    changed: next !== data, write: !!values.write,
  }, null, 2))
  if (values.write && next !== data) {
    await writeFile(file + '.tmp', JSON.stringify(next, null, 2) + '\n')
    await rename(file + '.tmp', file)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1 })
}
