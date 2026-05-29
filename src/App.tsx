import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Web3Provider } from '@/context/Web3Context';
import { NavigationProvider, useNavigation } from '@/context/NavigationContext';

// Screens
import { HomeScreen } from '@/components/home/HomeScreen';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { RegisterScreen } from '@/components/auth/RegisterScreen';
import { P2PExchange } from '@/components/p2p/P2PExchange';
import { CreateOrderForm } from '@/components/p2p/CreateOrderForm';
import { Marketplace } from '@/components/marketplace/Marketplace';
import { ProductForm } from '@/components/marketplace/ProductForm';
import { WalletScreen } from '@/components/wallet/WalletScreen';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { KYCForm } from '@/components/kyc/KYCForm';

// Layout
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

// ─── App Shell (inside providers) ───────────────
const AppShell = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentView, navigate } = useNavigation();
  const [demoMode, setDemoMode] = useState(false);

  // If not authenticated and not on login/register, show login
  useEffect(() => {
    if (!authLoading && !user && !demoMode) {
      if (currentView !== 'login' && currentView !== 'register') {
        navigate('login');
      }
    }
  }, [authLoading, user, currentView, navigate, demoMode]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/20 mb-4 animate-pulse">
          <span className="text-2xl font-black text-white">CF</span>
        </div>
        <div className="flex items-center gap-2 text-surface-200/50">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm">Cargando...</span>
        </div>
      </div>
    );
  }

  // Auth screens
  if (currentView === 'login') {
    return (
      <div>
        <LoginScreen />
        <div className="fixed bottom-6 left-0 right-0 px-6">
          <button
            onClick={() => {
              setDemoMode(true);
              navigate('home');
            }}
            className="w-full py-3 rounded-xl bg-surface-800/80 border border-surface-700/50 text-surface-200/60 text-sm font-medium active:bg-surface-700 transition-colors"
          >
            🎮 Explorar en modo demo
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'register') {
    return <RegisterScreen />;
  }

  // Main app
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen />;
      case 'p2p':
        return <P2PExchange />;
      case 'create-order':
        return <CreateOrderForm />;
      case 'marketplace':
        return <Marketplace />;
      case 'create-product':
        return <ProductForm />;
      case 'wallet':
        return <WalletScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'kyc':
        return <KYCForm />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white max-w-lg mx-auto relative">
      <Header />
      <main className="min-h-[calc(100vh-7.5rem)]">
        {renderCurrentView()}
      </main>
      <BottomNav />
    </div>
  );
};

// ─── App Entry Point ────────────────────────────
const App = () => {
  return (
    <AuthProvider>
      <Web3Provider>
        <NavigationProvider>
          <AppShell />
        </NavigationProvider>
      </Web3Provider>
    </AuthProvider>
  );
};

export default App;
