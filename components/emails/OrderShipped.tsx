import type { CSSProperties } from "react";

type OrderShippedEmailProps = {
  ctaUrl?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
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
  infoBlock: {
    marginTop: "16px",
    padding: "12px 14px",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
  },
  infoLabel: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#6b6b6b",
    marginBottom: "6px",
  },
  infoText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#2f2f2f",
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

export const subject = "Your order is on its way";

export default function OrderShippedEmail({
  ctaUrl = "#",
  trackingNumber,
  estimatedDelivery,
}: OrderShippedEmailProps) {
  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.brand}>Oiko</div>
        <h1 style={styles.title}>Your order is on its way</h1>
        <p style={styles.text}>Your order has left our hands.</p>
        <p style={styles.text}>It's moving toward you now.</p>
        <p style={styles.text}>We'll notify you once it arrives.</p>
        {(trackingNumber || estimatedDelivery) && (
          <div style={styles.infoBlock}>
            <div style={styles.infoLabel}>Shipping details</div>
            {trackingNumber && <p style={styles.infoText}>Tracking number: {trackingNumber}</p>}
            {estimatedDelivery && <p style={styles.infoText}>Estimated delivery: {estimatedDelivery}</p>}
          </div>
        )}
        <a href={ctaUrl} style={styles.button}>
          Track order
        </a>
      </div>
    </div>
  );
}
