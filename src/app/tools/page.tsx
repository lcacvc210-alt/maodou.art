'use client'

import Link from 'next/link'
import { ArrowLeft, Palette, Image, Code, Sparkles } from 'lucide-react'

// 工具列表
const tools = [
  {
    icon: '🎨',
    title: '配色灵感库',
    description: '56 套精选配色方案，支持实时预览、导出分享',
    href: '/tools/color-palette',
    features: ['56 套配色', '实时预览', '一键导出', '多平台分享'],
    gradient: 'from-neon-cyan via-neon-purple to-neon-pink',
    status: 'online',
  },
  {
    icon: '🕹️',
    title: '像素图转换器',
    description: '上传图片转 8bit 像素风格，支持自定义像素大小',
    href: '/tools/pixel-art',
    features: ['8bit 风格', '自定义像素', '批量处理', '透明背景'],
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    status: 'coming-soon',
  },
  {
    icon: '📐',
    title: '网格生成器',
    description: '生成各种类型的网格图案，支持 SVG/PNG 导出',
    href: '/tools/grid-generator',
    features: ['多种网格', '自定义间距', '矢量导出'],
    gradient: 'from-orange-400 via-red-500 to-pink-500',
    status: 'planning',
  },
  {
    icon: '✨',
    title: '渐变生成器',
    description: '创建线性/径向渐变，生成 CSS 代码',
    href: '/tools/gradient-generator',
    features: ['线性/径向', '多色渐变', 'CSS 代码'],
    gradient: 'from-purple-400 via-pink-500 to-red-500',
    status: 'planning',
  },
]

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="cyber-grid" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
      </div>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            返回首页
          </Link>

          {/* 页面标题 */}
          <div className="mb-12">
            <span className="tag text-sm mb-4 inline-block">
              🛠️ TOOLS
            </span>
            <h1 className="text-5xl font-bold gradient-text mb-4">
              创意工具集
            </h1>
            <p className="text-text-secondary text-lg">
              为创作者打造的实用工具，让设计更高效
            </p>
          </div>

          {/* 工具卡片列表 */}
          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>

          {/* 统计信息 */}
          <div className="mt-16 grid grid-cols-3 gap-6 text-center">
            <div className="card glow-border rounded-xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">
                {tools.filter(t => t.status === 'online').length}
              </div>
              <div className="text-text-muted text-sm">
                已上线工具
              </div>
            </div>
            <div className="card glow-border rounded-xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">
                {tools.filter(t => t.status === 'coming-soon').length}
              </div>
              <div className="text-text-muted text-sm">
                开发中
              </div>
            </div>
            <div className="card glow-border rounded-xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">
                {tools.filter(t => t.status === 'planning').length}
              </div>
              <div className="text-text-muted text-sm">
                规划中
              </div>
            </div>
          </div>

          {/* 建议工具 */}
          <div className="mt-12 card glow-border rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-neon-cyan flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  想要什么工具？
                </h3>
                <p className="text-text-secondary mb-4">
                  如果你有想要的创意工具，欢迎告诉我！我会尽快开发。
                </p>
                <a
                  href="mailto:harry@maodou.art"
                  className="text-neon-cyan hover:underline inline-flex items-center gap-2"
                >
                  提出建议 →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50 mt-20">
          <div className="max-w-6xl mx-auto text-center text-text-muted">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
            <p className="text-sm mt-2">
              Built with 💜 for creators
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

// 工具卡片组件
function ToolCard({ tool }: { tool: typeof tools[0] }) {
  const isOnline = tool.status === 'online'
  const isComingSoon = tool.status === 'coming-soon'
  const isPlanning = tool.status === 'planning'

  return (
    <div className={`card glow-border rounded-2xl p-8 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden ${
      !isOnline ? 'opacity-75' : ''
    }`}>
      {/* 顶部渐变条 */}
      <div className={`h-2 w-full bg-gradient-to-r ${tool.gradient} mb-6 rounded-full opacity-70 group-hover:opacity-100 transition-opacity`} />

      {/* 状态标签 */}
      <div className="absolute top-4 right-4">
        {isOnline && (
          <span className="tag bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan text-xs">
            ✓ 已上线
          </span>
        )}
        {isComingSoon && (
          <span className="tag bg-yellow-500/20 border-yellow-500/50 text-yellow-500 text-xs">
            ⏳ 开发中
          </span>
        )}
        {isPlanning && (
          <span className="tag bg-gray-500/20 border-gray-500/50 text-gray-500 text-xs">
            📋 规划中
          </span>
        )}
      </div>

      {/* 图标和标题 */}
      <div className="flex items-start gap-4 mb-6">
        <div className="text-5xl">{tool.icon}</div>
        <div className="flex-1">
          {isOnline ? (
            <Link href={tool.href} className="block">
              <h2 className="text-2xl font-bold text-text-primary group-hover:text-neon-cyan transition-colors">
                {tool.title}
              </h2>
            </Link>
          ) : (
            <h2 className="text-2xl font-bold text-text-primary text-text-muted">
              {tool.title}
            </h2>
          )}
          <p className="text-text-secondary mt-2">
            {tool.description}
          </p>
        </div>
      </div>

      {/* 功能特性 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tool.features.map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 rounded-full bg-card border border-border text-text-muted text-xs"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        {isOnline ? (
          <Link
            href={tool.href}
            className="flex-1 btn-gradient px-6 py-3 rounded-xl font-semibold text-center transition-all duration-300"
          >
            立即使用
          </Link>
        ) : isComingSoon ? (
          <button
            disabled
            className="flex-1 px-6 py-3 rounded-xl border border-border text-text-muted font-semibold cursor-not-allowed"
          >
            即将上线
          </button>
        ) : (
          <button
            disabled
            className="flex-1 px-6 py-3 rounded-xl border border-border text-text-muted font-semibold cursor-not-allowed"
          >
            规划中
          </button>
        )}
      </div>
    </div>
  )
}
