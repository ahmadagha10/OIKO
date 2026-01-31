import type { CSSProperties } from "react";

type WelcomeEmailProps = {
  firstName: string;
  email: string;
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
    margin: "16px 0 0",
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

export const subject = "Welcome to Oiko";

export default function WelcomeEmail({ firstName, email }: WelcomeEmailProps) {
  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.brand}>Oiko</div>
        <h1 style={styles.title}>Welcome, {firstName}</h1>
        <p style={styles.text}>
          You've joined something deliberate.
        </p>
        <p style={styles.text}>
          Every piece in our collection carries intention. From sustainable materials to
          timeless design, we create clothing that matters.
        </p>
        <p style={styles.text}>
          As you shop, you'll earn fragment points—a way to track your journey with us.
          Collect them, unlock rewards, and become part of the Oiko story.
        </p>
        <p style={styles.footnote}>
          Your account: {email}
        </p>
        <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products`} style={styles.button}>
          Explore collection
        </a>
      </div>
    </div>
  );
}
