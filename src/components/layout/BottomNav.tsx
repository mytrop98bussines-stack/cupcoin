import { useNavigation } from '@/context/NavigationContext';
import { cn } from '@/utils/cn';
import type { AppView } from '@/types';

interface NavItem {
  id: AppView;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'p2p', label: 'P2P', icon: 'p2p' },
  { id: 'marketplace', label: 'Market', icon: 'market' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet' },
  { id: 'profile', label: 'Perfil', icon: 'profile' },
];

const NavIcon = ({ icon, active }: { icon: string; active: boolean }) => {
  const color = active ? 'text-brand-400' : 'text-surface-200/50';

  switch (icon) {
    case 'home':
      return (
        <svg className={cn('w-6 h-6', color)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'p2p':
      return (
        <svg className={cn('w-6 h-6', color)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 014-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 01-4 4H3" />
        </svg>
      );
    case 'market':
      return (
        <svg className={cn('w-6 h-6', color)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      );
    case 'wallet':
      return (
        <svg className={cn('w-6 h-6', color)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 'profile':
      return (
        <svg className={cn('w-6 h-6', color)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
};

export const BottomNav = () => {
  const { currentView, navigate } = useNavigation();
  const mainViews: AppView[] = ['home', 'p2p', 'marketplace', 'wallet', 'profile'];
  const isMainView = mainViews.includes(currentView);

  if (!isMainView && currentView !== 'login' && currentView !== 'register') return null;
  if (currentView === 'login' || currentView === 'register') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-950/95 backdrop-blur-xl border-t border-surface-800/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-all duration-200',
                active ? 'text-brand-400' : 'text-surface-200/50'
              )}
            >
              <NavIcon icon={item.icon} active={active} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <div className="absolute top-0 w-8 h-0.5 bg-brand-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
