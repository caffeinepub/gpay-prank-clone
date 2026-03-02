import {
  ArrowLeft,
  HelpCircle,
  MoreVertical,
  Search,
  Shield,
} from "lucide-react";
import React from "react";

interface FakeTransactionDetailPageProps {
  onBack: () => void;
  recipientName?: string;
  recipientPhone?: string;
  upiId?: string;
  amount?: string;
}

export default function FakeTransactionDetailPage({
  onBack,
  recipientName = "Priya Sharma",
  recipientPhone = "",
  upiId = "priyas.98@okaxis",
  amount = "500.00",
}: FakeTransactionDetailPageProps) {
  const initials = recipientName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayUpiId =
    upiId || (recipientPhone ? `${recipientPhone}@upi` : "upi@okaxis");

  const formattedAmount = Number.isNaN(Number(amount))
    ? amount
    : Number(amount).toFixed(2);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
  const txId = `T${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background: "#ffffff",
        fontFamily: "'Google Sans', 'Roboto', sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 pt-12 pb-3"
        style={{ background: "#ffffff", borderBottom: "1px solid #e8eaed" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "transparent" }}
          aria-label="Go back"
        >
          <ArrowLeft size={22} style={{ color: "#1a1a1a" }} />
        </button>
        <span
          className="font-semibold text-base"
          style={{ color: "#1a1a1a", letterSpacing: "0.01em" }}
        >
          Transactions
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "transparent" }}
            aria-label="Search"
          >
            <Search size={20} style={{ color: "#1a1a1a" }} />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "transparent" }}
            aria-label="More options"
          >
            <MoreVertical size={20} style={{ color: "#1a1a1a" }} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-5 py-5 overflow-y-auto">
        {/* Header section */}
        <div className="mb-5">
          <h1 className="text-xl font-bold mb-1" style={{ color: "#1a1a1a" }}>
            Transaction Details
          </h1>
          <p className="text-sm" style={{ color: "#5f6368" }}>
            for {recipientName}
          </p>
        </div>

        {/* Amount */}
        <div className="mb-2">
          <p
            className="font-bold"
            style={{ color: "#1a1a1a", fontSize: "38px", lineHeight: "1.1" }}
          >
            ₹{formattedAmount}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold" style={{ color: "#1e8e3e" }}>
            ✓ Payment Successful
          </span>
        </div>

        {/* Date */}
        <p className="text-xs mb-5" style={{ color: "#5f6368" }}>
          {dateStr}, {timeStr}
        </p>

        {/* Divider */}
        <div className="mb-5" style={{ borderTop: "1px solid #e8eaed" }} />

        {/* Timeline section */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: "#f8f9fa" }}>
          {/* Payment Started row */}
          <div className="flex items-start gap-3">
            {/* Left icon — smaller by 40%: was w-8 h-8 (32px), now ~w-5 h-5 (20px) */}
            <div className="flex flex-col items-center">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#e8f0fe", border: "1.5px solid #1a73e8" }}
              />
              {/* Vertical line — increased gap/height */}
              <div
                className="w-0.5 flex-1 my-2"
                style={{ background: "#e8eaed", minHeight: "52px" }}
              />
            </div>

            {/* Center content */}
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Payment Started
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#5f6368" }}>
                {timeStr} | {txId}
              </p>
            </div>

            {/* Right icon — smaller by 40% */}
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "#e8f0fe", border: "1.5px solid #1a73e8" }}
            />
          </div>

          {/* Recipient row */}
          <div className="flex items-start gap-3 mt-1">
            {/* Left icon — smaller by 40%, no green, no tick */}
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#f1f3f4", border: "1.5px solid #dadce0" }}
            >
              <span
                className="text-[8px] font-bold"
                style={{ color: "#5f6368" }}
              >
                {initials}
              </span>
            </div>

            {/* Center content */}
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Recipient
              </p>
              <p className="text-sm" style={{ color: "#1a1a1a" }}>
                {recipientName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#5f6368" }}>
                UPI ID: {displayUpiId}
              </p>
              {/* Red note text — narrow/short horizontally */}
              <div className="mt-2" style={{ maxWidth: "200px" }}>
                <p
                  className="text-xs leading-snug"
                  style={{ color: "#d93025" }}
                >
                  <span className="font-semibold">Note:</span> There's an issue
                  with the recipient server right now, wait for 3-5 hours for
                  the transaction amount to be credited
                </p>
              </div>
            </div>

            {/* Right icon — smaller by 40%, no green, no tick */}
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "#f1f3f4", border: "1.5px solid #dadce0" }}
            />
          </div>
        </div>

        {/* Other Details section */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: "#f8f9fa" }}>
          <p
            className="text-xs font-semibold mb-3 uppercase tracking-wider"
            style={{ color: "#5f6368" }}
          >
            Other Details
          </p>

          {/* Transaction ID */}
          <div className="mb-3">
            <p className="text-xs mb-1" style={{ color: "#5f6368" }}>
              Transaction ID
            </p>
            <p
              className="text-sm font-medium"
              style={{ color: "#1a1a1a", wordBreak: "break-all" }}
            >
              {txId}-{Math.floor(Math.random() * 900000000000 + 100000000000)}
            </p>
          </div>

          {/* Divider */}
          <div className="mb-3" style={{ borderTop: "1px solid #e8eaed" }} />

          {/* Payment Method */}
          <div>
            <p className="text-xs mb-1" style={{ color: "#5f6368" }}>
              Payment Method
            </p>
            <div className="flex items-center gap-2">
              <Shield size={16} style={{ color: "#1e8e3e" }} fill="#e8f5e9" />
              <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                UPI, Bank of Baroda *1234
              </p>
            </div>
          </div>
        </div>

        {/* Need Help section */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} style={{ color: "#1a1a1a" }} />
            <h2 className="text-base font-bold" style={{ color: "#1a1a1a" }}>
              Need Help?
            </h2>
          </div>

          {/* Retry Payment button */}
          <button
            type="button"
            className="w-full py-3.5 rounded-full font-semibold text-sm mb-3 transition-all active:scale-[0.98]"
            style={{
              background: "#1a73e8",
              color: "white",
            }}
          >
            Retry Payment
          </button>

          {/* Raise Dispute button */}
          <button
            type="button"
            className="w-full py-3.5 rounded-full font-semibold text-sm transition-all active:scale-[0.98]"
            style={{
              background: "transparent",
              color: "#1a73e8",
              border: "1.5px solid #1a73e8",
            }}
          >
            Raise Dispute / Get Help
          </button>
        </div>
      </div>
    </div>
  );
}
