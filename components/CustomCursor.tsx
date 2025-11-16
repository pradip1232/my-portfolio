'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface CustomCursorProps {
  enabled?: boolean
}

/**
 * Custom animated cursor component with dot and ring
 * Automatically disables on touch devices
 * Uses requestAnimationFrame for smooth performance
 */
export default function CustomCursor({ enabled = true }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | undefined>()

  const checkTouchDevice = useCallback(() => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    )
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const isHoverable =
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') !== null ||
      target.closest('button') !== null ||
      target.getAttribute('role') === 'link' ||
      target.classList.contains('cursor-pointer') ||
      window.getComputedStyle(target).cursor === 'pointer'

    setIsHovering(isHoverable)
  }, [])

  const handleMouseOut = useCallback(() => {
    setIsHovering(false)
  }, [])

  useEffect(() => {
    const touchDevice = checkTouchDevice()
    setIsTouchDevice(touchDevice)

    if (touchDevice || !enabled) {
      return
    }

    document.body.classList.add('custom-cursor-enabled')

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      document.body.classList.remove('custom-cursor-enabled')
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [enabled, checkTouchDevice, handleMouseMove, handleMouseLeave, handleMouseOver, handleMouseOut])

  // Update cursor positions
  useEffect(() => {
    if (dotRef.current && ringRef.current && !isTouchDevice && enabled) {
      dotRef.current.style.left = `${position.x}px`
      dotRef.current.style.top = `${position.y}px`
      ringRef.current.style.left = `${position.x}px`
      ringRef.current.style.top = `${position.y}px`
    }
  }, [position, isTouchDevice, enabled])

  // Don't render on touch devices
  if (isTouchDevice || !enabled) {
    return null
  }

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          opacity: isVisible ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovering ? 'hover' : ''}`}
        style={{
          opacity: isVisible ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </>
  )
}

