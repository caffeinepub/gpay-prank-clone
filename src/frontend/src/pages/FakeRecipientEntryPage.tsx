import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

interface FakeRecipientEntryPageProps {
  onBack: () => void;
  onContinue: (details: {
    name: string;
    phone: string;
    upiId: string;
    amount: string;
  }) => void;
}

export default function FakeRecipientEntryPage({
  onBack,
  onContinue,
}: FakeRecipientEntryPageProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");

  const isValid =
    name.trim() !== "" &&
    (phone.trim() !== "" || upiId.trim() !== "") &&
    amount.trim() !== "";

  const handleContinue = () => {
    if (!isValid) return;
    onContinue({
      name: name.trim(),
      phone: phone.trim(),
      upiId: upiId.trim(),
      amount: amount.trim(),
    });
  };

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
          Recipient Details
        </span>
        <div className="w-9 h-9" />
      </div>

      {/* Form */}
      <div className="flex-1 px-5 py-6 flex flex-col gap-5">
        <p className="text-sm" style={{ color: "#5f6368" }}>
          Enter recipient details to view the transaction
        </p>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fake-recipient-name"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#5f6368" }}
          >
            Recipient Name
          </label>
          <input
            id="fake-recipient-name"
            type="text"
            placeholder="e.g. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "#f8f9fa",
              border: "1.5px solid #e8eaed",
              color: "#1a1a1a",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1a73e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e8eaed";
            }}
          />
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fake-recipient-phone"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#5f6368" }}
          >
            Mobile Number
          </label>
          <input
            id="fake-recipient-phone"
            type="tel"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "#f8f9fa",
              border: "1.5px solid #e8eaed",
              color: "#1a1a1a",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1a73e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e8eaed";
            }}
          />
        </div>

        {/* UPI ID */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fake-recipient-upi"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#5f6368" }}
          >
            UPI ID
          </label>
          <input
            id="fake-recipient-upi"
            type="text"
            placeholder="e.g. priyas.98@okaxis"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "#f8f9fa",
              border: "1.5px solid #e8eaed",
              color: "#1a1a1a",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1a73e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e8eaed";
            }}
          />
          <p className="text-xs" style={{ color: "#5f6368" }}>
            Enter either Mobile Number or UPI ID (or both)
          </p>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fake-recipient-amount"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#5f6368" }}
          >
            Amount (₹)
          </label>
          <input
            id="fake-recipient-amount"
            type="number"
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "#f8f9fa",
              border: "1.5px solid #e8eaed",
              color: "#1a1a1a",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1a73e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e8eaed";
            }}
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-5 pb-10 pt-2">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!isValid}
          className="w-full py-4 rounded-full font-semibold text-base transition-all active:scale-[0.98]"
          style={{
            background: isValid ? "#1a73e8" : "#c5d4f0",
            color: "white",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
