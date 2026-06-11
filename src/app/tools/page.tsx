import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const tools = [
  { number: '01', title: '配色灵感库', description: '56 套精选配色方案，支持实时预览、导出与分享。', href: '/tools/color-palette', status: '已上线', features: ['56 套配色', '实时预览', '一键导出'] },
  { number: '02', title: '像素图转换器', description: '上传图片，快速生成不同颗粒度的复古像素风格。', href: '/tools/pixel-art', status: '已上线', features: ['8bit 风格', '像素调节', '图片导出'] },
  { number: '03', title: '网格生成器', description: '创建可自定义间距与样式的基础网格图案。', href: '#', status: '规划中', features: ['多种网格', '自定义间距', '矢量导出'] },
  { number: '04', title: '渐变生成器', description: '创建线性与径向渐变，并生成可直接使用的 CSS。', href: '#', status: '规划中', features: ['多色渐变', '实时预览', 'CSS 代码'] },
]

export default function ToolsIndexPage() {
  return (
    <div className="px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 border-b border-border pb-12 md:grid-cols-[1fr_auto] md:items-end">
          <div><p className="editorial-kicker mb-5">Small tools, real utility</p><h1 className="text-6xl sm:text-8xl">创意工具</h1></div>
          <p className="max-w-md text-sm leading-7 text-text-secondary">不做功能堆叠，只解决创作过程中那些具体、重复又值得被简化的问题。</p>
        </section>

        <section className="grid gap-px border-x border-b border-border bg-border md:grid-cols-2">
          {tools.map(tool => {
            const online = tool.status === '已上线'
            const content = (
              <article className={`group flex min-h-[330px] flex-col bg-background p-7 sm:p-9 ${online ? 'hover:bg-card' : 'opacity-60'}`}>
                <div className="flex justify-between font-mono text-xs text-text-muted"><span>{tool.number}</span><span className={online ? 'text-neon-cyan' : ''}>{tool.status}</span></div>
                <h2 className="mt-14 text-3xl group-hover:text-neon-cyan">{tool.title}</h2>
                <p className="mt-4 max-w-md text-sm text-text-secondary">{tool.description}</p>
                <div className="mt-auto flex items-end justify-between pt-10">
                  <div className="flex flex-wrap gap-2">{tool.features.map(feature => <span key={feature} className="tag">{feature}</span>)}</div>
                  {online && <ArrowUpRight className="h-5 w-5 text-text-muted group-hover:text-neon-cyan" />}
                </div>
              </article>
            )
            return online ? <Link key={tool.number} href={tool.href}>{content}</Link> : <div key={tool.number}>{content}</div>
          })}
        </section>

        <section className="mt-14 grid gap-6 border-y border-border py-8 md:grid-cols-[1fr_auto] md:items-center">
          <div><p className="editorial-kicker mb-3">Open suggestion</p><h2 className="text-3xl">有一个值得被做出来的小工具？</h2></div>
          <a href="mailto:harry@maodou.art" className="btn-gradient px-6 py-3 text-sm font-semibold">告诉我你的想法 ↗</a>
        </section>
      </div>
    </div>
  )
}
