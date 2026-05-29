import { useState } from 'react';
import { useP2POrders } from '@/hooks/useP2POrders';
import { useNavigation } from '@/context/NavigationContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { OrderType, PaymentMethod, CryptoCurrency } from '@/types';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  transfermovil: 'Transfermóvil',
  enzona: 'EnZona',
  efectivo: 'Efectivo',
  usdt_trc20: 'USDT TRC-20',
};

const PAYMENT_COLORS: Record<PaymentMethod, string> = {
  transfermovil: 'bg-blue-500/15 text-blue-400',
  enzona: 'bg-purple-500/15 text-purple-400',
  efectivo: 'bg-emerald-500/15 text-emerald-400',
  usdt_trc20: 'bg-teal-500/15 text-teal-400',
};

const CRYPTO_OPTIONS: CryptoCurrency[] = ['USDT', 'BTC', 'ETH'];

export const P2PExchange = () => {
  const { orders, loading, filters, setFilters } = useP2POrders();
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<OrderType | 'all'>('all');

  const handleTabChange = (tab: OrderType | 'all') => {
    setActiveTab(tab);
    setFilters((f) => ({ ...f, type: tab }));
  };

  return (
    <div className="pb-24">
      {/* Crypto Selector */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CRYPTO_OPTIONS.map((crypto) => (
            <button
              key={crypto}
              onClick={() => setFilters((f) => ({ ...f, crypto }))}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
                filters.crypto === crypto
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'bg-surface-800 text-surface-200/60 active:bg-surface-700'
              )}
            >
              {crypto}
            </button>
          ))}
        </div>
      </div>

      {/* Buy/Sell Tabs */}
      <div className="px-4 pb-3">
        <div className="flex bg-surface-800/80 rounded-xl p-1">
          {[
            { id: 'all' as const, label: 'Todas' },
            { id: 'buy' as const, label: '🟢 Comprar' },
            { id: 'sell' as const, label: '🔴 Vender' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all',
                activeTab === tab.id
                  ? 'bg-surface-700 text-white shadow-sm'
                  : 'text-surface-200/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Filter */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilters((f) => ({ ...f, paymentMethod: 'all' }))}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              filters.paymentMethod === 'all'
                ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                : 'bg-surface-800/50 text-surface-200/40 border border-surface-700/30'
            )}
          >
            Todos
          </button>
          {(Object.keys(PAYMENT_LABELS) as PaymentMethod[])
            .filter((pm) => pm !== 'usdt_trc20')
            .map((method) => (
              <button
                key={method}
                onClick={() => setFilters((f) => ({ ...f, paymentMethod: method }))}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                  filters.paymentMethod === method
                    ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                    : 'bg-surface-800/50 text-surface-200/40 border border-surface-700/30'
                )}
              >
                {PAYMENT_LABELS[method]}
              </button>
            ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-4 w-24 bg-surface-700 rounded mb-2" />
                    <div className="h-6 w-32 bg-surface-700 rounded mb-2" />
                    <div className="h-3 w-40 bg-surface-700 rounded" />
                  </div>
                  <div className="h-10 w-20 bg-surface-700 rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-surface-200/60 text-sm">
              No hay ofertas con estos filtros
            </p>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} hoverable>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* User info */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-[10px] font-bold text-surface-950 shrink-0">
                      {order.userDisplayName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-white truncate">
                      {order.userDisplayName}
                    </span>
                    <Badge variant="info" size="sm">
                      {order.completedTrades} ops
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-xl font-bold text-white">
                      {order.pricePerUnit.toLocaleString()}
                    </span>
                    <span className="text-sm text-surface-200/50 ml-1">
                      {order.currency}/{order.crypto}
                    </span>
                  </div>

                  {/* Limits */}
                  <div className="text-xs text-surface-200/40 mb-2">
                    Límite: {order.minLimit.toLocaleString()} -{' '}
                    {order.maxLimit.toLocaleString()} {order.currency}
                  </div>

                  {/* Payment Methods */}
                  <div className="flex gap-1.5 flex-wrap">
                    {order.paymentMethods.map((pm) => (
                      <span
                        key={pm}
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-semibold',
                          PAYMENT_COLORS[pm]
                        )}
                      >
                        {PAYMENT_LABELS[pm]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  size="sm"
                  variant={order.type === 'sell' ? 'primary' : 'outline'}
                  className={cn(
                    'ml-3 shrink-0',
                    order.type === 'sell'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                      : 'border-red-500 text-red-400 hover:bg-red-500/10'
                  )}
                >
                  {order.type === 'sell' ? 'Comprar' : 'Vender'}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* FAB - Create Order */}
      <button
        onClick={() => navigate('create-order')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-brand-600 rounded-2xl shadow-2xl shadow-brand-600/40 flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};
