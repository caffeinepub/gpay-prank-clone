import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, Wallet } from 'lucide-react';
import { HdfcBankLogo, SbiBankLogo } from '../components/BankLogos';
import PinEntryDialog from '../components/PinEntryDialog';

const BALANCE_PIN = '1234';
const HDFC_KEY = 'gpay_balance_hdfc';
const SBI_KEY = 'gpay_balance_sbi';

type Step = 'bank-select' | 'pin' | 'balance';
type BankId = 'hdfc' | 'sbi';

interface BalancePageProps {
  onBack: () => void;
}

function formatBalance(raw: string): string {
  const num = parseFloat(raw);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BalancePage({ onBack }: BalancePageProps) {
  const [step, setStep] = useState<Step>('bank-select');
  const [selectedBank, setSelectedBank] = useState<BankId | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const getBankKey = (bank: BankId) => bank === 'hdfc' ? HDFC_KEY : SBI_KEY;

  const getBalance = (bank: BankId): string => {
    return localStorage.getItem(getBankKey(bank)) ?? '0.00';
  };

  const [hdfcBalance, setHdfcBalance] = useState(() => getBalance('hdfc'));
  const [sbiBalance, setSbiBalance] = useState(() => getBalance('sbi'));

  useEffect(() => {
    if (editMode && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editMode]);

  const handlePinSuccess = (pin: string) => {
    if (pin === BALANCE_PIN) {
      setShowPinDialog(false);
      setStep('balance');
    }
  };

  const handleContinue = () => {
    if (!selectedBank) return;
    setShowPinDialog(true);
  };

  const handleSaveBalance = () => {
    if (!selectedBank) return;
    const num = parseFloat(editValue);
    const val = isNaN(num) || num < 0 ? '0.00' : num.toFixed(2);
    localStorage.setItem(getBankKey(selectedBank), val);
    if (selectedBank === 'hdfc') setHdfcBalance(val);
    else setSbiBalance(val);
    setEditMode(false);
    setEditValue('');
  };

  const currentBalance = selectedBank ? (selectedBank === 'hdfc' ? hdfcBalance : sbiBalance) : '0.00';

  const bankName = selectedBank === 'hdfc' ? 'HDFC Bank' : 'State Bank of India';

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'oklch(0.10 0.015 250)' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-12 pb-4"
        style={{ borderBottom: '1px solid oklch(0.20 0.022 250)' }}
      >
        <button
          type="button"
          onClick={() => {
            if (step === 'balance') {
              setStep('bank-select');
              setSelectedBank(null);
              setEditMode(false);
            } else if (step === 'pin') {
              setShowPinDialog(false);
              setStep('bank-select');
            } else {
              onBack();
            }
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'oklch(0.18 0.022 250)' }}
        >
          <ArrowLeft size={18} style={{ color: 'oklch(0.97 0.005 250)' }} />
        </button>
        <h1 className="text-lg font-semibold" style={{ color: 'oklch(0.97 0.005 250)' }}>
          {step === 'balance' ? 'Account Balance' : 'Check Balance'}
        </h1>
      </div>

      {/* Step 1: Bank Selection */}
      {step === 'bank-select' && (
        <div className="flex-1 flex flex-col px-4 py-6">
          <p className="text-sm mb-5" style={{ color: 'oklch(0.65 0.02 250)' }}>
            Select a bank account to check balance
          </p>

          <div className="flex flex-col gap-3 flex-1">
            {/* HDFC Row */}
            <BankSelectRow
              logo={<HdfcBankLogo size={32} />}
              accountNumber="3107"
              isSelected={selectedBank === 'hdfc'}
              onClick={() => setSelectedBank('hdfc')}
            />

            {/* SBI Row */}
            <BankSelectRow
              logo={<SbiBankLogo size={32} />}
              accountNumber="3110"
              isSelected={selectedBank === 'sbi'}
              onClick={() => setSelectedBank('sbi')}
            />
          </div>

          {/* Continue button */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedBank}
            className="w-full py-4 rounded-2xl font-semibold text-base mt-6 transition-all"
            style={{
              background: selectedBank
                ? 'oklch(0.55 0.22 240)'
                : 'oklch(0.22 0.025 250)',
              color: selectedBank
                ? 'oklch(1 0 0)'
                : 'oklch(0.40 0.02 250)',
              cursor: selectedBank ? 'pointer' : 'not-allowed',
            }}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Balance Display (step 2 is PIN dialog, handled via overlay) */}
      {step === 'balance' && selectedBank && (
        <div className="flex-1 px-4 py-6">
          {/* Bank label */}
          <div className="flex items-center gap-2 mb-4">
            {selectedBank === 'hdfc' ? <HdfcBankLogo size={28} /> : <SbiBankLogo size={28} />}
          </div>

          {/* Balance card */}
          <div
            className="rounded-2xl p-6 mb-4"
            style={{
              background: 'linear-gradient(135deg, oklch(0.35 0.18 240) 0%, oklch(0.28 0.14 255) 100%)',
              border: '1px solid oklch(0.45 0.18 240 / 0.3)',
            }}
          >
            <p className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: 'oklch(0.75 0.10 240)' }}>
              {bankName}
            </p>
            <p className="text-xs mb-4" style={{ color: 'oklch(0.65 0.08 240)' }}>
              Account •• {selectedBank === 'hdfc' ? '3107' : '3110'}
            </p>
            <p className="text-sm mb-1" style={{ color: 'oklch(0.80 0.08 240)' }}>
              Available Balance
            </p>

            {/* Balance amount + disguised edit trigger */}
            <div className="relative flex items-baseline gap-2">
              <p className="text-4xl font-bold" style={{ color: 'oklch(1 0 0)' }}>
                ₹{formatBalance(currentBalance)}
              </p>
              {/* Disguised wallet icon — low opacity, positioned slightly below the balance */}
              <button
                type="button"
                onClick={() => {
                  setEditValue(parseFloat(currentBalance).toFixed(2));
                  setEditMode(true);
                }}
                className="mb-[-4px] ml-1 transition-opacity hover:opacity-80"
                style={{ opacity: 0.45 }}
                title="Edit balance"
              >
                <Wallet size={16} style={{ color: 'oklch(0.85 0.05 240)' }} />
              </button>
            </div>
          </div>

          {/* Edit balance panel — only visible when editMode */}
          {editMode && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'oklch(0.14 0.018 250)',
                border: '1px solid oklch(0.25 0.025 250)',
              }}
            >
              <p className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'oklch(0.55 0.02 250)' }}>
                Set Balance Amount
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold" style={{ color: 'oklch(0.70 0.02 250)' }}>₹</span>
                <input
                  ref={editInputRef}
                  type="number"
                  placeholder="0.00"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-bold outline-none"
                  style={{ color: 'oklch(0.97 0.005 250)' }}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setEditValue(''); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{
                    background: 'oklch(0.20 0.022 250)',
                    color: 'oklch(0.65 0.02 250)',
                    border: '1px solid oklch(0.28 0.025 250)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBalance}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                  style={{
                    background: 'oklch(0.55 0.22 240)',
                    color: 'oklch(1 0 0)',
                  }}
                >
                  <Check size={14} />
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PIN Dialog overlay */}
      <PinEntryDialog
        isOpen={showPinDialog}
        onClose={() => {
          setShowPinDialog(false);
          if (step !== 'balance') setStep('bank-select');
        }}
        onSuccess={handlePinSuccess}
        title="Balance PIN"
        subtitle="Enter PIN to view your balance"
        expectedPin={BALANCE_PIN}
      />
    </div>
  );
}

