/**
 * Voice Test Layout
 * Layout with voice control for testing
 */

'use client';

import { VoiceControlButton, VoiceControlProvider } from "../../voice-control";
import { VoiceDebugPanel } from "../../voice-control/components/VoiceDebugPanel";

export default function VoiceTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VoiceControlProvider
      config={{
        confidence: 0.7,
        continuous: true,
        interimResults: true,
        languages: ['en-US', 'hi-IN']
      }}
      autoStart={false}
      enableWakeWords={true}
      enableSpeechFeedback={true}
      onCommand={(result) => {
        console.log('🎤 Voice command executed:', result);
        // Show result in console for debugging
        if (result.success) {
          console.log(`✅ SUCCESS: ${result.message}`);
        } else {
          console.log(`❌ FAILED: ${result.message}`);
        }
      }}
      onError={(error) => {
        console.error('🚨 Voice control error:', error);
      }}
      onStateChange={(state) => {
        console.log('🔄 Voice state changed:', {
          isListening: state.isListening,
          isSupported: state.isSupported,
          lastTranscript: state.lastTranscript,
          confidence: Math.round(state.confidence),
          error: state.error
        });
      }}
    >
      {children}
      
      {/* Debug Panel */}
      <VoiceDebugPanel />
      
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