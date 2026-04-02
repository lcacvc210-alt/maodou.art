'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [visits, setVisits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 记录访问并获取最新计数
    const trackVisit = async () => {
      try {
        const response = await fetch('/api/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: window.location.pathname,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setVisits(data.totalVisits);
        }
      } catch (error) {
        console.error('Failed to track visit:', error);
      } finally {
        setLoading(false);
      }
    };

    trackVisit();
  }, []);

  return (
    <footer className="w-full py-6 mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 版权信息 */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} MAODOU.art. All rights reserved.
          </div>

          {/* 访问统计 */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>
                {loading ? (
                  <span className="animate-pulse">加载中...</span>
                ) : (
                  <>总访问量：<span className="font-semibold text-gray-900 dark:text-white">{visits || 0}</span></>
                )}
              </span>
            </div>
          </div>

          {/* 链接 */}
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <a href="/blog" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              博客
            </a>
            <a href="/tools" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              工具
            </a>
            <a href="/admin/stats" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              统计
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
