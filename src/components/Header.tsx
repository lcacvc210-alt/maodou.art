'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Moon, Sun, X } from 'lucide-react'

const links = [
  { href: '/blog', label: '深度文章' },
  { href: '/weekly/', label: '毛豆周历' },
  { href: '/tools', label: '创作工具' },
  { href: '/about', label: '关于毛豆' },
]

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const navigation = (mobile: boolean) => links.map(({ href, label }) => {
    const current = pathname === href || pathname.startsWith(href + '/')
    const className = `rounded-full px-4 py-2 text-sm font-medium ${mobile ? 'block' : ''} ${current ? 'bg-neon-cyan/12 text-neon-cyan' : 'text-text-secondary hover:bg-card hover:text-neon-cyan'}`
    return href === '/weekly/'
      ? <a key={href} href={href} className={className}>{label}</a>
      : <Link key={href} href={href} className={className} aria-current={current ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}>{label}</Link>
  })

  return (
    <header className="site-nav fixed inset-x-3 top-3 z-50 mx-auto max-w-7xl sm:inset-x-6">
      <nav aria-label="主导航" className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="logo text-2xl">MAODOU<span className="art">.art</span></Link>
        <div className="hidden items-center gap-1 md:flex">{navigation(false)}</div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="grid size-10 place-items-center rounded-full border border-border/50 bg-card text-neon-cyan" aria-label="切换主题"><Moon className="h-4 w-4 dark:hidden" /><Sun className="hidden h-4 w-4 dark:block" /></button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="grid size-10 place-items-center rounded-full border border-border/50 bg-card md:hidden" aria-expanded={isMenuOpen} aria-controls="mobile-nav" aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}>{isMenuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </nav>
      {isMenuOpen && <div id="mobile-nav" className="space-y-1 border-t border-border/50 p-3 md:hidden">{navigation(true)}</div>}
    </header>
  )
}
