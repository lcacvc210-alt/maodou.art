'use client'

import { useEffect, useState } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 检查 localStorage 或系统偏好
    const saved = localStorage.getItem('theme')
    if (saved) {
      setIsDark(saved === 'dark')
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // 避免服务端渲染不匹配
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <style jsx global>{`
        html {
          color-scheme: ${isDark ? 'dark' : 'light'};
        }
      `}</style>
    </>
  )
}
