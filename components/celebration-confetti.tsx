"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
}

interface CelebrationConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const colors = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export function CelebrationConfetti({
  trigger,
  onComplete,
}: CelebrationConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [viewportHeight, setViewportHeight] = useState(1000);

  useEffect(() => {
    // Set viewport height on mount
    setViewportHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (trigger) {
      // Generate 60 confetti pieces (colored cards)
      const newPieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random x position (0-100%)
        y: -10, // Start above viewport
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5, // Stagger the animation
      }));
      setPieces(newPieces);

      // Call onComplete after animation finishes
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {trigger && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute rounded-sm"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                boxShadow: `0 0 8px ${piece.color}`,
                width: `${12 + Math.random() * 8}px`,
                height: `${16 + Math.random() * 8}px`,
              }}
              initial={{
                y: piece.y,
                x: 0,
                rotate: piece.rotation,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                y: viewportHeight + 100,
                x: (Math.random() - 0.5) * 200,
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
                scale: [1, 1.2, 0.8],
              }}
              transition={{
                duration: 2.5 + Math.random() * 1,
                delay: piece.delay,
                ease: "easeOut",
              }}
              exit={{
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
