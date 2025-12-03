'use client'

import { type ReactNode } from 'react';
import Joyride, { type Step, type CallBackProps, STATUS } from 'react-joyride';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useHubby } from '@/contexts/HubbyContext';

const steps: Step[] = [
  {
    target: 'body',
    content: "Welcome to Mission Control! I'm Hubby, your AI assistant. Let me show you around!",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="metrics"]',
    content: "These cards show your key 2026 budget metrics. The deficit is $85k - but we've got a plan!",
    placement: 'bottom',
  },
  {
    target: '[data-tour="team-hub"]',
    content: "Meet your AI team! Each member has an AI twin that can help with their area of expertise.",
    placement: 'left',
  },
  {
    target: '[data-tour="alerts"]',
    content: "Priority alerts appear here. Critical items need immediate attention!",
    placement: 'left',
  },
  {
    target: '[data-tour="sidebar"]',
    content: "Navigate to different sections using the sidebar. Each page has specialized tools for HTI operations.",
    placement: 'right',
  },
];

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { isOnboardingActive, completeOnboarding, skipOnboarding } = useOnboarding();
  const { setPose, setMessage } = useHubby();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    // Update Hubby's pose based on tour progress
    if (type === 'step:after') {
      switch (index) {
        case 0:
          setPose('wave');
          break;
        case 1:
          setPose('point_right');
          setMessage("These metrics are key to closing the gap!");
          break;
        case 2:
          setPose('arms_up');
          setMessage("My AI colleagues are ready to help!");
          break;
        case 3:
          setPose('surprised');
          setMessage("Don't miss those deadlines!");
          break;
        case 4:
          setPose('happy_jump');
          setMessage("You're all set! I'm here if you need me.");
          break;
      }
    }

    if (status === STATUS.FINISHED) {
      completeOnboarding();
      setPose('happy_jump');
      setMessage("Tour complete! Let's close that budget gap together.");
      setTimeout(() => {
        setPose('sitting');
        setMessage(null);
      }, 4000);
    }

    if (status === STATUS.SKIPPED) {
      skipOnboarding();
      setPose('stand');
      setMessage(null);
    }
  };

  return (
    <>
      {children}
      <Joyride
        steps={steps}
        run={isOnboardingActive}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#FF6B00',
            backgroundColor: '#0F172A',
            textColor: '#F8FAFC',
            arrowColor: '#0F172A',
            overlayColor: 'rgba(1, 2, 4, 0.85)',
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: '1rem',
            padding: '1.5rem',
          },
          tooltipContent: {
            padding: '0.5rem 0',
          },
          buttonNext: {
            backgroundColor: '#FF6B00',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
          },
          buttonBack: {
            color: '#94A3B8',
            marginRight: '0.5rem',
          },
          buttonSkip: {
            color: '#64748B',
          },
          spotlight: {
            borderRadius: '1rem',
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Done',
          next: 'Next',
          skip: 'Skip tour',
        }}
      />
    </>
  );
}

export default OnboardingProvider;
