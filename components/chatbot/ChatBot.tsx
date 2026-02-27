'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Message } from './types';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

const QUICK_QUESTIONS = [
  'Show React projects',
  'What are his skills?',
  'Is he available for freelance?',
  'Contact information',
];

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi 👋 I'm Atul AI. Ask me about his skills, projects, or experience.",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    
    if (!textToSend || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            input={input}
            onInputChange={setInput}
            onSendMessage={sendMessage}
            quickQuestions={QUICK_QUESTIONS}
          />
        )}
      </AnimatePresence>
    </>
  );
}
