import React from 'react';
import { Banknote, Smartphone, Tv, ShoppingBag, Zap, Bus } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'loan', label: 'Instant Loan', icon: Banknote },
  { id: 'mobile', label: 'Mobile Recharge', icon: Smartphone },
  { id: 'dth', label: 'DTH Recharge', icon: Tv },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'electricity', label: 'Electricity', icon: Zap },
  { id: 'travel', label: 'Travel', icon: Bus },
];

interface QuickActionsProps {
  onActionClick: (actionId: string) => void;
}

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="px-4 py-2">
      <p className="text-xs font-medium mb-3" style={{ color: 'oklch(0.55 0.02 250)' }}>
        More Services
      </p>
      <div className="grid grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id)}
              className="flex flex-col items-center gap-2 py-2 transition-all active:scale-95"
            >
              {/* Blue circle with white icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(0.55 0.22 240)' }}
              >
                <Icon size={24} style={{ color: 'white' }} />
              </div>
              {/* White label underneath */}
              <span
                className="text-xs font-medium text-center leading-tight"
                style={{ color: 'oklch(0.97 0.005 250)' }}
              >
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
