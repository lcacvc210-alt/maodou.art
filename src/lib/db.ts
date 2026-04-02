import { sql } from '@vercel/postgres';

// 数据库连接单例
let cachedConnection: typeof sql | null = null;

export const db = sql;

// 初始化数据库表
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(45) NOT NULL,
        user_agent TEXT,
        path VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Database table initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// 获取总访问量
export async function getTotalVisits() {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM visits`;
    return result.rows[0]?.count || 0;
  } catch (error) {
    console.error('Failed to get total visits:', error);
    return 0;
  }
}

// 记录访问
export async function recordVisit(ip: string, userAgent: string, path: string) {
  try {
    await sql`
      INSERT INTO visits (ip, user_agent, path)
      VALUES (${ip}, ${userAgent}, ${path})
    `;
  } catch (error) {
    console.error('Failed to record visit:', error);
  }
}

// 获取访问统计（后台使用）
export async function getVisitStats(limit: number = 100) {
  try {
    const result = await sql`
      SELECT id, ip, user_agent, path, created_at
      FROM visits
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result.rows;
  } catch (error) {
    console.error('Failed to get visit stats:', error);
    return [];
  }
}

// 获取每日访问统计
export async function getDailyVisits(days: number = 7) {
  try {
    const result = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM visits
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Failed to get daily visits:', error);
    return [];
  }
}
