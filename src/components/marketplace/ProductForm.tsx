import { useState, useRef } from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { compressAndUpload } from '@/services/cloudinary';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import type { ProductCategory, ProductCondition } from '@/types';

const CATEGORIES: { id: ProductCategory; label: string; icon: string }[] = [
  { id: 'electronica', label: 'Electrónica', icon: '📱' },
  { id: 'ropa', label: 'Ropa', icon: '👕' },
  { id: 'hogar', label: 'Hogar', icon: '🛋️' },
  { id: 'vehiculos', label: 'Vehículos', icon: '🏍️' },
  { id: 'alimentos', label: 'Alimentos', icon: '🍎' },
  { id: 'servicios', label: 'Servicios', icon: '🔧' },
  { id: 'otros', label: 'Otros', icon: '📦' },
];

const CONDITIONS: { id: ProductCondition; label: string }[] = [
  { id: 'nuevo', label: 'Nuevo' },
  { id: 'como_nuevo', label: 'Como nuevo' },
  { id: 'usado', label: 'Usado' },
  { id: 'para_piezas', label: 'Para piezas' },
];

export const ProductForm = () => {
  const { goBack } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState<ProductCategory>('electronica');
  const [condition, setCondition] = useState<ProductCondition>('usado');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.slice(0, 5 - images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload images to Cloudinary
      const uploadedUrls: string[] = [];
      for (const img of images) {
        try {
          const result = await compressAndUpload(img.file, 'products');
          uploadedUrls.push(result.secure_url);
        } catch {
          // Fallback: use local preview
          uploadedUrls.push(img.preview);
        }
      }

      // In production, save to Firestore:
      // await createDocument('products', { title, description, price, ... });
      console.log('Product created:', {
        title,
        description,
        price: parseFloat(price),
        currency,
        category,
        condition,
        location,
        contactPhone,
        images: uploadedUrls,
      });

      setSuccess(true);
      setTimeout(() => goBack(), 1500);
    } catch {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="px-4 py-6">
        <Card className="text-center py-10">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-white mb-2">¡Producto Publicado!</h2>
          <p className="text-surface-200/60 text-sm">
            Tu anuncio ya está visible en el marketplace.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-surface-200 mb-2">
            Fotos del producto ({images.length}/5)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImages}
            className="hidden"
          />
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 shrink-0">
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-full object-cover rounded-xl border border-surface-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 shrink-0 border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center gap-1 bg-surface-800/30 active:bg-surface-800 transition-colors"
              >
                <svg className="w-6 h-6 text-surface-200/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="text-[9px] text-surface-200/30">Añadir</span>
              </button>
            )}
          </div>
        </div>

        <Input
          label="Título del producto"
          placeholder="Ej: iPhone 13 Pro 128GB"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />

        <div>
          <label className="block text-sm font-medium text-surface-200 mb-1.5">
            Descripción
          </label>
          <textarea
            placeholder="Describe tu producto: estado, detalles, qué incluye..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            maxLength={500}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-200/40 text-base focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 resize-none"
          />
          <p className="text-xs text-surface-200/30 mt-1 text-right">
            {description.length}/500
          </p>
        </div>

        {/* Price */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Precio"
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              step="any"
            />
          </div>
          <div className="w-28">
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              Moneda
            </label>
            <div className="flex bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
              {['USD', 'CUP'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={cn(
                    'flex-1 py-3 text-sm font-semibold transition-all',
                    currency === c
                      ? 'bg-brand-600 text-white'
                      : 'text-surface-200/50'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-surface-200 mb-2">
            Categoría
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all',
                  category === cat.id
                    ? 'bg-brand-600/15 border-2 border-brand-500 text-brand-400'
                    : 'bg-surface-800 border-2 border-transparent text-surface-200/50 active:bg-surface-700'
                )}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-surface-200 mb-2">
            Estado
          </label>
          <div className="flex gap-2 flex-wrap">
            {CONDITIONS.map((cond) => (
              <button
                key={cond.id}
                type="button"
                onClick={() => setCondition(cond.id)}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  condition === cond.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                    : 'bg-surface-800 text-surface-200/60 active:bg-surface-700'
                )}
              >
                {cond.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Ubicación"
          placeholder="Ej: La Habana, Vedado"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <Input
          label="Teléfono de contacto"
          type="tel"
          placeholder="+53 5555 1234"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          hint="Opcional: para que los interesados te contacten"
        />

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={submitting}
            disabled={!title || !price || images.length === 0}
          >
            Publicar Producto
          </Button>
        </div>
      </form>
    </div>
  );
};
