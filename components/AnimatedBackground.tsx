'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from './ThemeProvider'

export default function AnimatedBackground() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const mousePosRef = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const gridSize = 50
    let cells: Array<{ x: number; y: number }> = []

    const initCells = () => {
      cells = []
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          cells.push({ x, y })
        }
      }
    }

    initCells()

    let animationTime = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mousePos = mousePosRef.current
      const baseOpacity = theme === 'dark' ? 0.08 : 0.03
      const maxOpacity = theme === 'dark' ? 0.25 : 0.15
      const maxDistance = 250

      // Draw grid cells
      cells.forEach((cell) => {
        const distance = Math.sqrt(
          Math.pow(cell.x + gridSize / 2 - mousePos.x, 2) +
          Math.pow(cell.y + gridSize / 2 - mousePos.y, 2)
        )
        const influence = Math.max(0, 1 - distance / maxDistance)
        const opacity = Math.min(maxOpacity, baseOpacity + influence * (maxOpacity - baseOpacity))

        ctx.fillStyle =
          theme === 'dark'
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(0, 0, 0, ${opacity})`
        ctx.fillRect(cell.x + 1, cell.y + 1, gridSize - 2, gridSize - 2)
      })

      // Draw animated vertical lines (dark mode only)
      if (theme === 'dark') {
        animationTime += 0.01
        const lineCount = 5
        const lineSpacing = canvas.width / (lineCount + 1)

        for (let i = 1; i <= lineCount; i++) {
          const baseX = lineSpacing * i
          const offset = Math.sin(animationTime + i * 0.5) * 40
          const x = baseX + offset

          const gradient = ctx.createLinearGradient(x, 0, x, canvas.height)
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
          gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)')
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)')
          gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)')
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [theme, mounted])

  if (!mounted) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        opacity: 0.6,
      }}
    />
  )
}

