import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDemoMode = !isSupabaseConfigured;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (isSupabaseConfigured) return false;
    return localStorage.getItem('delaafro_admin_auth') === 'true';
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(isSupabaseConfigured);
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (isSupabaseConfigured) return null;
    return localStorage.getItem('delaafro_admin_email') || null;
  });

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
          localStorage.setItem('delaafro_admin_auth', 'true');
          if (session.user.email) localStorage.setItem('delaafro_admin_email', session.user.email);
        } else {
          setIsAuthenticated(false);
          setUserEmail(null);
          localStorage.removeItem('delaafro_admin_auth');
          localStorage.removeItem('delaafro_admin_email');
        }
        setIsAuthLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
          localStorage.setItem('delaafro_admin_auth', 'true');
          if (session.user.email) localStorage.setItem('delaafro_admin_email', session.user.email);
        } else {
          setIsAuthenticated(false);
          setUserEmail(null);
          localStorage.removeItem('delaafro_admin_auth');
          localStorage.removeItem('delaafro_admin_email');
        }
        setIsAuthLoading(false);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (error) {
          console.error('[AdminAuth] Supabase login error:', error);
          return {
            success: false,
            error: `Erreur Supabase : ${error.message}`,
          };
        }

        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email || email);
          localStorage.setItem('delaafro_admin_auth', 'true');
          localStorage.setItem('delaafro_admin_email', email);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Erreur de connexion Supabase' };
      }
    }

    // Only if Supabase is strictly NOT configured (offline / local prototype)
    if (!isSupabaseConfigured) {
      if (email.includes('@') && pass.length >= 6) {
        setIsAuthenticated(true);
        setUserEmail(email);
        localStorage.setItem('delaafro_admin_auth', 'true');
        localStorage.setItem('delaafro_admin_email', email);
        return { success: true };
      }
      return { success: false, error: 'Veuillez saisir un email valide et un mot de passe (6 car. min).' };
    }

    return { success: false, error: 'Identifiants invalides.' };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('delaafro_admin_auth');
    localStorage.removeItem('delaafro_admin_email');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        userEmail,
        login,
        logout,
        isDemoMode,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

