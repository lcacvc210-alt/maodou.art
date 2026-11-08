'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Lock, Terminal, Unlock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  content: string
  wordCount: number
  password?: string
}

interface UnlockedPost {
  unlockedAt: number
  expiresAt: number
}

export default function BlogPost() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [post, setPost] = useState<Post | null>(null)
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unlockedPosts = JSON.parse(localStorage.getItem('unlockedPosts') || '{}')
    const now = Date.now()
    let hasValidUnlock = false

    if (unlockedPosts[slug]) {
      const unlockInfo: UnlockedPost = unlockedPosts[slug]
      if (now < unlockInfo.expiresAt) {
        hasValidUnlock = true
      } else {
        delete unlockedPosts[slug]
        localStorage.setItem('unlockedPosts', JSON.stringify(unlockedPosts))
      }
    }

    fetch(`/api/posts/${slug}`)
      .then(res => {
        if (res.status === 404) {
          router.push('/blog')
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data) {
          setPost(data)
          if (!data.password || hasValidUnlock) {
            setIsUnlocked(true)
          }
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [slug, router])

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault()
    if (post && password === post.password) {
      const now = Date.now()
      const unlockedPosts = JSON.parse(localStorage.getItem('unlockedPosts') || '{}')

      unlockedPosts[slug] = {
        unlockedAt: now,
        expiresAt: now + 30 * 60 * 1000,
      }
      localStorage.setItem('unlockedPosts', JSON.stringify(unlockedPosts))

      setIsUnlocked(true)
      setError('')
    } else {
      setError('密码错误，请重试')
    }
  }

  if (isLoading) {
    return (
      <div className="persona-blog flex min-h-screen items-center justify-center px-5">
        <div className="persona-panel rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">Loading note</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  const readingMinutes = Math.max(1, Math.ceil(post.wordCount / 500))

  return (
    <div className="persona-blog min-h-screen px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <div className="relative mx-auto max-w-7xl">
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-text-muted hover:text-neon-cyan"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to journal
        </Link>

        <header className="glass-panel glass-hero grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_260px]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="persona-chip">LONG NOTE</span>
              {post.tags.slice(0, 4).map(tag => <span key={tag} className="persona-chip">{tag}</span>)}
            </div>
            <h1 className="max-w-5xl text-[clamp(2rem,4.8vw,4.5rem)] font-semibold leading-[1.14] tracking-tight text-text-primary">
              {post.title}
            </h1>
            {post.summary && <p className="mt-7 max-w-3xl text-lg leading-8 text-text-secondary">{post.summary}</p>}
          </div>

          <aside className="rounded-2xl bg-card/65 p-5 font-mono text-xs leading-7 text-text-muted">
            <div className="mb-6 flex items-center gap-2 uppercase tracking-[0.16em]">
              <Terminal className="h-4 w-4 text-neon-cyan" />
              meta
            </div>
            <p className="text-text-primary">发布日期</p>
            <p>{post.date}</p>
            <p className="mt-4 text-text-primary">阅读信息</p>
            <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />约 {readingMinutes} 分钟</p>
            <p>{post.wordCount} 字</p>
            <p className="mt-4 text-text-primary">作者</p>
            <p>超哥 Harry</p>
          </aside>
        </header>

        {post.password && !isUnlocked ? (
          <section className="glass-panel glass-reading mx-auto mt-10 max-w-2xl p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neon-cyan/10">
              <Lock className="h-8 w-8 text-neon-cyan" />
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-text-primary">这篇文章受密码保护</h2>
            <p className="mt-4 text-text-secondary">请输入密码查看内容。</p>
            <form onSubmit={handleUnlock} className="mx-auto mt-8 max-w-md">
              <div className="flex gap-3">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="输入密码"
                  className="min-w-0 flex-1 rounded-full border border-border/50 bg-card px-4 py-3 text-text-primary outline-none focus:border-neon-cyan"
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn-gradient px-5 py-3 font-semibold"
                >
                  解锁
                </button>
              </div>
              {error && <p className="mt-3 text-left text-sm text-red-700 dark:text-red-300">{error}</p>}
            </form>
          </section>
        ) : (
          <div className="grid gap-10 pt-12 lg:grid-cols-[230px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-32 border-l border-border/50 pl-5">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-neon-cyan">Note</p>
                <p className="mt-4 text-sm leading-7 text-text-muted">
                  本文仅代表写作时的个人观察，不构成任何投资建议。
                </p>
              </div>
            </aside>
            <article className="persona-article glass-panel glass-reading min-w-0 px-5 py-6 sm:px-10 sm:py-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                h2: ({node, ...props}) => {
                  void node
                  return <h2 {...props} />
                },
                h3: ({node, ...props}) => {
                  void node
                  return <h3 className="mt-10 mb-4 font-semibold" {...props} />
                },
                blockquote: ({node, ...props}) => {
                  void node
                  return <blockquote className="my-8 rounded-r-2xl px-6 py-4 italic" {...props} />
                },
                ul: ({node, ...props}) => {
                  void node
                  return <ul className="my-5 list-disc space-y-2 pl-6" {...props} />
                },
                li: ({node, ...props}) => {
                  void node
                  return <li {...props} />
                },
                p: ({node, ...props}) => {
                  void node
                  return <p className="my-5" {...props} />
                },
                a: ({node, ...props}) => {
                  void node
                  return <a className="persona-link" {...props} />
                },
                strong: ({node, ...props}) => {
                  void node
                  return <strong className="font-semibold" {...props} />
                },
                hr: ({node, ...props}) => {
                  void node
                  return <hr className="my-12 border-0 border-t border-border/50" {...props} />
                },
              }}>
                {post.content}
              </ReactMarkdown>
            </article>
          </div>
        )}

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-neon-cyan hover:text-neon-cyan"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
          {post.password && isUnlocked && (
            <button
              onClick={() => {
                setIsUnlocked(false)
                setPassword('')
                const unlockedPosts = JSON.parse(localStorage.getItem('unlockedPosts') || '{}')
                delete unlockedPosts[slug]
                localStorage.setItem('unlockedPosts', JSON.stringify(unlockedPosts))
              }}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-text-muted hover:text-neon-cyan"
            >
              <Lock className="h-4 w-4" />
              重新锁定
            </button>
          )}
          {post.password && isUnlocked && (
            <div className="text-sm text-text-muted">
              <Unlock className="mr-2 inline h-4 w-4" />
              已解锁，30 分钟后自动锁定
            </div>
          )}
        </footer>
      </div>
    </div>
  )
}
