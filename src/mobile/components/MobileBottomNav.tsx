import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, BookOpen, MessageCircle } from 'lucide-react';

interface TabItem {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: 'accueil', name: 'Accueil', path: '/', icon: Home },
  { id: 'boutique', name: 'Boutique', path: '/nos-gammes', icon: Sparkles },
  { id: 'conseils', name: 'Conseils', path: '/ma-routine', icon: BookOpen },
  { id: 'contact', name: 'Contact', path: '/contact', icon: MessageCircle },
];

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  // Hidden on product page, cart page, and confirmation page
  const shouldHide =
    location.pathname.startsWith('/produit/') ||
    location.pathname === '/panier' ||
    location.pathname === '/confirmation-commande';

  if (shouldHide) return null;

  return (
    <nav
      aria-label="Navigation principale mobile"
      className="fixed bottom-0 left-0 right-0 z-40 bg-creme/95 backdrop-blur-md border-t border-sable/50 shadow-[0_-4px_20px_rgba(42,20,9,0.08)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="h-16 max-w-lg mx-auto flex items-center justify-around px-2">
        {TABS.map((tab) => {
          const isActive =
            tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path) ||
                (tab.id === 'boutique' && location.pathname.startsWith('/boutique'));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none active:scale-95 ${
                isActive ? 'text-terracotta' : 'text-brun-nuit/55 hover:text-brun-nuit/80'
              }`}
            >
              {/* Active Tab Glow / Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabIndicator"
                  className="absolute top-1 w-8 h-1 rounded-full bg-terracotta"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />

              <span
                className={`text-[10px] tracking-wide mt-1 font-semibold ${
                  isActive ? 'font-bold text-terracotta' : 'text-brun-nuit/60'
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
