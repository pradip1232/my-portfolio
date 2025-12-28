/**
 * Voice Control Onboarding Modal
 * Shows users how to control the website with voice commands
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Volume2, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export interface VoiceOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVoiceControl: () => void;
  autoShow?: boolean;
}

interface VoiceExample {
  id: string;
  category: string;
  english: string;
  hindi: string;
  hinglish: string;
  description: string;
  icon: string;
}

const voiceExamples: VoiceExample[] = [
  // Navigation Examples
  {
    id: 'nav-home',
    category: 'Navigation',
    english: 'Go home',
    hindi: 'Ghar jao',
    hinglish: 'Hey beast, home page kholo',
    description: 'Navigate to home page',
    icon: '🏠'
  },
  {
    id: 'nav-about',
    category: 'Navigation', 
    english: 'Open about page',
    hindi: 'About page kholo',
    hinglish: 'Hey developer, about section dikhao',
    description: 'Go to about section',
    icon: '👤'
  },
  {
    id: 'nav-projects',
    category: 'Navigation',
    english: 'Show projects',
    hindi: 'Projects dikhao',
    hinglish: 'Hey beast developer, projects page kholo',
    description: 'View portfolio projects',
    icon: '💼'
  },
  {
    id: 'nav-contact',
    category: 'Navigation',
    english: 'Open contact',
    hindi: 'Contact kholo',
    hinglish: 'Hey boss, contact page dikhao',
    description: 'Go to contact page',
    icon: '📞'
  },

  // Scrolling Examples
  {
    id: 'scroll-down',
    category: 'Scrolling',
    english: 'Scroll down',
    hindi: 'Neeche jao',
    hinglish: 'Hey beast developer, page scroll kro niche',
    description: 'Scroll down the page',
    icon: '⬇️'
  },
  {
    id: 'scroll-up',
    category: 'Scrolling',
    english: 'Scroll up',
    hindi: 'Upar jao',
    hinglish: 'Hey developer, upar scroll karo',
    description: 'Scroll up the page',
    icon: '⬆️'
  },
  {
    id: 'scroll-top',
    category: 'Scrolling',
    english: 'Go to top',
    hindi: 'Top pe jao',
    hinglish: 'Hey beast, page ke top pe le chalo',
    description: 'Scroll to top of page',
    icon: '🔝'
  },
  {
    id: 'scroll-section',
    category: 'Scrolling',
    english: 'Go to projects section',
    hindi: 'Projects section me jao',
    hinglish: 'Hey developer, projects wala section dikhao',
    description: 'Scroll to specific section',
    icon: '🎯'
  },

  // Control Examples
  {
    id: 'start-listening',
    category: 'Control',
    english: 'Start listening',
    hindi: 'Sunna shuru karo',
    hinglish: 'Hey beast, voice control on karo',
    description: 'Activate voice control',
    icon: '🎤'
  },
  {
    id: 'stop-listening',
    category: 'Control',
    english: 'Stop listening',
    hindi: 'Sunna band karo',
    hinglish: 'Hey developer, voice control off karo',
    description: 'Deactivate voice control',
    icon: '🔇'
  },

  // Fun Examples
  {
    id: 'fun-theme',
    category: 'Fun Commands',
    english: 'Toggle theme',
    hindi: 'Theme badlo',
    hinglish: 'Hey beast developer, dark mode karo',
    description: 'Switch between light/dark theme',
    icon: '🌙'
  },
  {
    id: 'fun-time',
    category: 'Fun Commands',
    english: 'What time is it',
    hindi: 'Samay kya hai',
    hinglish: 'Hey boss, time batao',
    description: 'Get current time',
    icon: '⏰'
  }
];

const categories = ['Navigation', 'Scrolling', 'Control', 'Fun Commands'];

export const VoiceOnboardingModal: React.FC<VoiceOnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartVoiceControl,
  autoShow = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);

  const steps = [
    'Welcome',
    'How it Works', 
    'Voice Examples',
    'Get Started'
  ];

  const categoryExamples = voiceExamples.filter(
    example => example.category === categories[currentCategory]
  );

  // Auto-advance examples
  useEffect(() => {
    if (isPlaying && currentStep === 2) {
      const interval = setInterval(() => {
        setCurrentExample(prev => 
          prev >= categoryExamples.length - 1 ? 0 : prev + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentStep, categoryExamples.length]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartVoiceControl = () => {
    onStartVoiceControl();
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.2 }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Voice Control</h2>
                <p className="text-blue-100">Control this website with your voice!</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Step 0: Welcome */}
                {currentStep === 0 && (
                  <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">🎤</div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome to Voice Control!
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                      Navigate this portfolio website using just your voice. 
                      No clicking required!
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-blue-800 dark:text-blue-200 font-medium">
                        🌟 Say commands in English, Hindi, or Hinglish!
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 1: How it Works */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                      How Voice Control Works
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-3xl mb-2">🎤</div>
                        <h4 className="font-semibold mb-2">1. Click & Speak</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Click the microphone button and speak your command
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-3xl mb-2">🧠</div>
                        <h4 className="font-semibold mb-2">2. AI Understands</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Our AI recognizes your voice in multiple languages
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-3xl mb-2">⚡</div>
                        <h4 className="font-semibold mb-2">3. Action Happens</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          The website responds instantly to your command
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        🌐 Browser Support
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        Works best in Chrome and Edge. Make sure to allow microphone access!
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Voice Examples */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Voice Command Examples
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Try these commands to control the website
                      </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {categories.map((category, index) => (
                        <button
                          key={category}
                          onClick={() => {
                            setCurrentCategory(index);
                            setCurrentExample(0);
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            currentCategory === index
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Example Display */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {categoryExamples[currentExample]?.icon}
                          </span>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {categoryExamples[currentExample]?.description}
                          </h4>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setCurrentExample(0)}
                            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">🇺🇸 English</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            "{categoryExamples[currentExample]?.english}"
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">🇮🇳 Hindi</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            "{categoryExamples[currentExample]?.hindi}"
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gradient-to-r from-orange-100 to-green-100 dark:from-orange-900/20 dark:to-green-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-700">
                          <div className="text-xs text-orange-600 dark:text-orange-400 mb-1 font-semibold">
                            🔥 Hinglish (Recommended)
                          </div>
                          <div className="font-bold text-orange-800 dark:text-orange-200">
                            "{categoryExamples[currentExample]?.hinglish}"
                          </div>
                        </div>
                      </div>

                      {/* Example Navigation */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={() => setCurrentExample(prev => 
                            prev > 0 ? prev - 1 : categoryExamples.length - 1
                          )}
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </button>
                        
                        <div className="text-sm text-gray-500">
                          {currentExample + 1} of {categoryExamples.length}
                        </div>
                        
                        <button
                          onClick={() => setCurrentExample(prev => 
                            prev < categoryExamples.length - 1 ? prev + 1 : 0
                          )}
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Get Started */}
                {currentStep === 3 && (
                  <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Ready to Get Started?
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                      Click the button below to activate voice control and start commanding this website!
                    </p>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                        🎯 Quick Start Tips:
                      </h4>
                      <div className="text-left space-y-2 text-green-700 dark:text-green-300">
                        <p>• Start with simple commands like "go home"</p>
                        <p>• Speak clearly and wait for the response</p>
                        <p>• Try Hinglish for the most fun experience!</p>
                        <p>• Use "Hey beast developer" as a wake word</p>
                      </div>
                    </div>

                    <button
                      onClick={handleStartVoiceControl}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
                    >
                      <Volume2 className="w-6 h-6" />
                      Activate Voice Control
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartVoiceControl}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};