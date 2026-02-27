'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle chat"
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.svg
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="chat"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
