'use client'

import { useState, useEffect } from 'react'
import { Post } from '@/lib/posts'
import Link from 'next/link'

interface HomePageContentProps {
  featuredPosts: Post[]
}

export default function HomePageContent({ featuredPosts }: HomePageContentProps) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    setIsDark(saved !== 'light')
  }, [])

  return (
    <>
      {/* 背景效果层（仅深色模式） */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="cyber-grid" />
          <div className="glow-orb glow-orb-1" />
          <div className="glow-orb glow-orb-2" />
          <div className="glow-orb glow-orb-3" />
        </div>
      )}

      {/* 内容层 */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:py-32 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-6 sm:mb-8">
              <span className="logo text-3xl sm:text-5xl md:text-6xl">
                {isDark ? (
                  <span className="logo-dark">MAODOU<span className="art">.art</span></span>
                ) : (
                  <span className="logo-light">MAODOU<span className="art">.art</span></span>
                )}
              </span>
            </div>
            
            {/* 主标题 */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight px-2">
              毛豆的思考空间
            </h1>
            
            <p className="text-base sm:text-xl text-text-secondary mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              探索<span className={isDark ? "text-neon-cyan" : "text-blue-600"}>科技前沿</span> · 
              分享<span className={isDark ? "text-neon-purple" : "text-purple-600"}>财经思考</span> · 
              记录<span className={isDark ? "text-neon-pink" : "text-pink-600"}>创业旅程</span>
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4">
              <Link
                href="/blog"
                className="btn-gradient px-8 py-3 sm:px-10 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
              >
                开始探索 →
              </Link>
              <Link
                href="/about"
                className={`px-8 py-3 sm:px-10 sm:py-4 rounded-xl font-semibold border transition-all duration-300 backdrop-blur-sm text-base sm:text-lg w-full sm:w-auto ${
                  isDark 
                    ? 'border-neon-cyan/50 text-white hover:bg-neon-cyan/10 hover:border-neon-cyan' 
                    : 'border-gray-300 text-gray-700 hover:border-blue-400 bg-white hover:bg-blue-50'
                }`}
              >
                了解更多
              </Link>
            </div>

            {/* 数据展示 */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              <StatItem number="∞" label="可能性" isDark={isDark} />
              <StatItem number="24/7" label="持续更新" isDark={isDark} />
              <StatItem number="100%" label="用心创作" isDark={isDark} />
            </div>
          </div>
        </section>

        {/* 分割线 */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="divider-glow" />
        </div>

        {/* Featured Posts */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold text-text-primary">
                <span className="gradient-text">最新文章</span>
              </h2>
              <Link 
                href="/blog"
                className={`hover:underline ${isDark ? 'text-neon-cyan' : 'text-blue-600'}`}
              >
                查看全部 →
              </Link>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className={`card ${isDark ? 'glow-border' : ''} rounded-2xl p-8 group hover:scale-[1.01] transition-all duration-300`}>
                    {/* 顶部光条（仅深色模式） */}
                    {isDark && (
                      <div className="h-1 w-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink mb-6 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    <h2 className={`text-2xl font-bold mb-3 group-hover:text-neon-cyan transition-colors ${
                      isDark ? 'text-text-primary' : 'text-gray-900'
                    }`}>
                      {post.title}
                    </h2>
                    <p className="text-text-secondary mb-6 leading-relaxed">
                      {post.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <time className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-neon-cyan' : 'bg-blue-600'}`} />
                          {post.date}
                        </time>
                        <span>·</span>
                        <span>{post.summary?.length || 500} 字</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="tag text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent via-card/20 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">
              <span className="gradient-text">探索领域</span>
            </h2>
            <p className="text-text-secondary text-center mb-16 max-w-2xl mx-auto">
              在这里，你会发现多元视角下的深度思考
            </p>
            
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon="💰"
                title="财经思考"
                description="市场观察、投资心得、理财经验分享，用数据说话"
                gradient="from-neon-cyan to-neon-blue"
                isDark={isDark}
              />
              <FeatureCard
                icon="🤖"
                title="科技前沿"
                description="AI 新工具、新技术解读、数字化转型趋势分析"
                gradient="from-neon-purple to-neon-pink"
                isDark={isDark}
              />
              <FeatureCard
                icon="🎨"
                title="创意工具"
                description="配色灵感、像素艺术、实用工具分享与教程"
                gradient="from-green-400 to-blue-500"
                isDark={isDark}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50 mt-20">
          <div className="max-w-6xl mx-auto text-center text-text-muted text-sm">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
            <p className="mt-2">Built with 💜 for creators</p>
          </div>
        </footer>
      </div>
    </>
  )
}

// 统计项组件
function StatItem({ number, label, isDark }: { number: string; label: string; isDark: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-3xl sm:text-4xl font-bold mb-2 ${
        isDark ? 'gradient-text' : 'text-gray-900'
      }`}>
        {number}
      </div>
      <div className="text-text-muted text-sm">{label}</div>
    </div>
  )
}

// 特性卡片组件
function FeatureCard({ icon, title, description, gradient, isDark }: {
  icon: string
  title: string
  description: string
  gradient: string
  isDark: boolean
}) {
  return (
    <div className={`card ${isDark ? 'glow-border' : ''} rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300`}>
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className={`text-2xl font-bold mb-4 ${
        isDark ? 'text-text-primary' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      <p className="text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  )
}
