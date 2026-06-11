import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ArrowUpRight } from 'lucide-react'

function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  return fs.readdirSync(postsDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8')
      const { data, content } = matter(fileContents)
      return { slug: fileName.replace(/\.md$/, ''), title: data.title, date: data.date, tags: data.tags || [], summary: data.summary || '', draft: data.draft || false, content }
    })
    .filter(post => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export default function BlogPage() {
  const posts = getPosts()
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  return (
    <div className="px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <header className="static grid gap-8 border-b border-border bg-transparent pb-12 backdrop-blur-none md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="editorial-kicker mb-5">Archive · {posts.length} dispatches</p>
            <h1 className="text-6xl sm:text-8xl">文章档案</h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-text-secondary">这里不提供标准答案，只记录当时真实的观察、判断和取舍。</p>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-border py-6">
          <span className="tag border-neon-cyan text-neon-cyan">全部</span>
          {allTags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>

        <div>
          {posts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group grid gap-5 border-b border-border py-8 md:grid-cols-[70px_1fr_180px_24px] md:items-start">
              <span className="font-mono text-xs text-text-muted">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="max-w-3xl text-2xl leading-tight group-hover:text-neon-cyan sm:text-3xl">{post.title}</h2>
                <p className="mt-4 max-w-2xl text-sm text-text-secondary">{post.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">{post.tags.slice(0, 3).map((tag: string) => <span key={tag} className="tag">{tag}</span>)}</div>
              </div>
              <div className="font-mono text-xs leading-6 text-text-muted"><time>{post.date}</time><br />{post.content.length} 字</div>
              <ArrowUpRight className="h-5 w-5 text-text-muted group-hover:text-neon-cyan" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
