import type { CSSProperties } from "react";

type OrderDeliveredEmailProps = {
  ctaUrl?: string;
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
  footnote: {
    margin: "12px 0 0",
    fontSize: "12px",
    lineHeight: "1.6",
    color: "#6b6b6b",
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

export const subject = "Delivered";

export default function OrderDeliveredEmail({ ctaUrl = "#" }: OrderDeliveredEmailProps) {
  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.brand}>Oiko</div>
        <h1 style={styles.title}>Delivered</h1>
        <p style={styles.text}>Your order has arrived.</p>
        <p style={styles.text}>This step matters.</p>
        <p style={styles.text}>Each order forms a fragment.</p>
        <p style={styles.footnote}>You can see how this fits into your rewards journey.</p>
        <a href={ctaUrl} style={styles.button}>
          View rewards journey
        </a>
      </div>
    </div>
  );
}
