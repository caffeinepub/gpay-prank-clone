import React, { useState } from 'react';
import { User, Download, Code, Hash } from 'lucide-react';

interface YouPageProps {
  onBack: () => void;
}

type FeedbackKey = 'backup' | 'html' | 'canister' | null;

export default function YouPage({ onBack: _onBack }: YouPageProps) {
  const [feedback, setFeedback] = useState<FeedbackKey>(null);
  const [canisterId, setCanisterId] = useState<string | null>(null);

  const showFeedback = (key: FeedbackKey, duration = 2000) => {
    setFeedback(key);
    setTimeout(() => setFeedback(null), duration);
  };

  const handleBackupData = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gpay_')) {
        data[key] = localStorage.getItem(key) ?? '';
      }
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const today = new Date().toISOString().slice(0, 10);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `gpay-backup-${today}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showFeedback('backup');
  };

  const handleCopyHtml = () => {
    navigator.clipboard
      .writeText(document.documentElement.outerHTML)
      .then(() => showFeedback('html'))
      .catch(() => showFeedback('html'));
  };

  const handleCopyCanisterId = () => {
    const hostname = window.location.hostname;
    const id = hostname.split('.')[0];
    setCanisterId(id);
    navigator.clipboard
      .writeText(id)
      .then(() => showFeedback('canister'))
      .catch(() => showFeedback('canister'));
  };

  return (
    <div
      className="flex flex-col min-h-screen pb-28"
      style={{ background: 'oklch(0.10 0.015 250)' }}
    >
      {/* Header */}
      <div
        className="px-4 pt-12 pb-4"
        style={{ borderBottom: '1px solid oklch(0.20 0.022 250)' }}
      >
        <h1 className="text-xl font-semibold" style={{ color: 'oklch(0.97 0.005 250)' }}>
          You
        </h1>
      </div>

      {/* Profile section */}
      <div className="px-4 py-6 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'oklch(0.55 0.22 240)' }}
        >
          <User size={32} style={{ color: 'oklch(1 0 0)' }} />
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color: 'oklch(0.97 0.005 250)' }}>
            GPay User
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'oklch(0.55 0.02 250)' }}>
            Tap profile on home to change photo
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4" style={{ height: '1px', background: 'oklch(0.18 0.020 250)' }} />

      {/* Developer Tools section */}
      <div className="px-4 py-6">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'oklch(0.45 0.02 250)' }}
        >
          Developer Tools
        </p>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'oklch(0.14 0.018 250)',
            border: '1px solid oklch(0.22 0.025 250)',
          }}
        >
          {/* Backup Data */}
          <div className="p-4" style={{ borderBottom: '1px solid oklch(0.20 0.022 250)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Download size={15} style={{ color: 'oklch(0.70 0.18 25)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'oklch(0.97 0.005 250)' }}>
                    Backup Data
                  </p>
                </div>
                <p className="text-xs" style={{ color: 'oklch(0.50 0.02 250)' }}>
                  Downloads all GPay app data as a JSON file
                </p>
              </div>
              <button
                type="button"
                onClick={handleBackupData}
                className="px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all"
                style={{
                  background: feedback === 'backup'
                    ? 'oklch(0.50 0.15 150)'
                    : 'oklch(0.55 0.18 25)',
                  color: 'oklch(1 0 0)',
                  minWidth: '90px',
                }}
              >
                {feedback === 'backup' ? '✓ Downloaded!' : 'Download'}
              </button>
            </div>
          </div>

          {/* Copy App HTML */}
          <div className="p-4" style={{ borderBottom: '1px solid oklch(0.20 0.022 250)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Code size={15} style={{ color: 'oklch(0.65 0.02 250)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'oklch(0.97 0.005 250)' }}>
                    Copy App HTML
                  </p>
                </div>
                <p className="text-xs" style={{ color: 'oklch(0.50 0.02 250)' }}>
                  Copies the current rendered page HTML to clipboard
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyHtml}
                className="px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all"
                style={{
                  background: feedback === 'html'
                    ? 'oklch(0.50 0.15 150)'
                    : 'oklch(0.25 0.025 250)',
                  color: feedback === 'html' ? 'oklch(1 0 0)' : 'oklch(0.80 0.02 250)',
                  border: '1px solid oklch(0.32 0.025 250)',
                  minWidth: '90px',
                }}
              >
                {feedback === 'html' ? '✓ Copied!' : 'Copy HTML'}
              </button>
            </div>
          </div>

          {/* Copy Canister ID */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Hash size={15} style={{ color: 'oklch(0.65 0.02 250)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'oklch(0.97 0.005 250)' }}>
                    Copy Canister ID
                  </p>
                </div>
                <p className="text-xs mb-1" style={{ color: 'oklch(0.50 0.02 250)' }}>
                  Copies the ICP canister ID from the current URL
                </p>
                {canisterId && (
                  <p
                    className="text-xs font-mono mt-1 break-all"
                    style={{ color: 'oklch(0.60 0.14 240)' }}
                  >
                    {canisterId}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleCopyCanisterId}
                className="px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all"
                style={{
                  background: feedback === 'canister'
                    ? 'oklch(0.50 0.15 150)'
                    : 'oklch(0.25 0.025 250)',
                  color: feedback === 'canister' ? 'oklch(1 0 0)' : 'oklch(0.80 0.02 250)',
                  border: '1px solid oklch(0.32 0.025 250)',
                  minWidth: '90px',
                }}
              >
                {feedback === 'canister' ? '✓ Copied!' : 'Copy ID'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
