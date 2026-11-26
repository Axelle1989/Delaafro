import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useI18n } from '@/context/I18nContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/common/Button';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { products, addTestimonial } = useSettingsStore();
  const { t, translateProductName } = useI18n();

  const [city, setCity] = useState('');
  const [productId, setProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (honeypot.trim() !== '') {
      setIsSuccess(true);
      return;
    }

    const lastSubmit = localStorage.getItem('delaafro_last_review_ts');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit, 10) < 60000) {
      setError(t('modal.errRateLimit'));
      return;
    }

    if (!content.trim()) {
      setError(t('modal.errEmpty'));
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageUrl: string | undefined = undefined;

      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          setError(t('modal.errFileSize'));
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
        isVisible: false,
        status: 'pending' as const,
        isDemo: false,
      };

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

      addTestimonial(newTestimonial);
      localStorage.setItem('delaafro_last_review_ts', now.toString());

      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || t('modal.errGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setError(null);
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
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={handleResetAndClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('modal.reviewTitle')}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-[24px] bg-[var(--card)] text-[var(--text)] p-6 sm:p-8 shadow-2xl border border-[var(--border)] z-10 overflow-hidden max-h-[90vh] overflow-y-auto theme-surface"
          >
            <button
              type="button"
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={t('modal.close')}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-feuille/20 text-feuille mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--text)]">
                  {t('modal.successTitle')}
                </h3>
                <p className="text-base text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  {t('modal.successBody')}
                </p>
                <div className="pt-4">
                  <Button variant="terracotta" onClick={handleResetAndClose}>
                    {t('modal.close')}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-text)] block">
                    {t('modal.reviewEyebrow')}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[var(--text)] mt-1">
                    {t('modal.reviewTitle')}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {t('modal.reviewSubtitle')}
                  </p>
                </div>

                {/* Honeypot */}
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
                  <div className="p-3 rounded-xl bg-[var(--accent)]/12 border border-[var(--accent)]/35 text-xs text-[var(--accent-text)] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Rating */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                    {t('modal.ratingLabel')}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        aria-label={t('quote.ratingAria', { rating: star })}
                        className="p-1 text-[var(--gold)] transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-current' : 'opacity-25'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[var(--text)] ml-2">{rating} / 5</span>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    {t('modal.cityLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('modal.cityPlaceholder')}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] placeholder:text-[var(--text-secondary)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    🔒 {t('modal.privacyNotice')}
                  </p>
                </div>

                {/* Product */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    {t('modal.productLabel')}
                  </label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="">{t('modal.productPlaceholder')}</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {translateProductName(p.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    {t('modal.commentLabel')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={t('modal.commentPlaceholder')}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] placeholder:text-[var(--text-secondary)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    {t('modal.photoLabel')}
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 hover:border-[var(--accent)] cursor-pointer transition-colors text-xs text-[var(--text-secondary)]">
                    <Upload className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      {file ? t('modal.photoSelected', { name: file.name }) : t('modal.photoUploadCta')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#FBF5EC] text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {isSubmitting ? t('modal.submitting') : t('modal.submit')}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
