import React, { useState, useEffect } from 'react';
import { usePinContext, PinProvider } from './context/PinContext';
import BottomNavigation from './components/BottomNavigation';
import ScannerViewfinder from './components/ScannerViewfinder';
import PinSetupPage from './pages/PinSetupPage';
import HomePage from './pages/HomePage';
import PaymentEntryPage from './pages/PaymentEntryPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import BalancePage from './pages/BalancePage';
import HistoryPage from './pages/HistoryPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import ComingSoonPage from './pages/ComingSoonPage';
import YouPage from './pages/YouPage';

type Page =
  | 'home'
  | 'payment'
  | 'payment-success'
  | 'balance'
  | 'history'
  | 'transaction-detail'
  | 'scan'
  | 'coming-soon'
  | 'you'
  | 'pin-setup';

interface NavigationState {
  recipientName?: string;
  recipientPhone?: string;
  upiId?: string;
  feature?: string;
}

interface PaymentDetails {
  name: string;
  phone: string;
  amount: string;
  upiId: string;
}

export interface TransactionData {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  amount: string;
  timestamp: string;
  type: 'sent' | 'received';
}

function AppContent() {
  const { isPinSet } = usePinContext();
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const pinSet = !!localStorage.getItem('gpay_payment_pin');
    return pinSet ? 'home' : 'pin-setup';
  });
  const [navState, setNavState] = useState<NavigationState>({});
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (!isPinSet && currentPage !== 'pin-setup') {
      setCurrentPage('pin-setup');
    }
  }, [isPinSet, currentPage]);

  const navigate = (page: string, state?: Record<string, unknown>) => {
    setCurrentPage(page as Page);
    if (state) setNavState(state as NavigationState);
    if (page === 'home') setActiveTab('home');
    if (page === 'history') setActiveTab('money');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentPage('home');
    } else if (tab === 'money') {
      setCurrentPage('history');
    } else if (tab === 'you') {
      setCurrentPage('you');
    }
  };

  const handlePaymentSuccess = (details: PaymentDetails) => {
    setPaymentDetails(details);
    setCurrentPage('payment-success');
  };

  const handleScanDetected = (upiId: string, name: string) => {
    setNavState({ upiId, recipientName: name });
    setCurrentPage('payment');
  };

  const handleTransactionSelect = (tx: TransactionData) => {
    setSelectedTransaction(tx);
    setCurrentPage('transaction-detail');
  };

  const showBottomNav = ['home', 'history', 'you'].includes(currentPage);

  return (
    <div
      className="relative"
      style={{ background: 'oklch(0.10 0.015 250)', minHeight: '100vh' }}
    >
      {currentPage === 'pin-setup' && (
        <PinSetupPage onComplete={() => { setCurrentPage('home'); setActiveTab('home'); }} />
      )}

      {currentPage === 'home' && (
        <HomePage onNavigate={navigate} />
      )}

      {currentPage === 'scan' && (
        <ScannerViewfinder
          onDetected={handleScanDetected}
          onClose={() => { setCurrentPage('home'); setActiveTab('home'); }}
        />
      )}

      {currentPage === 'payment' && (
        <PaymentEntryPage
          initialState={navState}
          onBack={() => { setCurrentPage('home'); setActiveTab('home'); }}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {currentPage === 'payment-success' && paymentDetails && (
        <PaymentSuccessPage
          details={paymentDetails}
          onDone={() => { setCurrentPage('home'); setActiveTab('home'); }}
        />
      )}

      {currentPage === 'balance' && (
        <BalancePage onBack={() => { setCurrentPage('home'); setActiveTab('home'); }} />
      )}

      {currentPage === 'history' && (
        <HistoryPage
          onBack={() => { setCurrentPage('home'); setActiveTab('home'); }}
          onTransactionSelect={handleTransactionSelect}
        />
      )}

      {currentPage === 'transaction-detail' && selectedTransaction && (
        <TransactionDetailPage
          transaction={selectedTransaction}
          onBack={() => setCurrentPage('history')}
          onPay={(tx) => {
            setNavState({
              recipientName: tx.name,
              recipientPhone: tx.phone,
              upiId: tx.upiId,
            });
            setCurrentPage('payment');
          }}
        />
      )}

      {currentPage === 'coming-soon' && (
        <ComingSoonPage
          feature={navState.feature}
          onBack={() => { setCurrentPage('home'); setActiveTab('home'); }}
        />
      )}

      {currentPage === 'you' && (
        <YouPage onBack={() => { setCurrentPage('home'); setActiveTab('home'); }} />
      )}

      {showBottomNav && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <PinProvider>
      <AppContent />
    </PinProvider>
  );
}
