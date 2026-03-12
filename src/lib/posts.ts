import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  draft: boolean
  content: string
}

// 获取所有文章
export function getPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  const fileNames = fs.readdirSync(postsDirectory)
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        summary: data.summary || '',
        draft: data.draft || false,
        content,
      }
    })
    .filter(post => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  
  return posts
}

// 获取最新文章（限制数量）
export function getLatestPosts(limit: number = 3): Post[] {
  const posts = getPosts()
  return posts.slice(0, limit)
}

// 根据 slug 获取单篇文章
export function getPostBySlug(slug: string): Post | null {
  const posts = getPosts()
  return posts.find(post => post.slug === slug) || null
}
