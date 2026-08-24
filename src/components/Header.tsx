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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#f3f1e8]/10 bg-[#080907]/88 text-[#f3f1e8] backdrop-blur-xl">
      <div className="border-b border-[#f3f1e8]/10 bg-[#11130f]/40">
        <div className="mx-auto flex h-7 max-w-7xl items-center justify-between px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#858274] sm:px-8">
          <span>MAODOU.ART · PERSONAL LOG</span><span>FINANCE / AI / SELF-MEDIA</span>
        </div>
      </div>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="text-[1.7rem] font-bold tracking-[-0.06em] text-[#f3f1e8]">MAODOU<span className="font-medium text-[#b7ff3c]">.art</span></Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(link => <Link key={link.href} href={link.href} className="text-sm font-medium text-[#c8c4b5] hover:text-[#b7ff3c]">{link.label}</Link>)}
          <div className="ml-2 flex items-center gap-4 border-l border-[#f3f1e8]/10 pl-6">
            <Search className="h-4 w-4 text-[#858274]" />
            <button onClick={toggleTheme} className="text-[#c8c4b5] hover:text-[#b7ff3c]" aria-label="切换主题"><Moon className="h-4 w-4 dark:hidden" /><Sun className="hidden h-4 w-4 dark:block" /></button>
          </div>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#f3f1e8] md:hidden" aria-label="打开菜单">{isMenuOpen ? <X /> : <Menu />}</button>
      </nav>
      {isMenuOpen && <div className="border-t border-[#f3f1e8]/10 bg-[#080907] px-5 py-3 md:hidden">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="block border-b border-[#f3f1e8]/10 py-3 text-sm text-[#c8c4b5] last:border-0">{link.label}</Link>)}</div>}
    </header>
  )
}
