import React from 'react';
import { ArrowLeft, Shield, CheckCircle2, ChevronRight } from 'lucide-react';
import { TransactionData } from '../App';

interface TransactionDetailPageProps {
  transaction: TransactionData;
  onBack: () => void;
  onPay: (tx: TransactionData) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDetailTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatFullTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ', ' + date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString('en-IN');
}

// Generate a plausible "joined" date based on the UPI ID or name (deterministic)
function getJoinedDate(name: string): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  // Use char codes to pick a deterministic month/year
  const code = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const monthIdx = code % 12;
  const yearOffset = code % 3; // 0, 1, or 2 years ago
  const year = new Date().getFullYear() - yearOffset;
  return `Joined ${months[monthIdx]} ${year}`;
}

export default function TransactionDetailPage({ transaction, onBack, onPay }: TransactionDetailPageProps) {
  const initials = getInitials(transaction.name);
  const timeStr = formatDetailTimestamp(transaction.timestamp);
  const fullTimeStr = formatFullTimestamp(transaction.timestamp);
  const joinedStr = getJoinedDate(transaction.name);
  const displayPhone = transaction.phone || transaction.upiId;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: 'oklch(0.08 0.012 250)', fontFamily: "'Roboto', 'Google Sans', system-ui, sans-serif" }}
    >
      {/* Top bar with back arrow */}
      <div className="flex items-center justify-between px-4 pt-12 pb-2">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: 'oklch(0.16 0.020 250)' }}
        >
          <ArrowLeft size={20} style={{ color: 'oklch(0.97 0.005 250)' }} />
        </button>
        {/* Spacer for symmetry */}
        <div className="w-9 h-9" />
      </div>

      {/* Avatar + Contact Info */}
      <div className="flex flex-col items-center px-6 pt-8 pb-6">
        {/* Circular blue avatar */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{
            background: 'oklch(0.45 0.18 240)',
            boxShadow: '0 4px 20px oklch(0.45 0.18 240 / 0.4)',
          }}
        >
          <span
            className="text-2xl font-bold"
            style={{ color: 'oklch(1 0 0)', letterSpacing: '0.02em' }}
          >
            {initials}
          </span>
        </div>

        {/* Recipient name - bold, medium-large */}
        <h1
          className="text-xl font-bold text-center mb-2"
          style={{ color: 'oklch(0.97 0.005 250)' }}
        >
          {transaction.name}
        </h1>

        {/* Banking name row with shield icon */}
        <div className="flex items-center gap-1.5 mb-1">
          <Shield size={14} style={{ color: 'oklch(0.65 0.18 145)' }} />
          <span
            className="text-sm"
            style={{ color: 'oklch(0.75 0.02 250)', fontWeight: 400 }}
          >
            Banking name: {transaction.name}
          </span>
        </div>

        {/* Phone / UPI ID */}
        <p
          className="text-sm mb-1"
          style={{ color: 'oklch(0.75 0.02 250)', fontWeight: 400 }}
        >
          {displayPhone}
        </p>

        {/* Joined date - light gray, small */}
        <p
          className="text-xs"
          style={{ color: 'oklch(0.50 0.02 250)', fontWeight: 300 }}
        >
          {joinedStr}
        </p>
      </div>

      {/* Timestamp divider */}
      <div className="flex items-center gap-3 px-6 mb-4">
        <div className="flex-1 h-px" style={{ background: 'oklch(0.22 0.025 250)' }} />
        <span className="text-xs" style={{ color: 'oklch(0.50 0.02 250)' }}>
          {timeStr}
        </span>
        <div className="flex-1 h-px" style={{ background: 'oklch(0.22 0.025 250)' }} />
      </div>

      {/* Payment card bubble */}
      <div className="px-4 mb-6">
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'oklch(0.16 0.020 250)',
            border: '1px solid oklch(0.22 0.025 250)',
          }}
        >
          {/* Payment to label */}
          <p
            className="text-sm mb-1"
            style={{ color: 'oklch(0.65 0.02 250)', fontWeight: 400 }}
          >
            Payment to {transaction.name.split(' ')[0]}
          </p>

          {/* Large bold amount */}
          <p
            className="text-4xl font-bold mb-3"
            style={{ color: 'oklch(0.97 0.005 250)', letterSpacing: '-0.01em' }}
          >
            ₹{formatAmount(transaction.amount)}
          </p>

          {/* Paid status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={18}
                style={{ color: 'oklch(0.65 0.18 145)' }}
                fill="oklch(0.65 0.18 145)"
                stroke="oklch(0.16 0.020 250)"
                strokeWidth={1.5}
              />
              <span
                className="text-sm"
                style={{ color: 'oklch(0.75 0.02 250)', fontWeight: 400 }}
              >
                Paid • {fullTimeStr}
              </span>
            </div>
            <ChevronRight size={16} style={{ color: 'oklch(0.50 0.02 250)' }} />
          </div>
        </div>
      </div>

      {/* Spacer to push Pay button to bottom */}
      <div className="flex-1" />

      {/* Pay button at bottom */}
      <div
        className="px-4 pb-8 pt-4"
        style={{ borderTop: '1px solid oklch(0.18 0.022 250)' }}
      >
        <button
          onClick={() => onPay(transaction)}
          className="w-full py-4 rounded-full text-base font-bold transition-all active:scale-[0.98]"
          style={{
            background: 'oklch(0.72 0.17 175)',
            color: 'oklch(0.10 0.015 250)',
            boxShadow: '0 4px 20px oklch(0.72 0.17 175 / 0.35)',
          }}
        >
          Pay
        </button>
      </div>
    </div>
  );
}
