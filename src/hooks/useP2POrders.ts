import { useState, useEffect, useCallback } from 'react';
import type { P2POrder, OrderType, PaymentMethod, CryptoCurrency } from '@/types';

// ─── Demo data for P2P Orders ──────────────────
const DEMO_ORDERS: P2POrder[] = [
  {
    id: '1',
    userId: 'user1',
    userDisplayName: 'Carlos_Havana',
    type: 'sell',
    crypto: 'USDT',
    amount: 500,
    pricePerUnit: 380,
    currency: 'CUP',
    minLimit: 1000,
    maxLimit: 50000,
    paymentMethods: ['transfermovil', 'enzona'],
    status: 'active',
    completedTrades: 47,
  },
  {
    id: '2',
    userId: 'user2',
    userDisplayName: 'María_STG',
    type: 'sell',
    crypto: 'USDT',
    amount: 200,
    pricePerUnit: 375,
    currency: 'CUP',
    minLimit: 5000,
    maxLimit: 75000,
    paymentMethods: ['transfermovil'],
    status: 'active',
    completedTrades: 123,
  },
  {
    id: '3',
    userId: 'user3',
    userDisplayName: 'Pedro_Crypto',
    type: 'buy',
    crypto: 'USDT',
    amount: 1000,
    pricePerUnit: 370,
    currency: 'CUP',
    minLimit: 10000,
    maxLimit: 100000,
    paymentMethods: ['transfermovil', 'enzona', 'efectivo'],
    status: 'active',
    completedTrades: 89,
  },
  {
    id: '4',
    userId: 'user4',
    userDisplayName: 'Ana_Matanzas',
    type: 'sell',
    crypto: 'USDT',
    amount: 150,
    pricePerUnit: 382,
    currency: 'CUP',
    minLimit: 2000,
    maxLimit: 30000,
    paymentMethods: ['enzona'],
    status: 'active',
    completedTrades: 31,
  },
  {
    id: '5',
    userId: 'user5',
    userDisplayName: 'Jorge_VR',
    type: 'buy',
    crypto: 'USDT',
    amount: 300,
    pricePerUnit: 365,
    currency: 'CUP',
    minLimit: 5000,
    maxLimit: 60000,
    paymentMethods: ['efectivo'],
    status: 'active',
    completedTrades: 15,
  },
  {
    id: '6',
    userId: 'user6',
    userDisplayName: 'Lucia_Holguin',
    type: 'sell',
    crypto: 'USDT',
    amount: 800,
    pricePerUnit: 378,
    currency: 'CUP',
    minLimit: 3000,
    maxLimit: 90000,
    paymentMethods: ['transfermovil', 'efectivo'],
    status: 'active',
    completedTrades: 204,
  },
  {
    id: '7',
    userId: 'user7',
    userDisplayName: 'Roberto_CMG',
    type: 'buy',
    crypto: 'BTC',
    amount: 0.05,
    pricePerUnit: 28500000,
    currency: 'CUP',
    minLimit: 50000,
    maxLimit: 500000,
    paymentMethods: ['transfermovil', 'enzona'],
    status: 'active',
    completedTrades: 62,
  },
  {
    id: '8',
    userId: 'user8',
    userDisplayName: 'Diana_Pinar',
    type: 'sell',
    crypto: 'ETH',
    amount: 2,
    pricePerUnit: 1450000,
    currency: 'CUP',
    minLimit: 10000,
    maxLimit: 200000,
    paymentMethods: ['enzona', 'efectivo'],
    status: 'active',
    completedTrades: 38,
  },
];

interface Filters {
  type: OrderType | 'all';
  crypto: CryptoCurrency | 'all';
  paymentMethod: PaymentMethod | 'all';
}

export const useP2POrders = () => {
  const [orders, setOrders] = useState<P2POrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    crypto: 'USDT',
    paymentMethod: 'all',
  });

  const loadOrders = useCallback(async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));
    setOrders(DEMO_ORDERS);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = orders.filter((order) => {
    if (filters.type !== 'all' && order.type !== filters.type) return false;
    if (filters.crypto !== 'all' && order.crypto !== filters.crypto) return false;
    if (
      filters.paymentMethod !== 'all' &&
      !order.paymentMethods.includes(filters.paymentMethod)
    )
      return false;
    return order.status === 'active';
  });

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    filters,
    setFilters,
    refresh: loadOrders,
  };
};
