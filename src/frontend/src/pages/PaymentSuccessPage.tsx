import { Camera, ShieldCheck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface PaymentSuccessPageProps {
  details: {
    name: string;
    phone: string;
    amount: string;
    upiId: string;
  };
  onDone: () => void;
}

export interface PaymentHistoryEntry {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  amount: string;
  timestamp: string;
  type: "sent";
}

const HISTORY_KEY = "gpay_payment_history";

// GPay multicolor G logo for "powered by" section
function GPayMark() {
  return (
    <div className="flex items-center gap-1.5">
      <svg
        width="28"
        height="28"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Google Pay logo"
      >
        <title>Google Pay logo</title>
        <path
          d="M39.2 20.45c0-1.4-.12-2.75-.35-4.05H20v7.66h10.8c-.47 2.5-1.88 4.62-4 6.04v5.02h6.48c3.8-3.5 5.92-8.66 5.92-14.67z"
          fill="#4285F4"
        />
        <path
          d="M20 40c5.4 0 9.93-1.79 13.24-4.84l-6.48-5.02c-1.79 1.2-4.08 1.91-6.76 1.91-5.2 0-9.6-3.51-11.17-8.23H2.18v5.19C5.48 35.53 12.24 40 20 40z"
          fill="#34A853"
        />
        <path
          d="M8.83 23.82A12.04 12.04 0 0 1 8.2 20c0-1.32.23-2.6.63-3.82v-5.19H2.18A20.01 20.01 0 0 0 0 20c0 3.23.77 6.28 2.18 8.99l6.65-5.17z"
          fill="#FBBC04"
        />
        <path
          d="M20 7.95c2.93 0 5.56 1.01 7.63 2.99l5.72-5.72C29.92 1.99 25.4 0 20 0 12.24 0 5.48 4.47 2.18 11.01l6.65 5.17C10.4 11.46 14.8 7.95 20 7.95z"
          fill="#EA4335"
        />
      </svg>
      <span
        style={{
          fontFamily: "'Google Sans', 'Roboto', sans-serif",
          fontSize: "20px",
          fontWeight: "500",
          color: "oklch(0.97 0.005 250)",
          letterSpacing: "-0.3px",
        }}
      >
        Pay
      </span>
    </div>
  );
}

export default function PaymentSuccessPage({
  details,
  onDone,
}: PaymentSuccessPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showScreenshotButtons, setShowScreenshotButtons] = useState(false);
  const [screenshotToast, setScreenshotToast] = useState(false);

  const nowRef = useRef(new Date());
  const transactionIdRef = useRef(`TXN${Date.now().toString().slice(-10)}`);
  const detailsRef = useRef(details);
  const now = nowRef.current;

  const formattedAmount = `₹${Number.parseFloat(details.amount).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;

  const dateStr = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  const timestampStr = `${dateStr}, ${timeStr}`;

  const bankingName = details.name
    ? details.name.toUpperCase()
    : "ACCOUNT HOLDER";

  useEffect(() => {
    // Play success tone
    try {
      const AudioContext =
        window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext: typeof window.AudioContext;
          }
        ).webkitAudioContext;
      const ctx = new AudioContext();

      const playTone = (
        freq: number,
        start: number,
        duration: number,
        gain: number,
      ) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
        gainNode.gain.linearRampToValueAtTime(
          gain,
          ctx.currentTime + start + 0.02,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + start + duration,
        );
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration + 0.1);
      };

      playTone(523.25, 0, 0.3, 0.78);
      playTone(659.25, 0.15, 0.3, 0.78);
      playTone(783.99, 0.3, 0.4, 0.78);
      playTone(1046.5, 0.45, 0.6, 0.6825);
    } catch {
      // Audio not supported
    }

    // Save to history
    const savedDetails = detailsRef.current;
    const newEntry: PaymentHistoryEntry = {
      id: transactionIdRef.current,
      name: savedDetails.name,
      phone: savedDetails.phone,
      upiId: savedDetails.upiId,
      amount: savedDetails.amount,
      timestamp: nowRef.current.toISOString(),
      type: "sent",
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]",
      ) as PaymentHistoryEntry[];
      const updated = [newEntry, ...existing];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }

    // Phase 2: after 5 seconds, reveal details + Cancel/Continue buttons
    const timer1 = setTimeout(() => {
      setShowDetails(true);
    }, 5000);

    // Phase 3: after 5 seconds of phase 2 (10s total), swap to Screenshot/Continue
    const timer2 = setTimeout(() => {
      setShowScreenshotButtons(true);
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleScreenshot = () => {
    setScreenshotToast(true);
    setTimeout(() => setScreenshotToast(false), 2500);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between"
      style={{ background: "oklch(0.08 0.010 250)" }}
    >
      {/* Screenshot saved toast */}
      {screenshotToast && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full"
          style={{
            background: "oklch(0.25 0.025 250)",
            color: "oklch(0.97 0.005 250)",
            fontSize: "13px",
            fontWeight: "500",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          📸 Screenshot saved
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center w-full px-6">
        {/* Blue circle checkmark - always visible */}
        <div className="mt-20 mb-8 flex flex-col items-center">
          <div className="relative">
            {/* Pulse rings */}
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ background: "rgba(26, 115, 232, 0.25)" }}
            />
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{
                background: "rgba(26, 115, 232, 0.15)",
                animationDelay: "0.3s",
              }}
            />
            {/* Blue circle */}
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center animate-success-scale"
              style={{
                background: "#1a73e8",
                boxShadow: "0 8px 32px rgba(26, 115, 232, 0.5)",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                role="img"
                aria-label="Payment successful checkmark"
              >
                <title>Payment successful checkmark</title>
                <path
                  d="M10 24L20 34L38 14"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="tick-path"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Amount - always visible */}
        <div className="text-center mb-2">
          <p
            className="animate-fade-up"
            style={{
              fontSize: "42px",
              fontWeight: "300",
              color: "oklch(0.97 0.005 250)",
              fontFamily: "'Google Sans', 'Roboto', sans-serif",
              letterSpacing: "-1px",
              animationDelay: "0.3s",
              opacity: 0,
            }}
          >
            {formattedAmount}
          </p>
        </div>

        {/* Phase 2 details - fade in after 5 seconds */}
        <div
          style={{
            opacity: showDetails ? 1 : 0,
            transition: "opacity 0.8s ease",
            width: "100%",
          }}
        >
          {/* Paid to section */}
          <div className="text-center mt-4 mb-1">
            <p
              style={{
                fontSize: "14px",
                color: "oklch(0.55 0.02 250)",
                fontWeight: "400",
              }}
            >
              Paid to
            </p>
            <p
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "oklch(0.97 0.005 250)",
                fontFamily: "'Google Sans', 'Roboto', sans-serif",
                marginTop: "2px",
              }}
            >
              {details.name || "Recipient"}
            </p>
          </div>

          {/* Banking name with green shield */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <ShieldCheck
              size={16}
              style={{ color: "oklch(0.65 0.18 145)", flexShrink: 0 }}
            />
            <p
              style={{
                fontSize: "13px",
                color: "oklch(0.75 0.01 250)",
                fontWeight: "400",
              }}
            >
              Banking name: {bankingName} SO SH ...
            </p>
          </div>

          {/* Timestamp */}
          <div className="text-center mt-1">
            <p
              style={{
                fontSize: "13px",
                color: "oklch(0.55 0.02 250)",
              }}
            >
              {timestampStr}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom section - powered by + buttons */}
      <div
        className="w-full px-6 pb-10"
        style={{
          opacity: showDetails ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* POWERED BY GPay */}
        <div className="flex flex-col items-center mb-6 gap-1">
          <span
            style={{
              fontSize: "9px",
              fontWeight: "600",
              color: "oklch(0.50 0.02 250)",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            powered by
          </span>
          <GPayMark />
        </div>

        {/* Action buttons - Phase 2: Cancel X + Continue */}
        <div
          className="flex gap-3"
          style={{
            opacity: showScreenshotButtons ? 0 : 1,
            transition: "opacity 0.4s ease",
            position: showScreenshotButtons ? "absolute" : "relative",
            pointerEvents: showScreenshotButtons ? "none" : "auto",
          }}
        >
          {/* Cancel X */}
          <button
            type="button"
            onClick={onDone}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full transition-all active:scale-95"
            style={{
              background: "oklch(0.22 0.025 250)",
              color: "oklch(0.85 0.01 250)",
              fontSize: "15px",
              fontWeight: "500",
              border: "none",
            }}
          >
            Cancel ✕
          </button>

          {/* Continue */}
          <button
            type="button"
            onClick={onDone}
            className="flex-1 py-4 rounded-full transition-all active:scale-95"
            style={{
              background: "#1a73e8",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              border: "none",
            }}
          >
            Continue
          </button>
        </div>

        {/* Action buttons - Phase 3: Screenshot receipt + Continue */}
        <div
          className="flex gap-3"
          style={{
            opacity: showScreenshotButtons ? 1 : 0,
            transition: "opacity 0.4s ease",
            position: showScreenshotButtons ? "relative" : "absolute",
            pointerEvents: showScreenshotButtons ? "auto" : "none",
            width: showScreenshotButtons ? "auto" : "0",
          }}
        >
          {/* Screenshot receipt - outlined */}
          <button
            type="button"
            onClick={handleScreenshot}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full transition-all active:scale-95"
            style={{
              border: "1.5px solid oklch(0.35 0.02 250)",
              background: "transparent",
              color: "oklch(0.97 0.005 250)",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <Camera size={16} />
            Screenshot receipt
          </button>

          {/* Continue - solid blue */}
          <button
            type="button"
            onClick={onDone}
            className="flex-1 py-4 rounded-full transition-all active:scale-95"
            style={{
              background: "#1a73e8",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              border: "none",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
