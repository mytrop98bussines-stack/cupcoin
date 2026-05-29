import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const LoginScreen = () => {
  const { login, loading, error, clearError } = useAuth();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('home');
    } catch {
      // error handled by context
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-surface-950">
      <div className="mx-auto w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/20 mb-4">
            <span className="text-2xl font-black text-white">CF</span>
          </div>
          <h1 className="text-2xl font-bold text-white">CubaFinance</h1>
          <p className="text-surface-200/60 mt-1 text-sm">
            Tu plataforma financiera P2P
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
              onClick={clearError}
            >
              {error}
            </div>
          )}

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-surface-200/50 text-sm">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('register')}
              className="text-brand-400 font-semibold hover:text-brand-300"
            >
              Regístrate
            </button>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-8 p-4 bg-surface-800/50 rounded-xl border border-surface-700/30">
          <p className="text-xs text-surface-200/40 text-center">
            🔑 Demo: Usa cualquier email/contraseña para explorar la interfaz.
            <br />
            La app funciona con datos de demostración.
          </p>
        </div>
      </div>
    </div>
  );
};
