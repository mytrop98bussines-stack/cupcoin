import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const RegisterScreen = () => {
  const { register, loading, error, clearError } = useAuth();
  const { navigate } = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register(email, password, displayName);
      navigate('home');
    } catch {
      // error handled by context
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-surface-950">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/20 mb-4">
            <span className="text-2xl font-black text-white">CF</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-surface-200/60 mt-1 text-sm">
            Únete a la comunidad CubaFinance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <div
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
              onClick={() => {
                clearError();
                setLocalError('');
              }}
            >
              {displayError}
            </div>
          )}

          <Input
            label="Nombre de usuario"
            placeholder="Tu nombre o alias"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Crear Cuenta
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-surface-200/50 text-sm">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('login')}
              className="text-brand-400 font-semibold hover:text-brand-300"
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
