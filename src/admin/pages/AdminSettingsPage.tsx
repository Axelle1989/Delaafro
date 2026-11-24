import React, { useState } from 'react';
import {
  Save,
  MessageCircle,
  Sparkles,
  Share2,
  Clock,
  Truck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/common/Button';
import { SiteSettings } from '@/types';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useSettingsStore();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    showToast('Paramètres mis à jour avec succès !');
  };

  const handleReset = () => {
    if (confirm('Voulez-vous vraiment réinitialiser les réglages aux valeurs d’origine ?')) {
      resetToDefaults();
      setFormData(useSettingsStore.getState().settings);
      showToast('Paramètres réinitialisés');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brun-nuit text-creme-light px-6 py-3 rounded-2xl shadow-2xl border border-or/40 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-cuivre">
            Configuration
          </span>
          <h1 className="font-serif text-3xl font-bold text-brun-nuit mt-1">
            Réglages Généraux & WhatsApp
          </h1>
          <p className="text-xs sm:text-sm text-brun-nuit/70">
            Ajustez le numéro de commande WhatsApp, les annonces et les liens de contact.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Réinitialiser
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* WhatsApp Channel Config */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-sable/60 space-y-5">
          <div className="flex items-center gap-3 border-b border-sable/30 pb-3">
            <div className="p-2 rounded-xl bg-[#25D366]/20 text-[#25D366]">
              <MessageCircle className="w-5 h-5 fill-current/20" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-brun-nuit">
                Numéro WhatsApp Récepteur des Commandes
              </h3>
              <p className="text-xs text-brun-nuit/60">
                Numéro utilisé pour tous les boutons "Commander sur WhatsApp" et le panier.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Numéro brut avec indicatif pays (sans espaces ni signe +) *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="22945483473"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 font-mono"
              />
              <p className="text-[10px] text-brun-nuit/60">Format standard wa.me : 22945483473</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Numéro affiché aux clientes *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappDisplayNumber}
                onChange={(e) => handleChange('whatsappDisplayNumber', e.target.value)}
                placeholder="+229 45 48 34 73"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar & Hero Texts */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-sable/60 space-y-5">
          <div className="flex items-center gap-3 border-b border-sable/30 pb-3">
            <div className="p-2 rounded-xl bg-or/20 text-or-dark">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-brun-nuit">
                Textes du Hero (Accueil)
              </h3>
              <p className="text-xs text-brun-nuit/60">
                Badge, titre et sous-titre affichés sur le carrousel principal.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Badge du Hero
                </label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => handleChange('heroBadge', e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Slogan / Titre Hero
                </label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Sous-titre descriptif du Hero
              </label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-sable/60 space-y-5">
          <div className="flex items-center gap-3 border-b border-sable/30 pb-3">
            <div className="p-2 rounded-xl bg-terracotta/20 text-terracotta">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-brun-nuit">
                Réseaux Sociaux
              </h3>
              <p className="text-xs text-brun-nuit/60">
                Liens affichés dans le pied de page et les boutons de partage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E1306C]" />
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://www.instagram.com/delaafro_"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1877F2]" />
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://www.facebook.com/dela.afro/"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E60023]" />
                Pinterest URL
              </label>
              <input
                type="url"
                value={formData.pinterestUrl}
                onChange={(e) => handleChange('pinterestUrl', e.target.value)}
                placeholder="https://www.pinterest.com/DelaAfro/"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFFC00] border border-black/20" />
                Snapchat URL
              </label>
              <input
                type="url"
                value={formData.snapchatUrl}
                onChange={(e) => handleChange('snapchatUrl', e.target.value)}
                placeholder="https://www.snapchat.com/@delaeliiiiii"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Delivery Notice */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-sable/60 space-y-5">
          <div className="flex items-center gap-3 border-b border-sable/30 pb-3">
            <div className="p-2 rounded-xl bg-feuille/20 text-feuille">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-brun-nuit">
                Disponibilité & Livraison Internationale
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Horaires d'ouverture service client
              </label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Information livraison (Bénin & International)
              </label>
              <input
                type="text"
                value={formData.deliveryNotice}
                onChange={(e) => handleChange('deliveryNotice', e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="terracotta"
            size="lg"
            leftIcon={<Save className="w-5 h-5" />}
            className="shadow-terracotta-glow"
          >
            Enregistrer tous les réglages
          </Button>
        </div>
      </form>
    </div>
  );
};

