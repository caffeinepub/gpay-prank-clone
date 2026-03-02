import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from "lucide-react";
import React, { useMemo } from "react";
import type { TransactionData } from "../App";
import type { PaymentHistoryEntry } from "./PaymentSuccessPage";

interface HistoryPageProps {
  onBack: () => void;
  onTransactionSelect: (tx: TransactionData) => void;
}

const HISTORY_KEY = "gpay_payment_history";

const MOCK_HISTORY: TransactionData[] = [
  {
    id: "mock-1",
    name: "Erika Mate",
    amount: "500",
    type: "sent",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upiId: "erika.mate@ybl",
    phone: "9876543210",
  },
  {
    id: "mock-2",
    name: "Nengneilhing Kipgen",
    amount: "1200",
    type: "received",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    upiId: "nengneilhing.kipgen@okaxis",
    phone: "9845678901",
  },
  {
    id: "mock-3",
    name: "Amit Patel",
    amount: "250",
    type: "sent",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    upiId: "amit.patel@paytm",
    phone: "9812345678",
  },
  {
    id: "mock-4",
    name: "Swiggy",
    amount: "340",
    type: "sent",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    upiId: "swiggy@icici",
    phone: "",
  },
  {
    id: "mock-5",
    name: "Zomato",
    amount: "180",
    type: "sent",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    upiId: "zomato@ybl",
    phone: "",
  },
];

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return `${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function HistoryPage({
  onBack,
  onTransactionSelect,
}: HistoryPageProps) {
  const allTransactions = useMemo(() => {
    let localHistory: PaymentHistoryEntry[] = [];
    try {
      localHistory = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]",
      ) as PaymentHistoryEntry[];
    } catch {
      localHistory = [];
    }

    const localIds = new Set(localHistory.map((l) => l.id));

    const combined: TransactionData[] = [
      ...localHistory.map((e) => ({
        id: e.id,
        name: e.name,
        phone: e.phone,
        upiId: e.upiId,
        amount: e.amount,
        timestamp: e.timestamp,
        type: e.type,
      })),
      ...MOCK_HISTORY.filter((m) => !localIds.has(m.id)),
    ];

    return combined.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "oklch(0.10 0.015 250)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-12 pb-4"
        style={{ borderBottom: "1px solid oklch(0.20 0.022 250)" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "oklch(0.18 0.022 250)" }}
        >
          <ArrowLeft size={18} style={{ color: "oklch(0.97 0.005 250)" }} />
        </button>
        <h1
          className="text-lg font-semibold"
          style={{ color: "oklch(0.97 0.005 250)" }}
        >
          Transaction History
        </h1>
      </div>

      <div className="flex-1 px-4 py-4">
        <p
          className="text-xs font-medium mb-3"
          style={{ color: "oklch(0.55 0.02 250)" }}
        >
          RECENT TRANSACTIONS
        </p>

        <div className="space-y-2">
          {allTransactions.map((tx) => (
            <button
              type="button"
              key={tx.id}
              onClick={() => onTransactionSelect(tx)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-[0.98] text-left"
              style={{
                background: "oklch(0.14 0.018 250)",
                border: "1px solid oklch(0.22 0.025 250)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    tx.type === "sent"
                      ? "oklch(0.55 0.22 25 / 0.15)"
                      : "oklch(0.55 0.18 145 / 0.15)",
                }}
              >
                {tx.type === "sent" ? (
                  <ArrowUpRight
                    size={18}
                    style={{ color: "oklch(0.70 0.18 25)" }}
                  />
                ) : (
                  <ArrowDownLeft
                    size={18}
                    style={{ color: "oklch(0.65 0.18 145)" }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "oklch(0.97 0.005 250)" }}
                >
                  {tx.name}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "oklch(0.55 0.02 250)" }}
                >
                  {tx.upiId}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "oklch(0.45 0.02 250)", fontSize: "0.68rem" }}
                >
                  {formatTimestamp(tx.timestamp)}
                </p>
              </div>
              <p
                className="text-sm font-semibold flex-shrink-0"
                style={{
                  color:
                    tx.type === "sent"
                      ? "oklch(0.70 0.18 25)"
                      : "oklch(0.65 0.18 145)",
                }}
              >
                {tx.type === "sent" ? "-" : "+"}₹{tx.amount}
              </p>
            </button>
          ))}
        </div>

        <div
          className="mt-4 p-4 rounded-2xl text-center"
          style={{
            background: "oklch(0.14 0.018 250)",
            border: "1px solid oklch(0.22 0.025 250)",
          }}
        >
          <p className="text-xs" style={{ color: "oklch(0.45 0.02 250)" }}>
            These are simulated transactions for demonstration only
          </p>
        </div>
      </div>
    </div>
  );
}
