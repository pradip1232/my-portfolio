// Project data type definition
export interface Project {
  title: string
  description: string
  image: string
  imageAlt: string
  technologies: Array<{ name: string }>
  githubUrl?: string
  liveUrl?: string
  featured: boolean
}

// All projects data
export const allProjects: Project[] = [
  {
    title: "Pesticide Management System",
    description:
      "Comprehensive pesticide management platform with user and admin dashboards. Features product catalog, order management, inventory tracking, and safety guidelines. Built with React.js, PHP, MySQL, and deployed via cPanel with CI/CD pipeline.",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
    imageAlt: "Pesticide Management System",
    technologies: [
      { name: "React.js" },
      { name: "JavaScript" },
      { name: "PHP" },
      { name: "MySQL" },
      { name: "cPanel" },
      { name: "CI/CD" },
      { name: "REST API" },
    ],
    githubUrl: "https://github.com/username/pesticide-management",
    liveUrl: "https://pesticide-system.example.com",
    featured: true,
  },
  {
    title: "Admin Panel for Product Management",
    description:
      "Admin panel for product management with uploads, pricing, and inventory. Built with ReactJS, Tailwind CSS, Material-UI, PHP, and MySQL. Deployed via cPanel or GCP for scalability.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    imageAlt: "Admin Panel Product Management",
    technologies: [
      { name: "ReactJS" },
      { name: "Tailwind CSS" },
      { name: "Material-UI" },
      { name: "PHP" },
      { name: "MySQL" },
      { name: "cPanel" },
      { name: "GCP" },
    ],
    githubUrl: "https://github.com/username/admin-panel-products",
    liveUrl: "https://adminpanel-demo.example.com",
    featured: true,
  },
  {
    title: "Jewelry - Jewelry E-Commerce",
    description:
      "A stunning jewelry e-commerce platform built with Next.js, MongoDB, Stripe, and Tailwind CSS. Features product search, collection browse, secured checkout and beautiful UI.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop",
    imageAlt: "Jewelry E-Commerce Platform",
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "MongoDB" },
      { name: "Stripe" },
      { name: "Tailwind CSS" },
    ],
    githubUrl: "https://github.com/username/jwelley-ecommerce",
    liveUrl: "https://jwelley.vercel.app",
    featured: true,
  },
  {
    title: "EduPro - Education Platform",
    description:
      "An online education platform for interactive courses, quizzes, and progress tracking. Built with React, Node.js, Express, and PostgreSQL.",
    image:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&h=600&fit=crop",
    imageAlt: "EduPro Education Platform",
    technologies: [
      { name: "React" },
      { name: "Node.js" },
      { name: "Express" },
      { name: "PostgreSQL" },
      { name: "Chakra UI" },
    ],
    githubUrl: "https://github.com/username/edupro-platform",
    liveUrl: "https://edupro-demo.vercel.app",
    featured: true,
  },
  {
    title: "TradeConnect - B2B Platform",
    description:
      "A B2B marketplace connecting manufacturers and retailers, with secure messaging, deal management, and analytics. Built using Next.js, NestJS, AWS, and GraphQL.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    imageAlt: "TradeConnect B2B Marketplace",
    technologies: [
      { name: "Next.js" },
      { name: "NestJS" },
      { name: "GraphQL" },
      { name: "AWS" },
      { name: "TypeScript" },
    ],
    githubUrl: "https://github.com/username/tradeconnect-b2b",
    liveUrl: "https://tradeconnect.vercel.app",
    featured: true,
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    imageAlt: "Task Management App",
    technologies: [
      { name: "React" },
      { name: "Node.js" },
      { name: "Socket.io" },
      { name: "PostgreSQL" },
    ],
    githubUrl: "https://github.com/username/task-manager",
    liveUrl: "https://task-manager-demo.vercel.app",
    featured: false,
  },
  {
    title: "Social Media Dashboard",
    description:
      "Analytics dashboard for social media metrics with data visualization, real-time updates, and comprehensive reporting features.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    imageAlt: "Social Media Dashboard",
    technologies: [
      { name: "Next.js" },
      { name: "Chart.js" },
      { name: "Prisma" },
      { name: "NextAuth" },
    ],
    githubUrl: "https://github.com/username/social-dashboard",
    liveUrl: "https://social-dashboard-demo.vercel.app",
    featured: false,
  },
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform built with Next.js, MongoDB, and Stripe. Features include user authentication, product management, shopping cart, and payment processing.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    imageAlt: "E-Commerce Platform",
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "MongoDB" },
      { name: "Stripe" },
      { name: "Tailwind CSS" },
    ],
    githubUrl: "https://github.com/username/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.vercel.app",
    featured: false,
  },
]

// Get featured projects only
export const featuredProjects: Project[] = allProjects.filter(
  (project) => project.featured
)

// Get non-featured projects
export const nonFeaturedProjects: Project[] = allProjects.filter(
  (project) => !project.featured
)

// Helper function to get projects by limit
export const getProjects = (limit?: number): Project[] => {
  if (limit) {
    return allProjects.slice(0, limit)
  }
  return allProjects
}

// Helper function to get featured projects by limit
export const getFeaturedProjects = (limit?: number): Project[] => {
  if (limit) {
    return featuredProjects.slice(0, limit)
  }
  return featuredProjects
}
