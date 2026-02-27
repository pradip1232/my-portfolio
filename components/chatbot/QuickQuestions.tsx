'use client';

import { motion } from 'framer-motion';

interface QuickQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export default function QuickQuestions({ questions, onQuestionClick }: QuickQuestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-2"
    >
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Quick questions:
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
