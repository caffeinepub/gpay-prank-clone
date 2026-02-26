import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PinContextType {
  paymentPin: string | null;
  setPaymentPin: (pin: string) => void;
  validatePaymentPin: (pin: string) => boolean;
  isPinSet: boolean;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export function PinProvider({ children }: { children: ReactNode }) {
  const [paymentPin, setPaymentPinState] = useState<string | null>(() => {
    return localStorage.getItem('gpay_payment_pin');
  });

  const setPaymentPin = (pin: string) => {
    localStorage.setItem('gpay_payment_pin', pin);
    setPaymentPinState(pin);
  };

  const validatePaymentPin = (pin: string): boolean => {
    return paymentPin === pin;
  };

  return (
    <PinContext.Provider value={{
      paymentPin,
      setPaymentPin,
      validatePaymentPin,
      isPinSet: !!paymentPin,
    }}>
      {children}
    </PinContext.Provider>
  );
}

export function usePinContext() {
  const ctx = useContext(PinContext);
  if (!ctx) throw new Error('usePinContext must be used within PinProvider');
  return ctx;
}
