'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Download, Image, Grid3X3, Sliders } from 'lucide-react'

// 示例图片：使用占位图服务（更可靠）
const PLACEHOLDER_URL = 'https://picsum.photos/seed/vangogh/800/800'

export default function PixelArtPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [pixelSize, setPixelSize] = useState(16)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDemo, setShowDemo] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setShowDemo(false)
      }
      reader.readAsDataURL(file)
    }
  }

  // 像素化处理（方案 A：颜色量化 + 色彩分层）
  const processImage = () => {
    if (!uploadedImage || !canvasRef.current) return
    setIsProcessing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = document.createElement('img')
    img.onload = () => {
      // 步骤 1：缩小画布（像素化）
      const smallSize = pixelSize
      const smallCanvas = document.createElement('canvas')
      const smallCtx = smallCanvas.getContext('2d')
      if (!smallCtx) return
      
      smallCanvas.width = smallSize
      smallCanvas.height = smallSize
      smallCtx.drawImage(img, 0, 0, smallSize, smallSize)
      
      // 步骤 2：获取像素数据并处理
      const imageData = smallCtx.getImageData(0, 0, smallSize, smallSize)
      const data = imageData.data
      
      // 步骤 3：颜色量化 + 色彩分层
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // 颜色量化：将 RGB 各通道压缩到 4 个层级 (0-63, 64-127, 128-191, 192-255)
        data[i] = Math.floor(r / 64) * 64 + 32
        data[i + 1] = Math.floor(g / 64) * 64 + 32
        data[i + 2] = Math.floor(b / 64) * 64 + 32
      }
      
      smallCtx.putImageData(imageData, 0, 0)
      
      // 步骤 4：放大回原尺寸（使用最近邻插值保持硬边缘）
      canvas.width = img.width
      canvas.height = img.height
      ctx.imageSmoothingEnabled = false // 关键：关闭平滑，保持像素硬边缘
      ctx.drawImage(smallCanvas, 0, 0, img.width, img.height)

      setProcessedImage(canvas.toDataURL('image/png'))
      setIsProcessing(false)
    }
    img.src = uploadedImage
  }

  // 下载
  const downloadImage = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.download = `pixel-art-${Date.now()}.png`
    link.href = processedImage
    link.click()
  }

  // 重置
  const reset = () => {
    setUploadedImage(null)
    setProcessedImage(null)
    setShowDemo(true)
    setPixelSize(16)
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="cyber-grid" />
        <div className="glow-orb glow-orb-1" />
      </div>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            返回工具列表
          </Link>

          <div className="text-center mb-12">
            <div className="text-7xl mb-6">🕹️</div>
            <h1 className="text-5xl font-bold gradient-text mb-4">
              像素图转换器
            </h1>
            <p className="text-text-secondary text-lg">
              上传图片，通过像素网格切分重组，生成创意像素艺术
            </p>
          </div>

          {/* 演示区 - 三张图对比 */}
          {showDemo && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  🎨 效果对比（梵高自画像）
                </h2>
                <p className="text-text-secondary">
                  同一张图，不同像素密度的效果
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <DemoCard
                  title="原图"
                  description="示例图片"
                  tag="原始"
                  imageUrl={PLACEHOLDER_URL}
                />
                <DemoCard
                  title="低密度（8×8）"
                  description="强像素感，卡通风格"
                  tag="8×8 网格"
                  imageUrl={PLACEHOLDER_URL}
                  pixelSize={8}
                />
                <DemoCard
                  title="高密度（32×32）"
                  description="细节保留，艺术感"
                  tag="32×32 网格"
                  imageUrl={PLACEHOLDER_URL}
                  pixelSize={32}
                />
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setShowDemo(false)}
                  className="text-neon-cyan hover:underline text-sm font-medium"
                >
                  我自己上传试试 →
                </button>
              </div>
            </div>
          )}

          {/* 上传区域 */}
          {!uploadedImage ? (
            <div className="card glow-border rounded-2xl p-12 text-center">
              <Upload className="w-16 h-16 text-neon-cyan mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                上传图片开始创作
              </h3>
              <p className="text-text-secondary mb-8">
                支持 JPG、PNG、GIF 格式
              </p>
              <label className="btn-gradient px-8 py-4 rounded-xl font-semibold cursor-pointer inline-block">
                选择图片
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 原图 */}
                <div className="card glow-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      原图
                    </h3>
                    <button onClick={reset} className="text-text-secondary hover:text-neon-cyan text-sm">
                      更换图片
                    </button>
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-card flex items-center justify-center">
                    <img src={uploadedImage} alt="Original" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>

                {/* 像素效果 */}
                <div className="card glow-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                      <Grid3X3 className="w-5 h-5" />
                      像素效果
                    </h3>
                    {processedImage && (
                      <button onClick={downloadImage} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/30 transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    )}
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-card flex items-center justify-center">
                    {processedImage ? (
                      <img src={processedImage} alt="Pixelated" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="text-center text-text-muted">
                        <Sliders className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>调节密度后点击生成</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 控制区 */}
              <div className="card glow-border rounded-2xl p-8 mt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Sliders className="w-6 h-6 text-neon-cyan" />
                  <h3 className="text-xl font-bold text-text-primary">像素密度调节</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-sm">低密度（强像素感）</span>
                    <span className="text-2xl font-bold gradient-text">{pixelSize}×{pixelSize}</span>
                    <span className="text-text-secondary text-sm">高密度（细节保留）</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={pixelSize}
                    onChange={(e) => setPixelSize(Number(e.target.value))}
                    className="w-full h-3 bg-card rounded-full appearance-none cursor-pointer accent-neon-cyan"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="flex-1 btn-gradient px-8 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? '处理中...' : '生成像素图'}
                  </button>
                  <button onClick={reset} className="px-8 py-4 rounded-xl border border-border text-text-primary font-semibold hover:bg-card transition-colors">
                    重置
                  </button>
                </div>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <footer className="py-12 px-6 border-t border-border/50 mt-20">
          <div className="max-w-6xl mx-auto text-center text-text-muted">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

// 演示卡片组件
function DemoCard({ title, description, tag, imageUrl, pixelSize }: {
  title: string
  description: string
  tag: string
  imageUrl: string
  pixelSize?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!pixelSize || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = document.createElement('img')
    img.onload = () => {
      canvas.width = 400
      canvas.height = 400
      ctx.drawImage(img, 0, 0, 400, 400)

      const blockSize = pixelSize
      for (let y = 0; y < 400; y += blockSize) {
        for (let x = 0; x < 400; x += blockSize) {
          try {
            const imageData = ctx.getImageData(x, y, blockSize, blockSize)
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
          } catch (e) {
            // 如果 getImageData 失败（CORS），用简单方法
            ctx.fillStyle = `hsl(${(x + y) % 360}, 70%, 60%)`
            ctx.fillRect(x, y, blockSize, blockSize)
          }
        }
      }
    }
    img.src = imageUrl
  }, [pixelSize, imageUrl])

  return (
    <div className="card glow-border rounded-xl overflow-hidden">
      <div className="aspect-square bg-card relative">
        {pixelSize ? (
          <canvas ref={canvasRef} width={400} height={400} className="w-full h-full object-cover" />
        ) : (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        )}
        <div className="absolute top-3 right-3">
          <span className="tag text-xs bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan">{tag}</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-text-primary mb-1">{title}</h4>
        <p className="text-text-secondary text-sm">{description}</p>
      </div>
    </div>
  )
}
