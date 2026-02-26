import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PinEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
  subtitle?: string;
  expectedPin?: string;
  showError?: boolean;
}

export default function PinEntryDialog({
  isOpen,
  onClose,
  onSuccess,
  title = 'Enter PIN',
  subtitle = 'Enter your 4-digit payment PIN',
  expectedPin,
}: PinEntryDialogProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setError('');
      setShake(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (pin.length === 4) {
      if (expectedPin && pin !== expectedPin) {
        setError('Incorrect PIN. Please try again.');
        setShake(true);
        setTimeout(() => {
          setPin('');
          setShake(false);
        }, 600);
      } else {
        onSuccess(pin);
        setPin('');
      }
    }
  }, [pin, expectedPin, onSuccess]);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-[430px] rounded-t-3xl pb-8 pt-6 px-6"
        style={{
          background: 'oklch(0.14 0.018 250)',
          border: '1px solid oklch(0.22 0.025 250)',
          boxShadow: '0 -4px 32px oklch(0 0 0 / 0.5)',
        }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'oklch(0.30 0.02 250)' }} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full"
          style={{ background: 'oklch(0.20 0.022 250)' }}
        >
          <X size={18} style={{ color: 'oklch(0.65 0.02 250)' }} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-1" style={{ color: 'oklch(0.97 0.005 250)' }}>
          {title}
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: 'oklch(0.55 0.02 250)' }}>
          {subtitle}
        </p>

        {/* PIN Dots */}
        <div className={`flex justify-center gap-4 mb-4 ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? 'filled' : ''}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm mb-4" style={{ color: 'oklch(0.70 0.18 25)' }}>
            {error}
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (key === '⌫') handleDelete();
                else if (key !== '') handleKeyPress(key);
              }}
              disabled={key === ''}
              className="h-14 rounded-2xl text-xl font-medium transition-all active:scale-95"
              style={{
                background: key === '' ? 'transparent' : 'oklch(0.20 0.022 250)',
                color: key === '⌫' ? 'oklch(0.72 0.17 175)' : 'oklch(0.97 0.005 250)',
                border: key === '' ? 'none' : '1px solid oklch(0.26 0.025 250)',
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
