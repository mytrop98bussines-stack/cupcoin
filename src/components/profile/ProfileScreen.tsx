import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { KYCStatus } from '@/types';

const KYC_CONFIG: Record<KYCStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger'; icon: string }> = {
  none: { label: 'Sin verificar', variant: 'default', icon: '⚪' },
  pending: { label: 'En revisión', variant: 'warning', icon: '🟡' },
  approved: { label: 'Verificado', variant: 'success', icon: '🟢' },
  rejected: { label: 'Rechazado', variant: 'danger', icon: '🔴' },
};

export const ProfileScreen = () => {
  const { profile, logout } = useAuth();
  const { navigate } = useNavigation();

  if (!profile) return null;

  const kycConfig = KYC_CONFIG[profile.kycStatus || 'none'];

  return (
    <div className="px-4 py-6 pb-24">
      {/* Profile Header */}
      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-2xl font-bold text-surface-950 shrink-0">
            {profile.displayName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              {profile.displayName}
            </h2>
            <p className="text-sm text-surface-200/50 truncate">{profile.email}</p>
            <div className="mt-1.5">
              <Badge variant={kycConfig.variant} size="md">
                {kycConfig.icon} {kycConfig.label}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* KYC Banner */}
      {(profile.kycStatus === 'none' || profile.kycStatus === 'rejected') && (
        <Card
          className="mb-4 bg-amber-500/5 border-amber-500/20 cursor-pointer active:scale-[0.99]"
          onClick={() => navigate('kyc')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-300">
                Verifica tu identidad
              </p>
              <p className="text-xs text-surface-200/40">
                Accede a límites más altos y todas las funciones
              </p>
            </div>
            <svg className="w-5 h-5 text-surface-200/30 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Card>
      )}

      {/* Menu Items */}
      <div className="space-y-2 mb-6">
        <h3 className="text-xs font-semibold text-surface-200/40 uppercase tracking-wider mb-3 px-1">
          Cuenta
        </h3>

        {[
          { icon: '🔒', label: 'Verificación KYC', view: 'kyc' as const, badge: kycConfig.label },
          { icon: '📊', label: 'Mis Ofertas P2P', view: 'p2p' as const },
          { icon: '📦', label: 'Mis Productos', view: 'marketplace' as const },
        ].map((item) => (
          <Card
            key={item.label}
            hoverable
            onClick={() => navigate(item.view)}
            className="!p-3.5"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-sm font-medium text-white">
                {item.label}
              </span>
              {item.badge && (
                <Badge variant={kycConfig.variant} size="sm">
                  {item.badge}
                </Badge>
              )}
              <svg className="w-4 h-4 text-surface-200/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-xs font-semibold text-surface-200/40 uppercase tracking-wider mb-3 px-1">
          Información
        </h3>

        {[
          { icon: '📖', label: 'Ayuda y FAQ' },
          { icon: '📜', label: 'Términos y Condiciones' },
          { icon: '🔐', label: 'Política de Privacidad' },
        ].map((item) => (
          <Card key={item.label} hoverable className="!p-3.5">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-sm font-medium text-white">
                {item.label}
              </span>
              <svg className="w-4 h-4 text-surface-200/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card className="mb-6">
        <h3 className="text-xs font-semibold text-surface-200/40 uppercase tracking-wider mb-3">
          Estadísticas
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-400">0</p>
            <p className="text-[10px] text-surface-200/40">Trades P2P</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-400">0</p>
            <p className="text-[10px] text-surface-200/40">Productos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">100%</p>
            <p className="text-[10px] text-surface-200/40">Reputación</p>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Button variant="danger" fullWidth onClick={logout}>
        Cerrar Sesión
      </Button>

      <p className="text-center text-xs text-surface-200/20 mt-6">
        CubaFinance v1.0.0
      </p>
    </div>
  );
};
