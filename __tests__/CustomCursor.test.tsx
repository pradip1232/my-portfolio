import { render, screen } from '@testing-library/react'
import CustomCursor from '@/components/CustomCursor'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('CustomCursor', () => {
  beforeEach(() => {
    // Reset touch detection
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 0,
    })
    // @ts-ignore
    delete window.ontouchstart
  })

  it('renders cursor elements when enabled and not on touch device', () => {
    render(<CustomCursor enabled={true} />)
    
    const dot = document.querySelector('.custom-cursor-dot')
    const ring = document.querySelector('.custom-cursor-ring')
    
    expect(dot).toBeInTheDocument()
    expect(ring).toBeInTheDocument()
  })

  it('does not render on touch devices', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 1,
    })

    render(<CustomCursor enabled={true} />)
    
    const dot = document.querySelector('.custom-cursor-dot')
    const ring = document.querySelector('.custom-cursor-ring')
    
    expect(dot).not.toBeInTheDocument()
    expect(ring).not.toBeInTheDocument()
  })

  it('does not render when disabled', () => {
    render(<CustomCursor enabled={false} />)
    
    const dot = document.querySelector('.custom-cursor-dot')
    const ring = document.querySelector('.custom-cursor-ring')
    
    expect(dot).not.toBeInTheDocument()
    expect(ring).not.toBeInTheDocument()
  })

  it('adds custom-cursor-enabled class to body when enabled', () => {
    render(<CustomCursor enabled={true} />)
    
    expect(document.body.classList.contains('custom-cursor-enabled')).toBe(true)
  })
})

