import { Home, User } from "lucide-react";
import React from "react";

const PROFILE_PIC_KEY = "gpay_profile_picture";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function RupeeCircleIcon({
  size = 22,
  color = "currentColor",
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Rupee icon"
    >
      <title>Rupee icon</title>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 8h5a2 2 0 0 1 0 4H8" />
      <path d="M8 12h5l-5 5" />
      <path d="M8 8v8" />
    </svg>
  );
}

const tabs = [
  { id: "home", label: "Home", icon: "home" },
  { id: "money", label: "Money", icon: "rupee" },
  { id: "you", label: "You", icon: "user" },
];

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const [profilePic, setProfilePic] = React.useState<string | null>(() => {
    return localStorage.getItem(PROFILE_PIC_KEY);
  });

  // Listen for profile pic changes (when user uploads a new photo)
  React.useEffect(() => {
    const handleStorage = () => {
      setProfilePic(localStorage.getItem(PROFILE_PIC_KEY));
    };
    window.addEventListener("storage", handleStorage);
    // Also poll every 2s to catch same-tab updates
    const interval = setInterval(() => {
      const current = localStorage.getItem(PROFILE_PIC_KEY);
      setProfilePic((prev) => (prev !== current ? current : prev));
    }, 2000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40"
      style={{
        background: "oklch(0.12 0.016 250)",
        borderTop: "1px solid oklch(0.20 0.022 250)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -2px 16px oklch(0 0 0 / 0.4)",
      }}
    >
      <div className="flex items-center justify-around px-4 py-3">
        {tabs.map(({ id, label, icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 transition-all active:scale-95"
              style={{ minWidth: 72 }}
            >
              {/* Active home tab gets teal pill background */}
              <div
                style={{
                  background:
                    isActive && id === "home"
                      ? "oklch(0.35 0.12 175)"
                      : "transparent",
                  borderRadius: 50,
                  padding: isActive && id === "home" ? "6px 20px" : "6px 8px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon === "home" && (
                  <Home
                    size={22}
                    style={{
                      color: isActive
                        ? "oklch(0.97 0.005 250)"
                        : "oklch(0.60 0.02 250)",
                      strokeWidth: isActive ? 2.5 : 1.8,
                    }}
                  />
                )}
                {icon === "rupee" && (
                  <RupeeCircleIcon
                    size={22}
                    color={
                      isActive
                        ? "oklch(0.97 0.005 250)"
                        : "oklch(0.60 0.02 250)"
                    }
                  />
                )}
                {icon === "user" &&
                  (profilePic ? (
                    <div
                      className="overflow-hidden rounded-full"
                      style={{
                        width: 24,
                        height: 24,
                        border: isActive
                          ? "2px solid #1a73e8"
                          : "2px solid oklch(0.40 0.05 250)",
                      }}
                    >
                      <img
                        src={profilePic}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <User
                      size={22}
                      style={{
                        color: isActive
                          ? "oklch(0.97 0.005 250)"
                          : "oklch(0.60 0.02 250)",
                        strokeWidth: isActive ? 2.5 : 1.8,
                      }}
                    />
                  ))}
              </div>
              <span
                className="text-xs"
                style={{
                  color: isActive
                    ? "oklch(0.97 0.005 250)"
                    : "oklch(0.60 0.02 250)",
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
