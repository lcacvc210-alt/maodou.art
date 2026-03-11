'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, Sun, Menu, X, Sparkles } from 'lucide-react'

export default function Header() {
  const [isDark, setIsDark] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/60 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-neon-cyan/5' 
          : 'bg-transparent'
      }`}
    >
      {/* 顶部发光条 */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with glow */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-neon-cyan group-hover:animate-pulse" />
              <div className="absolute inset-0 blur-md bg-neon-cyan/50 group-hover:opacity-100 opacity-0 transition-opacity" />
            </div>
            <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
              毛豆·SPACE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/">首页</NavLink>
            <NavLink href="/blog">文章</NavLink>
            <NavLink href="/tools">工具</NavLink>
            <NavLink href="/about">关于</NavLink>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            {/* 日夜切换按钮 */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-card/50 border border-border/50 hover:border-neon-cyan/50 transition-all duration-300 group"
              aria-label="切换主题"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-400 group-hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-card/50 border border-border/50"
              aria-label="切换主题"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-text-secondary hover:text-neon-cyan transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 bg-card/30 backdrop-blur-xl rounded-2xl border border-border/50 p-4">
            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>首页</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMenuOpen(false)}>文章</MobileNavLink>
            <MobileNavLink href="/tools" onClick={() => setIsMenuOpen(false)}>工具</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>关于</MobileNavLink>
          </div>
        )}
      </nav>
    </header>
  )
}

// Desktop Nav Link
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-4 py-2 rounded-xl text-text-secondary hover:text-neon-cyan hover:bg-neon-cyan/5 transition-all duration-300 text-sm font-medium"
    >
      {children}
    </Link>
  )
}

// Mobile Nav Link
function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="block px-4 py-3 rounded-xl text-text-secondary hover:text-neon-cyan hover:bg-neon-cyan/5 transition-all duration-300"
    >
      {children}
    </Link>
  )
}
