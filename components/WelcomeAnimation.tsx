"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface WelcomeAnimationProps {
  onComplete?: () => void;
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Animation sequence timing
    const timers = [
      setTimeout(() => setStep(1), 500),      // Show logo
      setTimeout(() => setStep(2), 1500),     // Show brand name
      setTimeout(() => setStep(3), 2500),     // Show tagline
      setTimeout(() => setStep(4), 3500),     // Fade all
      setTimeout(() => {
        setShowWelcome(false);
        onComplete?.();
      }, 4200), // Complete and hide
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onComplete]);

  const handleSkip = () => {
    setShowWelcome(false);
    onComplete?.();
  };

  return (
    <AnimatePresence mode="wait">
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black pointer-events-auto"
          onAnimationComplete={() => {
            // Ensure pointer events are disabled when animation completes
            if (step >= 4) {
              const element = document.querySelector('.welcome-animation');
              if (element) {
                (element as HTMLElement).style.pointerEvents = 'none';
              }
            }
          }}
        >
          {/* Background gradient animation */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.3, 0] }}
              transition={{ duration: 4, times: [0, 0.3, 0.7, 1] }}
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.2), transparent 70%)',
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo animation */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.8
                  }}
                  className="mb-8"
                >
                  <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <Image
                      src="/bar.svg"
                      alt="Oiko Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brand name animation */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4"
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider">
                    Oiko
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tagline animation */}
            <AnimatePresence>
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-lg md:text-xl text-neutral-300 tracking-widest uppercase">
                    Premium Custom Streetwear
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
              className="absolute bottom-32 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
            />
          </div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            transition={{ delay: 1 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 text-white text-sm uppercase tracking-wider hover:text-purple-400 transition-colors"
          >
            Skip
          </motion.button>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0.1, 0] }}
            transition={{ duration: 4, times: [0, 0.2, 0.8, 1] }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0.1, 0] }}
            transition={{ duration: 4, times: [0, 0.3, 0.7, 1], delay: 0.2 }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-600 rounded-full blur-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
