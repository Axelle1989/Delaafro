import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Check,
  Loader2,
  Link2,
  Package,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SiteImages } from '@/types';
import {
  DEFAULT_SITE_IMAGES,
  SITE_IMAGE_SECTIONS,
  getSiteImage,
} from '@/lib/siteImages';
import { uploadImageToStorage } from '@/lib/imageUpload';
import { Button } from '@/components/common/Button';

export const AdminMediaPage: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [uploadingKey, setUploadingKey] = useState<keyof SiteImages | null>(null);
  const [urlDrafts, setUrlDrafts] = useState<Partial<Record<keyof SiteImages, string>>>({});
  const fileInputRefs = useRef<Partial<Record<keyof SiteImages, HTMLInputElement | null>>>({});

  const saveImage = async (key: keyof SiteImages, url: string) => {
    const nextSiteImages: Partial<SiteImages> = {
      ...(settings.siteImages || {}),
      [key]: url,
    };
    await updateSettings({ siteImages: nextSiteImages });
  };

  const handleFileChange = async (key: keyof SiteImages, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadingKey(key);
    try {
      const publicUrl = await uploadImageToStorage(file, 'site');
      await saveImage(key, publicUrl);
      toast.success('Photo mise à jour et synchronisée sur le site !');
    } catch (err: any) {
      toast.error(err?.message || "Impossible d'envoyer l'image.");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleApplyUrl = async (key: keyof SiteImages) => {
    const draft = (urlDrafts[key] || '').trim();
    if (!draft) {
      toast.error('Collez une URL ou un chemin d’image valide.');
      return;
    }
    setUploadingKey(key);
    try {
      await saveImage(key, draft);
      setUrlDrafts((prev) => ({ ...prev, [key]: '' }));
      toast.success('URL de photo enregistrée sur le site !');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleResetSlot = async (key: keyof SiteImages) => {
    const nextSiteImages: Partial<SiteImages> = { ...(settings.siteImages || {}) };
    delete nextSiteImages[key];
    await updateSettings({ siteImages: nextSiteImages });
    toast.success('Photo d’origine restaurée.');
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-cuivre">
            Médiathèque & Visuels
          </span>
          <h1 className="font-serif text-3xl font-bold text-brun-nuit mt-1">
            Photos du Site Vitrine
          </h1>
          <p className="text-xs sm:text-sm text-brun-nuit/70 mt-1">
            Changez n’importe quelle photo du site (accueil, gammes, à propos, routine, panier, chatbot).
            Les changements sont enregistrés dans Supabase et visibles partout immédiatement.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/produits">
            <Button variant="outline" size="sm" leftIcon={<Package className="w-4 h-4" />}>
              Photos Produits
            </Button>
          </Link>
          <Link to="/admin/temoignages">
            <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
              Photos Témoignages
            </Button>
          </Link>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {SITE_IMAGE_SECTIONS.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-sable/60 space-y-6"
          >
            <div className="border-b border-sable/40 pb-4">
              <h2 className="font-serif text-xl font-bold text-brun-nuit flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-terracotta shrink-0" />
                <span>{section.title}</span>
              </h2>
              <p className="text-xs text-brun-nuit/65 mt-1">{section.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.slots.map((slot) => {
                const currentSrc = getSiteImage(settings, slot.key);
                const isCustom =
                  Boolean(settings.siteImages?.[slot.key]) &&
                  settings.siteImages?.[slot.key] !== DEFAULT_SITE_IMAGES[slot.key];
                const isBusy = uploadingKey === slot.key;

                return (
                  <div
                    key={slot.key}
                    className="rounded-2xl border border-sable/70 bg-creme/20 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Preview */}
                    <div className="relative aspect-[4/3] bg-brun-nuit/10 overflow-hidden">
                      <img
                        src={currentSrc}
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brun-nuit/80 text-creme-light backdrop-blur-sm">
                        {slot.location}
                      </span>
                      {isCustom && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                          Personnalisée
                        </span>
                      )}
                      {isBusy && (
                        <div className="absolute inset-0 bg-brun-nuit/60 flex flex-col items-center justify-center text-white gap-2 text-xs font-semibold">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Envoi en cours...</span>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-serif font-bold text-sm text-brun-nuit">
                        {slot.label}
                      </h3>

                      <input
                        ref={(el) => {
                          fileInputRefs.current[slot.key] = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={(e) => handleFileChange(slot.key, e)}
                        className="hidden"
                      />

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="terracotta"
                          size="sm"
                          disabled={isBusy}
                          onClick={() => fileInputRefs.current[slot.key]?.click()}
                          leftIcon={<Upload className="w-3.5 h-3.5" />}
                          className="flex-1 justify-center"
                        >
                          Importer une photo
                        </Button>

                        {isCustom && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleResetSlot(slot.key)}
                            title="Remettre la photo d'origine"
                            className="p-2 rounded-xl border border-sable text-brun-nuit/70 hover:text-terracotta hover:bg-white transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Optional direct URL paste */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <div className="relative flex-1">
                          <Link2 className="w-3.5 h-3.5 text-brun-nuit/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={urlDrafts[slot.key] || ''}
                            onChange={(e) =>
                              setUrlDrafts((prev) => ({ ...prev, [slot.key]: e.target.value }))
                            }
                            placeholder="Ou coller une URL..."
                            className="w-full text-[11px] pl-8 pr-2 py-1.5 rounded-lg border border-sable bg-white focus:outline-none focus:border-terracotta"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={isBusy || !(urlDrafts[slot.key] || '').trim()}
                          onClick={() => handleApplyUrl(slot.key)}
                          title="Appliquer cette URL"
                          className="p-1.5 rounded-lg bg-brun-nuit text-creme-light hover:bg-terracotta disabled:opacity-40 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
