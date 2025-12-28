/**
 * Voice Control Custom Hook
 * Reusable hook for voice recognition and command execution
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  VoiceCommand, 
  VoiceConfig, 
  defaultVoiceConfig 
} from '../utils/voiceCommands';
import { 
  executeVoiceCommand, 
  ExecutionResult, 
  ExecutionContext,
  containsWakeWord,
  extractCommandAfterWakeWord
} from '../utils/executeVoice';

// Browser compatibility types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  addEventListener(type: 'error', listener: (event: SpeechRecognitionErrorEvent) => void): void;
  addEventListener(type: 'start' | 'end' | 'speechstart' | 'speechend' | 'soundstart' | 'soundend' | 'audiostart' | 'audioend' | 'nomatch', listener: (event: Event) => void): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface VoiceControlState {
  isListening: boolean;
  isSupported: boolean;
  isInitialized: boolean;
  lastTranscript: string;
  lastCommand: string;
  lastResult: ExecutionResult | null;
  error: string | null;
  confidence: number;
  language: string;
}

export interface VoiceControlActions {
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  speak: (text: string, lang?: string) => void;
  executeCommand: (transcript: string) => Promise<ExecutionResult>;
  addCommand: (command: VoiceCommand) => void;
  removeCommand: (commandId: string) => void;
  updateConfig: (newConfig: Partial<VoiceConfig>) => void;
  clearError: () => void;
}

export interface UseVoiceControlOptions {
  config?: Partial<VoiceConfig>;
  autoStart?: boolean;
  enableWakeWords?: boolean;
  enableSpeechFeedback?: boolean;
  onCommand?: (result: ExecutionResult) => void;
  onError?: (error: string) => void;
  onStateChange?: (state: VoiceControlState) => void;
  customCallbacks?: Record<string, () => void>;
}

export interface UseVoiceControlReturn {
  state: VoiceControlState;
  actions: VoiceControlActions;
}

/**
 * Main Voice Control Hook
 */
