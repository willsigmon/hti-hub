'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Define Hubby's emotional states and poses
export type HubbyPose =
  | 'wave' | 'stand' | 'point_right' | 'point_left'
  | 'thinking' | 'surprised' | 'sad' | 'happy_jump'
  | 'walking_left' | 'running_left' | 'arms_up' | 'walking_right'
  | 'wave_left' | 'back_view' | 'sitting';

interface HubbyContextType {
  pose: HubbyPose;
  setPose: (pose: HubbyPose) => void;
  message: string | null;
  setMessage: (msg: string | null) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  triggerReaction: (reaction: 'success' | 'error' | 'thinking' | 'idle') => void;
}

const HubbyContext = createContext<HubbyContextType | undefined>(undefined);

export const HubbyProvider = ({ children }: { children: ReactNode }) => {
  const [pose, setPose] = useState<HubbyPose>('stand');
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Context-aware behavior based on route
  useEffect(() => {
    // Reset state on route change
    setMessage(null);
    setPose('stand');

    // Route-specific logic
    switch (pathname) {
      case '/':
        setPose('wave');
        setTimeout(() => setMessage("Welcome to Mission Control! All systems nominal."), 1000);
        break;
      case '/budget-gap':
        setPose('point_right');
        setTimeout(() => setMessage("Adjust the sliders to model different scenarios."), 1000);
        break;
      case '/grants':
        setPose('point_right');
        setTimeout(() => setMessage("I've highlighted the deadlines for you!"), 1000);
        break;
      case '/crm':
        setPose('thinking');
        setTimeout(() => setMessage("Need to find a contact? Use the search bar above."), 1000);
        break;
      case '/inventory':
        setPose('arms_up');
        setTimeout(() => setMessage("Equipment sales are your best opportunity!"), 1000);
        break;
      case '/donors':
        setPose('happy_jump');
        setTimeout(() => setMessage("Every donor makes a difference."), 1000);
        break;
      default:
        setPose('stand');
    }

    // Clear message after 8 seconds to avoid annoyance
    const timer = setTimeout(() => {
      setMessage(null);
      setPose('sitting'); // Relax after helping
    }, 8000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const triggerReaction = (reaction: 'success' | 'error' | 'thinking' | 'idle') => {
    switch (reaction) {
      case 'success':
        setPose('happy_jump');
        setMessage("Great job! Task completed successfully.");
        break;
      case 'error':
        setPose('sad');
        setMessage("Oops! Something went wrong. Let's try again.");
        break;
      case 'thinking':
        setPose('thinking');
        setMessage("Processing... just a moment.");
        break;
      case 'idle':
        setPose('sitting');
        setMessage(null);
        break;
    }

    // Auto-reset to idle after success/error
    if (reaction === 'success' || reaction === 'error') {
      setTimeout(() => {
        setPose('sitting');
        setMessage(null);
      }, 4000);
    }
  };

  return (
    <HubbyContext.Provider value={{ pose, setPose, message, setMessage, isVisible, setIsVisible, triggerReaction }}>
      {children}
    </HubbyContext.Provider>
  );
};

export const useHubby = () => {
  const context = useContext(HubbyContext);
  if (!context) {
    throw new Error('useHubby must be used within a HubbyProvider');
  }
  return context;
};
