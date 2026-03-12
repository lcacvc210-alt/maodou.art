'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, Sun, Menu, X } from 'lucide-react'

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

  useEffect(() => {
    // 从 localStorage 读取主题
    const saved = localStorage.getItem('theme')
    if (saved) {
      setIsDark(saved === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'border-b border-border/50' 
          : ''
      }`}
    >
      {/* 顶部发光条（仅深色模式） */}
      <div className="hidden dark:block h-[1px] w-full bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - MAODOU.art */}
          <Link href="/" className="logo text-2xl">
            {isDark ? (
              <span className="logo-dark">
                MAODOU<span className="art">.art</span>
              </span>
            ) : (
              <span className="logo-light">
                MAODOU<span className="art">.art</span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/" isDark={isDark}>首页</NavLink>
            <NavLink href="/blog" isDark={isDark}>文章</NavLink>
            <NavLink href="/tools" isDark={isDark}>工具</NavLink>
            <NavLink href="/about" isDark={isDark}>关于</NavLink>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            {/* 日夜切换按钮 */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all duration-300 group ${
                isDark 
                  ? 'bg-card/50 border-border/50 hover:border-neon-cyan/50' 
                  : 'bg-white border-gray-200 hover:border-blue-400 shadow-sm'
              }`}
              aria-label="切换主题"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 group-hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border ${
                isDark 
                  ? 'bg-card/50 border-border/50' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
              aria-label="切换主题"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition-colors ${
                isDark 
                  ? 'text-text-secondary hover:text-neon-cyan' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 space-y-2 backdrop-blur-xl rounded-2xl border p-4 ${
            isDark 
              ? 'bg-card/30 border-border/50' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)} isDark={isDark}>首页</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMenuOpen(false)} isDark={isDark}>文章</MobileNavLink>
            <MobileNavLink href="/tools" onClick={() => setIsMenuOpen(false)} isDark={isDark}>工具</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)} isDark={isDark}>关于</MobileNavLink>
          </div>
        )}
      </nav>
    </header>
  )
}

// Desktop Nav Link
function NavLink({ href, children, isDark }: { href: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <Link 
      href={href}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        isDark
          ? 'text-text-secondary hover:text-neon-cyan hover:bg-neon-cyan/5'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </Link>
  )
}

// Mobile Nav Link
function MobileNavLink({ href, children, onClick, isDark }: { href: string; children: React.ReactNode; onClick: () => void; isDark: boolean }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
        isDark
          ? 'text-text-secondary hover:text-neon-cyan hover:bg-neon-cyan/5'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </Link>
  )
}
