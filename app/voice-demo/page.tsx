/**
 * Voice Control Demo Page
 * Comprehensive demo of voice control with onboarding
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  VoiceControlButton, 
  VoiceControlProvider, 
  VoiceOnboardingModal,
  useVoiceOnboarding 
} from '../../voice-control';

const VoiceDemoContent: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const {
    showModal,
    openModal,
    closeModal,
    markAsCompleted,
    resetOnboarding
  } = useVoiceOnboarding({ autoShow: false });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleStartVoiceControl = () => {
    markAsCompleted();
    console.log('Voice control activated!');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎤 Voice Control Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the future of web interaction with voice commands in English, Hindi, and Hinglish!
          </p>
        </motion.div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Demo Controls</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={openModal}
                className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-3xl mb-2">🎓</div>
                <div className="font-semibold">Show Onboarding</div>
                <div className="text-sm opacity-90 mt-1">Learn voice commands</div>
              </button>

              <button
                onClick={toggleTheme}
                className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-3xl mb-2">{theme === 'light' ? '🌙' : '☀️'}</div>
                <div className="font-semibold">Toggle Theme</div>
                <div className="text-sm opacity-90 mt-1">Try "theme badlo"</div>
              </button>

              <button
                onClick={resetOnboarding}
                className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-3xl mb-2">🔄</div>
                <div className="font-semibold">Reset Demo</div>
                <div className="text-sm opacity-90 mt-1">Start fresh</div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Voice Command Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Try These Voice Commands</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* English Commands */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🇺🇸</span>
                <h3 className="text-xl font-semibold">English</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">"Go home"</div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">"Show projects"</div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">"Scroll down"</div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">"Open contact"</div>
              </div>
            </div>

            {/* Hindi Commands */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🇮🇳</span>
                <h3 className="text-xl font-semibold">Hindi</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">"Ghar jao"</div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">"Projects dikhao"</div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">"Neeche jao"</div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">"Contact kholo"</div>
              </div>
            </div>

            {/* Hinglish Commands */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-orange-200 dark:border-orange-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔥</span>
                <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400">Hinglish (Best!)</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded font-medium">
                  "Hey beast developer, page scroll kro niche"
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded font-medium">
                  "Hey boss, home page kholo"
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded font-medium">
                  "Beast developer, projects dikhao"
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded font-medium">
                  "Hey developer, theme badlo"
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Demo Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Demo Sections</h2>
          
          <div id="hero" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">🏠 Hero Section</h3>
            <p>Say "go to hero" or "Hey beast developer, hero section dikhao"</p>
          </div>

          <div id="about" className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">👤 About Section</h3>
            <p>Say "scroll to about" or "Hey developer, about section me jao"</p>
          </div>

          <div id="projects" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">💼 Projects Section</h3>
            <p>Say "show projects" or "Hey beast, projects wala section dikhao"</p>
          </div>

          <div id="contact" className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">📞 Contact Section</h3>
            <p>Say "open contact" or "Hey boss developer, contact page kholo"</p>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mx-auto mt-12"
        >
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
              🎯 How to Test
            </h3>
            <ol className="text-yellow-700 dark:text-yellow-300 space-y-2 text-sm">
              <li>1. Click the microphone button (bottom-right)</li>
              <li>2. Allow microphone access when prompted</li>
              <li>3. Try any of the voice commands above</li>
              <li>4. Watch the magic happen! ✨</li>
            </ol>
          </div>
        </motion.div>
      </div>

      {/* Onboarding Modal */}
      <VoiceOnboardingModal
        isOpen={showModal}
        onClose={closeModal}
        onStartVoiceControl={handleStartVoiceControl}
      />
    </div>
  );
};

export default function VoiceDemoPage() {
  return (
    <VoiceControlProvider
      config={{
        confidence: 0.6,
        continuous: true,
        interimResults: true,
        languages: ['en-US', 'hi-IN']
      }}
      autoStart={false}
      enableWakeWords={true}
      enableSpeechFeedback={true}
      onCommand={(result) => {
        console.log('🎤 Voice command:', result);
      }}
      customCallbacks={{
        'toggle-theme': () => {
          // This would be handled by the component
          console.log('Theme toggle requested via voice');
        }
      }}
    >
      <VoiceDemoContent />
      
      {/* Voice Control Button with Onboarding */}
      <VoiceControlButton
        position="bottom-right"
        size="lg"
        showTranscript={true}
        showCommands={true}
        showOnboarding={true}
      />
    </VoiceControlProvider>
  );
}