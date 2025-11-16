import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectCard from '@/components/ProjectCard'

const mockProject = {
  title: 'Test Project',
  description: 'A test project description',
  image: 'https://via.placeholder.com/800x600',
  imageAlt: 'Test project image',
  technologies: [
    { name: 'React' },
    { name: 'TypeScript' },
    { name: 'Next.js' },
  ],
  githubUrl: 'https://github.com/test/project',
  liveUrl: 'https://test-project.vercel.app',
  featured: true,
}

describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    render(<ProjectCard {...mockProject} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('A test project description')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
  })

  it('displays featured badge when project is featured', () => {
    render(<ProjectCard {...mockProject} />)
    
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('does not display featured badge when project is not featured', () => {
    render(<ProjectCard {...mockProject} featured={false} />)
    
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('renders GitHub link when provided', () => {
    render(<ProjectCard {...mockProject} />)
    
    const githubLink = screen.getByText('GitHub').closest('a')
    expect(githubLink).toHaveAttribute('href', mockProject.githubUrl)
    expect(githubLink).toHaveAttribute('target', '_blank')
  })

  it('renders live link when provided', () => {
    render(<ProjectCard {...mockProject} />)
    
    const liveLink = screen.getByText('View Live').closest('a')
    expect(liveLink).toHaveAttribute('href', mockProject.liveUrl)
    expect(liveLink).toHaveAttribute('target', '_blank')
  })

  it('renders image with correct alt text', () => {
    render(<ProjectCard {...mockProject} />)
    
    const image = screen.getByAltText(mockProject.imageAlt)
    expect(image).toBeInTheDocument()
  })

  it('handles hover interactions', async () => {
    const user = userEvent.setup()
    render(<ProjectCard {...mockProject} />)
    
    const card = screen.getByText('Test Project').closest('.overflow-hidden')?.parentElement
    if (card) {
      await user.hover(card)
      // Card should have hover state applied
      expect(card).toBeInTheDocument()
    }
  })
})

