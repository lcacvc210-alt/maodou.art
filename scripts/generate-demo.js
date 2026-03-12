const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
const path = require('path')

async function createPixelatedImage() {
  try {
    // 加载原图
    const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg'
    const img = await loadImage(imgUrl)
    
    // 创建画布
    const size = 256
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')
    
    // 先绘制原图
    ctx.drawImage(img, 0, 0, size, size)
    
    // 像素化处理（16×16 网格）
    const pixelSize = 16
    const blockSize = Math.floor(size / pixelSize)
    
    for (let blockY = 0; blockY < pixelSize; blockY++) {
      for (let blockX = 0; blockX < pixelSize; blockX++) {
        const x = blockX * blockSize
        const y = blockY * blockSize
        
        // 获取像素块数据
        const imageData = ctx.getImageData(x, y, blockSize, blockSize)
        const data = imageData.data
        
        // 计算平均色
        let r = 0, g = 0, b = 0, count = 0
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            count++
          }
        }
        
        if (count > 0) {
          r = Math.round(r / count)
          g = Math.round(g / count)
          b = Math.round(b / count)
          
          // 填充像素块
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(x, y, blockSize, blockSize)
        }
      }
    }
    
    // 保存
    const buffer = canvas.toBuffer('image/png')
    const outputPath = path.join(__dirname, 'demo', 'pixel-girl.png')
    fs.writeFileSync(outputPath, buffer)
    
    console.log('✅ 像素图已生成：', outputPath)
  } catch (error) {
    console.error('❌ 生成失败:', error)
  }
}

createPixelatedImage()
