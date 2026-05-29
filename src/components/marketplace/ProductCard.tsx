import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/types';

const CONDITION_LABELS: Record<string, string> = {
  nuevo: 'Nuevo',
  como_nuevo: 'Como nuevo',
  usado: 'Usado',
  para_piezas: 'Para piezas',
};

const CONDITION_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  nuevo: 'success',
  como_nuevo: 'info',
  usado: 'warning',
  para_piezas: 'danger',
};

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <Card padding="none" hoverable className="overflow-hidden" onClick={onPress}>
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-700">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}
        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
          <span className="text-lg font-bold text-white">
            ${product.price}
          </span>
          <span className="text-xs text-white/60 ml-1">
            {product.currency}
          </span>
        </div>
        {/* Condition badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={CONDITION_VARIANTS[product.condition]} size="sm">
            {CONDITION_LABELS[product.condition]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1.5">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-surface-200/40">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate max-w-[100px]">{product.location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-surface-200/40">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {product.views}
          </div>
        </div>
      </div>
    </Card>
  );
};
