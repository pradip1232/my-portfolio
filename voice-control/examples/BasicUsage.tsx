/**
 * Basic Usage Example
 * Simple implementation of voice control in a Next.js component
 */

'use client';

import React from 'react';
import { VoiceControlButton, VoiceControlProvider } from '../index';

export const BasicVoiceControlExample: React.FC = () => {
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
        console.log('Voice command executed:', result);
      }}
      onError={(error) => {
        console.error('Voice control error:', error);
      }}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Voice Control Demo
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Try Voice Commands</h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p>• "Go home" - Navigate to home page</p>
                <p>• "Show projects" - Navigate to projects</p>
                <p>• "Scroll down" - Scroll down the page</p>
                <p>• "Go to top" - Scroll to top</p>
                <p>• "Hey portfolio, go home" - Wake word + command</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Hindi Commands</h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p>• "Ghar jao" - Navigate to home</p>
                <p>• "Projects dikhao" - Show projects</p>
                <p>• "Neeche jao" - Scroll down</p>
                <p>• "Upar jao" - Scroll up</p>
              </div>
            </div>
          </div>
        </main>

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