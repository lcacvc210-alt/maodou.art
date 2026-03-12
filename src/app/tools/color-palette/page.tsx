'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, Heart, Monitor, Palette, Download, Share2, Image, FileText } from 'lucide-react'

// 预设配色方案 - 56 套精选配色
const colorPalettes = [
  // 经典系列 (1-8)
  { id: 1, name: '赛博霓虹', colors: ['#00f0ff', '#7b2cbf', '#ff00ff'], likes: 8234 },
  { id: 2, name: '深空星河', colors: ['#030014', '#7c3aed', '#2563eb', '#06b6d4'], likes: 6892 },
  { id: 3, name: '苹果商务', colors: ['#ffffff', '#1d1d1f', '#0066cc'], likes: 9421 },
  { id: 4, name: '温暖日落', colors: ['#ff6b6b', '#ffa502', '#ff7f50', '#ffeaa7'], likes: 7156 },
  { id: 5, name: '清新海洋', colors: ['#0077b6', '#90e0ef', '#caf0f8'], likes: 5745 },
  { id: 6, name: '复古胶片', colors: ['#f4a261', '#e76f51', '#2a9d8f', '#264653'], likes: 8891 },
  { id: 7, name: '极简黑白', colors: ['#000000', '#4a4a4a', '#d4d4d4', '#ffffff'], likes: 12521 },
  { id: 8, name: '莫兰迪灰', colors: ['#8b9bb4', '#c5d0e0', '#f5f7fa'], likes: 6632 },
  
  // 奢华系列 (9-16)
  { id: 9, name: '奢华金黑', colors: ['#000000', '#d4af37', '#f4e4bc'], likes: 7078 },
  { id: 10, name: '玫瑰金', colors: ['#b76e79', '#e0bfb8', '#f4e4e0', '#ffffff'], likes: 8156 },
  { id: 11, name: '香槟金', colors: ['#f7e7ce', '#d4af37', '#c5a059', '#8b7355'], likes: 6534 },
  { id: 12, name: '翡翠绿', colors: ['#046307', '#078903', '#52b788', '#b7e4c7'], likes: 5289 },
  { id: 13, name: '宝石蓝', colors: ['#082032', '#2c394b', '#334756', '#4a6fa5'], likes: 4745 },
  { id: 14, name: '琥珀橙', colors: ['#ffbf00', '#ff9500', '#ff6b00', '#ff4500'], likes: 5891 },
  { id: 15, name: '紫水晶', colors: ['#4a0e4e', '#7b1fa2', '#ab47bc', '#e1bee7'], likes: 4632 },
  { id: 16, name: '红宝石', colors: ['#8b0000', '#c41e3a', '#e63946', '#ffb3c1'], likes: 5078 },
  
  // 自然系列 (17-24)
  { id: 17, name: '森林晨曦', colors: ['#2d5016', '#6ba84f', '#8fbc8f', '#b8e994'], likes: 4289 },
  { id: 18, name: '沙漠黄昏', colors: ['#c7917f', '#d4a373', '#e9c46a', '#f4a261'], likes: 5876 },
  { id: 19, name: '冰川蓝', colors: ['#e3f2fd', '#90caf9', '#42a5f5', '#1976d2'], likes: 6234 },
  { id: 20, name: '薰衣草田', colors: ['#e6e6fa', '#d8bfd8', '#dda0dd', '#ba55d3'], likes: 4967 },
  { id: 21, name: '樱花粉', colors: ['#ffb7c5', '#ff9eb5', '#ff85a1'], likes: 7745 },
  { id: 22, name: '薄荷绿', colors: ['#98ff98', '#b8e994', '#d4e157', '#f0f4c3'], likes: 5156 },
  { id: 23, name: '深海蓝', colors: ['#0a0e27', '#2d2d5f', '#6b6ba8', '#9d9dc9'], likes: 4534 },
  { id: 24, name: '秋日暖阳', colors: ['#a0522d', '#cd853f', '#daa520', '#f0e68c'], likes: 4891 },
  
  // 都市系列 (25-32)
  { id: 25, name: '午夜巴黎', colors: ['#1a0a2e', '#4a196f', '#8b5cf6', '#c084fc'], likes: 6967 },
  { id: 26, name: '纽约夜景', colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9'], likes: 5421 },
  { id: 27, name: '东京街头', colors: ['#ff0055', '#00ffff', '#ffcc00', '#1a1a2e'], likes: 7234 },
  { id: 28, name: '伦敦雾', colors: ['#4a5568', '#718096', '#a0aec0', '#cbd5e0'], likes: 4156 },
  { id: 29, name: '洛杉矶日落', colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'], likes: 6789 },
  { id: 30, name: '上海霓虹', colors: ['#ff0040', '#00f0ff', '#ffcc00', '#1a1a2e'], likes: 5892 },
  { id: 31, name: '北欧极简', colors: ['#f5f5f5', '#e0e0e0', '#9e9e9e', '#424242'], likes: 5634 },
  { id: 32, name: '地中海', colors: ['#0077b6', '#00b4d8', '#90e0ef', '#ffffff'], likes: 4967 },
  
  // 情感系列 (33-40)
  { id: 33, name: '热情似火', colors: ['#ff0000', '#ff4500', '#ff6347', '#ff8c69'], likes: 5234 },
  { id: 34, name: '冷静如冰', colors: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1'], likes: 4567 },
  { id: 35, name: '温柔如梦', colors: ['#fce4ec', '#f8bbd9', '#f48fb1', '#f06292'], likes: 6123 },
  { id: 36, name: '神秘如夜', colors: ['#0f0f0f', '#1a1a2e', '#16213e', '#1f4068'], likes: 5789 },
  { id: 37, name: '活力四射', colors: ['#ffeb3b', '#ff9800', '#ff5722', '#f44336'], likes: 4891 },
  { id: 38, name: '宁静致远', colors: ['#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784'], likes: 4234 },
  { id: 39, name: '浪漫满屋', colors: ['#ffc0cb', '#ffb6c1', '#ff69b4', '#ff1493'], likes: 6567 },
  { id: 40, name: '沉稳内敛', colors: ['#2c3e50', '#34495e', '#7f8c8d', '#bdc3c7'], likes: 4456 },
  
  // 季节系列 (41-48)
  { id: 41, name: '春暖花开', colors: ['#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef'], likes: 5678 },
  { id: 42, name: '夏日炎炎', colors: ['#ff6a00', '#ee0979', '#ff6a00', '#ffecd2'], likes: 5123 },
  { id: 43, name: '秋高气爽', colors: ['#f093fb', '#f5576c', '#4facfe', '#00f2fe'], likes: 4789 },
  { id: 44, name: '冬日暖阳', colors: ['#e6dee9', '#f5f7fa', '#c3cfe2', '#9198e5'], likes: 4345 },
  { id: 45, name: '春雨绵绵', colors: ['#d4fc79', '#96e6a1', '#84fab0', '#8fd3f4'], likes: 4567 },
  { id: 46, name: '夏夜星空', colors: ['#0f2027', '#203a43', '#2c5364', '#4a6fa5'], likes: 5234 },
  { id: 47, name: '秋风瑟瑟', colors: ['#c94b4b', '#4b134f', '#513160', '#5e605d'], likes: 4123 },
  { id: 48, name: '冬雪皑皑', colors: ['#ffffff', '#f0f0f0', '#d0d0d0', '#a0a0a0'], likes: 4890 },
  
  // 特别系列 (49-56)
  { id: 49, name: '马卡龙', colors: ['#ffb3ba', '#ffdfba', '#baffc9', '#bae1ff'], likes: 8156 },
  { id: 50, name: '糖果色', colors: ['#ff6b9d', '#feca57', '#48dbfb', '#ff9ff3'], likes: 7234 },
  { id: 51, name: '冰淇淋', colors: ['#ffc2d1', '#ffe5d9', '#fff5db', '#e2ece9'], likes: 6567 },
  { id: 52, name: '复古迪斯科', colors: ['#f72585', '#7209b7', '#3a0ca3', '#4361ee'], likes: 5891 },
  { id: 53, name: '蒸汽波', colors: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff'], likes: 6234 },
  { id: 54, name: '赛博朋克', colors: ['#fcee0a', '#000000', '#ff0055', '#00f0ff'], likes: 7567 },
  { id: 55, name: '中国风', colors: ['#c41e3a', '#ffd700', '#000000', '#ffffff'], likes: 5678 },
  { id: 56, name: '和风', colors: ['#bc4749', '#f5cac3', '#8d99ae', '#2b2d42'], likes: 4890 },
]

export default function ToolsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedPalette, setSelectedPalette] = useState<typeof colorPalettes[0] | null>(null)
  const [previewMode, setPreviewMode] = useState<'web' | 'ppt' | 'poster'>('web')
  const [showShareModal, setShowShareModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16 // 每页显示 16 个配色

  const copyColor = (color: string, paletteId: number) => {
    navigator.clipboard.writeText(color)
    setCopiedId(`${paletteId}-${color}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // 计算分页
  const totalPages = Math.ceil(colorPalettes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPalettes = colorPalettes.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedPalette(null) // 翻页时清空选中
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const exportPalette = () => {
    if (!selectedPalette) return
    const data = {
      name: selectedPalette.name,
      colors: selectedPalette.colors,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedPalette.name.replace(/\s+/g, '-').toLowerCase()}-palette.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sharePalette = () => {
    setShowShareModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-neon-purple/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* 网格底纹 */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 导航栏 */}
      <header className="border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回首页</span>
            </Link>
            <h1 className="text-xl font-bold gradient-text">配色灵感库</h1>
            <div className="w-20" />
          </div>
        </nav>
      </header>

      {/* 内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {/* 页面标题 */}
        <div className="text-center mb-8 pt-8">
          <p className="text-text-secondary text-sm mb-2">🎨 COLOR PALETTES</p>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            精选配色方案
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            点击颜色即可复制色值，点击卡片查看实时预览效果
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：配色卡片列表 */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {currentPalettes.map(palette => (
                <PaletteCard
                  key={palette.id}
                  palette={palette}
                  copiedId={copiedId}
                  onCopy={copyColor}
                  onSelect={() => setSelectedPalette(palette)}
                  isSelected={selectedPalette?.id === palette.id}
                />
              ))}
            </div>
            
            {/* 分页控件 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          {/* 右侧：实时预览画布 */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {selectedPalette ? (
                <PreviewCanvas
                  palette={selectedPalette}
                  mode={previewMode}
                  onModeChange={setPreviewMode}
                  onExport={exportPalette}
                  onShare={sharePalette}
                />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 分享弹窗 */}
      {showShareModal && selectedPalette && (
        <ShareModal 
          palette={selectedPalette} 
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-text-muted text-sm">
          <p>© 2026 毛豆的思考空间 | maodou.art</p>
        </div>
      </footer>
    </div>
  )
}

// 配色卡片组件
function PaletteCard({ palette, copiedId, onCopy, onSelect, isSelected }: {
  palette: typeof colorPalettes[0]
  copiedId: string | null
  onCopy: (color: string, id: number) => void
  onSelect: () => void
  isSelected: boolean
}) {
  return (
    <div 
      className={`group cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-[1.02] ring-2 ring-neon-cyan ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* 色块区域 */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-3">
        {palette.colors.map((color, index) => (
          <button
            key={color}
            onClick={(e) => {
              e.stopPropagation()
              onCopy(color, palette.id)
            }}
            className="w-full h-16 sm:h-20 relative group/color transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: color }}
            title={`点击复制 ${color}`}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity bg-black/40">
              {copiedId === `${palette.id}-${color}` ? (
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">已复制</span>
                </div>
              ) : (
                <span className="text-white text-sm font-mono bg-black/60 px-3 py-1 rounded-full">
                  {color}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 信息区域 */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base">{palette.name}</h3>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
          <Heart className="w-3.5 h-3.5" />
          <span className="font-medium">{palette.likes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

// 实时预览画布组件
function PreviewCanvas({ palette, mode, onModeChange, onExport, onShare }: {
  palette: typeof colorPalettes[0]
  mode: 'web' | 'ppt' | 'poster'
  onModeChange: (mode: 'web' | 'ppt' | 'poster') => void
  onExport: () => void
  onShare: () => void
}) {
  const [bg, text, accent] = palette.colors.length >= 3 
    ? [palette.colors[0], palette.colors[palette.colors.length - 1], palette.colors[Math.floor(palette.colors.length / 2)]]
    : ['#ffffff', '#000000', palette.colors[0]]

  return (
    <div className="card border border-border/50 backdrop-blur-xl rounded-2xl p-6 bg-white/80 dark:bg-slate-900/80 shadow-xl">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-text-primary flex items-center gap-2">
          <Palette className="w-5 h-5 text-neon-cyan" />
          实时预览
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => onModeChange('web')}
            className={`p-2 rounded-lg transition-colors ${
              mode === 'web' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-text-secondary hover:text-text-primary'
            }`}
            title="网页预览"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => onModeChange('ppt')}
            className={`p-2 rounded-lg transition-colors ${
              mode === 'ppt' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-text-secondary hover:text-text-primary'
            }`}
            title="PPT 预览"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => onModeChange('poster')}
            className={`p-2 rounded-lg transition-colors ${
              mode === 'poster' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-text-secondary hover:text-text-primary'
            }`}
            title="海报预览"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={onExport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          导出
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-primary font-medium text-sm hover:bg-card transition-colors"
        >
          <Share2 className="w-4 h-4" />
          分享
        </button>
      </div>

      {/* 配色信息 */}
      <div className="mb-6">
        <p className="font-bold text-gray-900 dark:text-white text-base mb-3">{palette.name}</p>
        <div className="flex gap-2">
          {palette.colors.map(color => (
            <div
              key={color}
              className="w-10 h-10 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 预览模板 */}
      {mode === 'web' && <WebPreview colors={palette.colors} />}
      {mode === 'ppt' && <PPTPreview colors={palette.colors} />}
      {mode === 'poster' && <PosterPreview colors={palette.colors} />}

      {/* 提示 */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <p className="text-text-muted text-xs text-center">
          💡 点击左侧配色卡片切换预览效果
        </p>
      </div>
    </div>
  )
}

// 网页预览
function WebPreview({ colors }: { colors: string[] }) {
  const [bg, text, accent] = colors.length >= 3 
    ? [colors[0], colors[colors.length - 1], colors[Math.floor(colors.length / 2)]]
    : ['#ffffff', '#000000', colors[0]]

  return (
    <div className="space-y-4">
      {/* 导航栏 */}
      <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: bg, color: text }}>
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm">MAODOU.art</div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: text, opacity: 0.5 }} />
          </div>
        </div>
      </div>

      {/* Hero 区域 */}
      <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: bg }}>
        <div className="text-lg font-bold mb-2" style={{ color: text }}>标题文字</div>
        <div className="text-sm mb-4" style={{ color: text, opacity: 0.7 }}>这是一段描述性文字，展示配色效果</div>
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: accent }}>按钮</button>
      </div>

      {/* 卡片 */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map(i => (
          <div
            key={i}
            className="rounded-xl p-4 shadow-sm"
            style={{ backgroundColor: i === 1 ? bg : `${bg}99`, border: `1px solid ${accent}33` }}
          >
            <div className="w-8 h-8 rounded-lg mb-3" style={{ backgroundColor: accent, opacity: 0.8 }} />
            <div className="text-xs font-medium mb-1" style={{ color: text }}>卡片标题</div>
            <div className="text-xs" style={{ color: text, opacity: 0.6 }}>简短描述</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// PPT 预览
function PPTPreview({ colors }: { colors: string[] }) {
  const [bg, text, accent] = colors.length >= 3 
    ? [colors[0], colors[colors.length - 1], colors[Math.floor(colors.length / 2)]]
    : ['#ffffff', '#000000', colors[0]]

  return (
    <div className="space-y-4">
      {/* PPT 幻灯片比例 16:9 */}
      <div className="aspect-video rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: bg }}>
        <div className="h-full p-6 flex flex-col justify-between">
          {/* 标题页 */}
          <div>
            <div className="text-xs opacity-50 mb-4" style={{ color: text }}>演示文稿标题</div>
            <div className="text-2xl font-bold mb-2" style={{ color: text }}>主标题</div>
            <div className="text-sm opacity-70" style={{ color: text }}>副标题或描述文字</div>
          </div>
          
          {/* 装饰条 */}
          <div className="h-2 rounded-full" style={{ backgroundColor: accent }} />
        </div>
      </div>

      {/* 内容页预览 */}
      <div className="aspect-video rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: `${bg}99` }}>
        <div className="h-full p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
            <div className="text-sm font-bold" style={{ color: text }}>内容页标题</div>
          </div>
          <div className="space-y-2 flex-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <div className="text-xs" style={{ color: text, opacity: 0.8 }}>要点内容 {i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 海报预览
function PosterPreview({ colors }: { colors: string[] }) {
  const [bg, text, accent] = colors.length >= 3 
    ? [colors[0], colors[colors.length - 1], colors[Math.floor(colors.length / 2)]]
    : ['#ffffff', '#000000', colors[0]]

  return (
    <div className="space-y-4">
      {/* 竖版海报 3:4 */}
      <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg relative" style={{ backgroundColor: bg }}>
        {/* 渐变背景 */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${accent}40 0%, transparent 100%)`
          }}
        />
        
        {/* 内容 */}
        <div className="relative h-full p-6 flex flex-col">
          {/* 顶部 */}
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest mb-2" style={{ color: text, opacity: 0.6 }}>EVENT</div>
            <div className="text-3xl font-bold" style={{ color: text }}>活动名称</div>
          </div>

          {/* 中部 */}
          <div className="flex-1 flex items-center justify-center">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accent }}
            >
              <div className="text-2xl font-bold text-white">2026</div>
            </div>
          </div>

          {/* 底部 */}
          <div className="text-center space-y-2">
            <div className="text-sm font-medium" style={{ color: text }}>2026.03.12</div>
            <div className="text-xs opacity-70" style={{ color: text }}>地点信息 | 更多信息</div>
            <div className="pt-4">
              <div className="h-1 w-16 mx-auto rounded-full" style={{ backgroundColor: accent }} />
            </div>
          </div>
        </div>
      </div>

      {/* 横版海报 16:9 */}
      <div className="aspect-video rounded-xl overflow-hidden shadow-lg relative" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2" style={{ color: text }}>宣传标语</div>
            <div className="text-sm opacity-70" style={{ color: text }}>副标题或活动信息</div>
          </div>
        </div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-2"
          style={{ backgroundColor: accent }}
        />
      </div>
    </div>
  )
}

// 空状态
function EmptyState() {
  return (
    <div className="card border border-border/50 backdrop-blur-xl rounded-2xl p-8 text-center bg-white/80 dark:bg-slate-900/80">
      <Palette className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-bold text-text-primary mb-2">选择一套配色</h3>
      <p className="text-text-secondary text-sm">
        点击任意配色卡片<br />查看实时预览效果
      </p>
    </div>
  )
}

// 分享弹窗
function ShareModal({ palette, onClose }: { palette: typeof colorPalettes[0], onClose: () => void }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `推荐一套配色方案：${palette.name} - ${palette.colors.join(', ')}`

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('链接已复制！')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card bg-background rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-text-primary mb-4">分享配色</h3>
        
        <div className="flex gap-2 mb-6">
          {palette.colors.map(color => (
            <div
              key={color}
              className="w-12 h-12 rounded-lg shadow-md"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <p className="text-text-secondary text-sm mb-6">{palette.name}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="p-3 rounded-xl bg-[#07c160] text-white text-sm font-medium">微信</button>
          <button className="p-3 rounded-xl bg-[#e6162d] text-white text-sm font-medium">微博</button>
          <button className="p-3 rounded-xl bg-[#1DA1F2] text-white text-sm font-medium">Twitter</button>
        </div>

        <div className="flex gap-3">
          <button onClick={copyLink} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-primary text-sm hover:bg-card transition-colors">
            复制链接
          </button>
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm">
            完成
          </button>
        </div>
      </div>
    </div>
  )
}

// 分页组件
function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border border-border text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card transition-colors"
      >
        ← 上一页
      </button>
      
      <div className="flex items-center gap-2">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              currentPage === page
                ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white'
                : 'border border-border text-text-secondary hover:bg-card'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border border-border text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card transition-colors"
      >
        下一页 →
      </button>
    </div>
  )
}
