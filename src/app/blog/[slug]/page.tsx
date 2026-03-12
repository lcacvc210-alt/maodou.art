import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 获取文章列表（用于上一篇下一篇）
function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), "content/blog");
  const fileNames = fs.readdirSync(postsDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith(".md"))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        date: data.date,
        draft: data.draft || false,
      };
    })
    .filter(post => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 获取单篇文章
function getPostBySlug(slug: string) {
  const postsDirectory = path.join(process.cwd(), "content/blog");
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    frontmatter: data,
    content,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = getPostBySlug(slug);
  const currentIndex = posts.findIndex(p => p.slug === slug);
  
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background relative">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="cyber-grid" />
        <div className="glow-orb glow-orb-1" />
      </div>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            返回文章列表
          </Link>

          {/* 文章头部 */}
          <header className="mb-12">
            <span className="tag text-sm mb-4 inline-block">
              📄 {post.frontmatter.tags?.join(" · ") || "文章"}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6 leading-tight">
              {post.frontmatter.title}
            </h1>
            
            <div className="flex items-center gap-6 text-text-muted text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time>{post.frontmatter.date}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>约 {Math.ceil(post.content.length / 400)} 分钟阅读</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{post.frontmatter.tags?.length || 0} 个标签</span>
              </div>
            </div>
          </header>

          {/* 分割线 */}
          <div className="divider-glow mb-12" />

          {/* 文章内容 */}
          <article className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-text-primary mt-12 mb-6 gradient-text" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-text-primary mt-8 mb-4" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-neon-cyan pl-6 py-2 my-6 bg-card/30 rounded-r-lg text-text-secondary italic" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside my-4 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="text-text-secondary ml-4" {...props} />,
              p: ({node, ...props}) => <p className="text-text-secondary leading-relaxed my-4" {...props} />,
              a: ({node, ...props}) => <a className="text-neon-cyan hover:underline" {...props} />,
              strong: ({node, ...props}) => <strong className="text-neon-cyan" {...props} />,
              hr: ({node, ...props}) => <hr className="divider-glow my-12" {...props} />,
            }}>
              {post.content}
            </ReactMarkdown>
          </article>

          {/* 分割线 */}
          <div className="divider-glow my-12" />

          {/* 文章导航 */}
          <div className="grid gap-4 md:grid-cols-2">
            {prevPost && (
              <Link href={`/blog/${prevPost.slug}`} className="card glow-border rounded-xl p-6 group hover:border-neon-cyan/50 transition-all">
                <div className="text-text-muted text-sm mb-2">← 上一篇</div>
                <div className="text-text-primary font-medium group-hover:text-neon-cyan transition-colors line-clamp-1">
                  {prevPost.title}
                </div>
              </Link>
            )}
            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`} className="card glow-border rounded-xl p-6 group hover:border-neon-cyan/50 transition-all md:text-right">
                <div className="text-text-muted text-sm mb-2">下一篇 →</div>
                <div className="text-text-primary font-medium group-hover:text-neon-cyan transition-colors line-clamp-1">
                  {nextPost.title}
                </div>
              </Link>
            )}
          </div>

          {/* 无文章导航时的提示 */}
          {!prevPost && !nextPost && (
            <div className="text-center py-8">
              <Link href="/blog" className="text-neon-cyan hover:underline">
                返回文章列表 →
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50 mt-20">
          <div className="max-w-3xl mx-auto text-center text-text-muted">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
            <p className="text-sm mt-2">
              喜欢这篇文章？分享给更多人 💜
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
