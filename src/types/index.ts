// ─── User & KYC Types ───────────────────────────
export type KYCStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  kycStatus: KYCStatus;
  kycDocumentUrl?: string;
  kycFullName?: string;
  kycIdNumber?: string;
  walletAddress?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

// ─── P2P Exchange Types ─────────────────────────
export type OrderType = 'buy' | 'sell';
export type PaymentMethod = 'transfermovil' | 'enzona' | 'efectivo' | 'usdt_trc20';
export type OrderStatus = 'active' | 'in_progress' | 'completed' | 'cancelled';
export type CryptoCurrency = 'USDT' | 'BTC' | 'ETH';

export interface P2POrder {
  id: string;
  userId: string;
  userDisplayName: string;
  type: OrderType;
  crypto: CryptoCurrency;
  amount: number;
  pricePerUnit: number;
  currency: string; // CUP, USD
  minLimit: number;
  maxLimit: number;
  paymentMethods: PaymentMethod[];
  status: OrderStatus;
  completedTrades: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

// ─── Marketplace Types ──────────────────────────
export type ProductCategory =
  | 'electronica'
  | 'ropa'
  | 'hogar'
  | 'vehiculos'
  | 'servicios'
  | 'alimentos'
  | 'otros';

export type ProductCondition = 'nuevo' | 'como_nuevo' | 'usado' | 'para_piezas';

export interface Product {
  id: string;
  userId: string;
  userDisplayName: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  condition: ProductCondition;
  images: string[];
  location: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  isActive: boolean;
  views: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

// ─── Navigation ─────────────────────────────────
export type AppView =
  | 'home'
  | 'p2p'
  | 'marketplace'
  | 'wallet'
  | 'profile'
  | 'kyc'
  | 'create-order'
  | 'create-product'
  | 'login'
  | 'register';
