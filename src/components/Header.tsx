'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Moon, Sun, X } from 'lucide-react'

const links = [
  { href: '/', label: '首页', index: '01' },
  { href: '/blog', label: '文章', index: '02' },
  { href: '/tools', label: '工具', index: '03' },
  { href: '/about', label: '关于', index: '04' },
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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="logo text-2xl">
          maodou<span className="art">.art</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="group flex items-baseline gap-1.5 text-sm text-text-secondary">
              <span className="font-mono text-[9px] text-text-muted group-hover:text-neon-cyan">{link.index}</span>
              {link.label}
            </Link>
          ))}
          <button onClick={toggleTheme} className="border-l border-border pl-6 text-text-secondary hover:text-neon-cyan" aria-label="切换主题">
            <Moon className="h-4 w-4 dark:hidden" /><Sun className="hidden h-4 w-4 dark:block" />
          </button>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleTheme} className="text-text-secondary" aria-label="切换主题">
            <Moon className="h-5 w-5 dark:hidden" /><Sun className="hidden h-5 w-5 dark:block" />
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-primary" aria-label="打开菜单">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="flex justify-between border-b border-border py-3 text-text-secondary last:border-0">
              {link.label}<span className="font-mono text-xs text-text-muted">{link.index}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
