import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

interface ComingSoonPageProps {
  feature?: string;
  onBack: () => void;
}

const FEATURE_NAMES: Record<string, string> = {
  loan: 'Instant Loan',
  mobile: 'Mobile Recharge',
  dth: 'DTH Recharge',
  shopping: 'Shopping',
  electricity: 'Electricity Bill',
  travel: 'Travel Booking',
  request: 'Request Money',
  bills: 'Pay Bills',
  cibil: 'Check CIBIL Score',
  profile: 'Profile',
};

export default function ComingSoonPage({ feature, onBack }: ComingSoonPageProps) {
  const featureName = feature ? (FEATURE_NAMES[feature] || feature) : 'This Feature';

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
          {featureName}
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'oklch(0.72 0.17 175 / 0.12)' }}
        >
          <Clock size={44} style={{ color: 'oklch(0.72 0.17 175)' }} />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'oklch(0.97 0.005 250)' }}>
          Coming Soon!
        </h2>
        <p className="text-sm mb-2" style={{ color: 'oklch(0.60 0.02 250)' }}>
          {featureName} is currently under development.
        </p>
        <p className="text-sm mb-8" style={{ color: 'oklch(0.50 0.02 250)' }}>
          We're working hard to bring you this feature. Stay tuned!
        </p>
        <button onClick={onBack} className="gpay-btn" style={{ maxWidth: 200 }}>
          Go Back
        </button>
      </div>
    </div>
  );
}
