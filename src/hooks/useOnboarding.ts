import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'hti-hub-onboarding-complete';

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  });
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  useEffect(() => {
    // Auto-start onboarding for first-time users after a brief delay
    if (!hasCompletedOnboarding) {
      const timer = setTimeout(() => {
        setIsOnboardingActive(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding]);

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
