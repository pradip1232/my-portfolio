/**
 * Advanced Usage Example
 * Complex implementation with custom commands and multiple features
 */

'use client';

import React, { useState, useCallback } from 'react';
import { 
  VoiceControlButton, 
  VoiceControlProvider, 
  VoiceCommandsList,
  useVoiceControlContext,
  VoiceCommand,
  addCustomCommand
} from '../index';

// Custom component that uses voice control context
const AdvancedVoiceDemo: React.FC = () => {
  const { state, actions } = useVoiceControlContext();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<string[]>([]);

  // Custom command handlers
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    actions.speak(`Switched to ${newTheme} theme`);
    addNotification(`Theme changed to ${newTheme}`);
  }, [theme, actions]);

  const addNotification = useCallback((message: string) => {
    setNotifications(prev => [...prev.slice(-4), message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    actions.speak('Notifications cleared');
  }, [actions]);

  const showTime = useCallback(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    actions.speak(`Current time is ${timeString}`);
    addNotification(`Time: ${timeString}`);
  }, [actions]);

  // Custom commands
  const customCommands: VoiceCommand[] = [
    {
      id: 'toggle-theme',
      keywords: ['toggle theme', 'switch theme', 'change theme', 'dark mode', 'light mode'],
      action: 'custom',
      callback: toggleTheme,
      description: 'Toggle between light and dark theme',
      language: 'en'
    },
    {
      id: 'show-time',
      keywords: ['what time is it', 'show time', 'current time', 'tell me time'],
      action: 'custom',
      callback: showTime,
      description: 'Show current time',
      language: 'en'
    },
    {
      id: 'clear-notifications',
      keywords: ['clear notifications', 'dismiss notifications', 'hide notifications'],
      action: 'custom',
      callback: clearNotifications,
      description: 'Clear all notifications',
      language: 'en'
    },
    // Hindi custom commands
    {
      id: 'toggle-theme-hi',
      keywords: ['theme badlo', 'rang badlo', 'dark mode karo'],
      action: 'custom',
      callback: toggleTheme,
      description: 'थीम बदलें',
      language: 'hi'
    },
    {
      id: 'show-time-hi',
      keywords: ['samay batao', 'time kya hai', 'samay dikhao'],
      action: 'custom',
      callback: showTime,
      description: 'समय बताएं',
      language: 'hi'
    }
  ];

  // Add custom commands to voice control
  React.useEffect(() => {
    customCommands.forEach(command => {
      actions.addCommand(command);
    });
  }, [actions]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Advanced Voice Control Demo</h1>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm ${
                state.isListening 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {state.isListening ? 'Listening...' : 'Voice Control Ready'}
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Voice Status */}
            <div className={`rounded-lg p-6 shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-semibold mb-4">Voice Control Status</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className={`font-medium ${
                    state.isListening ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {state.isListening ? 'Actively Listening' : 'Standby'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Confidence</div>
                  <div className="font-medium">
                    {state.confidence > 0 ? `${Math.round(state.confidence)}%` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Language</div>
                  <div className="font-medium">{state.language}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Supported</div>
                  <div className={`font-medium ${
                    state.isSupported ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {state.isSupported ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              {state.lastTranscript && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-500 mb-1">Last Heard:</div>
                  <div className="font-medium">"{state.lastTranscript}"</div>
                </div>
              )}

              {state.lastResult && (
                <div className="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20">
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                    Last Command Result:
                  </div>
                  <div className={`font-medium ${
                    state.lastResult.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {state.lastResult.message}
                  </div>
                </div>
              )}
            </div>

            {/* Demo Sections */}
            <div className={`rounded-lg p-6 shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-semibold mb-4">Demo Sections</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div id="hero" className="p-4 border-2 border-dashed border-gray-300 rounded">
                  <h3 className="font-semibold mb-2">Hero Section</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Say "go to hero" to scroll here
                  </p>
                </div>
                <div id="about" className="p-4 border-2 border-dashed border-gray-300 rounded">
                  <h3 className="font-semibold mb-2">About Section</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Say "scroll to about" to scroll here
                  </p>
                </div>
                <div id="projects" className="p-4 border-2 border-dashed border-gray-300 rounded">
                  <h3 className="font-semibold mb-2">Projects Section</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Say "show projects" to navigate or scroll here
                  </p>
                </div>
                <div id="contact" className="p-4 border-2 border-dashed border-gray-300 rounded">
                  <h3 className="font-semibold mb-2">Contact Section</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Say "go to contact" to scroll here
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Commands Demo */}
            <div className={`rounded-lg p-6 shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-semibold mb-4">Custom Commands</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <div className="font-medium">Toggle Theme</div>
                    <div className="text-sm text-gray-500">Say "toggle theme" or "theme badlo"</div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90"
                  >
                    Toggle
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <div className="font-medium">Show Time</div>
                    <div className="text-sm text-gray-500">Say "what time is it" or "samay batao"</div>
                  </div>
                  <button
                    onClick={showTime}
                    className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90"
                  >
                    Show Time
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <div className="font-medium">Clear Notifications</div>
                    <div className="text-sm text-gray-500">Say "clear notifications"</div>
                  </div>
                  <button
                    onClick={clearNotifications}
                    className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Commands List */}
            <VoiceCommandsList
              showSearch={true}
              showFilter={true}
              groupByAction={true}
              maxHeight="500px"
            />

            {/* Notifications */}
            {notifications.length > 0 && (
              <div className={`rounded-lg p-4 shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-2">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded text-sm"
                    >
                      {notification}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Control Button */}
      <VoiceControlButton
        position="bottom-right"
        size="lg"
        showTranscript={true}
        showCommands={true}
      />

      {/* Error Display */}
      {state.error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Voice Control Error</div>
              <div className="text-sm opacity-90">{state.error}</div>
            </div>
            <button
              onClick={actions.clearError}
              className="ml-4 text-white hover:text-red-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdvancedVoiceControlExample: React.FC = () => {
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
        console.log('Advanced voice command executed:', result);
      }}
      onError={(error) => {
        console.error('Advanced voice control error:', error);
      }}
      onStateChange={(state) => {
        console.log('Voice control state changed:', state);
      }}
    >
      <AdvancedVoiceDemo />
    </VoiceControlProvider>
  );
};