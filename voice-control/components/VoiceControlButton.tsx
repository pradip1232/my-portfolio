/**
 * Voice Control Button Component
 * Floating microphone button with listening state indicator
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useVoiceControl, UseVoiceControlOptions } from '../hooks/useVoiceControl';
import { useVoiceOnboarding } from '../hooks/useVoiceOnboarding';
import { VoiceOnboardingModal } from './VoiceOnboardingModal';

export interface VoiceControlButtonProps extends UseVoiceControlOptions {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  showTranscript?: boolean;
  showCommands?: boolean;
  showOnboarding?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const positionClasses = {
  'bottom-right': 'fixed bottom-6 right-6',
  'bottom-left': 'fixed bottom-6 left-6',
  'top-right': 'fixed top-6 right-6',
  'top-left': 'fixed top-6 left-6',
  'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
};

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20'
};

const iconSizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export const VoiceControlButton: React.FC<VoiceControlButtonProps> = ({
  position = 'bottom-right',
  size = 'md',
  showTranscript = true,
  showCommands = false,
  showOnboarding = true,
  className = '',
  style,
  ...voiceOptions
}) => {
  const { state, actions } = useVoiceControl(voiceOptions);
  const [showPanel, setShowPanel] = React.useState(false);
  
  // Onboarding modal
  const {
    showModal: showOnboardingModal,
    hasSeenOnboarding,
    openModal: openOnboardingModal,
    closeModal: closeOnboardingModal,
    markAsCompleted
  } = useVoiceOnboarding({
    autoShow: showOnboarding && !state.isSupported ? false : showOnboarding
  });

  const buttonVariants = {
    idle: { 
      scale: 1,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    listening: { 
      scale: [1, 1.1, 1],
      boxShadow: [
        '0 4px 12px rgba(0, 0, 0, 0.15)',
        '0 8px 24px rgba(59, 130, 246, 0.4)',
        '0 4px 12px rgba(0, 0, 0, 0.15)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    processing: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const getButtonState = () => {
    if (!state.isSupported) return 'unsupported';
    if (state.error) return 'error';
    if (state.isListening) return 'listening';
    if (state.lastResult?.success) return 'success';
    return 'idle';
  };

  const getButtonColor = () => {
    const buttonState = getButtonState();
    switch (buttonState) {
      case 'listening': return 'bg-blue-500 hover:bg-blue-600';
      case 'error': return 'bg-red-500 hover:bg-red-600';
      case 'success': return 'bg-green-500 hover:bg-green-600';
      case 'unsupported': return 'bg-gray-400 cursor-not-allowed';
      default: return 'bg-primary hover:bg-primary/90';
    }
  };

  const getIcon = () => {
    const buttonState = getButtonState();
    const iconClass = iconSizeClasses[size];
    
    switch (buttonState) {
      case 'listening':
        return <Volume2 className={`${iconClass} text-white`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-white`} />;
      case 'success':
        return <CheckCircle2 className={`${iconClass} text-white`} />;
      case 'unsupported':
        return <MicOff className={`${iconClass} text-white`} />;
      default:
        return state.isListening ? 
          <Mic className={`${iconClass} text-white`} /> : 
          <MicOff className={`${iconClass} text-white`} />;
    }
  };

  const handleClick = () => {
    if (!state.isSupported) return;
    
    if (state.error) {
      actions.clearError();
      return;
    }
    
    actions.toggleListening();
  };

  const handleStartVoiceControl = () => {
    markAsCompleted();
    actions.startListening();
  };

  return (
    <>
      <div className={`${positionClasses[position]} z-50 ${className}`} style={style}>
        {/* Main Button */}
        <motion.button
          onClick={handleClick}
          onMouseEnter={() => setShowPanel(true)}
          onMouseLeave={() => setShowPanel(false)}
          className={`
            ${sizeClasses[size]} 
            ${getButtonColor()}
            rounded-full 
            flex items-center justify-center 
            transition-colors duration-200
            focus:outline-none focus:ring-4 focus:ring-blue-500/30
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          variants={buttonVariants}
          animate={state.isListening ? 'listening' : 'idle'}
          whileTap={{ scale: 0.95 }}
          disabled={!state.isSupported}
          title={
            !state.isSupported ? 'Voice control not supported' :
            state.error ? 'Click to clear error' :
            state.isListening ? 'Stop listening' : 'Start listening'
          }
        >
          {getIcon()}
        </motion.button>

        {/* Help Button (for onboarding) */}
        {showOnboarding && (
          <motion.button
            onClick={openOnboardingModal}
            className={`
              absolute ${position.includes('right') ? '-left-14' : '-right-14'} top-0
              w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full
              flex items-center justify-center transition-colors duration-200
              focus:outline-none focus:ring-4 focus:ring-blue-500/30
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Voice Control Help"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
        )}

        {/* Status Panel */}
        <AnimatePresence>
          {(showPanel || state.isListening) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`
                absolute ${position.includes('right') ? 'right-0' : 'left-0'} 
                ${position.includes('bottom') ? 'bottom-full mb-4' : 'top-full mt-4'}
                bg-white dark:bg-gray-800 
                rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
                p-4 min-w-64 max-w-80
              `}
            >
              {/* Status Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`
                  w-3 h-3 rounded-full 
                  ${state.isListening ? 'bg-green-500 animate-pulse' : 
                    state.error ? 'bg-red-500' : 'bg-gray-400'}
                `} />
                <span className="font-semibold text-sm">
                  {state.isListening ? 'Listening...' : 
                   state.error ? 'Error' : 'Voice Control'}
                </span>
                {state.confidence > 0 && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {Math.round(state.confidence)}%
                  </span>
                )}
              </div>

              {/* Error Display */}
              {state.error && (
                <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300 text-xs">
                  {state.error}
                </div>
              )}

              {/* Transcript Display */}
              {showTranscript && state.lastTranscript && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Last heard:</div>
                  <div className="text-sm bg-gray-50 dark:bg-gray-700 rounded p-2">
                    "{state.lastTranscript}"
                  </div>
                </div>
              )}

              {/* Last Command Result */}
              {state.lastResult && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Last command:</div>
                  <div className={`
                    text-sm rounded p-2 
                    ${state.lastResult.success ? 
                      'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 
                      'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}
                  `}>
                    {state.lastResult.message}
                  </div>
                </div>
              )}

              {/* Quick Commands */}
              {showCommands && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="text-xs text-gray-500 mb-2">Try saying:</div>
                  <div className="space-y-1 text-xs">
                    <div>"Go home"</div>
                    <div>"Show projects"</div>
                    <div>"Scroll down"</div>
                    <div>"Hey beast developer, page scroll kro niche"</div>
                  </div>
                </div>
              )}

              {/* Onboarding Prompt for New Users */}
              {!hasSeenOnboarding && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <button
                    onClick={openOnboardingModal}
                    className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    🎤 Learn Voice Commands
                  </button>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={actions.startListening}
                  disabled={state.isListening || !state.isSupported}
                  className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start
                </button>
                <button
                  onClick={actions.stopListening}
                  disabled={!state.isListening}
                  className="flex-1 px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stop
                </button>
                {state.error && (
                  <button
                    onClick={actions.clearError}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listening Indicator Rings */}
        <AnimatePresence>
          {state.isListening && (
            <>
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full border-2 border-blue-400"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ 
                    scale: [1, 2, 3],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: ring * 0.4,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Onboarding Modal */}
      <VoiceOnboardingModal
        isOpen={showOnboardingModal}
        onClose={closeOnboardingModal}
        onStartVoiceControl={handleStartVoiceControl}
      />
    </>
  );
};