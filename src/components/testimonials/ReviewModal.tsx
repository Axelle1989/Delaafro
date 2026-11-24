import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/common/Button';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { products, addTestimonial } = useSettingsStore();

  const [clientName, setClientName] = useState('');
  const [city, setCity] = useState('');
  const [productId, setProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam hidden field
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Anti-spam honeypot
    if (honeypot.trim() !== '') {
      setIsSuccess(true);
      return;
    }

    // 2. Rate limiting (1 submission per minute)
    const lastSubmit = localStorage.getItem('delaafro_last_review_ts');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit, 10) < 60000) {
      setError('Veuillez patienter 1 minute avant de soumettre un nouvel avis.');
      return;
    }

    if (!content.trim()) {
      setError('Veuillez renseigner votre avis.');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageUrl: string | undefined = undefined;

      // File upload if provided (max 2MB)
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          setError('La photo ne doit pas dépasser 2 Mo.');
          setIsSubmitting(false);
          return;
        }

        if (supabase) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `reviews/${fileName}`;

          const { error: uploadErr } = await supabase.storage
            .from('testimonials')
            .upload(filePath, file);

          if (!uploadErr) {
            const { data } = supabase.storage.from('testimonials').getPublicUrl(filePath);
            uploadedImageUrl = data.publicUrl;
          }
        }
      }

      const selectedProduct = products.find((p) => p.id === productId);

      const newTestimonial = {
        clientName: 'Cliente Vérifiée',
        city: city.trim() || 'Cotonou, Bénin',
        rating,
        content: content.trim(),
        productName: selectedProduct?.name,
        productId: selectedProduct?.id,
        avatarUrl: uploadedImageUrl,
        photoUrl: uploadedImageUrl,
        isVisible: false, // Pending moderation!
        status: 'pending' as const,
        isDemo: false,
      };

      // Try inserting into Supabase
      if (supabase) {
        try {
          await supabase.from('testimonials').insert({
            client_name: newTestimonial.clientName,
            city: newTestimonial.city,
            rating: newTestimonial.rating,
            content: newTestimonial.content,
            product_name: newTestimonial.productName,
            avatar_url: uploadedImageUrl,
            is_visible: false,
          });
        } catch (dbErr) {
          console.warn('Could not save review directly to Supabase, fallback to store', dbErr);
        }
      }

      // Add to store
      addTestimonial(newTestimonial);
      localStorage.setItem('delaafro_last_review_ts', now.toString());

      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setError(null);
    setClientName('');
    setCity('');
    setContent('');
    setFile(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brun-nuit/80 backdrop-blur-sm"
            onClick={handleResetAndClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-3xl bg-creme-light p-6 sm:p-8 shadow-2xl border border-or/40 z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 p-2 rounded-full text-brun-nuit/60 hover:text-brun-nuit hover:bg-sable/30 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-feuille/20 text-feuille mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="card-title text-2xl font-bold text-brun-nuit">
                  Merci pour votre confiance !
                </h3>
                <p className="prose-body text-base text-brun-nuit/85 max-w-sm mx-auto leading-relaxed">
                  Votre avis a bien été enregistré. Il sera publié sur le site dès validation par notre équipe DELAAFRO.
                </p>
                <div className="pt-4">
                  <Button variant="terracotta" onClick={handleResetAndClose}>
                    Fermer
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="eyebrow text-xs text-cuivre block">
                    Votre Expérience
                  </span>
                  <h3 className="card-title text-2xl font-bold text-brun-nuit">
                    Laisser un avis sur vos soins
                  </h3>
                  <p className="card-text text-sm sm:text-base text-brun-nuit/75 mt-1">
                    Partagez votre ressenti sur vos rituels capillaires DELAAFRO.
                  </p>
                </div>

                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {error && (
                  <div className="p-3 rounded-xl bg-terracotta/10 border border-terracotta/30 text-xs text-terracotta-deep flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-semibold text-brun-nuit mb-1.5">
                    Votre note globale *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-or transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-or text-or' : 'text-sable fill-sable/20'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-brun-nuit ml-2">{rating} / 5</span>
                  </div>
                </div>

                {/* City & Anonymous Notice (Sans noms de personnes) */}
                <div>
                  <label className="block text-xs font-semibold text-brun-nuit mb-1">
                    Votre ville ou quartier au Bénin (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Cotonou, Abidjan, Paris, Lomé, Dakar..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sable bg-white text-xs text-brun-nuit focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                  <p className="text-[11px] text-brun-nuit/55 mt-1">
                    🔒 Pour préserver votre anonymat, votre avis est publié sous l'intitulé <strong>« Cliente Vérifiée »</strong>.
                  </p>
                </div>

                {/* Product selection */}
                <div>
                  <label className="block text-xs font-semibold text-brun-nuit mb-1">
                    Produit ou Gamme utilisé(e)
                  </label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sable bg-white text-xs text-brun-nuit focus:outline-none focus:ring-2 focus:ring-terracotta"
                  >
                    <option value="">Sélectionnez un produit...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Review content */}
                <div>
                  <label className="block text-xs font-semibold text-brun-nuit mb-1">
                    Votre avis détaillé *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Qu'avez-vous pensé de la texture, du parfum, de l'hydratation et du résultat sur vos cheveux ?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sable bg-white text-xs text-brun-nuit focus:outline-none focus:ring-2 focus:ring-terracotta resize-none"
                  />
                </div>

                {/* Photo upload (optional) */}
                <div>
                  <label className="block text-xs font-semibold text-brun-nuit mb-1">
                    Photo de vos cheveux ou du soin (optionnel, max 2 Mo)
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-sable hover:border-terracotta bg-white cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-cuivre shrink-0" />
                    <span className="text-xs text-brun-nuit/70 truncate">
                      {file ? file.name : 'Choisir une image (JPG, PNG, WebP)...'}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="terracotta"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

