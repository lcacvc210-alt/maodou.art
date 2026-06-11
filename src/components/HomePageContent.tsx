import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Post } from '@/lib/posts'

export default function HomePageContent({ featuredPosts }: { featuredPosts: Post[] }) {
  return (
    <div className="px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <section className="border-b border-border pb-14 sm:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.45fr_.55fr] lg:items-end">
            <div>
              <p className="editorial-kicker mb-6">Independent notes · Xinjiang · 2026</p>
              <h1 className="max-w-5xl text-[clamp(3.2rem,10vw,8.8rem)] font-semibold leading-[0.86] tracking-[-0.085em]">
                不追逐噪音，<br /><span className="text-neon-cyan">记录真实判断。</span>
              </h1>
            </div>
            <div className="border-l border-border pl-6">
              <p className="mb-7 text-base leading-8 text-text-secondary">这里是毛豆的个人思考档案。拆解财经事件，观察 AI 变化，也诚实记录一个创作者如何从零开始。</p>
              <Link href="/blog" className="btn-gradient px-6 py-3 text-sm font-semibold">阅读最新文章 <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="grid border-b border-border md:grid-cols-3">
          {[
            ['01', '财经观察', '理解事件背后的利益、周期与结构。'],
            ['02', '科技前沿', '关注 AI 如何改变创作与普通人的生活。'],
            ['03', '创业记录', '公开记录个人 IP 从冷启动到长期主义。'],
          ].map(item => (
            <div key={item[0]} className="border-b border-border py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0">
              <span className="font-mono text-xs text-neon-cyan">{item[0]}</span>
              <h2 className="mt-8 text-2xl">{item[1]}</h2>
              <p className="mt-3 text-sm text-text-muted">{item[2]}</p>
            </div>
          ))}
        </section>

        <section className="py-14 sm:py-20">
          <div className="mb-10 flex items-end justify-between border-b border-border pb-5">
            <div><p className="editorial-kicker mb-3">Latest dispatches</p><h2 className="text-4xl sm:text-5xl">最近写下的</h2></div>
            <Link href="/blog" className="hidden text-sm text-text-secondary sm:block">全部文章 ↗</Link>
          </div>
          <div className="grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex min-h-[360px] flex-col bg-background p-6 hover:bg-card">
                <div className="flex justify-between font-mono text-[11px] text-text-muted"><span>0{index + 1}</span><time>{post.date}</time></div>
                <h3 className="mt-12 text-2xl leading-tight group-hover:text-neon-cyan">{post.title}</h3>
                <p className="mt-5 text-sm text-text-secondary">{post.summary}</p>
                <div className="mt-auto flex items-end justify-between pt-10">
                  <div className="flex flex-wrap gap-2">{post.tags.slice(0, 2).map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                  <ArrowUpRight className="h-5 w-5 text-text-muted group-hover:text-neon-cyan" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-y border-border py-10 md:grid-cols-[1fr_2fr]">
          <p className="editorial-kicker">Working principle</p>
          <blockquote className="text-3xl leading-tight sm:text-5xl">“先形成自己的判断，再借助工具把它表达清楚。”</blockquote>
        </section>
      </div>
    </div>
  )
}
