'use client'

import Link from 'next/link'
import { ArrowLeft, Code, Image, Upload, Sparkles } from 'lucide-react'

export default function PixelArtPage() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="cyber-grid" />
        <div className="glow-orb glow-orb-1" />
      </div>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            返回工具列表
          </Link>

          {/* 页面标题 */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-6">🕹️</div>
            <h1 className="text-5xl font-bold gradient-text mb-4">
              像素图转换器
            </h1>
            <p className="text-text-secondary text-lg">
              上传图片，一键转换为 8bit 像素艺术风格
            </p>
          </div>

          {/* 即将上线提示 */}
          <div className="card glow-border rounded-2xl p-12 text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 mb-8">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">开发中 · 即将上线</span>
            </div>

            {/* 功能预览 */}
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="card bg-card/50 rounded-xl p-6">
                <Upload className="w-8 h-8 text-neon-cyan mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  一键上传
                </h3>
                <p className="text-text-secondary text-sm">
                  支持 JPG/PNG/GIF 格式，拖拽上传，自动处理
                </p>
              </div>

              <div className="card bg-card/50 rounded-xl p-6">
                <Image className="w-8 h-8 text-neon-purple mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  自定义像素
                </h3>
                <p className="text-text-secondary text-sm">
                  调节像素大小，控制细节程度，实现不同风格
                </p>
              </div>

              <div className="card bg-card/50 rounded-xl p-6">
                <Code className="w-8 h-8 text-neon-pink mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  批量处理
                </h3>
                <p className="text-text-secondary text-sm">
                  支持批量上传，一次性转换多张图片
                </p>
              </div>

              <div className="card bg-card/50 rounded-xl p-6">
                <Sparkles className="w-8 h-8 text-neon-cyan mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  透明背景
                </h3>
                <p className="text-text-secondary text-sm">
                  保留透明通道，支持 PNG 导出，方便二次创作
                </p>
              </div>
            </div>

            {/* 通知按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                disabled
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold cursor-not-allowed opacity-50"
              >
                上线时通知我
              </button>
              <Link
                href="/tools"
                className="px-8 py-4 rounded-xl border border-border text-text-primary font-semibold hover:bg-card transition-colors"
              >
                浏览其他工具
              </Link>
            </div>
          </div>

          {/* 开发进度 */}
          <div className="card glow-border rounded-2xl p-8">
            <h3 className="text-xl font-bold text-text-primary mb-6">
               开发进度
            </h3>
            <div className="space-y-4">
              <ProgressItem label="核心算法开发" progress={80} />
              <ProgressItem label="UI 界面设计" progress={100} />
              <ProgressItem label="批量处理功能" progress={50} />
              <ProgressItem label="性能优化" progress={30} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50 mt-20">
          <div className="max-w-4xl mx-auto text-center text-text-muted">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

// 进度条组件
function ProgressItem({ label, progress }: { label: string; progress: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-secondary text-sm">{label}</span>
        <span className="text-text-muted text-xs">{progress}%</span>
      </div>
      <div className="h-2 bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
