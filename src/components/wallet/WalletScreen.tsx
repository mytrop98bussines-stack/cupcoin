import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  56: 'BSC',
  137: 'Polygon',
  43114: 'Avalanche',
  42161: 'Arbitrum',
  10: 'Optimism',
};

export const WalletScreen = () => {
  const {
    address,
    balance,
    chainId,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendTransaction,
    formatAddress,
  } = useWeb3();

  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'receive'>('overview');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSend = async () => {
    if (!sendTo || !sendAmount) return;
    setSending(true);
    const hash = await sendTransaction(sendTo, sendAmount);
    if (hash) setTxHash(hash);
    setSending(false);
    setSendTo('');
    setSendAmount('');
  };

  if (!isConnected) {
    return (
      <div className="px-4 py-6 pb-24">
        {/* Connect Wallet Card */}
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Conecta tu Wallet</h2>
          <p className="text-surface-200/50 text-sm text-center px-8 mb-6">
            Conecta MetaMask, Trust Wallet u otra wallet compatible para acceder a tus criptomonedas.
          </p>

          {error && (
            <div className="w-full mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <Button size="lg" fullWidth loading={isConnecting} onClick={connect}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Conectar Wallet
          </Button>

          <p className="text-xs text-surface-200/30 text-center mt-4 px-6">
            Compatible con MetaMask, Trust Wallet, Coinbase Wallet y otras wallets Web3
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-brand-700/40 to-brand-900/40 border-brand-600/30 mb-4">
        <div className="text-center py-2">
          <p className="text-xs text-surface-200/50 mb-1">Balance Total</p>
          <p className="text-3xl font-bold text-white mb-1">{balance} ETH</p>
          <div className="flex items-center justify-center gap-2">
            {address && (
              <Badge variant="info" size="md">
                {formatAddress(address)}
              </Badge>
            )}
            {chainId && (
              <Badge variant="success" size="sm">
                {CHAIN_NAMES[chainId] || `Chain ${chainId}`}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { id: 'overview' as const, label: 'Resumen', icon: '📊' },
          { id: 'send' as const, label: 'Enviar', icon: '📤' },
          { id: 'receive' as const, label: 'Recibir', icon: '📥' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 py-4 rounded-xl transition-all',
              activeTab === tab.id
                ? 'bg-brand-600/15 border-2 border-brand-500'
                : 'bg-surface-800 border-2 border-transparent active:bg-surface-700'
            )}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-surface-200/60 mb-3">
            Actividad Reciente
          </h3>
          {txHash && (
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <span>✅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">Transacción enviada</p>
                  <p className="text-xs text-surface-200/40 truncate">{txHash}</p>
                </div>
              </div>
            </Card>
          )}
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
                <span>🔗</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Wallet conectada</p>
                <p className="text-xs text-surface-200/40">Sesión activa</p>
              </div>
              <Badge variant="success" size="sm">Activa</Badge>
            </div>
          </Card>

          <div className="pt-4">
            <Button variant="danger" fullWidth onClick={disconnect}>
              Desconectar Wallet
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'send' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-200/60">
            Enviar Criptomonedas
          </h3>
          <Input
            label="Dirección destino"
            placeholder="0x..."
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
          />
          <Input
            label="Cantidad (ETH)"
            type="number"
            placeholder="0.0"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            step="any"
            hint={`Disponible: ${balance} ETH`}
          />
          <Button
            fullWidth
            size="lg"
            loading={sending}
            disabled={!sendTo || !sendAmount}
            onClick={handleSend}
          >
            Enviar
          </Button>
        </div>
      )}

      {activeTab === 'receive' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-200/60">
            Recibir Criptomonedas
          </h3>
          <Card className="text-center py-6">
            <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4">
              {/* QR Code placeholder */}
              <div className="w-32 h-32 bg-surface-950 rounded-xl flex items-center justify-center">
                <span className="text-3xl">📱</span>
              </div>
            </div>
            <p className="text-sm font-medium text-white mb-2">Tu Dirección</p>
            {address && (
              <div className="bg-surface-900 rounded-xl px-4 py-3 mx-auto max-w-[280px]">
                <p className="text-xs text-brand-400 font-mono break-all select-all">
                  {address}
                </p>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                if (address) navigator.clipboard.writeText(address);
              }}
            >
              📋 Copiar Dirección
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
