'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Download, Image, Grid3X3, Sliders, Sparkles, RefreshCw } from 'lucide-react'

export default function PixelArtPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [pixelSize, setPixelSize] = useState(35)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setProcessedImage(null)
        setShowGrid(false)
      }
      reader.readAsDataURL(file)
    }
  }

  // 像素化处理
  const processImage = () => {
    if (!uploadedImage || !canvasRef.current) return
    setIsProcessing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = document.createElement('img')
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      const blockSize = Math.floor(Math.min(img.width, img.height) / pixelSize)
      
      for (let y = 0; y < img.height; y += blockSize) {
        for (let x = 0; x < img.width; x += blockSize) {
          const tempCanvas = document.createElement('canvas')
          const tempCtx = tempCanvas.getContext('2d')
          if (!tempCtx) continue
          
          tempCanvas.width = blockSize
          tempCanvas.height = blockSize
          tempCtx.drawImage(img, x, y, blockSize, blockSize, 0, 0, blockSize, blockSize)
          
          const imageData = tempCtx.getImageData(0, 0, blockSize, blockSize)
          const data = imageData.data
          
          let r = 0, g = 0, b = 0, count = 0
          for (let i = 0; i < data.length; i += 4) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            count++
          }
          
          if (count > 0) {
            r = Math.round(r / count)
            g = Math.round(g / count)
            b = Math.round(b / count)
            
            ctx.fillStyle = `rgb(${r},${g},${b})`
            ctx.fillRect(x, y, blockSize, blockSize)
          }
        }
      }

      setProcessedImage(canvas.toDataURL('image/png'))
      setIsProcessing(false)
    }
    img.src = uploadedImage
  }

  // 下载
  const downloadImage = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.download = `pixel-art-${pixelSize}x${pixelSize}-${Date.now()}.png`
    link.href = processedImage
    link.click()
  }

  // 重置
  const reset = () => {
    setUploadedImage(null)
    setProcessedImage(null)
    setShowGrid(false)
    setPixelSize(35)
  }

  // 预览网格
  const previewGrid = () => {
    setShowGrid(!showGrid)
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="cyber-grid" />
        <div className="glow-orb glow-orb-1 opacity-30" />
      </div>

      <div className="relative z-10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            返回工具列表
          </Link>

          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🕹️</div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              像素图转换器
            </h1>
            <p className="text-text-secondary">
              将图片分割成像素色块，生成复古像素风效果
            </p>
          </div>

          {/* 上传区域 */}
          {!uploadedImage ? (
            <div className="card glow-border rounded-2xl p-16 text-center max-w-2xl mx-auto">
              <Upload className="w-20 h-20 text-neon-cyan mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-text-primary mb-3">上传图片开始创作</h3>
              <p className="text-text-secondary mb-8">支持 JPG、PNG、GIF 格式，最大 10MB</p>
              <label className="btn-gradient px-10 py-5 rounded-xl font-semibold cursor-pointer inline-block text-lg">
                选择图片
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-text-muted text-sm mt-4">或拖拽图片到此处</p>
            </div>
          ) : (
            <>
              {/* 图片对比区 */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* 原图 */}
                <div className="card glow-border rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <Image className="w-5 h-5 text-neon-cyan" />
                      <span className="font-bold text-text-primary">原图</span>
                    </div>
                    <button
                      onClick={reset}
                      className="text-text-secondary hover:text-neon-cyan text-sm transition-colors"
                    >
                      更换图片
                    </button>
                  </div>
                  <div className="aspect-square bg-card/50 flex items-center justify-center p-4">
                    <img
                      src={uploadedImage}
                      alt="Original"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                </div>

                {/* 像素图 */}
                <div className={`card rounded-2xl overflow-hidden transition-all duration-500 ${
                  processedImage 
                    ? 'glow-border border-neon-cyan/50' 
                    : 'border-border/50'
                }`}>
                  <div className="flex items-center justify-between p-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="w-5 h-5 text-neon-purple" />
                      <span className="font-bold text-text-primary">像素图（{pixelSize}×{pixelSize}）</span>
                    </div>
                    {processedImage && (
                      <button
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/30 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    )}
                  </div>
                  <div className="aspect-square bg-card/50 flex items-center justify-center p-4">
                    {processedImage ? (
                      <img
                        src={processedImage}
                        alt="Pixelated"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className="text-center text-text-muted">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">调节像素密度后点击生成</p>
                        <p className="text-sm mt-2">生成 {pixelSize}×{pixelSize} 像素风效果</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 控制区 */}
              <div className="card glow-border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Sliders className="w-6 h-6 text-neon-cyan" />
                  <h3 className="text-xl font-bold text-text-primary">像素密度调节</h3>
                </div>

                {/* 滑块 */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-text-muted text-sm">低密度（强像素感）</span>
                    <span className="text-3xl font-bold gradient-text">{pixelSize}×{pixelSize}</span>
                    <span className="text-text-muted text-sm">高密度（细节保留）</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={pixelSize}
                    onChange={(e) => setPixelSize(Number(e.target.value))}
                    className="w-full h-4 bg-card rounded-full appearance-none cursor-pointer accent-neon-cyan"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #a855f7 ${(pixelSize - 4) / 60 * 100}%, #374151 ${(pixelSize - 4) / 60 * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between mt-3 text-text-muted text-xs">
                    <span>4×4</span>
                    <span>16×16</span>
                    <span>32×32</span>
                    <span>48×48</span>
                    <span>64×64</span>
                  </div>
                </div>

                {/* 按钮组 */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={processImage}
                    disabled={isProcessing || !uploadedImage}
                    className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-neon-purple/25"
                  >
                    {isProcessing ? '生成中...' : '生成像素图'}
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-8 py-5 rounded-xl border border-border text-text-primary font-semibold hover:bg-card transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    重置
                  </button>
                </div>

                {/* 效果说明 */}
                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                  <div className="text-center p-4 rounded-xl bg-card/30">
                    <div className="text-lg font-bold text-neon-cyan mb-2">4×4 - 8×8</div>
                    <div className="text-text-muted text-sm mb-1">强像素感</div>
                    <div className="text-text-muted text-xs">适合图标、头像</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-card/30">
                    <div className="text-lg font-bold text-neon-purple mb-2">16×16 - 32×32</div>
                    <div className="text-text-muted text-sm mb-1">平衡细节</div>
                    <div className="text-text-muted text-xs">通用场景</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-card/30">
                    <div className="text-lg font-bold text-neon-pink mb-2">48×48 - 64×64</div>
                    <div className="text-text-muted text-sm mb-1">细节丰富</div>
                    <div className="text-text-muted text-xs">轻微像素化</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 隐藏画布 */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50 mt-12">
          <div className="max-w-7xl mx-auto text-center text-text-muted text-sm">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
            <p className="mt-2">Built with 💜 for creators</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
