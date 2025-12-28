/**
 * Voice-Enabled Layout Component
 * Layout with integrated voice control for testing
 */

'use client';

import { Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import { VoiceControlButton, VoiceControlProvider } from "../voice-control";

const inter = Inter({ subsets: ["latin"] });

export default function VoiceEnabledLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
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
              // Optional: Show toast notification
              if (result.success) {
                console.log(`✅ ${result.message}`);
              } else {
                console.log(`❌ ${result.message}`);
              }
            }}
            onError={(error) => {
              console.error('🚨 Voice control error:', error);
            }}
            onStateChange={(state) => {
              console.log('🔄 Voice state:', {
                isListening: state.isListening,
                lastTranscript: state.lastTranscript,
                confidence: Math.round(state.confidence)
              });
            }}
          >
            <AnimatedBackground />
            <CustomCursor enabled={true} />
            <Navigation />
            <PageTransition>
              <main className="pt-16 min-h-screen flex flex-col">
                <div className="flex-1">{children}</div>
                <Footer />
              </main>
            </PageTransition>
            
            {/* Voice Control Button */}
            <VoiceControlButton
              position="bottom-right"
              size="lg"
              showTranscript={true}
              showCommands={true}
            />
          </VoiceControlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}