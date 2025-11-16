'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen((prev) => !prev)

  // Close menu on route change
  useEffect(() => {
    closeMenu()
  }, [pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg sm:text-xl font-bold" aria-label="Home">
            Portfolio
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="flex gap-6" role="menubar">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative px-3 py-2 text-sm font-medium transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          layoutId="navbar-indicator"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <ThemeToggle />
          </div>
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-sm"
          >
            <ul className="flex flex-col px-4 py-4 space-y-2" role="menu">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'block px-3 py-2 text-base font-medium rounded-md transition-colors',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
