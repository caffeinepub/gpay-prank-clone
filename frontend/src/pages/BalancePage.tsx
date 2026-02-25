import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Edit2, Check } from 'lucide-react';
import PinEntryDialog from '../components/PinEntryDialog';
import { useGetBalance, useUpdateBalance, useRegisterUser } from '../hooks/useQueries';

const BALANCE_PIN = '1234';

interface BalancePageProps {
  onBack: () => void;
}

export default function BalancePage({ onBack }: BalancePageProps) {
  const [pinVerified, setPinVerified] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: balance, isLoading, error, refetch } = useGetBalance();
  const updateBalance = useUpdateBalance();
  const registerUser = useRegisterUser();

  const handlePinSuccess = (pin: string) => {
    if (pin === BALANCE_PIN) {
      setPinVerified(true);
      setShowPinDialog(false);
    }
  };

  const handleSaveBalance = async () => {
    const amount = parseFloat(newBalance);
    if (isNaN(amount) || amount < 0) return;

    try {
      await updateBalance.mutateAsync(BigInt(Math.round(amount * 100)));
      setSaveSuccess(true);
      setEditMode(false);
      setNewBalance('');
      setTimeout(() => setSaveSuccess(false), 2000);
      refetch();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('not found') || errMsg.includes('User not found')) {
        try {
          await registerUser.mutateAsync('0000');
          await updateBalance.mutateAsync(BigInt(Math.round(amount * 100)));
          setSaveSuccess(true);
          setEditMode(false);
          setNewBalance('');
          setTimeout(() => setSaveSuccess(false), 2000);
          refetch();
        } catch {
          // ignore
        }
      }
    }
  };

  const displayBalance = balance !== undefined
    ? (Number(balance) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

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
          Check Balance
        </h1>
      </div>

      {pinVerified ? (
        <div className="flex-1 px-4 py-6">
          {/* Balance Card */}
          <div
            className="rounded-2xl p-6 mb-4 text-center"
            style={{
              background: 'linear-gradient(135deg, oklch(0.45 0.16 175) 0%, oklch(0.35 0.14 200) 100%)',
            }}
          >
            <p className="text-sm mb-2" style={{ color: 'oklch(0.85 0.08 175)' }}>
              Available Balance
            </p>
            <div className="flex items-center justify-center gap-3">
              {showBalance ? (
                <p className="text-4xl font-bold" style={{ color: 'oklch(1 0 0)' }}>
                  {isLoading ? '...' : `₹${displayBalance}`}
                </p>
              ) : (
                <p className="text-4xl font-bold" style={{ color: 'oklch(1 0 0)' }}>
                  ₹••••••
                </p>
              )}
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 rounded-full"
                style={{ background: 'oklch(1 0 0 / 0.15)' }}
              >
                {showBalance
                  ? <EyeOff size={18} style={{ color: 'oklch(1 0 0)' }} />
                  : <Eye size={18} style={{ color: 'oklch(1 0 0)' }} />
                }
              </button>
            </div>
            {error && (
              <p className="text-xs mt-2" style={{ color: 'oklch(0.85 0.08 175)' }}>
                Register first to view balance
              </p>
            )}
          </div>

          {/* Edit Balance */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'oklch(0.14 0.018 250)',
              border: '1px solid oklch(0.22 0.025 250)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.02 250)' }}>
                Update Balance
              </p>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'oklch(0.72 0.17 175 / 0.15)', color: 'oklch(0.72 0.17 175)' }}
                >
                  <Edit2 size={12} />
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSaveBalance}
                  disabled={updateBalance.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'oklch(0.72 0.17 175)', color: 'oklch(0.10 0.015 250)' }}
                >
                  {updateBalance.isPending ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check size={12} />
                      Save
                    </>
                  )}
                </button>
              )}
            </div>

            {editMode ? (
              <input
                type="number"
                placeholder="Enter new balance (₹)"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold outline-none"
                style={{ color: 'oklch(0.97 0.005 250)' }}
                autoFocus
              />
            ) : (
              <p className="text-sm" style={{ color: 'oklch(0.55 0.02 250)' }}>
                {saveSuccess ? '✓ Balance updated successfully!' : 'Tap Edit to update your balance'}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'oklch(0.72 0.17 175 / 0.12)' }}
            >
              <Eye size={36} style={{ color: 'oklch(0.72 0.17 175)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'oklch(0.97 0.005 250)' }}>
              PIN Required
            </h2>
            <p className="text-sm" style={{ color: 'oklch(0.55 0.02 250)' }}>
              Enter PIN 1234 to view your balance
            </p>
          </div>
        </div>
      )}

      <PinEntryDialog
        isOpen={showPinDialog}
        onClose={() => { setShowPinDialog(false); onBack(); }}
        onSuccess={handlePinSuccess}
        title="Balance PIN"
        subtitle="Enter PIN to view your balance"
        expectedPin={BALANCE_PIN}
      />
    </div>
  );
}
