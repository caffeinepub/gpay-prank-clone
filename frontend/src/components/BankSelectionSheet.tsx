import React, { useEffect, useState } from 'react';
import BankRow from './BankRow';
import { HdfcBankLogo, SbiBankLogo } from './BankLogos';

interface BankSelectionSheetProps {
  visible: boolean;
  onCancel: () => void;
  onContinue: () => void;
}

export default function BankSelectionSheet({ visible, onCancel, onContinue }: BankSelectionSheetProps) {
  const [selectedBank, setSelectedBank] = useState<'hdfc' | 'sbi'>('hdfc');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      // Small delay to trigger CSS transition
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(0,0,0,0.6)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onCancel}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] rounded-t-3xl"
        style={{
          transform: `translateX(-50%) translateY(${mounted ? '0%' : '100%'})`,
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          background: 'oklch(0.12 0.018 250)',
          borderTop: '1px solid oklch(0.25 0.025 250)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: 'oklch(0.35 0.02 250)' }}
          />
        </div>

        {/* Sheet content */}
        <div className="px-4 pt-2 pb-4">
          {/* Title */}
          <h3
            className="text-base font-semibold mb-4 text-center"
            style={{ color: 'oklch(0.97 0.005 250)' }}
          >
            Select Bank Account
          </h3>

          {/* Bank rows */}
          <div className="space-y-3 mb-3">
            <BankRow
              logo={<HdfcBankLogo size={32} />}
              accountNumber="3107"
              isSelected={selectedBank === 'hdfc'}
              onClick={() => setSelectedBank('hdfc')}
            />
            <BankRow
              logo={<SbiBankLogo size={32} />}
              accountNumber="3110"
              isSelected={selectedBank === 'sbi'}
              onClick={() => setSelectedBank('sbi')}
            />
          </div>

          {/* Helper text */}
          <p
            className="text-center mb-5"
            style={{
              color: 'oklch(0.50 0.02 250)',
              fontSize: '12px',
            }}
          >
            Choose to continue your bank for transaction
          </p>

          {/* Action buttons */}
          <div className="flex gap-3">
            {/* Cancel */}
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-full font-semibold transition-all active:scale-95"
              style={{
                background: 'oklch(0.28 0.02 250)',
                color: 'oklch(0.85 0.01 250)',
                fontSize: '15px',
                border: 'none',
              }}
            >
              Cancel
            </button>

            {/* Continue */}
            <button
              onClick={onContinue}
              className="flex-1 py-3.5 rounded-full font-semibold transition-all active:scale-95"
              style={{
                background: '#1a73e8',
                color: 'white',
                fontSize: '15px',
                border: 'none',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
