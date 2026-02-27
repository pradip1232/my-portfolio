'use client';

import { motion } from 'framer-motion';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  index: number;
}

export default function ChatMessage({ message, index }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          message.role === 'user'
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}
