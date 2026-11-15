export function preferredWeek(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const get = type => parts.find(part => part.type === type).value
  const local = new Date(`${get('year')}-${get('month')}-${get('day')}T00:00:00Z`)
  const weekday = local.getUTCDay()
  const monday = local.getTime() + (weekday === 0 ? 1 : 1 - weekday) * 86400000
  return new Date(monday).toISOString().slice(0, 10)
}

export function preferredOffset(baseWeek, now = new Date()) {
  return (Date.parse(preferredWeek(now)) - Date.parse(baseWeek)) / 604800000
}
