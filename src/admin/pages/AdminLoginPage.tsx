import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isDemoMode } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set noindex, nofollow for search engines
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', 'noindex, nofollow');

    return () => {
      metaTag?.setAttribute('content', 'index, follow');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brun-nuit via-brun-nuit-light to-brun-nuit flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-creme rounded-3xl p-8 sm:p-10 shadow-2xl border border-or/40 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" variant="gold" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brun-nuit pt-2">
            Connexion Administration
          </h1>
          <p className="text-xs text-brun-nuit/70">
            Accédez à la gestion des soins, commandes WhatsApp et réglages de DELAAFRO.
          </p>
        </div>

        {/* Demo Notice only when offline / no supabase */}
        {isDemoMode && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold text-amber-800">
              Serveur Supabase non détecté (Mode Local)
            </p>
            <p className="text-amber-800/80">
              Saisissez n'importe quel email valide et un mot de passe de 6 caractères minimum pour tester le tableau de bord.
            </p>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-100 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brun-nuit/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@delaafro.com"
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-sable bg-white text-brun-nuit focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brun-nuit/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm pl-10 pr-11 py-3 rounded-2xl border border-sable bg-white text-brun-nuit focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brun-nuit/40 hover:text-brun-nuit p-1"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="terracotta"
              size="lg"
              className="w-full justify-center shadow-terracotta-glow"
              disabled={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
