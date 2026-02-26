import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { usePinContext } from '../context/PinContext';
import { useRegisterUser } from '../hooks/useQueries';

interface PinSetupPageProps {
  onComplete: () => void;
}

export default function PinSetupPage({ onComplete }: PinSetupPageProps) {
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const { setPaymentPin } = usePinContext();
  const registerUser = useRegisterUser();

  const currentPin = step === 'create' ? pin : confirmPin;
  const setCurrentPin = step === 'create' ? setPin : setConfirmPin;

  const handleKeyPress = (digit: string) => {
    if (currentPin.length < 4) {
      const newPin = currentPin + digit;
      setCurrentPin(newPin);
      setError('');

      if (newPin.length === 4) {
        if (step === 'create') {
          setTimeout(() => setStep('confirm'), 300);
        } else {
          if (newPin !== pin) {
            setError('PINs do not match. Please try again.');
            setShake(true);
            setTimeout(() => {
              setConfirmPin('');
              setShake(false);
            }, 600);
          } else {
            setPaymentPin(pin);
            registerUser.mutate(pin, {
              onSuccess: () => onComplete(),
              onError: () => {
                onComplete();
              },
            });
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setCurrentPin(prev => prev.slice(0, -1));
    setError('');
  };

  const displayPin = step === 'create' ? pin : confirmPin;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'oklch(0.10 0.015 250)' }}
    >
      <div className="flex flex-col items-center pt-16 pb-8 px-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'oklch(0.72 0.17 175 / 0.12)' }}
        >
          <Shield size={40} style={{ color: 'oklch(0.72 0.17 175)' }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.97 0.005 250)' }}>
          {step === 'create' ? 'Create Payment PIN' : 'Confirm PIN'}
        </h1>
        <p className="text-sm text-center" style={{ color: 'oklch(0.55 0.02 250)' }}>
          {step === 'create'
            ? 'Set a 4-digit PIN to authorize payments'
            : 'Re-enter your PIN to confirm'}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-2 mb-8">
        <div
          className="w-8 h-1.5 rounded-full"
          style={{ background: 'oklch(0.72 0.17 175)' }}
        />
        <div
          className="w-8 h-1.5 rounded-full transition-all"
          style={{ background: step === 'confirm' ? 'oklch(0.72 0.17 175)' : 'oklch(0.25 0.025 250)' }}
        />
      </div>

      {/* PIN Dots */}
      <div className={`flex justify-center gap-5 mb-4 ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`pin-dot ${i < displayPin.length ? 'filled' : ''}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm mb-2 px-6" style={{ color: 'oklch(0.70 0.18 25)' }}>
          {error}
        </p>
      )}

      {/* Keypad */}
      <div className="flex-1 flex flex-col justify-end px-6 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (key === '⌫') handleDelete();
                else if (key !== '') handleKeyPress(key);
              }}
              disabled={key === ''}
              className="h-16 rounded-2xl text-2xl font-medium transition-all active:scale-95"
              style={{
                background: key === '' ? 'transparent' : 'oklch(0.16 0.020 250)',
                color: key === '⌫' ? 'oklch(0.72 0.17 175)' : 'oklch(0.97 0.005 250)',
                border: key === '' ? 'none' : '1px solid oklch(0.22 0.025 250)',
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
