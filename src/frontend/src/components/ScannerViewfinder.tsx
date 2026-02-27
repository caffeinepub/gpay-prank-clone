import React, { useEffect, useState } from 'react';
import { X, Zap } from 'lucide-react';

interface ScannerViewfinderProps {
  onDetected: (upiId: string, name: string) => void;
  onClose: () => void;
}

const MOCK_UPI_IDS = [
  'merchant.store@ybl',
  'shopowner@okaxis',
  'vendor123@paytm',
  'retailer@upi',
];

function deriveNameFromUpiId(upiId: string): string {
  const localPart = upiId.split('@')[0] || upiId;
  // Remove trailing digits
  const withoutTrailingDigits = localPart.replace(/\d+$/, '');
  // Split on dots, underscores, hyphens
  const words = withoutTrailingDigits
    .split(/[._\-]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.join(' ') || localPart;
}

export default function ScannerViewfinder({ onDetected, onClose }: ScannerViewfinderProps) {
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);
  const [detectedUpiId, setDetectedUpiId] = useState('');
  const [detectedName, setDetectedName] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    const timer = setTimeout(() => {
      const randomUpi = MOCK_UPI_IDS[Math.floor(Math.random() * MOCK_UPI_IDS.length)];
      const derivedName = deriveNameFromUpiId(randomUpi);
      setDetectedUpiId(randomUpi);
      setDetectedName(derivedName);
      setDetected(true);
      setScanning(false);
      setTimeout(() => onDetected(randomUpi, derivedName), 1200);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'oklch(0.05 0.01 250)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={onClose}
          className="p-2 rounded-full"
          style={{ background: 'oklch(0.2 0.02 250)' }}
        >
          <X size={20} style={{ color: 'oklch(0.97 0.005 250)' }} />
        </button>
        <h2 className="text-lg font-semibold" style={{ color: 'oklch(0.97 0.005 250)' }}>
          Scan QR Code
        </h2>
        <div className="p-2 rounded-full" style={{ background: 'oklch(0.2 0.02 250)' }}>
          <Zap size={20} style={{ color: 'oklch(0.72 0.17 175)' }} />
        </div>
      </div>

      {/* Camera area */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="relative w-full max-w-[280px] aspect-square">
          {/* Dark overlay corners */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ background: 'oklch(0.1 0.01 250 / 0.3)' }}
          />

          {/* Scanner frame */}
          <div className="absolute inset-0">
            <div className="scanner-corner scanner-corner-tl" />
            <div className="scanner-corner scanner-corner-tr" />
            <div className="scanner-corner scanner-corner-bl" />
            <div className="scanner-corner scanner-corner-br" />
          </div>

          {/* Scanning line */}
          {scanning && (
            <div
              className="absolute left-2 right-2 h-0.5 scanner-line"
              style={{
                background: 'linear-gradient(90deg, transparent, oklch(0.72 0.17 175), transparent)',
                boxShadow: '0 0 8px oklch(0.72 0.17 175)',
              }}
            />
          )}

          {/* Mock QR pattern */}
          <div className="absolute inset-6 grid grid-cols-7 gap-0.5 opacity-20">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{
                  background: Math.random() > 0.5 ? 'oklch(0.97 0.005 250)' : 'transparent',
                  aspectRatio: '1',
                }}
              />
            ))}
          </div>

          {/* Detected overlay */}
          {detected && (
            <div
              className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{ background: 'oklch(0.72 0.17 175 / 0.2)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center animate-success-scale"
                style={{ background: 'oklch(0.72 0.17 175)' }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M6 16L13 23L26 9"
                    stroke="oklch(0.1 0.01 250)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="tick-path"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-8 mb-4">
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'oklch(0.22 0.025 250)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: 'oklch(0.72 0.17 175)',
            }}
          />
        </div>
      </div>

      {/* Bottom text */}
      <div className="px-8 pb-12 text-center">
        <p className="text-sm" style={{ color: 'oklch(0.65 0.02 250)' }}>
          {detected ? '✓ QR Code detected!' : 'Align QR code within the frame'}
        </p>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.45 0.02 250)' }}>
          {detected ? 'Redirecting to payment...' : 'Scanning automatically...'}
        </p>

        {/* UPI info card — shown after detection */}
        {detected && detectedUpiId && (
          <div
            className="mt-3 mx-auto rounded-xl px-4 py-3 text-left"
            style={{
              background: 'oklch(0.14 0.018 250)',
              border: '1px solid oklch(0.55 0.22 240 / 0.5)',
              maxWidth: '300px',
            }}
          >
            <p
              className="text-xs font-semibold mb-0.5"
              style={{ color: '#1a73e8' }}
            >
              Paying: {detectedName}
            </p>
            <p
              className="text-xs"
              style={{ color: 'oklch(0.60 0.02 250)' }}
            >
              {detectedUpiId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
