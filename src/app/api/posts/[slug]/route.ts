import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // 计算字数
    const wordCount = content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[#*`\n]/g, '')
      .length

    const post = {
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      summary: data.summary || '',
      content: data.password ? '' : content, // 有密码时不返回内容
      wordCount,
      password: data.password || undefined,
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    )
  }
}
