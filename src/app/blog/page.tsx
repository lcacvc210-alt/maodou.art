import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ArrowUpRight } from 'lucide-react'

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
  return (
    <div className="px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-6 border-b-2 border-text-primary pb-7 md:grid-cols-[1fr_auto] md:items-end">
          <div><p className="publication-label mb-3">Research archive</p><h1 className="text-5xl sm:text-6xl">深度文章</h1></div>
          <div className="font-mono text-xs leading-6 text-text-muted md:text-right"><p>{posts.length} 篇公开文章</p><p>按发布日期倒序</p></div>
        </section>
        <div className="flex flex-wrap gap-2 border-b border-border py-5"><span className="issue-badge">全部主题</span>{tags.slice(0, 10).map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
        <section className="grid lg:grid-cols-[1fr_230px]">
          <div className="lg:border-r lg:border-border lg:pr-8">
            {posts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group grid gap-4 border-b border-border py-8 sm:grid-cols-[52px_1fr_120px_20px]">
                <span className="font-mono text-xs text-text-muted">{String(index + 1).padStart(2, '0')}</span>
                <div><h2 className="max-w-3xl text-2xl group-hover:text-neon-cyan sm:text-[1.7rem]">{post.title}</h2><p className="mt-3 max-w-2xl text-sm text-text-secondary">{post.summary}</p><div className="mt-4 flex flex-wrap gap-2">{post.tags.slice(0,3).map((tag:string) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
                <div className="font-mono text-xs leading-6 text-text-muted"><time>{post.date}</time><br />约 {Math.max(1, Math.ceil(post.content.length / 500))} 分钟</div>
                <ArrowUpRight className="h-4 w-4 text-text-muted group-hover:text-neon-cyan" />
              </Link>
            ))}
          </div>
          <aside className="hidden py-8 pl-7 lg:block"><div className="sticky top-32"><p className="publication-label mb-4">About archive</p><p className="text-sm text-text-secondary">文章保留写作当时的认知与判断。它们不构成投资建议，也不会因为后来观点变化而被悄悄改写。</p><div className="mt-7 border-t border-border pt-5 font-mono text-xs leading-7 text-text-muted"><p>财经思考</p><p>科技观察</p><p>创作记录</p><p>个人成长</p></div></div></aside>
        </section>
      </div>
    </div>
  )
}
