import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import { useWeb3 } from '@/context/Web3Context';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const HomeScreen = () => {
  const { profile } = useAuth();
  const { navigate } = useNavigation();
  const { isConnected, balance, formatAddress, address } = useWeb3();

  return (
    <div className="pb-24">
      {/* Welcome Banner */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-gradient-to-br from-brand-700/50 via-brand-800/40 to-surface-900 rounded-2xl p-5 border border-brand-600/20">
          <p className="text-sm text-brand-200/70 mb-0.5">Bienvenido 👋</p>
          <h2 className="text-xl font-bold text-white mb-3">
            {profile?.displayName || 'Usuario'}
          </h2>

          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">
                {address ? formatAddress(address) : ''}
              </span>
              <Badge variant="success" size="sm">{balance} ETH</Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-surface-200/30" />
              <span className="text-xs text-surface-200/40">
                Wallet no conectada
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4">
        <h3 className="text-sm font-semibold text-surface-200/50 mb-3">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              icon: '💱',
              label: 'Comprar\nUSDT',
              view: 'p2p' as const,
              gradient: 'from-emerald-600/20 to-emerald-800/20',
            },
            {
              icon: '💰',
              label: 'Vender\nUSDT',
              view: 'p2p' as const,
              gradient: 'from-red-600/20 to-red-800/20',
            },
            {
              icon: '👛',
              label: 'Mi\nWallet',
              view: 'wallet' as const,
              gradient: 'from-blue-600/20 to-blue-800/20',
            },
            {
              icon: '🛍️',
              label: 'Market\nplace',
              view: 'marketplace' as const,
              gradient: 'from-amber-600/20 to-amber-800/20',
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.view)}
              className={`flex flex-col items-center gap-2 py-4 rounded-xl bg-gradient-to-br ${action.gradient} border border-surface-700/30 active:scale-95 transition-transform`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-[10px] font-medium text-surface-200/70 whitespace-pre-line text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Market Overview */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-surface-200/50">
            Precios del Mercado
          </h3>
          <Badge variant="info" size="sm">CUP</Badge>
        </div>
        <div className="space-y-2">
          {[
            {
              symbol: 'USDT',
              name: 'Tether',
              price: '378',
              change: '+2.1%',
              positive: true,
              icon: '💵',
            },
            {
              symbol: 'BTC',
              name: 'Bitcoin',
              price: '28.5M',
              change: '+4.3%',
              positive: true,
              icon: '₿',
            },
            {
              symbol: 'ETH',
              name: 'Ethereum',
              price: '1.45M',
              change: '-1.2%',
              positive: false,
              icon: 'Ξ',
            },
          ].map((crypto) => (
            <Card key={crypto.symbol} hoverable className="!p-3.5" onClick={() => navigate('p2p')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center text-lg font-bold shrink-0">
                  {crypto.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {crypto.symbol}
                  </p>
                  <p className="text-xs text-surface-200/40">{crypto.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {crypto.price} CUP
                  </p>
                  <p
                    className={`text-xs font-semibold ${
                      crypto.positive ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {crypto.change}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent P2P Activity */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-surface-200/50">
            Actividad P2P Reciente
          </h3>
          <button
            onClick={() => navigate('p2p')}
            className="text-xs text-brand-400 font-semibold"
          >
            Ver todo →
          </button>
        </div>
        <div className="space-y-2">
          {[
            {
              user: 'Carlos_Havana',
              action: 'vendió',
              amount: '100 USDT',
              price: '37,800 CUP',
              time: 'hace 5 min',
            },
            {
              user: 'María_STG',
              action: 'compró',
              amount: '50 USDT',
              price: '18,750 CUP',
              time: 'hace 12 min',
            },
            {
              user: 'Pedro_Crypto',
              action: 'vendió',
              amount: '200 USDT',
              price: '74,000 CUP',
              time: 'hace 23 min',
            },
          ].map((activity, i) => (
            <Card key={i} className="!p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-[10px] font-bold text-surface-950 shrink-0">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="text-surface-200/50">{activity.action}</span>{' '}
                    <span className="font-semibold text-brand-400">
                      {activity.amount}
                    </span>
                  </p>
                  <p className="text-[10px] text-surface-200/30">{activity.time}</p>
                </div>
                <p className="text-xs font-semibold text-surface-200/60 shrink-0">
                  {activity.price}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 py-2 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-surface-200/50">
            Productos Destacados
          </h3>
          <button
            onClick={() => navigate('marketplace')}
            className="text-xs text-accent-400 font-semibold"
          >
            Ver todo →
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {[
            {
              title: 'iPhone 13 Pro',
              price: '$650',
              img: '📱',
              location: 'La Habana',
            },
            {
              title: 'Moto Eléctrica',
              price: '$1,800',
              img: '🏍️',
              location: 'Villa Clara',
            },
            {
              title: 'Nike Air Max',
              price: '$120',
              img: '👟',
              location: 'Playa',
            },
          ].map((product, i) => (
            <button
              key={i}
              onClick={() => navigate('marketplace')}
              className="shrink-0 w-36 bg-surface-800 rounded-xl overflow-hidden border border-surface-700/30 active:scale-[0.97] transition-transform"
            >
              <div className="h-24 bg-surface-700 flex items-center justify-center text-3xl">
                {product.img}
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-white truncate">
                  {product.title}
                </p>
                <p className="text-sm font-bold text-accent-400">{product.price}</p>
                <p className="text-[10px] text-surface-200/30">{product.location}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
