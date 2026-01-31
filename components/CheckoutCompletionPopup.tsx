"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { CheckCircle, Crown, Gift, Sparkles, Star, X } from "lucide-react";
import { REWARD_THRESHOLDS, getRewardTypeForProgress, type RewardType } from "@/lib/rewards";

type CheckoutCompletionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  currentPoints: number;
  pointsEarned: number;
  orderReference?: string;
  confirmationMessage?: string;
};

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
};

const CONFETTI_COLORS = ["#525252", "#737373", "#A3A3A3"];

// Helper to check if user just unlocked a reward
const getNewlyUnlockedReward = (
  previousPoints: number,
  currentPoints: number
): RewardType | null => {
  const previousReward = getRewardTypeForProgress(previousPoints);
  const currentReward = getRewardTypeForProgress(currentPoints);

  // Check if they crossed a new threshold
  if (currentReward && currentReward !== previousReward) {
    return currentReward;
  }

  return null;
};

// Get message for reward achievement
const getRewardMessage = (rewardType: RewardType | null, currentPoints: number): string => {
  if (rewardType === "free") {
    return "🎉 Congratulations! You've reached 100 points and earned a FREE PRODUCT! You can now claim your free item from our collection. Your loyalty has been rewarded!";
  }
  if (rewardType === "discount") {
    return "Amazing! You've unlocked a DISCOUNT REWARD at 70 points! Keep going to reach 100 points for a free product!";
  }
  if (rewardType === "cashback") {
    return "Great job! You've unlocked CASHBACK REWARD at 30 points! Continue shopping to unlock even better rewards at 70 and 100 points!";
  }

  // Progress messages when no reward was unlocked
  if (currentPoints >= 70 && currentPoints < 100) {
    return `You're so close! Just ${100 - currentPoints} more points until you unlock a FREE PRODUCT!`;
  }
  if (currentPoints >= 30 && currentPoints < 70) {
    return `You've earned cashback! Keep going - ${70 - currentPoints} more points to unlock a discount reward!`;
  }
  return "Keep collecting points to unlock amazing rewards! Reach 30 points for cashback, 70 for discounts, and 100 for a free product!";
};

export default function CheckoutCompletionPopup({
  isOpen,
  onClose,
  currentPoints,
  pointsEarned,
  orderReference,
  confirmationMessage,
}: CheckoutCompletionPopupProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  // Calculate previous points and check if a reward was just unlocked
  const previousPoints = currentPoints - pointsEarned;
  const newlyUnlockedReward = getNewlyUnlockedReward(previousPoints, currentPoints);
  const rewardMessage = getRewardMessage(newlyUnlockedReward, currentPoints);

  // Show confetti if they reached 100 points (free product)
  const shouldShowConfetti = newlyUnlockedReward === "free";

  useEffect(() => {
    if (!isOpen || !shouldShowConfetti) {
      setConfettiPieces([]);
      return;
    }

    const pieces = Array.from({ length: 50 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
    }));

    setConfettiPieces(pieces);
  }, [isOpen, shouldShowConfetti]);

  if (!isOpen) {
    return null;
  }

  // Choose icon based on reward type
  const Icon = newlyUnlockedReward === "free"
    ? Crown
    : newlyUnlockedReward === "discount"
      ? Gift
      : newlyUnlockedReward === "cashback"
        ? Star
        : Sparkles;

  const iconClassName = [
    "h-20 w-20 text-neutral-600",
    shouldShowConfetti ? "ccp-spin" : "",
  ].join(" ");

  return (
    <>
      {shouldShowConfetti && (
        <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden" aria-hidden>
          {confettiPieces.map((piece) => {
            const pieceStyle: CSSProperties & { ["--rotation"]: string } = {
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              backgroundColor: piece.color,
              ["--rotation"]: `${piece.rotation}deg`,
            };

            return <span key={piece.id} className="ccp-confetti" style={pieceStyle} />;
          })}
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 ccp-fadeIn">
        <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 text-center ccp-scaleIn sm:p-12">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 transition hover:text-black"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6 flex justify-center">
            <div className="ccp-bounce">
              <Icon className={iconClassName} />
            </div>
          </div>

          <CheckCircle className="mx-auto mb-4 h-[60px] w-[60px] text-green-500" />
          <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl">Order Completed!</h2>
          {orderReference && (
            <p className="mb-2 text-sm text-neutral-500">
              Reference: <span className="text-black">{orderReference}</span>
            </p>
          )}
          {confirmationMessage && (
            <p className="mb-4 text-sm text-neutral-500">{confirmationMessage}</p>
          )}

          <div className="mb-6 inline-flex rounded-full bg-neutral-600 px-6 py-3 text-sm font-semibold text-white">
            +{pointsEarned} Points Earned
          </div>
          <p className="mb-4 text-sm text-gray-500">
            This order added +{pointsEarned} fragments to your journey.
          </p>

          {/* Reward achievement notification */}
          {newlyUnlockedReward && (
            <div className="mb-6 rounded-lg bg-gradient-to-r from-neutral-600 to-neutral-700 p-6 text-white">
              <h3 className="mb-2 text-xl font-bold">
                {newlyUnlockedReward === "free" && "🎉 FREE PRODUCT UNLOCKED!"}
                {newlyUnlockedReward === "discount" && "🎁 DISCOUNT REWARD UNLOCKED!"}
                {newlyUnlockedReward === "cashback" && "⭐ CASHBACK REWARD UNLOCKED!"}
              </h3>
              <p className="text-sm leading-relaxed">{rewardMessage}</p>
            </div>
          )}

          {/* Regular progress message if no reward unlocked */}
          {!newlyUnlockedReward && (
            <p className="mb-6 text-lg leading-relaxed text-gray-700">{rewardMessage}</p>
          )}

          <p className="mb-6 text-sm text-gray-500">Total Points: {currentPoints}/100</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/rewards"
              className="flex-1 rounded-lg bg-neutral-600 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              {newlyUnlockedReward ? "Claim Your Reward" : "View Rewards Journey"}
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border-2 border-neutral-600 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ccp-fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes ccp-scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes ccp-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes ccp-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ccp-fall {
          0% {
            transform: translateY(-20px) rotate(var(--rotation));
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(calc(var(--rotation) + 720deg));
            opacity: 0;
          }
        }

        .ccp-fadeIn {
          animation: ccp-fadeIn 0.3s ease-out forwards;
        }

        .ccp-scaleIn {
          animation: ccp-scaleIn 0.3s ease-out forwards;
        }

        .ccp-bounce {
          animation: ccp-bounce 1.2s ease-in-out infinite;
        }

        .ccp-spin {
          animation: ccp-spin 0.8s ease-in-out infinite;
        }

        .ccp-confetti {
          position: absolute;
          top: -20px;
          width: 8px;
          height: 16px;
          animation-name: ccp-fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </>
  );
}
