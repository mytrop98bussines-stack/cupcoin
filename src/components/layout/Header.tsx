import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import type { AppView } from '@/types';

export const Header = () => {
  const { profile } = useAuth();
  const { currentView, goBack, navigate } = useNavigation();

  const showBack = !['home', 'p2p', 'marketplace', 'wallet', 'profile'].includes(
    currentView
  );

  const titles: Record<AppView, string> = {
    home: 'CubaFinance',
    p2p: 'P2P Exchange',
    marketplace: 'Marketplace',
    wallet: 'Billetera',
    profile: 'Mi Perfil',
    kyc: 'Verificación KYC',
    'create-order': 'Nueva Oferta P2P',
    'create-product': 'Publicar Producto',
    login: 'Iniciar Sesión',
    register: 'Crear Cuenta',
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-950/90 backdrop-blur-xl border-b border-surface-800/50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={goBack}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-800 active:bg-surface-700 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          ) : currentView === 'home' ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-sm">
                CF
              </div>
            </div>
          ) : null}
          <h1 className="text-lg font-bold tracking-tight">
            {titles[currentView]}
          </h1>
        </div>

        {currentView === 'home' && profile && (
          <button
            onClick={() => navigate('profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800 active:bg-surface-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-surface-950">
              {profile.displayName?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium max-w-[80px] truncate hidden sm:block">
              {profile.displayName}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
