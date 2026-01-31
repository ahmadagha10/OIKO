"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Crown,
  Gift,
  Lock,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clampProgress, FRAGMENTS_KEY, MAX_PROGRESS, REWARD_THRESHOLDS } from "@/lib/rewards";

type StageType = "progress" | "cashback" | "discount" | "free";

type Stage = {
  id: number;
  points: number;
  type: StageType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STAGES: Stage[] = [
  {
    id: 1,
    points: 10,
    type: "progress",
    title: "Welcome Bonus",
    description: "You're on your way! Keep shopping to unlock amazing rewards.",
    icon: Sparkles,
  },
  {
    id: 2,
    points: 20,
    type: "progress",
    title: "Rising Star",
    description: "Great progress! Your next reward is just around the corner.",
    icon: Star,
  },
  {
    id: 3,
    points: REWARD_THRESHOLDS.cashback,
    type: "cashback",
    title: "10% Cashback",
    description: "Enjoy 10% cashback on your next purchase!",
    icon: TrendingUp,
  },
  {
    id: 4,
    points: 45,
    type: "progress",
    title: "VIP Track",
    description: "You're entering VIP territory. Exclusive perks ahead!",
    icon: Award,
  },
  {
    id: 5,
    points: 60,
    type: "progress",
    title: "Elite Status",
    description: "Almost there! Premium rewards are within reach.",
    icon: Award,
  },
  {
    id: 6,
    points: REWARD_THRESHOLDS.discount,
    type: "discount",
    title: "20% Discount",
    description: "Unlock a massive 20% discount on any purchase!",
    icon: Gift,
  },
  {
    id: 7,
    points: 80,
    type: "progress",
    title: "Platinum Member",
    description: "You're among our most valued customers. The ultimate reward awaits!",
    icon: Crown,
  },
  {
    id: 8,
    points: 90,
    type: "progress",
    title: "Final Stretch",
    description: "One more step to claim your grand reward. You've earned it!",
    icon: Crown,
  },
  {
    id: 9,
    points: REWARD_THRESHOLDS.free,
    type: "free",
    title: "FREE Product",
    description: "Congratulations! Choose any product free (up to your points value).",
    icon: Crown,
  },
];

const rewardLabels: Record<StageType, string> = {
  progress: "Progress",
  cashback: "10% cashback",
  discount: "20% discount",
  free: "Free product",
};

const maxPoints = MAX_PROGRESS;
const CONFETTI_COLORS = ["#525252", "#737373", "#A3A3A3"];

const getCurrentStage = (points: number) => {
  for (let i = STAGES.length - 1; i >= 0; i -= 1) {
    if (points >= STAGES[i].points) {
      return STAGES[i];
    }
  }
  return null;
};

const getNextStage = (points: number) =>
  STAGES.find((stage) => stage.points > points) ?? null;

export default function LoyaltyRewardsPage() {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasShownCelebration, setHasShownCelebration] = useState(false);

  const handleClaimReward = () => {
    localStorage.setItem(FRAGMENTS_KEY, "0");
    setCurrentPoints(0);
    setShowCelebration(false);
    setHasShownCelebration(false);
    window.dispatchEvent(new Event("oiko:points-updated"));
  };

  useEffect(() => {
    const syncPointsFromStorage = () => {
      const storedPoints = Number(localStorage.getItem(FRAGMENTS_KEY) || "0");
      const sanitized = Number.isNaN(storedPoints) ? 0 : storedPoints;
      setCurrentPoints(clampProgress(sanitized));
    };

    syncPointsFromStorage();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === FRAGMENTS_KEY) {
        syncPointsFromStorage();
      }
    };

    const handlePointsUpdate = () => syncPointsFromStorage();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("oiko:points-updated", handlePointsUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("oiko:points-updated", handlePointsUpdate);
    };
  }, []);

  const currentStage = useMemo(() => getCurrentStage(currentPoints), [currentPoints]);

  const nextStage = useMemo(() => getNextStage(currentPoints), [currentPoints]);

  const displayPoints = clampProgress(currentPoints);
  const overallProgress = Math.min(1, displayPoints / maxPoints);
  const pointsToNext = nextStage ? Math.max(0, nextStage.points - currentPoints) : 0;

  const darkGray = "bg-neutral-600";
  const darkGrayBorder = "border-neutral-600";

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
      })),
    []
  );

  useEffect(() => {
    if (currentPoints < maxPoints || hasShownCelebration) {
      return;
    }

    setShowCelebration(true);
    setHasShownCelebration(true);

    const timeoutId = window.setTimeout(() => {
      setShowCelebration(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [currentPoints, hasShownCelebration]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-700">
      {showCelebration && (
        <>
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden>
            {confettiPieces.map((piece) => {
              const pieceStyle: React.CSSProperties & { ["--rotation"]: string } = {
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                backgroundColor: piece.color,
                ["--rotation"]: `${piece.rotation}deg`,
              };

              return <span key={piece.id} className="confetti-piece" style={pieceStyle} />;
            })}
          </div>
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 animate-fadeIn">
            <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12 animate-scaleIn">
              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 transition hover:text-black"
                aria-label="Close celebration"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex justify-center">
                <Crown className="h-20 w-20 text-neutral-700 animate-bounceSoft" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-black sm:text-4xl">🎉 Congratulations! 🎉</h2>
              <p className="mt-3 text-base text-neutral-700 sm:text-lg">
                You&apos;ve unlocked the ultimate reward! Choose any product free up to your points value.
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Claiming will reset your points to 0 so you can start a new rewards journey.
              </p>
              <button
                type="button"
                onClick={handleClaimReward}
                className="mt-6 w-full rounded-full bg-neutral-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
              >
                Claim Your Reward
              </button>
            </div>
          </div>
        </>
      )}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-black sm:text-4xl lg:text-5xl">
            Your Rewards Journey
          </h1>
          <p className="text-sm text-neutral-600 sm:text-base">
            Collect points with every purchase and unlock exclusive rewards
          </p>
        </header>

        <section
          className={cn(
            "mt-10 rounded-2xl p-6 text-white shadow-lg sm:rounded-3xl sm:p-8",
            darkGray
          )}
        >
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-white/70">Your Points Balance</p>
            <p className="text-4xl font-semibold sm:text-5xl lg:text-6xl">{displayPoints}</p>
            <p className="text-sm text-white/80">
              {displayPoints}/{maxPoints} fragments
            </p>
            <p className="text-xs text-white/70">Fragments are counted per piece.</p>
            <div className="h-2 w-full rounded-full bg-neutral-800 sm:h-3">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${overallProgress * 100}%` }}
              />
            </div>
            <p className="text-sm text-white/90">
              {nextStage ? `${pointsToNext} points until ${nextStage.title}` : "All stages unlocked"}
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {STAGES.slice(0, 6).map((stage) => {
            const isUnlocked = currentPoints >= stage.points;
            const isNext = nextStage?.id === stage.id;
            const isFinalStage = stage.id === STAGES.length;
            const isFinalUnlocked = isFinalStage && currentStage?.id === stage.id;
            const Icon = stage.icon;
            const isProgress = stage.type === "progress";
            const rewardBadgeClasses = isProgress
              ? isUnlocked
                ? "bg-white/20 text-white border-transparent"
                : "bg-gray-100 text-gray-500 border-transparent"
              : isUnlocked
                ? "bg-white text-black border-white"
                : "bg-neutral-50 text-neutral-700 border-neutral-200";

            return (
              <div
                key={stage.id}
                className={cn(
                  "relative rounded-2xl border p-5 transition-all duration-300 shadow-sm",
                  isUnlocked
                    ? `${darkGray} text-white ${darkGrayBorder} shadow-xl`
                    : "bg-white text-black border-neutral-200",
                  isFinalUnlocked
                    ? "scale-105 shadow-[0_0_24px_rgba(0,0,0,0.35)] animate-pulseGlow"
                    : ""
                )}
              >
                {isNext && (
                  <span className="absolute inset-0 rounded-2xl ring-2 ring-neutral-300 sm:ring-4" />
                )}
                <span className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-neutral-600 text-xs font-semibold text-white sm:h-10 sm:w-10">
                  {stage.id}
                </span>
                <span className="absolute -right-3 -top-3 rounded-full border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-700">
                  {isUnlocked ? "UNLOCKED" : "LOCKED"}
                </span>

                <div className="relative mt-6 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border sm:h-16 sm:w-16",
                      isUnlocked
                        ? "bg-white text-neutral-700 border-white"
                        : "bg-neutral-50 text-gray-400 border-neutral-200"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 sm:h-6 sm:w-6",
                        isFinalUnlocked ? "animate-spinOnce" : ""
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold sm:text-xl">{stage.title}</p>
                    <p
                      className={cn(
                        "text-xs leading-relaxed sm:text-sm",
                        isUnlocked ? "text-white/80" : "text-neutral-500"
                      )}
                    >
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="relative mt-6">
                  <p className={cn("text-base font-semibold sm:text-lg", isUnlocked ? "text-white" : "text-black")}>
                    {stage.points} points
                  </p>
                  <div className="mt-3 flex justify-center">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest",
                        rewardBadgeClasses
                      )}
                    >
                      {rewardLabels[stage.type]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {displayPoints < STAGES[6].points ? (
            <div className="relative rounded-2xl border-2 border-neutral-300 bg-neutral-50 p-6 opacity-90 lg:col-span-3 sm:p-8">
              <Lock className="absolute right-6 top-6 h-10 w-10 text-neutral-400" />
              <div className="flex flex-col items-center text-center">
                <Lock className="mb-4 h-[60px] w-[60px] text-neutral-300" />
                <h3 className="text-2xl font-bold text-neutral-600">Ultimate Rewards Locked</h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Reach {STAGES[6].points} points to unlock the final three stages and claim your ultimate reward
                </p>
                <p className="mt-3 text-sm font-semibold text-neutral-600">
                  Current: {displayPoints} / {maxPoints} points
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  {[7, 8, 9].map((stage) => (
                    <div
                      key={stage}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-300"
                    >
                      <Crown className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl border-2 border-neutral-600 bg-white p-6 shadow-xl lg:col-span-3 sm:p-8">
              <span className="absolute right-4 top-4 rounded-full bg-neutral-600 px-4 py-2 text-xs font-semibold text-white">
                UNLOCKED
              </span>
              <h3 className="mb-6 text-2xl font-bold text-black">Ultimate Rewards</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {STAGES.slice(6).map((stage) => {
                  const isStageUnlocked = currentPoints >= stage.points;
                  return (
                    <div
                      key={stage.id}
                      className="relative rounded-xl border border-neutral-200 p-4 text-center"
                    >
                      <span className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-600 text-xs font-semibold text-white">
                        {stage.id}
                      </span>
                      <div className="mb-3 flex justify-center">
                        <Crown className={cn("h-10 w-10", isStageUnlocked ? "text-neutral-600" : "text-gray-400")} />
                      </div>
                      <p className="text-base font-bold text-black">{stage.title}</p>
                      <p className="mt-2 text-sm text-neutral-600">{stage.points} points</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:rounded-3xl sm:p-6">
          <p className="text-sm text-neutral-700">
            Demo: Adjust your points to see the stages unlock
          </p>
          <div className="mt-3 flex items-center justify-between text-sm text-neutral-500">
            <span>Adjust points</span>
            <span>{displayPoints}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPoints}
            value={displayPoints}
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              const clamped = clampProgress(nextValue);
              setCurrentPoints(clamped);
              localStorage.setItem(FRAGMENTS_KEY, String(clamped));
              window.dispatchEvent(new Event("oiko:points-updated"));
            }}
            className="mt-3 w-full accent-neutral-600"
          />
          <p className="mt-2 text-sm text-black">
            Current points: {displayPoints}
          </p>
        </section>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spinOnce {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
          }
        }

        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(var(--rotation));
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(calc(var(--rotation) + 720deg));
            opacity: 0;
          }
        }

        @keyframes bounceSoft {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .animate-spinOnce {
          animation: spinOnce 0.6s ease-out forwards;
        }

        .animate-pulseGlow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-bounceSoft {
          animation: bounceSoft 1.2s ease-in-out infinite;
        }

        .confetti-piece {
          position: absolute;
          top: -20px;
          width: 8px;
          height: 16px;
          animation-name: fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
