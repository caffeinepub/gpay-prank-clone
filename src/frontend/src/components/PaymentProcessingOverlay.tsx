import React, { useEffect, useState } from 'react';

const CONFETTI_ANGLES = Array.from({ length: 14 }, (_, i) => (i * 360) / 14);
const CONFETTI_DISTANCES = [75, 85, 70, 90, 80, 75, 85, 70, 90, 80, 75, 85, 70, 90];
const CONFETTI_COLORS = [
  '#00BCD4', '#FFFFFF', '#00BCD4', '#FFFFFF', '#00E5FF', '#FFFFFF', '#00BCD4',
  '#FFFFFF', '#00E5FF', '#FFFFFF', '#00BCD4', '#FFFFFF', '#00E5FF', '#FFFFFF',
];

interface PaymentProcessingOverlayProps {
  onComplete: () => void;
}

export default function PaymentProcessingOverlay({ onComplete }: PaymentProcessingOverlayProps) {
  const [phase, setPhase] = useState<'spinner' | 'success'>('spinner');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('success'), 950);
    const t2 = setTimeout(onComplete, 2050);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes proc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes proc-fadein {
          from { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.1); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes proc-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
        @keyframes proc-confetti {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
          20% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1.2); }
          60% { opacity: 0.8; transform: translate(var(--tx), var(--ty)) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.5); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(18,18,18,0.97)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Phase 1: Google Blue circular arc spinner */}
        {phase === 'spinner' && (
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            aria-label="Processing payment"
            role="img"
            style={{
              animation: 'proc-spin 1s linear infinite',
            }}
          >
            <title>Processing payment</title>
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="#4285F4"
              strokeWidth="8"
              strokeDasharray="188 63"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Phase 2: Green checkmark + confetti burst */}
        {phase === 'success' && (
          <div
            style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Radial confetti particles */}
            {CONFETTI_ANGLES.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const dist = CONFETTI_DISTANCES[i];
              const tx = `${Math.cos(rad) * dist}px`;
              const ty = `${Math.sin(rad) * dist}px`;
              return (
                <div
                  key={`confetti-${angle.toFixed(1)}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: CONFETTI_COLORS[i],
                    '--tx': tx,
                    '--ty': ty,
                    animation: `proc-confetti 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                    animationDelay: `${i * 0.02}s`,
                  } as React.CSSProperties}
                />
              );
            })}

            {/* Checkmark SVG with bounce + pulse animation */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              aria-label="Payment successful"
              role="img"
              style={{
                position: 'relative',
                zIndex: 1,
                animation:
                  'proc-fadein 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, proc-pulse 0.6s ease-in-out 0.4s infinite',
              }}
            >
              <title>Payment successful</title>
              <circle cx="40" cy="40" r="36" fill="none" stroke="#00E676" strokeWidth="3" opacity="0.3" />
              <polyline
                points="22,40 34,52 58,28"
                fill="none"
                stroke="#00E676"
                strokeWidth="5"
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
