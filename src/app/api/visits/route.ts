import { NextResponse } from 'next/server';
import { getVisitStats, getDailyVisits, getTotalVisits } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');
    const days = parseInt(searchParams.get('days') || '7');
    
    if (type === 'daily') {
      // 获取每日统计
      const dailyVisits = await getDailyVisits(days);
      return NextResponse.json({
        success: true,
        data: dailyVisits
      });
    } else if (type === 'recent') {
      // 获取最近访问记录
      const recentVisits = await getVisitStats(limit);
      return NextResponse.json({
        success: true,
        data: recentVisits
      });
    } else {
      // 获取全部统计
      const [total, recent, daily] = await Promise.all([
        getTotalVisits(),
        getVisitStats(limit),
        getDailyVisits(days)
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          total,
          recent,
          daily
        }
      });
    }
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    );
  }
}
