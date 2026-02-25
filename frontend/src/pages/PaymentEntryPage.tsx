import React, { useState } from 'react';
import { ArrowLeft, User, Phone, IndianRupee } from 'lucide-react';
import PinEntryDialog from '../components/PinEntryDialog';
import BankSelectionSheet from '../components/BankSelectionSheet';
import { usePinContext } from '../context/PinContext';

interface PaymentState {
  recipientName?: string;
  recipientPhone?: string;
  upiId?: string;
}

interface PaymentEntryPageProps {
  initialState?: PaymentState;
  onBack: () => void;
  onSuccess: (details: { name: string; phone: string; amount: string; upiId: string }) => void;
}

export default function PaymentEntryPage({ initialState, onBack, onSuccess }: PaymentEntryPageProps) {
  const [name, setName] = useState(initialState?.recipientName || '');
  const [phone, setPhone] = useState(initialState?.recipientPhone || '');
  const [upiId, setUpiId] = useState(initialState?.upiId || '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showBankSheet, setShowBankSheet] = useState(false);
  const [pendingDetails, setPendingDetails] = useState<{ name: string; phone: string; amount: string; upiId: string } | null>(null);
  const { validatePaymentPin } = usePinContext();

  const isFormValid = (name.trim() || phone.trim()) && amount.trim() && parseFloat(amount) > 0;

  const handlePay = () => {
    if (!isFormValid) return;
    setShowPinDialog(true);
  };

  const handlePinSuccess = (enteredPin: string) => {
    if (validatePaymentPin(enteredPin)) {
      setShowPinDialog(false);
      const details = {
        name: name || 'Unknown',
        phone: phone || upiId,
        amount,
        upiId: upiId || `${phone}@upi`,
      };
      setPendingDetails(details);
      setShowBankSheet(true);
    }
    // If PIN is wrong, PinEntryDialog handles the error display internally
    // via its own error state when expectedPin doesn't match.
    // Since we use validatePaymentPin externally, we just don't proceed.
  };

  const handleBankCancel = () => {
    setShowBankSheet(false);
    setPendingDetails(null);
  };

  const handleBankContinue = () => {
    setShowBankSheet(false);
    if (pendingDetails) {
      onSuccess(pendingDetails);
    }
  };

  const quickAmounts = ['50', '100', '200', '500', '1000', '2000'];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'oklch(0.10 0.015 250)' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-12 pb-4"
        style={{ borderBottom: '1px solid oklch(0.20 0.022 250)' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'oklch(0.18 0.022 250)' }}
        >
          <ArrowLeft size={18} style={{ color: 'oklch(0.97 0.005 250)' }} />
        </button>
        <h1 className="text-lg font-semibold" style={{ color: 'oklch(0.97 0.005 250)' }}>
          Send Money
        </h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto pb-32">
        {/* Recipient Card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'oklch(0.14 0.018 250)',
            border: '1px solid oklch(0.22 0.025 250)',
          }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: 'oklch(0.55 0.02 250)' }}>
            RECIPIENT DETAILS
          </p>

          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'oklch(0.72 0.17 175 / 0.12)' }}
            >
              <User size={16} style={{ color: 'oklch(0.72 0.17 175)' }} />
            </div>
            <input
              type="text"
              placeholder="Recipient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none border-b py-1"
              style={{
                color: 'oklch(0.97 0.005 250)',
                borderColor: 'oklch(0.25 0.025 250)',
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'oklch(0.72 0.17 175 / 0.12)' }}
            >
              <Phone size={16} style={{ color: 'oklch(0.72 0.17 175)' }} />
            </div>
            <input
              type="text"
              placeholder="Phone number or UPI ID"
              value={phone || upiId}
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('@')) {
                  setUpiId(val);
                  setPhone('');
                } else {
                  setPhone(val);
                  setUpiId('');
                }
              }}
              className="flex-1 bg-transparent text-sm outline-none border-b py-1"
              style={{
                color: 'oklch(0.97 0.005 250)',
                borderColor: 'oklch(0.25 0.025 250)',
              }}
            />
          </div>
        </div>

        {/* Amount Card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'oklch(0.14 0.018 250)',
            border: '1px solid oklch(0.22 0.025 250)',
          }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: 'oklch(0.55 0.02 250)' }}>
            AMOUNT
          </p>
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee size={28} style={{ color: 'oklch(0.72 0.17 175)' }} />
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-4xl font-bold outline-none"
              style={{ color: 'oklch(0.97 0.005 250)' }}
              min="1"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: amount === amt ? 'oklch(0.72 0.17 175)' : 'oklch(0.18 0.022 250)',
                  color: amount === amt ? 'oklch(0.10 0.015 250)' : 'oklch(0.75 0.02 250)',
                  border: `1px solid ${amount === amt ? 'oklch(0.72 0.17 175)' : 'oklch(0.25 0.025 250)'}`,
                }}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'oklch(0.14 0.018 250)',
            border: '1px solid oklch(0.22 0.025 250)',
          }}
        >
          <input
            type="text"
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: 'oklch(0.97 0.005 250)' }}
          />
        </div>
      </div>

      {/* Pay Button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 py-4"
        style={{
          background: 'oklch(0.10 0.015 250)',
          borderTop: '1px solid oklch(0.20 0.022 250)',
        }}
      >
        <button
          onClick={handlePay}
          disabled={!isFormValid}
          className="w-full py-4 rounded-full font-semibold text-base transition-all active:scale-95"
          style={{
            background: isFormValid ? '#1a73e8' : 'oklch(0.22 0.025 250)',
            color: isFormValid ? 'white' : 'oklch(0.45 0.02 250)',
            border: 'none',
          }}
        >
          Pay / Send
        </button>
      </div>

      {/* PIN Entry Dialog */}
      <PinEntryDialog
        isOpen={showPinDialog}
        onSuccess={handlePinSuccess}
        onClose={() => setShowPinDialog(false)}
      />

      {/* Bank Selection Sheet */}
      <BankSelectionSheet
        visible={showBankSheet}
        onCancel={handleBankCancel}
        onContinue={handleBankContinue}
      />
    </div>
  );
}
