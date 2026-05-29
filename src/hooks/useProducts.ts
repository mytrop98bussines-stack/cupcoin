import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductCategory } from '@/types';

const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    userId: 'user1',
    userDisplayName: 'Carlos_Havana',
    title: 'iPhone 13 Pro 128GB',
    description: 'iPhone 13 Pro en excelente estado, batería al 89%. Incluye cargador original y funda. Sin arañazos en pantalla.',
    price: 650,
    currency: 'USD',
    category: 'electronica',
    condition: 'como_nuevo',
    images: ['https://images.unsplash.com/photo-1632633173522-47456de71b76?w=400'],
    location: 'La Habana, Vedado',
    contactPhone: '+5355551234',
    isActive: true,
    views: 234,
  },
  {
    id: '2',
    userId: 'user2',
    userDisplayName: 'María_STG',
    title: 'Laptop ASUS VivoBook 15',
    description: 'Laptop ASUS VivoBook, Core i5 11th Gen, 8GB RAM, 512GB SSD. Perfecta para trabajo y estudio.',
    price: 450,
    currency: 'USD',
    category: 'electronica',
    condition: 'usado',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
    location: 'Santiago de Cuba',
    contactPhone: '+5355559876',
    isActive: true,
    views: 156,
  },
  {
    id: '3',
    userId: 'user3',
    userDisplayName: 'Pedro_Trader',
    title: 'Zapatillas Nike Air Max 90',
    description: 'Zapatillas Nike originales, talla 42, traídas de Miami. Sin usar, con caja original.',
    price: 120,
    currency: 'USD',
    category: 'ropa',
    condition: 'nuevo',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    location: 'La Habana, Playa',
    isActive: true,
    views: 89,
  },
  {
    id: '4',
    userId: 'user4',
    userDisplayName: 'Ana_Matanzas',
    title: 'Aire Acondicionado Split 1 Ton',
    description: 'Split de 1 tonelada marca Midea, enfría perfectamente. Instalación incluida en Matanzas.',
    price: 380,
    currency: 'USD',
    category: 'hogar',
    condition: 'usado',
    images: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400'],
    location: 'Matanzas',
    contactPhone: '+5355554321',
    isActive: true,
    views: 312,
  },
  {
    id: '5',
    userId: 'user5',
    userDisplayName: 'Jorge_VR',
    title: 'Moto Eléctrica Mishozuki',
    description: 'Moto eléctrica Mishozuki Pro, batería de litio 72V, 45km de autonomía. Chapa y seguro al día.',
    price: 1800,
    currency: 'USD',
    category: 'vehiculos',
    condition: 'como_nuevo',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],
    location: 'Villa Clara',
    contactPhone: '+5355557890',
    contactWhatsApp: '+5355557890',
    isActive: true,
    views: 567,
  },
  {
    id: '6',
    userId: 'user6',
    userDisplayName: 'Lucia_Tech',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'Galaxy S23 Ultra 256GB, como nuevo. Pantalla impecable, incluye todos los accesorios originales.',
    price: 800,
    currency: 'USD',
    category: 'electronica',
    condition: 'como_nuevo',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
    location: 'La Habana, Centro',
    isActive: true,
    views: 445,
  },
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setProducts(DEMO_PRODUCTS);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return {
    products: filteredProducts,
    loading,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    refresh: loadProducts,
  };
};
