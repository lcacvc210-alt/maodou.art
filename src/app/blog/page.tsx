import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ArrowUpRight, CircleDot, Command, Terminal } from 'lucide-react'

function getPosts() {
  const directory = path.join(process.cwd(), 'content/blog')
  return fs.readdirSync(directory).filter(name => name.endsWith('.md')).map(name => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, name), 'utf8'))
    return { slug: name.replace(/\.md$/, ''), title: data.title, date: data.date, tags: data.tags || [], summary: data.summary || '', draft: data.draft || false, content }
  }).filter(post => !post.draft).sort((a, b) => a.date < b.date ? 1 : -1)
}

export default function BlogPage() {
  const posts = getPosts()
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)))
  const lead = posts[0]

  return (
    <div className="persona-blog px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <div className="relative mx-auto max-w-7xl">
        <section className="grid gap-8 border-b border-[#f3f1e8]/15 pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="mb-7 flex flex-wrap gap-2">
              <span className="persona-chip">ONLINE JOURNAL</span>
              <span className="persona-chip">MAODOU.ART</span>
            </div>
            <h1 className="max-w-5xl text-[clamp(3rem,9vw,8.6rem)] font-semibold leading-[0.88] tracking-[-0.08em] text-[#f3f1e8]">
              我把这里当成公开的思考日志。
            </h1>
          </div>
          <div className="persona-panel rounded-[2rem] p-5 sm:p-7">
            <div className="mb-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-[#858274]">
              <span>Profile</span>
              <span>CN / Web</span>
            </div>
            <p className="text-lg leading-8 text-[#ded9c8]">
              写财经、自媒体、AI 工具，也记录自己怎么和注意力、表达欲、商业现实周旋。
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#f3f1e8]/10 pt-5 font-mono text-xs text-[#858274]">
              <p><span className="block text-2xl text-[#f3f1e8]">{posts.length}</span>posts</p>
              <p><span className="block text-2xl text-[#f3f1e8]">{tags.length}</span>tags</p>
              <p><span className="block text-2xl text-[#f3f1e8]">1</span>person</p>
            </div>
          </div>
        </section>

        {lead && (
          <section className="grid gap-5 border-b border-[#f3f1e8]/15 py-8 lg:grid-cols-[180px_1fr_140px]">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#858274]">
              <CircleDot className="mb-4 h-5 w-5 fill-[#b7ff3c] text-[#b7ff3c]" />
              Current thought
            </div>
            <Link href={`/blog/${lead.slug}`} className="group">
              <h2 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#f3f1e8] group-hover:text-[#b7ff3c] sm:text-5xl">
                {lead.title}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#aaa592]">{lead.summary}</p>
            </Link>
            <div className="font-mono text-xs leading-7 text-[#858274] lg:text-right">
              <time>{lead.date}</time>
              <p>约 {Math.max(1, Math.ceil(lead.content.length / 500))} 分钟</p>
            </div>
          </section>
        )}

        <section className="grid gap-8 pt-10 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="persona-panel rounded-[1.5rem] p-5">
              <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#858274]">
                <Terminal className="h-4 w-4 text-[#b7ff3c]" />
                filters
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 12).map(tag => <span className="persona-chip" key={tag}>{tag}</span>)}
              </div>
              <p className="mt-6 border-t border-[#f3f1e8]/10 pt-5 text-sm leading-7 text-[#858274]">
                文章保留写作当时的认知与判断。后来的变化，会用新的文章补上。
              </p>
            </div>
          </aside>

          <div className="space-y-3">
            {posts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group grid gap-5 rounded-[1.6rem] border border-[#f3f1e8]/10 bg-[#11130f]/55 p-5 transition hover:border-[#b7ff3c]/60 hover:bg-[#171a14] sm:grid-cols-[70px_1fr_140px_24px] sm:p-6">
                <span className="font-mono text-xs text-[#858274]">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="max-w-3xl text-2xl font-semibold tracking-[-0.045em] text-[#f3f1e8] group-hover:text-[#b7ff3c]">{post.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aaa592]">{post.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{post.tags.slice(0, 3).map((tag: string) => <span className="persona-chip" key={tag}>{tag}</span>)}</div>
                </div>
                <div className="font-mono text-xs leading-6 text-[#858274]"><time>{post.date}</time><br />{Math.max(1, Math.ceil(post.content.length / 500))} min read</div>
                <ArrowUpRight className="h-5 w-5 text-[#858274] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b7ff3c]" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 rounded-[2rem] border border-[#f3f1e8]/12 bg-[#f3f1e8] p-6 text-[#080907] sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#58604c]">What this blog is for</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">不是人设橱窗，是一个持续调试自己的地方。</h2>
          </div>
          <Command className="hidden h-12 w-12 text-[#080907] sm:block" />
        </section>
      </div>
    </div>
  )
}
