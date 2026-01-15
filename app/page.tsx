"use client";

import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Code,
  Users,
  Award,
  TrendingUp,
  Star,
  MessageSquare,
} from "lucide-react";
import { getFeaturedProjects } from "@/app/projects/projectData";
import WorkingModal from "@/components/WorkingModal";
import aboutImg from '../app/assets/images/pic-removebg-preview (1).png';

// Get featured projects for home page (limit to 3 for preview)
const featuredProjects = getFeaturedProjects(3);

const stats = [
  { icon: Code, value: "17+", label: "Projects Completed" },
  { icon: Users, value: "100+", label: "Happy Clients" },
  { icon: Award, value: "4+", label: "Years Experience" },
  { icon: TrendingUp, value: "99%", label: "Client Satisfaction" },
];

const testimonials = [
  {
    name: "John Doe",
    role: "CEO, Tech Company",
    content:
      "Exceptional work! The project was delivered on time and exceeded our expectations.",
    rating: 5,
  },
  {
    name: "Jane Smith",
    role: "Product Manager",
    content:
      "Professional, creative, and reliable. Highly recommended for any web project.",
    rating: 5,
  },
  {
    name: "Mike Johnson",
    role: "Startup Founder",
    content:
      "Transformed our vision into reality. The attention to detail is remarkable.",
    rating: 5,
  },
];

const scrollAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Home() {
  return (
    <div>
      {/* modal working on this portfolio */}
      <WorkingModal />
      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: About Preview */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 bg-muted/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollAnimation}
              className="order-2 md:order-1"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                About Me
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4">
                I&apos;m a passionate full-stack developer with a love for
                creating beautiful, functional, and user-friendly web
                applications.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-6">
                With expertise in modern JavaScript frameworks, I bring ideas to
                life through clean code and thoughtful design.
              </p>
              <Link href="/about">
                <Button className="w-full sm:w-auto">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="relative aspect-square rounded-lg overflow-hidden order-1 md:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.6, delay: 0.2 },
                },
              }}
            >
              <Image
                src={aboutImg}
                alt="Profile"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 3: Skills Preview */}
      <motion.section
        className="py-12 sm:py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollAnimation}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Skills & Expertise
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Technologies I work with daily
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {["Frontend", "Backend", "Tools"].map((category, index) => (
              <motion.div
                key={category}
                className="bg-card border rounded-lg p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: index * 0.1 },
                  },
                }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  {category}
                </h3>
                <div className="space-y-2">
                  {category === "Frontend" && (
                    <>
                      <div className="text-sm sm:text-base">
                        JavaScript, jQuery, HTML, CSS, Tailwind CSS, MUI, XML
                      </div>
                      <div className="text-sm sm:text-base">
                        React, Next.js, TypeScript, Framer Motion
                      </div>
                    </>
                  )}
                  {category === "Backend" && (
                    <>
                      <div className="text-sm sm:text-base">
                        TypeScript, Node.js, Express, PHP, Python
                      </div>
                      <div className="text-sm sm:text-base">
                        MySQL, PostgreSQL, SQL, MongoDB, REST APIs
                      </div>
                    </>
                  )}
                  {category === "Tools" && (
                    <>
                      <div className="text-sm sm:text-base">
                        Git, Docker, AWS
                      </div>
                      <div className="text-sm sm:text-base">Jest, CI/CD</div>
                    </>
                  )}
                </div>
                <Link
                  href="/skills"
                  className="mt-4 inline-block text-sm sm:text-base text-primary hover:underline"
                >
                  View All Skills →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 4: Featured Projects */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 bg-muted/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollAnimation}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Some of my recent work and side projects
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: index * 0.1 },
                  },
                }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollAnimation}
          >
            <Link href="/projects">
              <Button size="lg">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 5: Stats */}
      <motion.section
        className="py-12 sm:py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      },
                    },
                  }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-muted-foreground px-1">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Section 6: Testimonials */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 bg-muted/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollAnimation}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              What Clients Say
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Testimonials from satisfied clients
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: index * 0.1 },
                  },
                }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <CardDescription className="text-base">
                      {testimonial.content}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 7: CTA */}
      <motion.section
        className="py-12 sm:py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 sm:p-8 md:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.6 },
              },
            }}
          >
            <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 sm:mb-6 text-primary" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Let&apos;s Work Together
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              Have a project in mind? I&apos;d love to hear from you. Send me a
              message and let&apos;s create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Get In Touch
                </Button>
              </Link>
              <Link href="/projects" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  View My Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
