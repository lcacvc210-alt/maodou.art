'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Download, Image, Grid3X3, Sliders } from 'lucide-react'

// 梵高自画像示例（公共版权）
const VAN_GOGH_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg/800px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg'

export default function PixelArtPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [pixelSize, setPixelSize] = useState(16) // 像素块大小（每边的块数）
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDemo, setShowDemo] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const demoCanvasRef = useRef<HTMLCanvasElement>(null)
  const [demoStage, setDemoStage] = useState(0) // 0=原图，1=低密度，2=高密度
  const [isAnimating, setIsAnimating] = useState(false)

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

  // 像素化处理
  const processImage = () => {
    if (!uploadedImage || !canvasRef.current) return

    setIsProcessing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // 设置画布大小为原图大小
      canvas.width = img.width
      canvas.height = img.height

      // 计算像素块大小
      const blockSize = Math.floor(img.width / pixelSize)
      
      // 遍历每个像素块
      for (let y = 0; y < img.height; y += blockSize) {
        for (let x = 0; x < img.width; x += blockSize) {
          // 获取像素块内的平均颜色
          const imageData = ctx.getImageData(x, y, blockSize, blockSize)
          const data = imageData.data
          
          let r = 0, g = 0, b = 0, count = 0
          for (let i = 0; i < data.length; i += 4) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            count++
          }
          
          r = Math.round(r / count)
          g = Math.round(g / count)
          b = Math.round(b / count)
          
          // 填充整个像素块为平均色
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(x, y, blockSize, blockSize)
        }
      }

      setProcessedImage(canvas.toDataURL('image/png'))
      setIsProcessing(false)
    }
    img.src = uploadedImage
  }

  // 下载处理后的图片
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

  // 演示动画
  const playDemoAnimation = () => {
    if (!demoCanvasRef.current || isAnimating) return
    setIsAnimating(true)
    setDemoStage(0)

    const canvas = demoCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // 阶段 1：显示原图（2 秒）
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      setTimeout(() => {
        // 阶段 2：切割动画（1 秒）- 叠加网格线
        animateCut(ctx, canvas.width, canvas.height, 8, () => {
          // 恢复原图
          ctx.putImageData(originalImageData, 0, 0)
          // 阶段 3：像素化处理
          pixelate(ctx, img, canvas.width, canvas.height, 8, () => {
            setDemoStage(1)
            const lowPixelData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            
            setTimeout(() => {
              // 阶段 4：再次切割
              animateCut(ctx, canvas.width, canvas.height, 32, () => {
                // 恢复低密度像素图
                ctx.putImageData(lowPixelData, 0, 0)
                // 阶段 5：高密度像素化
                pixelate(ctx, img, canvas.width, canvas.height, 32, () => {
                  setDemoStage(2)
                  setIsAnimating(false)
                })
              })
            }, 1500)
          })
        })
      }, 2000)
    }
    img.onerror = () => {
      console.error('图片加载失败')
      setIsAnimating(false)
      alert('演示图片加载失败，请上传自己的图片测试')
    }
    img.src = VAN_GOGH_URL
  }

  // 切割动画（不清除画布，只叠加网格线）
  const animateCut = (ctx: CanvasRenderingContext2D, width: number, height: number, gridSize: number, callback: () => void) => {
    const blockSize = width / gridSize
    let progress = 0
    const animate = () => {
      progress += 0.05
      if (progress >= 1) {
        callback()
        return
      }

      // 绘制网格切割效果（半透明叠加）
      for (let y = 0; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${progress * 0.5})`
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, blockSize, blockSize)
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }

  // 像素化处理 - 从 ImageData 计算
  const pixelate = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number, gridSize: number, callback: () => void) => {
    // 创建一个离屏 canvas 来获取图像数据
    const offCanvas = document.createElement('canvas')
    offCanvas.width = width
    offCanvas.height = height
    const offCtx = offCanvas.getContext('2d')
    if (!offCtx) {
      callback()
      return
    }

    // 绘制图片到离屏 canvas
    offCtx.drawImage(img, 0, 0, width, height)
    
    const blockSize = width / gridSize
    let currentBlock = 0
    const totalBlocks = gridSize * gridSize

    const processNextBlock = () => {
      if (currentBlock >= totalBlocks) {
        callback()
        return
      }

      const row = Math.floor(currentBlock / gridSize)
      const col = currentBlock % gridSize
      const x = col * blockSize
      const y = row * blockSize

      try {
        // 从离屏 canvas 获取像素数据（避免 CORS 问题）
        const imageData = offCtx.getImageData(x, y, blockSize, blockSize)
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
          
          // 填充整个像素块为平均色
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(x, y, blockSize, blockSize)
        }
      } catch (e) {
        console.error('像素化失败:', e)
        // 失败时使用随机色块作为备选
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`
        ctx.fillRect(x, y, blockSize, blockSize)
      }

      currentBlock++
      setTimeout(processNextBlock, 20) // 每块间隔 20ms
    }

    processNextBlock()
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="cyber-grid" />
        <div className="glow-orb glow-orb-1" />
      </div>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            返回工具列表
          </Link>

          {/* 页面标题 */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-6">🕹️</div>
            <h1 className="text-5xl font-bold gradient-text mb-4">
              像素图转换器
            </h1>
            <p className="text-text-secondary text-lg">
              上传图片，通过像素网格切分重组，生成创意像素艺术
            </p>
          </div>

          {/* 示例演示区 - 动态动画 */}
          {showDemo && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  🎨 像素化过程演示
                </h2>
                <p className="text-text-secondary">
                  看梵高自画像如何一步步变成像素艺术
                </p>
              </div>

              <div className="card glow-border rounded-2xl p-8">
                {/* 演示画布 */}
                <div className="aspect-video bg-card rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                  <canvas
                    ref={demoCanvasRef}
                    width={800}
                    height={450}
                    className="max-w-full max-h-full"
                  />
                </div>

                {/* 阶段指示器 */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <StageIndicator stage={0} current={demoStage} label="原图" icon="🖼️" />
                  <div className={`w-16 h-1 bg-card rounded-full ${demoStage >= 1 ? 'bg-gradient-to-r from-neon-cyan to-neon-purple' : ''}`} />
                  <StageIndicator stage={1} current={demoStage} label="低密度像素" icon="🎨" />
                  <div className={`w-16 h-1 bg-card rounded-full ${demoStage >= 2 ? 'bg-gradient-to-r from-neon-cyan to-neon-purple' : ''}`} />
                  <StageIndicator stage={2} current={demoStage} label="高密度像素" icon="✨" />
                </div>

                {/* 控制按钮 */}
                <div className="text-center">
                  <button
                    onClick={playDemoAnimation}
                    disabled={isAnimating}
                    className="btn-gradient px-8 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnimating ? '🎬 演示中...' : '▶️ 播放演示动画'}
                  </button>
                  <p className="text-text-muted text-sm mt-4">
                    点击播放，观看从原图到像素艺术的变换过程
                  </p>
                </div>

                {/* 说明文字 */}
                <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="font-bold text-text-primary mb-1">原图</div>
                    <div className="text-text-muted text-xs">梵高自画像（1887）</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="font-bold text-text-primary mb-1">8×8 网格</div>
                    <div className="text-text-muted text-xs">低密度，强像素感，卡通风格</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">✨</div>
                    <div className="font-bold text-text-primary mb-1">32×32 网格</div>
                    <div className="text-text-muted text-xs">高密度，细节保留，艺术感</div>
                  </div>
                </div>
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
                支持 JPG、PNG、GIF 格式，最大 10MB
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
              <p className="text-text-muted text-sm mt-4">
                或直接拖拽图片到此处
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 左侧：原图预览 */}
              <div className="card glow-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    原图
                  </h3>
                  <button
                    onClick={reset}
                    className="text-text-secondary hover:text-neon-cyan text-sm"
                  >
                    更换图片
                  </button>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden bg-card flex items-center justify-center">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* 右侧：处理后预览 */}
              <div className="card glow-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5" />
                    像素效果
                  </h3>
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
                <div className="aspect-square rounded-xl overflow-hidden bg-card flex items-center justify-center">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Pixelated"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-text-muted">
                      <Sliders className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>调节像素密度后点击处理</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 控制区域 */}
          {uploadedImage && (
            <div className="card glow-border rounded-2xl p-8 mt-8">
              <div className="flex items-center gap-2 mb-6">
                <Sliders className="w-6 h-6 text-neon-cyan" />
                <h3 className="text-xl font-bold text-text-primary">
                  像素密度调节
                </h3>
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
                <div className="flex justify-between mt-2 text-text-muted text-xs">
                  <span>4×4</span>
                  <span>16×16</span>
                  <span>32×32</span>
                  <span>64×64</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="flex-1 btn-gradient px-8 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '处理中...' : '生成像素图'}
                </button>
                <button
                  onClick={reset}
                  className="px-8 py-4 rounded-xl border border-border text-text-primary font-semibold hover:bg-card transition-colors"
                >
                  重置
                </button>
              </div>

              {/* 效果说明 */}
              <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/50">
                <EffectInfo
                  density="4×4 - 8×8"
                  effect="强像素感，卡通风格明显"
                  bestFor="头像、图标、艺术创作"
                />
                <EffectInfo
                  density="16×16 - 32×32"
                  effect="平衡细节与像素感"
                  bestFor="风景、人物、通用场景"
                />
                <EffectInfo
                  density="48×48 - 64×64"
                  effect="细节保留多，轻微像素化"
                  bestFor="高清图片、精细作品"
                />
              </div>
            </div>
          )}

          {/* 隐藏画布用于处理 */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50 mt-20">
          <div className="max-w-6xl mx-auto text-center text-text-muted">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

// 阶段指示器组件
function StageIndicator({ stage, current, label, icon }: {
  stage: number
  current: number
  label: string
  icon: string
}) {
  const isActive = current === stage
  const isCompleted = current > stage

  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${
      isActive ? 'scale-110' : isCompleted ? 'opacity-70' : 'opacity-40'
    }`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-r from-neon-cyan to-neon-purple shadow-lg shadow-neon-cyan/50' 
          : isCompleted
          ? 'bg-neon-cyan/20 border-2 border-neon-cyan/50'
          : 'bg-card border-2 border-border'
      }`}>
        {icon}
      </div>
      <div className={`text-sm font-medium transition-colors ${
        isActive ? 'text-neon-cyan' : 'text-text-muted'
      }`}>
        {label}
      </div>
    </div>
  )
}

// 效果说明组件
function EffectInfo({ density, effect, bestFor }: {
  density: string
  effect: string
  bestFor: string
}) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold gradient-text mb-2">{density}</div>
      <div className="text-text-secondary text-sm mb-1">{effect}</div>
      <div className="text-text-muted text-xs">适合：{bestFor}</div>
    </div>
  )
}
