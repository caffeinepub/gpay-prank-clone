import React from "react";

// HDFC Bank Logo - recreated as inline SVG matching the reference image
// Red bracket/frame outer shape with blue square center + HDFC BANK text bar
export function HdfcBankLogo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Icon mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="HDFC Bank Logo"
      >
        <title>HDFC Bank Logo</title>
        {/* Red bracket frame - four L-shaped corners */}
        {/* Top-left corner */}
        <rect x="5" y="5" width="28" height="12" fill="#E31837" />
        <rect x="5" y="5" width="12" height="28" fill="#E31837" />
        {/* Top-right corner */}
        <rect x="67" y="5" width="28" height="12" fill="#E31837" />
        <rect x="83" y="5" width="12" height="28" fill="#E31837" />
        {/* Bottom-left corner */}
        <rect x="5" y="83" width="28" height="12" fill="#E31837" />
        <rect x="5" y="67" width="12" height="28" fill="#E31837" />
        {/* Bottom-right corner */}
        <rect x="67" y="83" width="28" height="12" fill="#E31837" />
        <rect x="83" y="67" width="12" height="28" fill="#E31837" />
        {/* Blue center square */}
        <rect x="30" y="30" width="40" height="40" fill="#1A3A8F" />
      </svg>
      {/* HDFC BANK text bar */}
      <div
        style={{
          background: "#1A3A8F",
          padding: "3px 7px",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontWeight: "800",
            fontSize: "11px",
            letterSpacing: "0.5px",
            fontFamily: "'Google Sans', 'Roboto', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          HDFC BANK
        </span>
      </div>
    </div>
  );
}

// SBI Bank Logo - standard blue circular emblem with SBI text
export function SbiBankLogo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {/* SBI circular emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SBI Bank Logo"
      >
        <title>SBI Bank Logo</title>
        {/* Outer blue circle */}
        <circle cx="50" cy="50" r="48" fill="#22409A" />
        {/* White ring */}
        <circle cx="50" cy="50" r="42" fill="white" />
        {/* Inner blue circle */}
        <circle cx="50" cy="50" r="36" fill="#22409A" />
        {/* Keyhole/torch symbol - white */}
        {/* Torch flame top */}
        <ellipse cx="50" cy="28" rx="8" ry="10" fill="white" />
        {/* Torch body */}
        <rect x="46" y="35" width="8" height="18" fill="white" />
        {/* Torch base */}
        <rect x="42" y="52" width="16" height="5" rx="2" fill="white" />
        {/* Horizontal lines (waves) */}
        <rect x="30" y="62" width="40" height="3" rx="1.5" fill="white" />
        <rect x="30" y="68" width="40" height="3" rx="1.5" fill="white" />
        {/* SBI text at bottom */}
        <text
          x="50"
          y="82"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          letterSpacing="1"
        >
          SBI
        </text>
      </svg>
      {/* SBI text label */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            color: "oklch(0.97 0.005 250)",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: "0.3px",
            fontFamily: "'Google Sans', 'Roboto', sans-serif",
            lineHeight: 1.2,
          }}
        >
          State Bank of India
        </span>
        <span
          style={{
            color: "oklch(0.55 0.02 250)",
            fontSize: "10px",
          }}
        >
          SBI
        </span>
      </div>
    </div>
  );
}
