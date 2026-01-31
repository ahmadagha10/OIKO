import type { CSSProperties } from "react";
import { getRewardTypeForProgress, type RewardType } from "@/lib/rewards";

type RewardUnlockedEmailProps = {
  ctaUrl?: string;
  rewardType?: RewardType;
  currentPoints?: number;
  discountPercent?: number;
};

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: "#ffffff",
    padding: "32px 16px",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    color: "#111111",
  },
  card: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e5e5",
    borderRadius: "16px",
    padding: "32px",
  },
  brand: {
    fontSize: "12px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "#6b6b6b",
  },
  title: {
    margin: "16px 0 12px",
    fontSize: "22px",
    fontWeight: 600,
  },
  text: {
    margin: "0 0 12px",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#2f2f2f",
  },
  rewardBox: {
    marginTop: "16px",
    padding: "14px 16px",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
  },
  rewardLabel: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#6b6b6b",
    marginBottom: "6px",
  },
  rewardValue: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#111111",
    fontWeight: 600,
  },
  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 18px",
    border: "1px solid #111111",
    borderRadius: "999px",
    color: "#111111",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
  },
};

const rewardTextMap: Record<RewardType, (discountPercent?: number) => string> = {
  cashback: () => "Cashback has been added to your account.",
  discount: (discountPercent = 20) => `${discountPercent}% off your next order.`,
  free: () => "A free product is now available to you.",
};

export const subject = "Something opened";

export default function RewardUnlockedEmail({
  ctaUrl = "#",
  rewardType,
  currentPoints,
  discountPercent,
}: RewardUnlockedEmailProps) {
  const resolvedType = rewardType ?? getRewardTypeForProgress(currentPoints ?? 0);

  if (!resolvedType) {
    return null;
  }

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.brand}>Oiko</div>
        <h1 style={styles.title}>Something opened</h1>
        <p style={styles.text}>Something became available to you.</p>
        <p style={styles.text}>You've reached a step in your journey where a reward applies.</p>
        <p style={styles.text}>It's there when you're ready.</p>
        <div style={styles.rewardBox}>
          <div style={styles.rewardLabel}>Your reward</div>
          <p style={styles.rewardValue}>{rewardTextMap[resolvedType](discountPercent)}</p>
        </div>
        <a href={ctaUrl} style={styles.button}>
          View reward
        </a>
      </div>
    </div>
  );
}
