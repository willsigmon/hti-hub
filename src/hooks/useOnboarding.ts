'use client'

import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'hti-hub-onboarding-complete';

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize on client side only
  useEffect(() => {
    setIsClient(true);
    const completed = localStorage.getItem(ONBOARDING_KEY) === 'true';
    setHasCompletedOnboarding(completed);
  }, []);

  useEffect(() => {
    // Auto-start onboarding for first-time users after a brief delay
    if (isClient && !hasCompletedOnboarding) {
      const timer = setTimeout(() => {
        setIsOnboardingActive(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isClient, hasCompletedOnboarding]);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompletedOnboarding(true);
    setIsOnboardingActive(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setHasCompletedOnboarding(false);
  };

  const startOnboarding = () => {
    setIsOnboardingActive(true);
  };

  const skipOnboarding = () => {
    setIsOnboardingActive(false);
    completeOnboarding();
  };

  return {
    hasCompletedOnboarding,
    isOnboardingActive,
    completeOnboarding,
    resetOnboarding,
    startOnboarding,
    skipOnboarding,
  };
}
