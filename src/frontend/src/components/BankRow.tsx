import type React from "react";

interface BankRowProps {
  logo: React.ReactNode;
  accountNumber: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function BankRow({
  logo,
  accountNumber,
  isSelected,
  onClick,
}: BankRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-[0.98]"
      style={{
        background: isSelected
          ? "oklch(0.55 0.22 240 / 0.12)"
          : "oklch(0.16 0.020 250)",
        border: `1.5px solid ${isSelected ? "oklch(0.55 0.22 240 / 0.5)" : "oklch(0.25 0.025 250)"}`,
      }}
    >
      {/* Logo section */}
      <div className="flex items-center gap-3">{logo}</div>
      {/* Account number */}
      <span
        style={{
          color: "oklch(0.65 0.02 250)",
          fontSize: "13px",
          fontWeight: "500",
          letterSpacing: "0.5px",
        }}
      >
        ·· {accountNumber}
      </span>
    </button>
  );
}
