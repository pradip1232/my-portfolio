'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_rp7vuid',
  templateId: 'template_0v298z6',
  publicKey: 'cfN49vHfEJIo9-MVN',
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

function EmailJSForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<FormStatus>({
    type: 'idle',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Name is required' });
      return false;
    }
    if (!formData.email.trim()) {
      setStatus({ type: 'error', message: 'Email is required' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.subject.trim()) {
      setStatus({ type: 'error', message: 'Subject is required' });
      return false;
    }
    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Message is required' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      const result = await emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        formRef.current!,
        EMAILJS_CONFIG.publicKey
      );

      console.log('Email sent successfully:', result);
      
      setStatus({
        type: 'success',
        message: 'Message sent successfully! I\'ll get back to you soon.'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error: any) {
      console.error('Error sending email:', error);
      
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or contact me directly at 755201pradip@gmail.com'
      });
    }
  };

  const clearStatus = () => {
    setStatus({ type: 'idle', message: '' });
  };

  return (
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
            <label htmlFor="name" className="block text-sm font-medium mb-2">
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
            <label htmlFor="email" className="block text-sm font-medium mb-2">
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
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
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
            <label htmlFor="message" className="block text-sm font-medium mb-2">
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
  );
}

export default EmailJSForm;