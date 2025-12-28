/**
 * Voice Control System - Main Export File
 * Reusable voice control system for Next.js applications
 */

// Core Hook
export { useVoiceControl } from './hooks/useVoiceControl';
export type { 
  VoiceControlState, 
  VoiceControlActions, 
  UseVoiceControlOptions, 
  UseVoiceControlReturn 
} from './hooks/useVoiceControl';

// Configuration and Commands
export { 
  defaultVoiceCommands,
  defaultWakeWords,
  defaultVoiceConfig,
  getCommandsByLanguage,
  getAllKeywords,
  addCustomCommand,
  removeCommand
} from './utils/voiceCommands';
export type { 
  VoiceCommand, 
  VoiceConfig, 
  VoiceActionType 
} from './utils/voiceCommands';

// Execution Engine
export { 
  executeVoiceCommand,
  executeBatchCommands,
  containsWakeWord,
  extractCommandAfterWakeWord
} from './utils/executeVoice';
export type { 
  ExecutionResult, 
  ExecutionContext 
} from './utils/executeVoice';

// Components
export { VoiceControlButton } from './components/VoiceControlButton';
export type { VoiceControlButtonProps } from './components/VoiceControlButton';

export { 
  VoiceControlProvider, 
  useVoiceControlContext, 
  withVoiceControl 
} from './components/VoiceControlProvider';
export type { VoiceControlProviderProps } from './components/VoiceControlProvider';

export { VoiceCommandsList } from './components/VoiceCommandsList';
export type { VoiceCommandsListProps } from './components/VoiceCommandsList';

export { VoiceDebugPanel } from './components/VoiceDebugPanel';

export { VoiceOnboardingModal } from './components/VoiceOnboardingModal';
export type { VoiceOnboardingModalProps } from './components/VoiceOnboardingModal';

export { useVoiceOnboarding } from './hooks/useVoiceOnboarding';
export type { UseVoiceOnboardingOptions, UseVoiceOnboardingReturn } from './hooks/useVoiceOnboarding';

// Re-export everything for convenience
export * from './hooks/useVoiceControl';
export * from './utils/voiceCommands';
export * from './utils/executeVoice';
export * from './components/VoiceControlButton';
export * from './components/VoiceControlProvider';
export * from './components/VoiceCommandsList';