/* ─── Bank Selection Row ─────────────────────────────────────────────────── */
interface BankSelectRowProps {
  logo: React.ReactNode;
  accountNumber: string;
  isSelected: boolean;
  onClick: () => void;
}

function BankSelectRow({ logo, accountNumber, isSelected, onClick }: BankSelectRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all active:scale-[0.98]"
      style={{
        background: isSelected
          ? 'oklch(0.55 0.22 240 / 0.12)'
          : 'oklch(0.16 0.020 250)',
        border: `1.5px solid ${isSelected ? 'oklch(0.55 0.22 240 / 0.55)' : 'oklch(0.25 0.025 250)'}`,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        {logo}
      </div>

      {/* Account number */}
      <span
        style={{
          color: 'oklch(0.65 0.02 250)',
          fontSize: '13px',
          fontWeight: '500',
          letterSpacing: '0.5px',
          marginRight: '28px',
        }}
      >
        ·· {accountNumber}
      </span>

      {/* Selection circle — top-right corner */}
      <div
        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all"
        style={{
          background: isSelected ? 'oklch(0.55 0.22 240)' : 'transparent',
          border: `2px solid ${isSelected ? 'oklch(0.55 0.22 240)' : 'oklch(0.35 0.025 250)'}`,
        }}
      >
        {isSelected && (
          <Check size={11} strokeWidth={3} style={{ color: 'oklch(1 0 0)' }} />
        )}
      </div>
    </button>
  );
}
