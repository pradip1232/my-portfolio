'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Github, Linkedin, Twitter, MapPin, Phone, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import emailjs from '@emailjs/browser'

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_rp7vuid',
  templateId: 'template_0v298z6',
  publicKey: 'cfN49vHfEJIo9-MVN',
}

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
}

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState({
    type: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Name is required' })
      return false
    }
    if (!formData.email.trim()) {
      setStatus({ type: 'error', message: 'Email is required' })
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' })
      return false
    }
    if (!formData.subject.trim()) {
      setStatus({ type: 'error', message: 'Subject is required' })
      return false
    }
    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Message is required' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus({ type: 'loading', message: 'Sending message...' })

    try {
      const result = await emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        formRef.current!,
        EMAILJS_CONFIG.publicKey
      )

      console.log('Email sent successfully:', result)
      
      setStatus({
        type: 'success',
        message: 'Message sent successfully! I\'ll get back to you soon.'
      })

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

    } catch (error: any) {
      console.error('Error sending email:', error)
      
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or contact me directly at 755201pradip@gmail.com'
      })
    }
  }

  const clearStatus = () => {
    setStatus({ type: 'idle', message: '' })
  }
  return (
    <div>
      {/* Section 1: Hero */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scrollAnimation}
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollAnimation}
          >
            Get In Touch
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              },
            }}
          >
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </motion.p>
        </div>
      </motion.section>

      {/* Section 2: Contact Information */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 bg-muted/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="mb-8 sm:mb-12 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollAnimation}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Contact Information
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Reach out through any of these channels
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5 },
                  },
                }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Get in Touch</CardTitle>
                    <CardDescription className="text-sm">Ways to reach me</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                      <a
                        href="mailto:755201pradip@gmail.com"
                        className="text-sm sm:text-base md:text-lg hover:text-primary transition-colors break-all"
                      >
                        755201pradip@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg">
                        <a href="tel:+918057196070" className="hover:text-primary transition-colors">+91 8057196070</a>,{" "}
                        <a href="tel:9258682549" className="hover:text-primary transition-colors">9258682549</a>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg">Gurugram, Sector 45, India</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, delay: 0.2 },
                  },
                }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Social Media</CardTitle>
                    <CardDescription className="text-sm">Connect with me online</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 sm:gap-4">
                      <Link
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon" className="h-10 w-10 sm:h-12 sm:w-12">
                          <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </Link>
                      <Link
                        href="https://www.linkedin.com/in/pradipmourya-61a387218/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon" className="h-10 w-10 sm:h-12 sm:w-12">
                          <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </Link>
                      <Link
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon" className="h-10 w-10 sm:h-12 sm:w-12">
                          <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 3: Contact Form */}
      <motion.section
        className="py-12 sm:py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="mb-6 sm:mb-8 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollAnimation}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Send a Message
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Fill out the form below and I&apos;ll get back to you as soon as
                possible
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6 },
                },
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Contact Form
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Send me a message and I&apos;ll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-2"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="What's this about?"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Tell me about your project, idea, or just say hello!"
                        required
                      />
                    </div>

                    <AnimatePresence>
                      {status.message && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`p-3 rounded-md flex items-center gap-2 ${
                            status.type === 'success'
                              ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                              : status.type === 'error'
                              ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                              : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                          }`}
                        >
                          {status.type === 'success' && <CheckCircle className="w-4 h-4" />}
                          {status.type === 'error' && <AlertCircle className="w-4 h-4" />}
                          {status.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                          <span className="text-sm flex-1">{status.message}</span>
                          {status.type !== 'loading' && (
                            <button
                              type="button"
                              onClick={clearStatus}
                              className="ml-auto text-xs hover:underline"
                            >
                              ✕
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={status.type === 'loading'}
                    >
                      {status.type === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
