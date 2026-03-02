import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  Clock,
  History,
  QrCode,
  Search,
  Send,
  User,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import ContactCircles from "../components/ContactCircles";
import QuickActions from "../components/QuickActions";
import type { Contact } from "../utils/contactData";

interface HomePageProps {
  onNavigate: (page: string, state?: Record<string, unknown>) => void;
}

const PROFILE_PIC_KEY = "gpay_profile_picture";

// GPay multicolor G logo SVG
function GPayLogo() {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {/* Google G icon */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="GPay Logo"
        role="img"
      >
        <title>GPay Logo</title>
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
      {/* Pay text */}
      <span
        style={{
          fontFamily: "'Google Sans', 'Roboto', sans-serif",
          fontSize: "28px",
          fontWeight: "400",
          color: "oklch(0.97 0.005 250)",
          letterSpacing: "-0.5px",
        }}
      >
        Pay
      </span>
    </div>
  );
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(() => {
    return localStorage.getItem(PROFILE_PIC_KEY);
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContactClick = (contact: Contact) => {
    onNavigate("payment", {
      recipientName: contact.name,
      recipientPhone: contact.phone,
      upiId: contact.upiId,
    });
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      onNavigate("payment", {
        recipientPhone: searchValue.trim(),
        upiId: searchValue.includes("@") ? searchValue.trim() : "",
      });
    }
  };

  const handleQuickAction = (actionId: string) => {
    onNavigate("coming-soon", { feature: actionId });
  };

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfilePic(dataUrl);
      localStorage.setItem(PROFILE_PIC_KEY, dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const actionRows = [
    {
      id: "balance",
      label: "Check bank balance",
      icon: Building2,
      action: () => onNavigate("balance"),
    },
    {
      id: "history",
      label: "See transaction history",
      icon: History,
      action: () => onNavigate("history"),
    },
    {
      id: "cibil",
      label: "Check CIBIL Score",
      icon: BarChart3,
      action: () => onNavigate("coming-soon", { feature: "cibil" }),
    },
  ];

  return (
    <div
      className="flex flex-col pb-24"
      style={{ background: "oklch(0.10 0.015 250)", minHeight: "100vh" }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div
        className="px-4 pt-12 pb-4"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.025 175) 0%, oklch(0.10 0.015 250) 100%)",
        }}
      >
        {/* Top row: profile + greeting + bells */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleProfilePicClick}
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-transform active:scale-95"
              style={{
                border: "2px solid oklch(0.55 0.22 240 / 0.5)",
                background: profilePic
                  ? "transparent"
                  : "oklch(0.55 0.22 240 / 0.15)",
              }}
              title="Tap to change profile picture"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} style={{ color: "oklch(0.65 0.22 240)" }} />
              )}
            </button>
            <div>
              <p className="text-xs" style={{ color: "oklch(0.60 0.02 250)" }}>
                {getGreeting()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.18 0.022 250)" }}
            >
              <Bell size={18} style={{ color: "oklch(0.70 0.02 250)" }} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-full mb-4"
          style={{
            background: "oklch(0.16 0.020 250)",
            border: "1px solid oklch(0.25 0.025 250)",
          }}
        >
          <Search size={18} style={{ color: "oklch(0.55 0.02 250)" }} />
          <input
            type="text"
            placeholder="Search phone number or UPI ID"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "oklch(0.97 0.005 250)" }}
          />
          {searchValue ? (
            <button
              type="button"
              onClick={handleSearch}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.55 0.22 240)" }}
            >
              <ArrowRight size={16} style={{ color: "white" }} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("scan")}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.55 0.22 240 / 0.15)" }}
            >
              <QrCode size={16} style={{ color: "oklch(0.65 0.22 240)" }} />
            </button>
          )}
        </div>

        {/* GPay Logo */}
        <GPayLogo />
      </div>

      {/* Quick Send Buttons (blue circles) — with top spacing gap from GPay logo */}
      <div className="px-4 mt-14 mb-4">
        {/* Row 1: Scan QR, Send, Request, History */}
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: "Scan QR",
              icon: QrCode,
              action: () => onNavigate("scan"),
            },
            {
              label: "Send",
              icon: Send,
              action: () => onNavigate("payment", {}),
            },
            {
              label: "Request",
              icon: ArrowRight,
              action: () => onNavigate("coming-soon", { feature: "request" }),
            },
            {
              label: "History",
              icon: History,
              action: () => onNavigate("history", {}),
            },
          ].map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className="flex flex-col items-center gap-2 py-2 transition-all active:scale-95"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.55 0.22 240)" }}
              >
                <Icon size={20} style={{ color: "white" }} />
              </div>
              <span
                className="text-xs font-medium text-center"
                style={{ color: "oklch(0.97 0.005 250)" }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
        {/* Row 2: Pay Bills + Recent — aligned under columns 1 and 2 */}
        <div className="grid grid-cols-4 gap-2 mt-1">
          <button
            type="button"
            onClick={() => onNavigate("coming-soon", { feature: "bills" })}
            className="flex flex-col items-center gap-2 py-2 transition-all active:scale-95"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.55 0.22 240)" }}
            >
              <ArrowRight size={20} style={{ color: "white" }} />
            </div>
            <span
              className="text-xs font-medium text-center"
              style={{ color: "oklch(0.97 0.005 250)" }}
            >
              Pay Bills
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("fake-recipient-entry")}
            className="flex flex-col items-center gap-2 py-2 transition-all active:scale-95"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.55 0.22 240)" }}
            >
              <Clock size={20} style={{ color: "white" }} />
            </div>
            <span
              className="text-xs font-medium text-center"
              style={{ color: "oklch(0.97 0.005 250)" }}
            >
              Recent
            </span>
          </button>
        </div>
      </div>

      {/* Contact Circles */}
      <ContactCircles onContactClick={handleContactClick} />

      {/* Quick Actions */}
      <div className="mt-2">
        <QuickActions onActionClick={handleQuickAction} />
      </div>

      {/* Action Rows: Check Balance, See Transaction History, Check CIBIL Score */}
      <div className="px-4 mt-4 space-y-1">
        {actionRows.map(({ id, label, icon: Icon, action }) => (
          <button
            type="button"
            key={id}
            onClick={action}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all active:scale-[0.98]"
            style={{
              background: "oklch(0.14 0.018 250)",
              border: "1px solid oklch(0.22 0.025 250)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.55 0.22 240)" }}
            >
              <Icon size={20} style={{ color: "white" }} />
            </div>
            <span
              className="flex-1 text-left text-base font-semibold"
              style={{ color: "oklch(0.97 0.005 250)" }}
            >
              {label}
            </span>
            <ChevronRight size={18} style={{ color: "oklch(0.55 0.02 250)" }} />
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 mb-4 text-center px-4">
        <p className="text-xs" style={{ color: "oklch(0.40 0.02 250)" }}>
          Built with <span style={{ color: "oklch(0.65 0.22 240)" }}>♥</span>{" "}
          using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "unknown-app")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.65 0.22 240)" }}
          >
            caffeine.ai
          </a>{" "}
          · © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
