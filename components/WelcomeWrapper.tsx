"use client";

import { useState, useEffect } from 'react';
import WelcomeAnimation from './WelcomeAnimation';

interface WelcomeWrapperProps {
  children: React.ReactNode;
  showOnce?: boolean; // If true, only show once per session
}

export default function WelcomeWrapper({ children, showOnce = true }: WelcomeWrapperProps) {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if welcome has been shown before
    const hasSeenWelcome = sessionStorage.getItem('oiko_welcome_shown');

    if (showOnce && hasSeenWelcome) {
      // User has seen welcome this session, skip it
      setShowWelcome(false);
      setIsReady(true);
    } else {
      // Show welcome animation
      setShowWelcome(true);
      setIsReady(true);
    }
  }, [showOnce]);

  const handleComplete = () => {
    setShowWelcome(false);
    // Mark as shown for this session
    if (showOnce) {
      sessionStorage.setItem('oiko_welcome_shown', 'true');
    }
  };

  // Prevent flash of content during SSR
  if (!isReady) {
    return (
      <div className="min-h-screen bg-black" />
    );
  }

  return (
    <>
      {showWelcome && <WelcomeAnimation onComplete={handleComplete} />}
      <div className={showWelcome ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {children}
      </div>
    </>
  );
}
