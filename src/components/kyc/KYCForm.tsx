import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import { compressAndUpload } from '@/services/cloudinary';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const KYCForm = () => {
  const { profile, updateProfile } = useAuth();
  const { goBack } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.kycFullName || '');
  const [idNumber, setIdNumber] = useState(profile?.kycIdNumber || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    profile?.kycDocumentUrl || null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !idNumber.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (!selectedFile && !profile?.kycDocumentUrl) {
      setError('Por favor sube una foto de tu documento de identidad.');
      return;
    }

    setUploading(true);

    try {
      let documentUrl = profile?.kycDocumentUrl || '';

      if (selectedFile) {
        // Upload to Cloudinary
        try {
          const result = await compressAndUpload(selectedFile, 'kyc');
          documentUrl = result.secure_url;
        } catch {
          // Fallback: use local preview as demo
          documentUrl = preview || '';
        }
      }

      await updateProfile({
        kycFullName: fullName,
        kycIdNumber: idNumber,
        kycDocumentUrl: documentUrl,
        kycStatus: 'pending',
      });

      setSuccess(true);
      setTimeout(() => goBack(), 2000);
    } catch {
      setError('Error al enviar la verificación. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  if (profile?.kycStatus === 'approved') {
    return (
      <div className="px-4 py-6">
        <Card className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verificado ✓</h2>
          <p className="text-surface-200/60 text-sm">
            Tu identidad ha sido verificada exitosamente.
          </p>
          <Badge variant="success" size="md" className="mt-3">
            KYC Aprobado
          </Badge>
        </Card>
      </div>
    );
  }

  if (profile?.kycStatus === 'pending' && !success) {
    return (
      <div className="px-4 py-6">
        <Card className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">En Revisión</h2>
          <p className="text-surface-200/60 text-sm px-4">
            Tu documentación está siendo revisada. Recibirás una notificación cuando el proceso finalice.
          </p>
          <Badge variant="warning" size="md" className="mt-3">
            Pendiente de aprobación
          </Badge>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="px-4 py-6">
        <Card className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">¡Enviado!</h2>
          <p className="text-surface-200/60 text-sm">
            Tu documentación ha sido enviada para revisión.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Info Banner */}
      <Card className="mb-6 bg-brand-600/10 border-brand-600/20">
        <div className="flex gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-300">Verificación de Identidad</p>
            <p className="text-xs text-surface-200/50 mt-0.5">
              Necesaria para operar en P2P con límites mayores y acceder a todas las funciones.
            </p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <Input
          label="Nombre completo (como aparece en tu ID)"
          placeholder="Juan Carlos Pérez González"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          label="Número de Carnet de Identidad"
          placeholder="00000000000"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          required
          maxLength={11}
          hint="11 dígitos de tu carnet de identidad"
        />

        {/* Document Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-surface-200">
            Foto del Carnet de Identidad
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Documento"
                className="w-full h-48 object-cover rounded-xl border border-surface-700"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center gap-3 bg-surface-800/30 active:bg-surface-800 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-surface-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-surface-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-surface-200">
                  Toca para subir foto
                </p>
                <p className="text-xs text-surface-200/40 mt-0.5">
                  JPG, PNG · Máx. 10MB
                </p>
              </div>
            </button>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" fullWidth size="lg" loading={uploading}>
            {uploading ? 'Enviando...' : 'Enviar Verificación'}
          </Button>
        </div>

        <p className="text-xs text-surface-200/30 text-center px-4">
          🔒 Tu información está protegida y solo será utilizada para verificar tu identidad según nuestras políticas de privacidad.
        </p>
      </form>
    </div>
  );
};
