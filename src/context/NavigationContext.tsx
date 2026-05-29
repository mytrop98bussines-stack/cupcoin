import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AppView } from '@/types';

interface NavigationContextValue {
  currentView: AppView;
  previousView: AppView | null;
  navigate: (view: AppView) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [history, setHistory] = useState<AppView[]>(['home']);

  const navigate = useCallback((view: AppView) => {
    setCurrentView(view);
    setHistory((h) => [...h, view]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const newHistory = h.slice(0, -1);
      setCurrentView(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  const previousView = history.length > 1 ? history[history.length - 2] : null;

  return (
    <NavigationContext.Provider value={{ currentView, previousView, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};
