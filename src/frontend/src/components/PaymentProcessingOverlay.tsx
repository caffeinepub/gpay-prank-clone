import type React from "react";
import { useEffect, useState } from "react";

// Symbols that orbit around the central ₹ — mirroring GPay's multi-currency feel
const INNER_ORBIT_SYMBOLS = [
  { symbol: "$", color: "#34A853", startAngle: 0 },
  { symbol: "€", color: "#4285F4", startAngle: 90 },
  { symbol: "£", color: "#FBBC04", startAngle: 180 },
  { symbol: "¥", color: "#EA4335", startAngle: 270 },
];

const OUTER_ORBIT_SYMBOLS = [
  { symbol: "₿", color: "#F7931A", startAngle: 45 },
  { symbol: "₩", color: "#00BCD4", startAngle: 135 },
  { symbol: "₦", color: "#9C27B0", startAngle: 225 },
  { symbol: "฿", color: "#00BFA5", startAngle: 315 },
];

const CONFETTI_ANGLES = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
const CONFETTI_DISTANCES = [
  80, 90, 75, 95, 85, 80, 90, 75, 95, 85, 80, 90, 75, 95, 85, 80,
];
const CONFETTI_COLORS = [
  "#4285F4",
  "#34A853",
  "#FBBC04",
  "#EA4335",
  "#4285F4",
  "#34A853",
  "#FBBC04",
  "#EA4335",
  "#4285F4",
  "#34A853",
  "#FBBC04",
  "#EA4335",
  "#4285F4",
  "#34A853",
  "#FBBC04",
  "#EA4335",
];

interface PaymentProcessingOverlayProps {
  onComplete: () => void;
}

export default function PaymentProcessingOverlay({
  onComplete,
}: PaymentProcessingOverlayProps) {
  const [phase, setPhase] = useState<"processing" | "success">("processing");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("success"), 2000);
    const t2 = setTimeout(onComplete, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes ppo-inr-pulse {
          0%, 100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 0.85; transform: translate(-50%,-50%) scale(1.06); }
        }
        @keyframes ppo-inr-enter {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0.6); }
          to { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes ppo-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ppo-ring-spin-rev {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes ppo-success-enter {
          0% { opacity: 0; transform: scale(0.4); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ppo-confetti {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
          25% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1.3); }
          70% { opacity: 0.7; transform: translate(var(--tx), var(--ty)) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.4); }
        }
        @keyframes ppo-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(66,133,244,0); }
          50% { box-shadow: 0 0 32px 12px rgba(66,133,244,0.35); }
        }
        @keyframes ppo-tagline-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ppo-inr-symbol {
          animation: ppo-inr-enter 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,
                     ppo-inr-pulse 1.5s ease-in-out 0.4s infinite,
                     ppo-glow 1.5s ease-in-out 0.4s infinite;
        }
        .ppo-ring1 {
          animation: ppo-ring-spin 3.2s linear infinite;
        }
        .ppo-ring2 {
          animation: ppo-ring-spin-rev 2.0s linear infinite;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(10,15,30,0.98)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
        }}
      >
        {phase === "processing" && (
          <>
            {/* Orbit + INR container */}
            <div
              style={{ position: "relative", width: "260px", height: "260px" }}
            >
              {/* Orbit guide rings (decorative, faint) */}
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.12,
                }}
                viewBox="0 0 260 260"
              >
                <title>Orbit guides</title>
                <circle
                  cx="130"
                  cy="130"
                  r="108"
                  fill="none"
                  stroke="#4285F4"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="72"
                  fill="none"
                  stroke="#4285F4"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
              </svg>

              {/* Inner orbit symbols (ring 1, clockwise) */}
              <div
                className="ppo-ring1"
                style={{ position: "absolute", inset: 0 }}
              >
                {INNER_ORBIT_SYMBOLS.map((s) => {
                  const rad = (s.startAngle * Math.PI) / 180;
                  const cx = 130 + 72 * Math.cos(rad);
                  const cy = 130 + 72 * Math.sin(rad);
                  return (
                    <div
                      key={`inner-${s.symbol}`}
                      style={{
                        position: "absolute",
                        left: `${cx}px`,
                        top: `${cy}px`,
                        transform: "translate(-50%, -50%)",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: `${s.color}22`,
                        border: `1.5px solid ${s.color}88`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: s.color,
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      {s.symbol}
                    </div>
                  );
                })}
              </div>

              {/* Outer orbit symbols (ring 2, counter-rotating) */}
              <div
                className="ppo-ring2"
                style={{ position: "absolute", inset: 0 }}
              >
                {OUTER_ORBIT_SYMBOLS.map((s) => {
                  const rad = (s.startAngle * Math.PI) / 180;
                  const cx = 130 + 108 * Math.cos(rad);
                  const cy = 130 + 108 * Math.sin(rad);
                  return (
                    <div
                      key={`outer-${s.symbol}`}
                      style={{
                        position: "absolute",
                        left: `${cx}px`,
                        top: `${cy}px`,
                        transform: "translate(-50%, -50%)",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: `${s.color}1A`,
                        border: `1.5px solid ${s.color}66`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: s.color,
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      {s.symbol}
                    </div>
                  );
                })}
              </div>

              {/* Central ₹ symbol */}
              <div
                className="ppo-inr-symbol"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "72px",
                  height: "72px",
                  marginLeft: "-36px",
                  marginTop: "-36px",
                  borderRadius: "50%",
                  background: "rgba(66,133,244,0.15)",
                  border: "2.5px solid rgba(66,133,244,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "34px",
                  fontWeight: "900",
                  color: "#4285F4",
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  zIndex: 10,
                }}
              >
                ₹
              </div>
            </div>

            {/* Processing label */}
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                fontWeight: "500",
                letterSpacing: "0.5px",
                fontFamily: "system-ui, sans-serif",
                animation: "ppo-tagline-fade 0.5s ease forwards 0.3s",
                opacity: 0,
              }}
            >
              Processing payment...
            </div>
          </>
        )}

        {phase === "success" && (
          <div
            style={{
              position: "relative",
              width: "140px",
              height: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Confetti burst */}
            {CONFETTI_ANGLES.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const dist = CONFETTI_DISTANCES[i];
              const tx = `${Math.cos(rad) * dist}px`;
              const ty = `${Math.sin(rad) * dist}px`;
              return (
                <div
                  key={`confetti-${angle.toFixed(1)}`}
                  style={
                    {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: CONFETTI_COLORS[i],
                      "--tx": tx,
                      "--ty": ty,
                      animation:
                        "ppo-confetti 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                      animationDelay: `${i * 0.025}s`,
                    } as React.CSSProperties
                  }
                />
              );
            })}

            {/* Success checkmark */}
            <svg
              width="90"
              height="90"
              viewBox="0 0 90 90"
              aria-label="Payment successful"
              role="img"
              style={{
                position: "relative",
                zIndex: 1,
                animation:
                  "ppo-success-enter 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }}
            >
              <title>Payment successful</title>
              <circle
                cx="45"
                cy="45"
                r="40"
                fill="rgba(52,168,83,0.15)"
                stroke="#34A853"
                strokeWidth="2.5"
              />
              <polyline
                points="26,45 38,57 64,32"
                fill="none"
                stroke="#34A853"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
