import { useState } from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import type { OrderType, PaymentMethod, CryptoCurrency } from '@/types';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'transfermovil', label: 'Transfermóvil', icon: '📱' },
  { id: 'enzona', label: 'EnZona', icon: '💳' },
  { id: 'efectivo', label: 'Efectivo', icon: '💵' },
];

export const CreateOrderForm = () => {
  const { goBack } = useNavigation();
  const [type, setType] = useState<OrderType>('sell');
  const [crypto, setCrypto] = useState<CryptoCurrency>('USDT');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [minLimit, setMinLimit] = useState('');
  const [maxLimit, setMaxLimit] = useState('');
  const [selectedPayments, setSelectedPayments] = useState<PaymentMethod[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePayment = (method: PaymentMethod) => {
    setSelectedPayments((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate creating order
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => goBack(), 1500);
  };

  if (success) {
    return (
      <div className="px-4 py-6">
        <Card className="text-center py-10">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-white mb-2">¡Oferta Creada!</h2>
          <p className="text-surface-200/60 text-sm">
            Tu oferta ya está visible en el mercado P2P.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-surface-200 mb-2">
            Tipo de orden
          </label>
          <div className="flex bg-surface-800/80 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setType('buy')}
              className={cn(
                'flex-1 py-3 rounded-lg text-sm font-semibold transition-all',
                type === 'buy'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-surface-200/50'
              )}
            >
              Quiero Comprar
            </button>
            <button
              type="button"
              onClick={() => setType('sell')}
              className={cn(
                'flex-1 py-3 rounded-lg text-sm font-semibold transition-all',
                type === 'sell'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-surface-200/50'
              )}
            >
              Quiero Vender
            </button>
          </div>
        </div>

        {/* Crypto */}
        <div>
          <label className="block text-sm font-medium text-surface-200 mb-2">
            Criptomoneda
          </label>
          <div className="flex gap-2">
            {(['USDT', 'BTC', 'ETH'] as CryptoCurrency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCrypto(c)}
                className={cn(
                  'flex-1 py-3 rounded-xl text-sm font-semibold transition-all',
                  crypto === c
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                    : 'bg-surface-800 text-surface-200/60 active:bg-surface-700'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Input
          label={`Cantidad (${crypto})`}
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="any"
        />

        <Input
          label="Precio por unidad (CUP)"
          type="number"
          placeholder="380"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          hint={`Precio al que quieres ${type === 'buy' ? 'comprar' : 'vender'} 1 ${crypto}`}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Límite mín. (CUP)"
            type="number"
            placeholder="1000"
            value={minLimit}
            onChange={(e) => setMinLimit(e.target.value)}
            required
          />
          <Input
            label="Límite máx. (CUP)"
            type="number"
            placeholder="50000"
            value={maxLimit}
            onChange={(e) => setMaxLimit(e.target.value)}
            required
          />
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-medium text-surface-200 mb-2">
            Métodos de pago aceptados
          </label>
          <div className="space-y-2">
            {PAYMENT_OPTIONS.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => togglePayment(pm.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all',
                  selectedPayments.includes(pm.id)
                    ? 'bg-brand-600/15 border-2 border-brand-500'
                    : 'bg-surface-800 border-2 border-transparent active:bg-surface-700'
                )}
              >
                <span className="text-xl">{pm.icon}</span>
                <span className="text-sm font-medium">{pm.label}</span>
                {selectedPayments.includes(pm.id) && (
                  <svg className="w-5 h-5 text-brand-400 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {amount && price && (
          <Card className="bg-brand-600/5 border-brand-600/20">
            <div className="text-center">
              <p className="text-xs text-surface-200/50 mb-1">Total estimado</p>
              <p className="text-2xl font-bold text-white">
                {(parseFloat(amount || '0') * parseFloat(price || '0')).toLocaleString()}{' '}
                <span className="text-base text-surface-200/50">CUP</span>
              </p>
            </div>
          </Card>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={submitting}
          disabled={!amount || !price || selectedPayments.length === 0}
        >
          Publicar Oferta
        </Button>
      </form>
    </div>
  );
};
