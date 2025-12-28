/**
 * Voice Control Test Component
 * Simple test to verify the voice control system works
 */

'use client';

import React from 'react';
import { VoiceControlButton, VoiceControlProvider } from '../index';

export const VoiceControlTest: React.FC = () => {
  return (
    <VoiceControlProvider
      config={{
        confidence: 0.7,
        continuous: true,
        interimResults: true
      }}
      autoStart={false}
      enableWakeWords={true}
      enableSpeechFeedback={true}
      onCommand={(result) => {
        console.log('✅ Voice command executed:', result);
        alert(`Command executed: ${result.message}`);
      }}
      onError={(error) => {
        console.error('❌ Voice control error:', error);
        alert(`Voice error: ${error}`);
      }}
      onStateChange={(state) => {
        console.log('🔄 Voice state changed:', {
          isListening: state.isListening,
          isSupported: state.isSupported,
          lastTranscript: state.lastTranscript,
          confidence: state.confidence
        });
      }}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            🎤 Voice Control Test
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Test Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                📋 Test Instructions
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. Click the microphone button</h3>
                  <p className="text-sm">The floating button in the bottom-right corner</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">2. Try these commands:</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• "go home"</li>
                    <li>• "show projects"</li>
                    <li>• "scroll down"</li>
                    <li>• "go to top"</li>
                    <li>• "stop listening"</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">3. Try Hindi commands:</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• "ghar jao"</li>
                    <li>• "projects dikhao"</li>
                    <li>• "neeche jao"</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">4. Try wake words:</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• "Hey portfolio, go home"</li>
                    <li>• "Portfolio suno, ghar jao"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Test Sections */}
            <div className="space-y-6">
              <div id="hero" className="bg-blue-100 dark:bg-blue-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  🏠 Hero Section
                </h3>
                <p className="text-blue-700 dark:text-blue-200">
                  Say "go to hero" to scroll here
                </p>
              </div>

              <div id="about" className="bg-green-100 dark:bg-green-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-100">
                  👤 About Section
                </h3>
                <p className="text-green-700 dark:text-green-200">
                  Say "scroll to about" to scroll here
                </p>
              </div>

              <div id="projects" className="bg-purple-100 dark:bg-purple-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-purple-900 dark:text-purple-100">
                  💼 Projects Section
                </h3>
                <p className="text-purple-700 dark:text-purple-200">
                  Say "show projects" or "scroll to projects"
                </p>
              </div>

              <div id="contact" className="bg-orange-100 dark:bg-orange-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-orange-900 dark:text-orange-100">
                  📞 Contact Section
                </h3>
                <p className="text-orange-700 dark:text-orange-200">
                  Say "go to contact" to scroll here
                </p>
              </div>
            </div>
          </div>

          {/* Browser Support Info */}
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              🌐 Browser Support
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Voice control works best in Chrome/Edge. Safari has limited support. Firefox is not supported.
              Make sure to allow microphone access when prompted.
            </p>
          </div>

          {/* Debug Info */}
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              🐛 Debug Info
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Check the browser console for detailed logs. Command results will also show as alerts.
            </p>
          </div>
        </div>

        {/* Voice Control Button */}
        <VoiceControlButton
          position="bottom-right"
          size="lg"
          showTranscript={true}
          showCommands={true}
        />
      </div>
    </VoiceControlProvider>
  );
};