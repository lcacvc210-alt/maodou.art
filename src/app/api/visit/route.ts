import { NextRequest, NextResponse } from 'next/server';
import { recordVisit, getTotalVisits } from '@/lib/db';

// 获取客户端 IP 地址
function getClientIP(request: NextRequest): string {
  // 尝试从多个 header 中获取 IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    // x-forwarded-for 可能包含多个 IP，取第一个
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // 回退到 unknown（Vercel 会自动处理）
  return 'unknown';
}

// 脱敏 IP 地址（只保留前两段）
function anonymizeIP(ip: string): string {
  if (ip === 'unknown' || !ip) return 'unknown';
  
  // IPv4
  const ipv4Match = ip.match(/^(\d{1,3})\.(\d{1,3})\./);
  if (ipv4Match) {
    return `${ipv4Match[1]}.${ipv4Match[2]}.x.x`;
  }
  
  // IPv6 - 简单处理，只保留前两段
  const parts = ip.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}:...`;
  }
  
  return ip;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const anonymizedIP = anonymizeIP(ip);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // 从请求体或 header 获取路径
    let path = '/';
    try {
      const body = await request.json();
      path = body.path || request.headers.get('x-path') || '/';
    } catch {
      path = request.headers.get('x-path') || '/';
    }
    
    // 记录访问
    await recordVisit(anonymizedIP, userAgent, path);
    
    // 获取最新总访问量
    const totalVisits = await getTotalVisits();
    
    return NextResponse.json({
      success: true,
      totalVisits
    });
  } catch (error) {
    console.error('Visit API error:', error);
    return NextResponse.json(
      { error: 'Failed to record visit' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const totalVisits = await getTotalVisits();
    return NextResponse.json({
      totalVisits
    });
  } catch (error) {
    console.error('Visit API error:', error);
    return NextResponse.json(
      { error: 'Failed to get visit count' },
      { status: 500 }
    );
  }
}
