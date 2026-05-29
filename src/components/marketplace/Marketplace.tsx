import { useProducts } from '@/hooks/useProducts';
import { useNavigation } from '@/context/NavigationContext';
import { ProductCard } from './ProductCard';
import { cn } from '@/utils/cn';
import type { ProductCategory } from '@/types';

const CATEGORIES: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Todo', icon: '🏠' },
  { id: 'electronica', label: 'Electrónica', icon: '📱' },
  { id: 'ropa', label: 'Ropa', icon: '👕' },
  { id: 'hogar', label: 'Hogar', icon: '🛋️' },
  { id: 'vehiculos', label: 'Vehículos', icon: '🏍️' },
  { id: 'alimentos', label: 'Alimentos', icon: '🍎' },
  { id: 'servicios', label: 'Servicios', icon: '🔧' },
  { id: 'otros', label: 'Otros', icon: '📦' },
];

export const Marketplace = () => {
  const {
    products,
    loading,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useProducts();
  const { navigate } = useNavigation();

  return (
    <div className="pb-24">
      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-200/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-800 border border-surface-700/50 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                categoryFilter === cat.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'bg-surface-800 text-surface-200/60 active:bg-surface-700'
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-surface-800 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-surface-700" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-surface-700 rounded w-3/4" />
                  <div className="h-3 bg-surface-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-surface-200/60 text-sm">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* FAB - Create Product */}
      <button
        onClick={() => navigate('create-product')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-accent-500 rounded-2xl shadow-2xl shadow-accent-500/40 flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <svg className="w-7 h-7 text-surface-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};
