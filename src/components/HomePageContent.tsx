import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BarChart3, BookOpen, Wrench } from 'lucide-react'
import { Post } from '@/lib/posts'

export default function HomePageContent({ featuredPosts }: { featuredPosts: Post[] }) {
  const [lead, ...latest] = featuredPosts
  return (
    <div className="px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b-2 border-text-primary pb-4">
          <div><p className="publication-label mb-2">Independent research & notes</p><h1 className="text-3xl sm:text-4xl">毛豆的思考空间</h1></div>
          <div className="font-mono text-xs leading-6 text-text-muted sm:text-right"><p>ISSUE 010</p><p>更新于 2026.06</p></div>
        </section>

        <section className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[1.55fr_.65fr]">
          <Link href={`/blog/${lead.slug}`} className="group block">
            <div className="mb-5 flex items-center gap-3"><span className="issue-badge">本期主文</span><time className="font-mono text-xs text-text-muted">{lead.date}</time></div>
            <h2 className="max-w-4xl text-[clamp(2.6rem,6vw,5.3rem)] leading-[1.02] group-hover:text-neon-cyan">{lead.title}</h2>
            <p className="mt-6 max-w-3xl text-lg text-text-secondary">{lead.summary}</p>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-neon-cyan">阅读全文 <ArrowRight className="h-4 w-4" /></div>
          </Link>
          <aside className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className="publication-label mb-5">编辑手记</p>
            <p className="text-xl leading-8">不追逐每一条热点，只保留那些值得反复思考的问题。</p>
            <p className="mt-5 text-sm text-text-secondary">围绕财经事件、AI 变革与个人创作，记录判断形成的过程，而不仅是最后的结论。</p>
            <div className="mt-8 border-t border-border pt-5 font-mono text-xs leading-7 text-text-muted"><p>作者：超哥 Harry</p><p>坐标：中国 · 新疆</p><p>持续写作：2026 — NOW</p></div>
          </aside>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-2 flex items-end justify-between border-b border-border pb-4"><div><p className="publication-label mb-2">Latest analysis</p><h2 className="text-3xl">最新研究</h2></div><Link href="/blog" className="text-sm text-neon-cyan">查看档案 ↗</Link></div>
            {latest.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group grid gap-4 border-b border-border py-7 sm:grid-cols-[42px_1fr_110px_20px] sm:items-start">
                <span className="font-mono text-xs text-text-muted">0{index + 2}</span>
                <div><h3 className="text-xl group-hover:text-neon-cyan sm:text-2xl">{post.title}</h3><p className="mt-3 text-sm text-text-secondary">{post.summary}</p><div className="mt-4 flex gap-2">{post.tags.slice(0,2).map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></div>
                <time className="font-mono text-xs text-text-muted">{post.date}</time><ArrowUpRight className="h-4 w-4 text-text-muted" />
              </Link>
            ))}
          </div>
          <aside>
            <div className="rounded-lg bg-[#101b16] p-6 text-white">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#78c7a9]">Research desk</p><h2 className="mt-4 text-2xl">把思考变成可用工具</h2><p className="mt-3 text-sm leading-6 text-white/65">配色、像素图和后续的数据工具，都从真实创作需求出发。</p><Link href="/tools" className="mt-7 inline-flex items-center gap-2 text-sm text-[#d9ff43]">打开工具箱 <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {[[BarChart3,'财经'],[BookOpen,'文章'],[Wrench,'工具']].map(([Icon,label]) => { const C = Icon as typeof BarChart3; return <div key={label as string} className="bg-card p-4 text-center"><C className="mx-auto h-4 w-4 text-neon-cyan" /><p className="mt-2 text-xs text-text-muted">{label as string}</p></div> })}
            </div>
          </aside>
        </section>

        <section className="border-y border-border py-8"><div className="grid gap-5 md:grid-cols-[170px_1fr]"><p className="publication-label">Coverage</p><div className="grid gap-5 sm:grid-cols-3">{[['财经观察','政策、市场与产业逻辑'],['科技前沿','AI 与生产方式变化'],['创作复盘','个人 IP 的真实试验']].map(([title,desc]) => <div key={title}><h3 className="text-lg">{title}</h3><p className="mt-2 text-sm text-text-muted">{desc}</p></div>)}</div></div></section>
      </div>
    </div>
  )
}
