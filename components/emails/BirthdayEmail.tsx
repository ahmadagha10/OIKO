import * as React from "react";

interface BirthdayEmailProps {
  customerName: string;
  age: number;
  bonusPoints: number;
  currentPoints: number;
}

export default function BirthdayEmail({
  customerName = "Ahmad",
  age = 30,
  bonusPoints = 50,
  currentPoints = 50,
}: BirthdayEmailProps) {
  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: "#f9fafb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header with gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
            padding: "40px 32px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎂</div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "32px",
              fontWeight: "bold",
              margin: "0 0 8px 0",
            }}
          >
            Happy {age}th Birthday!
          </h1>
          <p
            style={{
              color: "#fce7f3",
              fontSize: "18px",
              margin: 0,
            }}
          >
            {customerName}, you're amazing! 🎉
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "40px 32px" }}>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              marginBottom: "24px",
            }}
          >
            Dear {customerName},
          </p>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              marginBottom: "24px",
            }}
          >
            Team Oiko wishes you a wonderful birthday filled with joy, laughter, and style!
            As a token of our appreciation for being part of our community, we've prepared a
            special gift just for you.
          </p>

          {/* Gift Box */}
          <div
            style={{
              background: "linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)",
              border: "2px solid #e9d5ff",
              borderRadius: "12px",
              padding: "32px",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎁</div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#9333ea",
                margin: "0 0 8px 0",
              }}
            >
              Your Birthday Gift
            </h2>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                padding: "20px",
                margin: "16px 0",
                display: "inline-block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "36px", fontWeight: "bold", color: "#9333ea" }}>
                  +{bonusPoints}
                </span>
                <span style={{ fontSize: "18px", color: "#6b7280" }}>Bonus Points</span>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#7c3aed", margin: "8px 0 0 0" }}>
              Added to your account automatically!
            </p>
          </div>

          {/* Points Summary */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "32px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
                margin: "0 0 12px 0",
              }}
            >
              Your Rewards Balance
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>Total Points:</span>
              <span style={{ color: "#9333ea", fontSize: "20px", fontWeight: "bold" }}>
                {currentPoints} pts
              </span>
            </div>
            <div
              style={{
                marginTop: "12px",
                height: "8px",
                backgroundColor: "#e5e7eb",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#9333ea",
                  width: `${Math.min((currentPoints / 100) * 100, 100)}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "8px 0 0 0" }}>
              {100 - currentPoints > 0
                ? `${100 - currentPoints} points until your next reward!`
                : "You've unlocked all rewards! 🎉"}
            </p>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <a
              href="https://oiko.com/products"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                color: "#ffffff",
                textDecoration: "none",
                padding: "16px 32px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 4px 6px rgba(147, 51, 234, 0.3)",
              }}
            >
              Shop Now & Use Your Points
            </a>
          </div>

          {/* Special Birthday Offers */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
                margin: "0 0 16px 0",
              }}
            >
              🎈 Birthday Month Specials
            </h3>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#6b7280" }}>
              <li style={{ marginBottom: "8px" }}>Free shipping on your next order</li>
              <li style={{ marginBottom: "8px" }}>Double points on all purchases this month</li>
              <li style={{ marginBottom: "8px" }}>Early access to new collections</li>
              <li>Exclusive birthday discount code: <strong style={{ color: "#9333ea" }}>BDAY2026</strong></li>
            </ul>
          </div>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Thank you for being part of the Oiko family. We hope this year brings you
            everything you wish for!
          </p>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              marginBottom: "24px",
            }}
          >
            With love and style,<br />
            <strong>The Oiko Team</strong>
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "32px",
            textAlign: "center",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 8px 0" }}>
            Oiko - Premium Custom Streetwear
          </p>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 16px 0" }}>
            Riyadh, Saudi Arabia
          </p>
          <div style={{ marginBottom: "16px" }}>
            <a
              href="https://www.instagram.com/oikoksa/"
              style={{
                color: "#9333ea",
                textDecoration: "none",
                margin: "0 12px",
                fontSize: "12px",
              }}
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com/@oiko"
              style={{
                color: "#9333ea",
                textDecoration: "none",
                margin: "0 12px",
                fontSize: "12px",
              }}
            >
              TikTok
            </a>
          </div>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0" }}>
            © 2026 Oiko. All rights reserved.
          </p>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: "8px 0 0 0" }}>
            You received this email because it's your birthday! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
