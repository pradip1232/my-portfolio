'use client'

import Link from 'next/link'
import { Mail, Phone, Github, Linkedin, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const version = 'v3.2.0'

  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Contact Info */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <motion.a
              href="tel:+918057196070"
              className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+91 80571 96070</span>
              <span className="sm:hidden">Call</span>
            </motion.a>
            <motion.a
              href="mailto:755201pradip@gmail.com"
              className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">755201pradip@gmail.com</span>
              <span className="sm:hidden">Email</span>
            </motion.a>
          </div>

          {/* Center: Copyright */}
          <div className="text-xs sm:text-sm text-muted-foreground text-center">
            © {currentYear} Portfolio. All rights reserved.
          </div>

          {/* Right: Social Media Links & Version */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Social Media Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.a
                href="https://github.com/pradip1232"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/pradipmourya-61a387218/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.a>
              <motion.a
                // href="https://twitter.com/pradipmourya_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.a>
            </div>

            
            <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l">
              <motion.div
                className="text-xs sm:text-sm text-muted-foreground font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {version}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
