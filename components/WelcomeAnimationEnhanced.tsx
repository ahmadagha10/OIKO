"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface WelcomeAnimationEnhancedProps {
  onComplete?: () => void;
}

/**
 * Enhanced Welcome Animation with more visual effects
 * Use this for a more dramatic entrance
 */
export default function WelcomeAnimationEnhanced({ onComplete }: WelcomeAnimationEnhancedProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),      // Particles
      setTimeout(() => setStep(2), 800),      // Logo zoom in
      setTimeout(() => setStep(3), 1800),     // Brand reveal
      setTimeout(() => setStep(4), 2800),     // Tagline
      setTimeout(() => setStep(5), 3800),     // Pulse effect
      setTimeout(() => {
        setShowWelcome(false);
        onComplete?.();
      }, 4800),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onComplete]);

  const handleSkip = () => {
    setShowWelcome(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              background: [
                'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                'linear-gradient(135deg, #1a0a2e 0%, #0f0f1e 100%)',
                'linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%)',
                'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
              ],
            }}
            transition={{ duration: 4, times: [0, 0.3, 0.7, 1] }}
            className="absolute inset-0"
          />

          {/* Animated particles */}
          {step >= 1 && (
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  className="absolute w-1 h-1 bg-purple-500 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Glowing circles */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 2.5], opacity: [0, 0.15, 0] }}
            transition={{ duration: 3, times: [0, 0.5, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.8, 2.2], opacity: [0, 0.15, 0] }}
            transition={{ duration: 3, delay: 0.3, times: [0, 0.5, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600 rounded-full blur-3xl"
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
            {/* Logo with zoom effect */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  initial={{ scale: 5, opacity: 0, rotateY: 180 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotateY: 0,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    duration: 1.2,
                  }}
                  className="mb-8 relative"
                >
                  {/* Glow effect behind logo */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-purple-600 blur-2xl rounded-full"
                  />

                  <div className="relative w-28 h-28 md:w-40 md:h-40">
                    <Image
                      src="/bar.svg"
                      alt="Oiko Logo"
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brand name with letter-by-letter animation */}
            <AnimatePresence>
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="flex gap-1 md:gap-2">
                    {['W', 'E', 'A', 'R', 'T', 'H'].map((letter, i) => (
                      <motion.span
                        key={i}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: i * 0.1,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="text-6xl md:text-8xl font-bold text-white tracking-wider inline-block"
                        style={{
                          textShadow: '0 0 30px rgba(147, 51, 234, 0.8)',
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tagline with slide effect */}
            <AnimatePresence>
              {step >= 4 && (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Animated underline */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 origin-left"
                  />

                  <p className="text-xl md:text-2xl text-neutral-200 tracking-[0.3em] uppercase font-light">
                    Premium Custom Streetwear
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse effect */}
            {step >= 5 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 3],
                  opacity: [0.5, 0],
                }}
                transition={{ duration: 1 }}
                className="absolute inset-0 border-4 border-purple-600 rounded-full"
              />
            )}
          </div>

          {/* Animated progress line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"
              style={{
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)',
              }}
            />
          </div>

          {/* Skip button with hover effect */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            whileHover={{
              opacity: 1,
              scale: 1.1,
              textShadow: '0 0 8px rgba(147, 51, 234, 0.8)',
            }}
            transition={{ delay: 1.5 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 text-white text-sm uppercase tracking-widest hover:text-purple-400 transition-colors px-4 py-2 border border-purple-600/30 rounded hover:border-purple-600 backdrop-blur-sm"
          >
            Skip →
          </motion.button>

          {/* Corner decorations */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1, rotate: 360 }}
            transition={{ duration: 2, delay: 1 }}
            className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-purple-600"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1, rotate: 360 }}
            transition={{ duration: 2, delay: 1.2 }}
            className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-600"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
