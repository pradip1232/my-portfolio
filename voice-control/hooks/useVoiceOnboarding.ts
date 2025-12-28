/**
 * Voice Onboarding Hook
 * Manages the onboarding modal state and first-time user experience
 */

'use client';

import { useState, useEffect } from 'react';

export interface UseVoiceOnboardingOptions {
  autoShow?: boolean;
  storageKey?: string;
  showDelay?: number;
}

export interface UseVoiceOnboardingReturn {
  showModal: boolean;
  hasSeenOnboarding: boolean;
  openModal: () => void;
  closeModal: () => void;
  markAsCompleted: () => void;
  resetOnboarding: () => void;
}

export const useVoiceOnboarding = (
  options: UseVoiceOnboardingOptions = {}
): UseVoiceOnboardingReturn => {
  const {
    autoShow = true,
    storageKey = 'voice-control-onboarding-completed',
    showDelay = 2000
  } = options;

  const [showModal, setShowModal] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if user has seen onboarding before
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const completed = localStorage.getItem(storageKey);
      const hasCompleted = completed === 'true';
      setHasSeenOnboarding(hasCompleted);

      // Auto-show modal for first-time users
      if (autoShow && !hasCompleted) {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, showDelay);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.warn('Failed to check onboarding status:', error);
    }
  }, [autoShow, storageKey, showDelay]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const markAsCompleted = () => {
    try {
      localStorage.setItem(storageKey, 'true');
      setHasSeenOnboarding(true);
      setShowModal(false);
    } catch (error) {
      console.warn('Failed to save onboarding status:', error);
    }
  };

  const resetOnboarding = () => {
    try {
      localStorage.removeItem(storageKey);
      setHasSeenOnboarding(false);
    } catch (error) {
      console.warn('Failed to reset onboarding status:', error);
    }
  };

  return {
    showModal,
    hasSeenOnboarding,
    openModal,
    closeModal,
    markAsCompleted,
    resetOnboarding
  };
};