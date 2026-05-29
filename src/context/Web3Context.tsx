import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// ─── Types ──────────────────────────────────────
interface Web3State {
  address: string | null;
  balance: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface Web3ContextValue extends Web3State {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendTransaction: (to: string, amount: string) => Promise<string | null>;
  signMessage: (message: string) => Promise<string | null>;
  formatAddress: (addr: string) => string;
}

const Web3Context = createContext<Web3ContextValue | null>(null);

export const useWeb3 = () => {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error('useWeb3 must be used within Web3Provider');
  return ctx;
};

// ─── Ethereum helpers (window.ethereum) ─────────
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const formatAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const weiToEth = (wei: string): string => {
  const value = BigInt(wei);
  const ethWhole = value / BigInt(10 ** 18);
  const ethFraction = value % BigInt(10 ** 18);
  const fractionStr = ethFraction.toString().padStart(18, '0').slice(0, 4);
  return `${ethWhole}.${fractionStr}`;
};

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Web3State>({
    address: null,
    balance: '0',
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const fetchBalance = useCallback(async (address: string) => {
    if (!window.ethereum) return '0';
    try {
      const balance = (await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })) as string;
      return weiToEth(balance);
    } catch {
      return '0';
    }
  }, []);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, isConnecting: true, error: null }));

    if (!window.ethereum) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: 'No se detectó wallet. Instala MetaMask o Trust Wallet.',
      }));
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      const chainIdHex = (await window.ethereum.request({
        method: 'eth_chainId',
      })) as string;

      const address = accounts[0];
      const chainId = parseInt(chainIdHex, 16);
      const balance = await fetchBalance(address);

      setState({
        address,
        balance,
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      // Listen for account/chain changes
      window.ethereum.on('accountsChanged', (accs: unknown) => {
        const accounts = accs as string[];
        if (accounts.length === 0) {
          setState({
            address: null,
            balance: '0',
            chainId: null,
            isConnected: false,
            isConnecting: false,
            error: null,
          });
        } else {
          setState((s) => ({ ...s, address: accounts[0] }));
          fetchBalance(accounts[0]).then((b) =>
            setState((s) => ({ ...s, balance: b }))
          );
        }
      });

      window.ethereum.on('chainChanged', (cId: unknown) => {
        const newChainId = parseInt(cId as string, 16);
        setState((s) => ({ ...s, chainId: newChainId }));
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al conectar wallet';
      setState((s) => ({ ...s, isConnecting: false, error: message }));
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      balance: '0',
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  const sendTransaction = useCallback(
    async (to: string, amount: string): Promise<string | null> => {
      if (!window.ethereum || !state.address) return null;
      try {
        const amountWei = `0x${(BigInt(Math.floor(parseFloat(amount) * 1e18))).toString(16)}`;
        const txHash = (await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: state.address,
              to,
              value: amountWei,
            },
          ],
        })) as string;
        // Refresh balance
        const newBalance = await fetchBalance(state.address);
        setState((s) => ({ ...s, balance: newBalance }));
        return txHash;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error en transacción';
        setState((s) => ({ ...s, error: message }));
        return null;
      }
    },
    [state.address, fetchBalance]
  );

  const signMessage = useCallback(
    async (message: string): Promise<string | null> => {
      if (!window.ethereum || !state.address) return null;
      try {
        const signature = (await window.ethereum.request({
          method: 'personal_sign',
          params: [message, state.address],
        })) as string;
        return signature;
      } catch {
        return null;
      }
    },
    [state.address]
  );

  return (
    <Web3Context.Provider
      value={{
        ...state,
        connect,
        disconnect,
        sendTransaction,
        signMessage,
        formatAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
