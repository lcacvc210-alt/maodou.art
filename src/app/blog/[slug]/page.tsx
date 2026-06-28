'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Lock, Unlock } from 'lucide-react'
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

// 获取所有文章
function getAllPosts(): Post[] {
  return []
}

// 根据 slug 获取文章
function getPostBySlug(slug: string): Post | null {
  return null
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
    // 检查 localStorage 中是否有已解锁的文章（带过期时间检查）
    const unlockedPosts = JSON.parse(localStorage.getItem('unlockedPosts') || '{}')
    const now = Date.now()
    
    if (unlockedPosts[slug]) {
      const unlockInfo: UnlockedPost = unlockedPosts[slug]
      // 检查是否过期（30 分钟 = 30 * 60 * 1000 毫秒）
      if (now < unlockInfo.expiresAt) {
        setIsUnlocked(true)
      } else {
        // 已过期，清除解锁状态
        delete unlockedPosts[slug]
        localStorage.setItem('unlockedPosts', JSON.stringify(unlockedPosts))
      }
    }

    // 获取文章内容
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
          // 如果文章没有密码保护，直接解锁
          if (!data.password) {
            setIsUnlocked(true)
          }
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [slug, router])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (post && password === post.password) {
      const now = Date.now()
      const unlockInfo: UnlockedPost = {
        unlockedAt: now,
        expiresAt: now + 30 * 60 * 1000, // 30 分钟后过期
      }
      
      // 保存解锁状态到 localStorage（带时间戳）
      const unlockedPosts = JSON.parse(localStorage.getItem('unlockedPosts') || '{}')
      unlockedPosts[slug] = unlockInfo
      localStorage.setItem('unlockedPosts', JSON.stringify(unlockedPosts))
      
      setIsUnlocked(true)
      setError('')
    } else {
      setError('密码错误，请重试')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">加载中...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 px-5 sm:px-8 sm:py-16">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            返回文章列表
          </Link>

          {/* 文章头部 */}
          <div className="mb-12 grid gap-8 border-b-2 border-text-primary pb-10 lg:grid-cols-[1fr_210px]">
            <div>
            <p className="publication-label mb-5">Maodou research · Long read</p>
            <h1 className="max-w-4xl text-4xl md:text-[3.25rem] font-bold mb-7 leading-[1.1]">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => <span key={tag} className="tag text-sm">{tag}</span>)}
            </div>
            </div>
            <aside className="border-t border-border pt-5 font-mono text-xs leading-7 text-text-muted lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="text-text-primary">发布日期</p><p>{post.date}</p>
              <p className="mt-4 text-text-primary">阅读信息</p><p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />约 {Math.max(1, Math.ceil(post.wordCount / 500))} 分钟</p><p>{post.wordCount} 字</p>
              <p className="mt-4 text-text-primary">作者</p><p>超哥 Harry</p>
            </aside>
          </div>

          {/* 密码保护 */}
          {post.password && !isUnlocked ? (
            <div className="card glow-border rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-neon-purple" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                这篇文章受密码保护
              </h2>
              <p className="text-text-secondary mb-8">
                请输入密码查看内容
              </p>
              <form onSubmit={handleUnlock} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码"
                    className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-text-primary focus:outline-none focus:border-neon-cyan"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    解锁
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-3 text-left">{error}</p>
                )}
              </form>
            </div>
          ) : (
            /* 文章内容 */
            <div className="grid lg:grid-cols-[160px_1fr] lg:gap-12">
            <aside className="hidden lg:block"><div className="sticky top-32 border-t border-border pt-4"><p className="publication-label mb-3">Note</p><p className="text-xs leading-6 text-text-muted">本文仅代表写作时的个人观察，不构成任何投资建议。</p></div></aside>
            <article className="article-copy max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                h2: ({node, ...props}) => (
                  <h2 className="text-2xl font-bold text-text-primary mt-14 mb-6" {...props} />
                ),
                h3: ({node, ...props}) => (
                  <h3 className="text-xl font-bold text-text-primary mt-8 mb-4" {...props} />
                ),
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-2 border-neon-cyan pl-6 py-4 my-8 text-text-secondary italic" {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul className="list-disc list-inside my-4 space-y-2" {...props} />
                ),
                li: ({node, ...props}) => (
                  <li className="text-text-secondary ml-4" {...props} />
                ),
                p: ({node, ...props}) => (
                  <p className="text-text-secondary leading-relaxed my-4" {...props} />
                ),
                a: ({node, ...props}) => (
                  <a className="text-neon-cyan hover:underline" {...props} />
                ),
                strong: ({node, ...props}) => (
                  <strong className="text-text-primary font-bold" {...props} />
                ),
                hr: ({node, ...props}) => (
                  <hr className="divider-glow my-12" {...props} />
                ),
              }}>
                {post.content}
              </ReactMarkdown>
            </article>
            </div>
          )}

          {/* 文章底部 */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="text-neon-cyan hover:underline inline-flex items-center gap-2"
              >
                ← 返回文章列表
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
                  className="text-text-secondary hover:text-neon-cyan inline-flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  重新锁定
                </button>
              )}
              
              {/* 解锁状态提示 */}
              {post.password && isUnlocked && (
                <div className="mt-4 text-center text-sm text-text-muted">
                  <Unlock className="w-4 h-4 inline mr-2" />
                  已解锁 · 30 分钟后自动锁定
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
