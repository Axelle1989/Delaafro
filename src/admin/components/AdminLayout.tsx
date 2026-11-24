import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Logo } from '@/components/common/Logo';

export const AdminLayout: React.FC = () => {
  const { userEmail, logout, isDemoMode } = useAdminAuth();
  const { testimonials } = useSettingsStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingCount = testimonials.filter(
    (t) => t.status === 'pending' || (!t.isVisible && t.status !== 'hidden')
  ).length;

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Tableau de bord', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Produits', path: '/admin/produits', icon: <Package className="w-5 h-5" /> },
    { name: 'Nouveau Produit', path: '/admin/produits/nouveau', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Témoignages', path: '/admin/temoignages', icon: <MessageSquare className="w-5 h-5" />, badge: pendingCount },
    { name: 'Réglages & WhatsApp', path: '/admin/reglages', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F5] text-brun-nuit flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-brun-nuit text-creme-light border-b border-cuivre/20">
        <Logo size="sm" variant="light" showSubtitle={false} />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-creme hover:text-white"
          aria-label="Toggle admin navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col justify-between w-full md:w-64 bg-brun-nuit text-creme-light p-6 md:min-h-screen shrink-0 border-r border-cuivre/20 z-20`}
      >
        <div className="space-y-8">
          {/* Logo / Admin Header */}
          <div className="hidden md:block">
            <Logo size="md" variant="light" />
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-or bg-or/15 px-2.5 py-1 rounded-full border border-or/30">
                Espace Gestion
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl text-xs uppercase font-semibold tracking-wider transition-all ${
                    isActive
                      ? 'bg-terracotta text-white shadow-terracotta-glow'
                      : 'text-sable/80 hover:bg-brun-nuit-light hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-brun-nuit">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile & External Store Link */}
        <div className="pt-6 border-t border-cuivre/20 space-y-4">
          {/* Storage / Supabase status */}
          <div className="px-3 py-2 rounded-xl bg-brun-nuit-light/80 border border-cuivre/15 flex items-center gap-2 text-[11px]">
            <Database className={`w-3.5 h-3.5 ${isDemoMode ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="text-sable/70 truncate">
              {isDemoMode ? 'Mode Local / Démo' : 'Connecté Supabase'}
            </span>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-sable hover:text-or transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Voir le site public
            </span>
            <span className="text-[10px] text-sable/50">↗</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-cuivre/10">
            <div className="truncate pr-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-or">Connecté</p>
              <p className="text-xs text-sable truncate max-w-[130px]">{userEmail || 'Admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="p-2 text-sable/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

