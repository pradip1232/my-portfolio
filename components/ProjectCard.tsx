'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Github } from 'lucide-react'
import { useState, useCallback } from 'react'

interface TechBadge {
  name: string
  color?: string
}

interface ProjectCardProps {
  title: string
  description: string
  image: string
  imageAlt: string
  technologies: TechBadge[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
}

/**
 * Animated project card with 3D hover tilt effect
 */
export default function ProjectCard({
  title,
  description,
  image,
  imageAlt,
  technologies,
  githubUrl,
  liveUrl,
  featured = false,
}: ProjectCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setRotate({ x: rotateX, y: rotateY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="h-full"
    >
      <Card
        className={`h-full overflow-hidden transition-all duration-300 ${
          featured ? 'border-2 border-primary' : ''
        } ${isHovered ? 'shadow-2xl' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={featured}
            quality={85}
          />
          {featured && (
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              Featured
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {githubUrl && (
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </Link>
          )}
          {liveUrl && (
            <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

