import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 获取所有文章
function getPosts() {
  const postsDirectory = path.join(process.cwd(), "content/blog");
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith(".md"))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        summary: data.summary || "",
        draft: data.draft || false,
        content,
      };
    })
    .filter(post => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  
  return posts;
}

export default function BlogPage() {
  const posts = getPosts();
  
  // 获取所有标签
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  );

  return (
    <div className="min-h-screen bg-background relative">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="cyber-grid" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
      </div>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-12">
            <span className="tag text-sm mb-4 inline-block">
              📚 文章 archive
            </span>
            <h1 className="text-5xl font-bold gradient-text mb-4">
              全部文章
            </h1>
            <p className="text-text-secondary text-lg">
              记录思考，分享见解，共 {posts.length} 篇文章
            </p>
          </div>

          {/* 标签筛选 */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="tag bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan">
                全部
              </span>
              {allTags.map(tag => (
                <span key={tag} className="tag cursor-pointer hover:bg-neon-cyan/20">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 文章列表 */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="card glow-border rounded-2xl p-8 group hover:scale-[1.01] transition-all duration-300">
                  {/* 顶部光条 */}
                  <div className="h-1 w-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink mb-6 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  <h2 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-neon-cyan transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {post.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <time className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neon-cyan" />
                        {post.date}
                      </time>
                      <span>·</span>
                      <span>{post.content.length} 字</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="tag text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* 空状态 */}
          {posts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                还没有文章
              </h3>
              <p className="text-text-secondary mb-8">
                第一篇文章正在路上...
              </p>
              <Link href="/" className="btn-gradient px-8 py-3 rounded-xl">
                返回首页
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50 mt-20">
          <div className="max-w-4xl mx-auto text-center text-text-muted">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
