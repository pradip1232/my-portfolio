/**
 * Voice Control Provider Component
 * Context provider for voice control functionality across the app
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { 
  useVoiceControl, 
  UseVoiceControlOptions, 
  UseVoiceControlReturn 
} from '../hooks/useVoiceControl';

interface VoiceControlContextType extends UseVoiceControlReturn {
  isEnabled: boolean;
}

const VoiceControlContext = createContext<VoiceControlContextType | null>(null);

export interface VoiceControlProviderProps extends UseVoiceControlOptions {
  children: ReactNode;
  enabled?: boolean;
}

/**
 * Voice Control Provider
 * Provides voice control functionality to child components
 */
export const VoiceControlProvider: React.FC<VoiceControlProviderProps> = ({
  children,
  enabled = true,
  ...voiceOptions
}) => {
  const voiceControl = useVoiceControl(enabled ? voiceOptions : { ...voiceOptions, autoStart: false });

  const contextValue: VoiceControlContextType = {
    ...voiceControl,
    isEnabled: enabled
  };

  return (
    <VoiceControlContext.Provider value={contextValue}>
      {children}
    </VoiceControlContext.Provider>
  );
};

/**
 * Hook to use voice control context
 */
export const useVoiceControlContext = (): VoiceControlContextType => {
  const context = useContext(VoiceControlContext);
  
  if (!context) {
    throw new Error('useVoiceControlContext must be used within a VoiceControlProvider');
  }
  
  return context;
};

/**
 * HOC to add voice control to any component
 */
export function withVoiceControl<P extends object>(
  Component: React.ComponentType<P>,
  voiceOptions?: UseVoiceControlOptions
) {
  return function VoiceControlledComponent(props: P) {
    return (
      <VoiceControlProvider {...voiceOptions}>
        <Component {...props} />
      </VoiceControlProvider>
    );
  };
}