export const useVoiceControl = (
  options: UseVoiceControlOptions = {}
): UseVoiceControlReturn => {
  const router = useRouter();
  
  // Merge default config with user options
  const config = { ...defaultVoiceConfig, ...options.config };
  
  // State management
  const [state, setState] = useState<VoiceControlState>({
    isListening: false,
    isSupported: false,
    isInitialized: false,
    lastTranscript: '',
    lastCommand: '',
    lastResult: null,
    error: null,
    confidence: 0,
    language: config.languages[0] || 'en-US'
  });

  // Refs for speech recognition and synthesis
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isManualStop = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const commandsRef = useRef<VoiceCommand[]>(config.commands);

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<VoiceControlState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      options.onStateChange?.(newState);
      return newState;
    });
  }, [options]);

  /**
   * Text-to-Speech function
   */
  const speak = useCallback((text: string, lang: string = state.language) => {
    if (!options.enableSpeechFeedback) return;
    
    try {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  }, [state.language, options.enableSpeechFeedback]);

  /**
   * Execute voice command
   */
  const executeCommand = useCallback(async (transcript: string): Promise<ExecutionResult> => {
    const context: ExecutionContext = {
      router,
      speak: options.enableSpeechFeedback ? speak : undefined,
      onStartListening: () => startListening(),
      onStopListening: () => stopListening(),
      customCallbacks: options.customCallbacks
    };

    const result = await executeVoiceCommand(
      transcript,
      commandsRef.current,
      context,
      config.confidence
    );

    updateState({ 
      lastResult: result,
      lastCommand: result.command?.id || ''
    });

    options.onCommand?.(result);
    
    return result;
  }, [router, speak, options, config.confidence]);

  /**
   * Initialize speech recognition
   */
  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      updateState({ 
        isSupported: false, 
        error: 'Speech recognition not supported in this browser' 
      });
      return false;
    }

    try {
      const recognition = new SpeechRecognition();
      
      // Configure recognition
      recognition.continuous = config.continuous;
      recognition.interimResults = config.interimResults;
      recognition.lang = state.language;
      recognition.maxAlternatives = 3;

      // Event handlers
      recognition.addEventListener('start', () => {
        updateState({ 
          isListening: true, 
          error: null 
        });
      });

      recognition.addEventListener('end', () => {
        updateState({ isListening: false });
        
        // Auto-restart if not manually stopped
        if (!isManualStop.current && state.isListening) {
          restartTimeoutRef.current = setTimeout(() => {
            if (!isManualStop.current) {
              try {
                recognition.start();
              } catch (error) {
                console.error('Auto-restart failed:', error);
              }
            }
          }, 1000);
        }
      });

      recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        const latestResult = results[event.resultIndex];
        
        if (latestResult) {
          const transcript = latestResult[0].transcript.trim();
          const confidence = latestResult[0].confidence || 0;
          
          updateState({ 
            lastTranscript: transcript,
            confidence: confidence * 100
          });

          // Only process final results or high-confidence interim results
          if (latestResult.isFinal || confidence > config.confidence) {
            handleVoiceInput(transcript);
          }
        }
      });

      recognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        updateState({ 
          error: errorMessage,
          isListening: false 
        });
        options.onError?.(errorMessage);
        
        // Auto-restart on certain errors
        if (['no-speech', 'audio-capture'].includes(event.error)) {
          setTimeout(() => {
            if (!isManualStop.current) {
              try {
                recognition.start();
              } catch (error) {
                console.error('Error restart failed:', error);
              }
            }
          }, 2000);
        }
      });

      recognitionRef.current = recognition;
      updateState({ 
        isSupported: true, 
        isInitialized: true 
      });
      
      return true;
    } catch (error) {
      const errorMessage = `Failed to initialize speech recognition: ${error}`;
      updateState({ 
        error: errorMessage,
        isSupported: false 
      });
      options.onError?.(errorMessage);
      return false;
    }
  }, [config, state.language, options]);

  /**
   * Handle voice input processing
   */
  const handleVoiceInput = useCallback(async (transcript: string) => {
    try {
      let commandToExecute = transcript;

      // Check for wake words if enabled
      if (options.enableWakeWords && config.wakeWords) {
        if (containsWakeWord(transcript, config.wakeWords)) {
          commandToExecute = extractCommandAfterWakeWord(transcript, config.wakeWords);
          
          // If no command after wake word, just acknowledge
          if (!commandToExecute || commandToExecute === transcript) {
            speak('Yes, I\'m listening');
            return;
          }
        } else {
          // If wake words are enabled but not detected, ignore
          return;
        }
      }

      // Execute the command
      await executeCommand(commandToExecute);
      
    } catch (error) {
      const errorMessage = `Voice input processing error: ${error}`;
      updateState({ error: errorMessage });
      options.onError?.(errorMessage);
    }
  }, [options, config, executeCommand, speak]);

  /**
   * Start listening
   */
  const startListening = useCallback(() => {
    if (!recognitionRef.current || state.isListening) return;

    try {
      isManualStop.current = false;
      recognitionRef.current.start();
    } catch (error) {
      const errorMessage = `Failed to start listening: ${error}`;
      updateState({ error: errorMessage });
      options.onError?.(errorMessage);
    }
  }, [state.isListening, options]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !state.isListening) return;

    try {
      isManualStop.current = true;
      
      // Clear restart timeout
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      recognitionRef.current.stop();
    } catch (error) {
      const errorMessage = `Failed to stop listening: ${error}`;
      updateState({ error: errorMessage });
      options.onError?.(errorMessage);
    }
  }, [state.isListening, options]);

  /**
   * Toggle listening state
   */
  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  /**
   * Add custom command
   */
  const addCommand = useCallback((command: VoiceCommand) => {
    commandsRef.current = [...commandsRef.current, command];
  }, []);

  /**
   * Remove command by ID
   */
  const removeCommand = useCallback((commandId: string) => {
    commandsRef.current = commandsRef.current.filter(cmd => cmd.id !== commandId);
  }, []);

  /**
   * Update configuration
   */
  const updateConfig = useCallback((newConfig: Partial<VoiceConfig>) => {
    Object.assign(config, newConfig);
    
    if (newConfig.commands) {
      commandsRef.current = newConfig.commands;
    }
    
    if (newConfig.languages && recognitionRef.current) {
      recognitionRef.current.lang = newConfig.languages[0];
      updateState({ language: newConfig.languages[0] });
    }
  }, [config]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, []);

  // Initialize on mount
  useEffect(() => {
    const initialized = initializeSpeechRecognition();
    
    if (initialized && options.autoStart) {
      setTimeout(startListening, 1000);
    }

    // Cleanup on unmount
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    };
  }, []);

  // Return hook interface
  return {
    state,
    actions: {
      startListening,
      stopListening,
      toggleListening,
      speak,
      executeCommand,
      addCommand,
      removeCommand,
      updateConfig,
      clearError
    }
  };
};