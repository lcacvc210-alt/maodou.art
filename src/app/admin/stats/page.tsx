'use client';

import { useEffect, useState } from 'react';

interface VisitRecord {
  id: number;
  ip: string;
  user_agent: string;
  path: string;
  created_at: string;
}

interface DailyStat {
  date: string;
  count: number;
}

interface StatsData {
  total: number;
  recent: VisitRecord[];
  daily: DailyStat[];
}

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recent' | 'daily'>('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/visits');
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            加载中...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">访问统计</h1>
          <p className="text-gray-600 dark:text-gray-400">
            网站访问数据分析
          </p>
        </div>

        {/* 选项卡 */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            总览
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`pb-2 px-4 transition-colors ${
              activeTab === 'recent'
                ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            最近访问
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`pb-2 px-4 transition-colors ${
              activeTab === 'daily'
                ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            每日趋势
          </button>
        </div>

        {/* 总览 */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* 总访问量卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">总访问量</h2>
              <div className="text-4xl font-bold text-blue-500">
                {stats.total.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                自网站上线以来的总访问次数
              </p>
            </div>

            {/* 最近 7 天趋势 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">最近 7 天访问趋势</h2>
              <div className="space-y-3">
                {stats.daily.slice(0, 7).map((day) => (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(day.date)}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full transition-all"
                        style={{
                          width: `${Math.min((day.count / Math.max(...stats.daily.map(d => d.count))) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-semibold">
                      {day.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 最近访问记录 */}
        {activeTab === 'recent' && stats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP 地址
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      页面
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      设备/浏览器
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.recent.map((visit) => (
                    <tr key={visit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDateTime(visit.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {visit.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {visit.path}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {visit.user_agent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 每日趋势 */}
        {activeTab === 'daily' && stats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      访问量
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.daily.map((day) => (
                    <tr key={day.date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(day.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        {day.count.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
