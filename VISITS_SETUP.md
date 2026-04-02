# 访问统计功能部署指南

## 📋 功能说明

已为 maodou.art 网站添加访问统计功能：

- **前端展示**：页脚显示总访问量（实时）
- **后台管理**：`/admin/stats` 查看详细数据
- **数据记录**：IP 地址（脱敏）、访问时间、访问页面、设备信息

## 🚀 部署步骤

### 1. 在 Vercel 创建 Postgres 数据库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择 `maodou-art` 项目
3. 点击 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **Postgres**
6. 填写数据库名称（如 `maodou-visits`）
7. 选择区域（建议选 `iad1` - 美国东部，或离你最近的）
8. 点击 **Create**

### 2. 环境变量自动配置

创建数据库后，Vercel 会自动注入以下环境变量：
- `POSTGRES_URL` - 数据库连接字符串

**无需手动配置！** Vercel 会自动处理。

### 3. 部署代码

推送代码到 GitHub 后，Vercel 会自动部署。

或者手动触发部署：

```bash
cd C:\Users\LC\.easyclaw\workspace\websites\maodou-website
git add .
git commit -m "feat: 添加访问统计功能"
git push
```

### 4. 初始化数据库表

首次部署后，访问任意页面会自动创建数据库表。

你也可以通过 Vercel Functions 日志确认初始化成功。

## 📊 使用说明

### 前端展示
- 页脚自动显示总访问量
- 绿色圆点表示实时追踪
- 每几秒自动刷新

### 后台管理
访问 `https://maodou.art/admin/stats` 查看：

1. **总览**：总访问量 + 最近 7 天趋势图
2. **最近访问**：详细访问记录（IP、时间、页面、设备）
3. **每日趋势**：按日期统计的访问数据

## 🔒 隐私保护

- IP 地址已脱敏处理（仅保留前两段）
- 不记录个人敏感信息
- 符合基本隐私保护要求

## 🛠️ 本地开发

本地测试需要配置数据库连接：

1. 复制环境变量示例文件：
```bash
cp .env.local.example .env.local
```

2. 在 Vercel Dashboard 获取连接字符串：
   - Storage → 选择数据库 → **Connect** → **Copy URL**

3. 编辑 `.env.local`：
```env
POSTGRES_URL="你的数据库连接字符串"
```

4. 启动开发服务器：
```bash
npm run dev
```

## 📈 数据迁移说明

> ⚠️ **重要**：`@vercel/postgres` 已标记为废弃，Vercel 推荐迁移到 Neon。
> 
> 但现有数据库会自动迁移到 Neon，代码无需修改即可继续使用。
> 
> 如果是新项目，可以考虑直接使用 Neon SDK。

## 🎯 后续优化建议

1. **添加访问密码**：后台页面增加简单认证
2. **数据导出**：支持 CSV/Excel 导出
3. **可视化图表**：使用 Chart.js 或 Recharts 展示趋势
4. **实时刷新**：WebSocket 实现实时访问推送
5. **地理分布**：IP 地址解析地理位置

---

**部署完成后，访问网站即可看到访问统计功能！** 🌱
