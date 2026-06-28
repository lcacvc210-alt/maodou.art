'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'

const links = [
  { href: '/blog', label: '深度文章' },
  { href: '/tools', label: '创作工具' },
  { href: '/about', label: '关于毛豆' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border">
      <div className="border-b border-border/70 bg-card/50">
        <div className="mx-auto flex h-7 max-w-7xl items-center justify-between px-5 font-mono text-[10px] text-text-muted sm:px-8">
          <span>MAODOU RESEARCH · PERSONAL EDITION</span><span>财经 / 科技 / 创作</span>
        </div>
      </div>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="logo text-[1.7rem]">MAODOU<span className="art">.art</span></Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(link => <Link key={link.href} href={link.href} className="text-sm font-medium text-text-secondary">{link.label}</Link>)}
          <div className="ml-2 flex items-center gap-4 border-l border-border pl-6">
            <Search className="h-4 w-4 text-text-muted" />
            <button onClick={toggleTheme} className="text-text-secondary" aria-label="切换主题"><Moon className="h-4 w-4 dark:hidden" /><Sun className="hidden h-4 w-4 dark:block" /></button>
          </div>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden" aria-label="打开菜单">{isMenuOpen ? <X /> : <Menu />}</button>
      </nav>
      {isMenuOpen && <div className="border-t border-border bg-background px-5 py-3 md:hidden">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="block border-b border-border py-3 text-sm last:border-0">{link.label}</Link>)}</div>}
    </header>
  )
}
