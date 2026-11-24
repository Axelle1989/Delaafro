import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

export const MobileFloatingWhatsApp: React.FC = () => {
  const { settings } = useSettingsStore();
  const location = useLocation();

  // Hide on checkout/cart/confirmation to prevent obstruction
  const shouldHide =
    location.pathname === '/panier' ||
    location.pathname === '/confirmation-commande';

  if (shouldHide) return null;

  const whatsAppUrl = buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber);

  return (
    <aside
      aria-label="Conseil WhatsApp DELAAFRO"
      className="fixed right-4 bottom-20 z-30"
    >
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter une conseillère DELAAFRO sur WhatsApp"
        className="w-[52px] h-[52px] rounded-full bg-[#2F6B4F] text-[#FAF3EA] flex items-center justify-center shadow-md hover:scale-105 active:scale-90 transition-transform relative group"
      >
        <MessageCircle className="w-6 h-6 stroke-[1.8]" />

        {/* Small live badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FAF3EA] border border-[#2F6B4F]" />
        </span>
      </a>
    </aside>
  );
};
