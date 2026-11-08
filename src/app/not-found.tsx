import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <section className="glass-panel glass-hero p-8 sm:p-12">
        <p className="editorial-kicker mb-4">404</p>
        <h1 className="text-3xl sm:text-4xl">没有找到这个页面</h1>
        <Link className="btn-gradient mt-6 px-5 py-3 text-sm" href="/">返回首页</Link>
      </section>
    </div>
  )
}
