import Link from 'next/link'

export const metadata = { title: '关于毛豆 | maodou.art' }

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
      <section className="glass-panel glass-hero p-6 sm:p-12">
        <p className="editorial-kicker mb-4">About maodou.art</p>
        <h1 className="text-4xl sm:text-6xl">关于毛豆</h1>
        <p className="mt-5 max-w-2xl text-lg text-text-secondary">
          我是超哥 Harry。这里是我的个人网站，记录财经观察、AI 探索和创作复盘，也放一些从实际需求出发做的小工具。
        </p>
      </section>
      <section className="mt-5 grid gap-4 sm:grid-cols-3" aria-label="浏览网站">
        {[
          { href: '/blog', title: '深度文章', text: '读财经观察、创作复盘和思考笔记。' },
          { href: '/weekly/', title: '毛豆周历', text: '按日期查看已核验的财经与科技日程。' },
          { href: '/tools', title: '创作工具', text: '试用配色灵感库和像素图生成器。' },
        ].map(({ href, title, text }) => {
          const content = <><h2 className="text-xl">{title} ↗</h2><p className="mt-3 text-sm text-text-secondary">{text}</p></>
          return href === '/weekly/'
            ? <a key={href} className="card block p-6" href={href}>{content}</a>
            : <Link key={href} className="card block p-6" href={href}>{content}</Link>
        })}
      </section>
    </div>
  )
}
