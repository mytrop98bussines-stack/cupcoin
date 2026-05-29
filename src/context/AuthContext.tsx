import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  signIn,
  signUp,
  signOut as fbSignOut,
  onAuthChange,
  createDocument,
  getDocument,
  updateDocument,
  type User,
} from '@/services/firebase';
import type { UserProfile, KYCStatus } from '@/types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const loadProfile = useCallback(async (user: User) => {
    try {
      const profileData = await getDocument('users', user.uid);
      if (profileData) {
        setState((s) => ({
          ...s,
          profile: profileData as UserProfile,
          loading: false,
        }));
      } else {
        // Create default profile
        const newProfile: Omit<UserProfile, 'id'> = {
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
          kycStatus: 'none',
        };
        await createDocument('users', newProfile, user.uid);
        setState((s) => ({
          ...s,
          profile: { id: user.uid, ...newProfile },
          loading: false,
        }));
      }
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setState((s) => ({ ...s, user, loading: true }));
        await loadProfile(user);
      } else {
        setState({ user: null, profile: null, loading: false, error: null });
      }
    });
    return unsubscribe;
  }, [loadProfile]);

  const login = async (email: string, password: string) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      await signIn(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setState((s) => ({ ...s, loading: false, error: message }));
      throw err;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const cred = await signUp(email, password);
      const newProfile: Omit<UserProfile, 'id'> = {
        email,
        displayName,
        kycStatus: 'none' as KYCStatus,
      };
      await createDocument('users', newProfile, cred.user.uid);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setState((s) => ({ ...s, loading: false, error: message }));
      throw err;
    }
  };

  const logout = async () => {
    await fbSignOut();
    setState({ user: null, profile: null, loading: false, error: null });
  };

  const refreshProfile = async () => {
    if (state.user) await loadProfile(state.user);
  };

  const updateProfileFn = async (data: Partial<UserProfile>) => {
    if (!state.user) return;
    await updateDocument('users', state.user.uid, data);
    setState((s) => ({
      ...s,
      profile: s.profile ? { ...s.profile, ...data } : null,
    }));
  };

  const clearError = () => setState((s) => ({ ...s, error: null }));

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile: updateProfileFn,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
