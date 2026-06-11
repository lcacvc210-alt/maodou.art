'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname }),
    })
      .then(response => response.ok ? response.json() : null)
      .then(data => data && setVisits(data.totalVisits))
      .catch(() => undefined)
  }, [])

  return (
    <footer className="mt-auto border-t border-border px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Link href="/" className="logo text-2xl">maodou<span className="art">.art</span></Link>
          <p className="mt-3 max-w-md text-sm text-text-muted">记录财经、科技与创作中的真实判断。观点会变化，思考持续发生。</p>
        </div>
        <div className="text-left text-xs text-text-muted md:text-right">
          <div className="mb-2 flex gap-5 md:justify-end">
            <Link href="/blog">文章</Link><Link href="/tools">工具</Link><Link href="/admin/stats">统计</Link>
          </div>
          <p>© {new Date().getFullYear()} MAODOU.ART · {visits === null ? '—' : `${visits} 次访问`}</p>
        </div>
      </div>
    </footer>
  )
}
