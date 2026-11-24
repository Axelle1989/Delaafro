import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';

// Mobile Architecture
import { useIsMobile } from '@/hooks/useIsMobile';
import { MobileLayout } from '@/mobile/layout/MobileLayout';
import { MobileHomePage } from '@/mobile/pages/MobileHomePage';
import { MobileProductPage } from '@/mobile/pages/MobileProductPage';
import { MobileCartPage } from '@/mobile/pages/MobileCartPage';
import { MobileConfirmationPage } from '@/mobile/pages/MobileConfirmationPage';

// Public Desktop Layout & Components
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { useSettingsStore, initRealtimeSync } from '@/store/useSettingsStore';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { RangesPage } from '@/pages/RangesPage';
import { AccessoriesPage } from '@/pages/AccessoriesPage';
import { RoutinePage } from '@/pages/RoutinePage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { TestimonialsPage } from '@/pages/TestimonialsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Admin
import { AdminAuthProvider, useAdminAuth } from '@/admin/context/AdminAuthContext';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { AdminLoginPage } from '@/admin/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/admin/pages/AdminDashboardPage';
import { AdminProductsPage } from '@/admin/pages/AdminProductsPage';
import { AdminProductEditPage } from '@/admin/pages/AdminProductEditPage';
import { AdminTestimonialsPage } from '@/admin/pages/AdminTestimonialsPage';
import { AdminSettingsPage } from '@/admin/pages/AdminSettingsPage';

// Scroll To Top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route Guard for Admin
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Public Layout Wrapper (Adaptive: MobileLayout on < 1024px, Desktop Layout on >= 1024px)
function PublicLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
}

export function App() {
  const isMobile = useIsMobile();

  // Synchronisation backend Supabase & Realtime
  useEffect(() => {
    useSettingsStore.getState().fetchFromBackend();
    const unsubscribe = initRealtimeSync();
    return () => {
      unsubscribe();
    };
  }, []);

  // Initialize Lenis Smooth Scroll ONLY on desktop non-touch devices
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileScreen = window.matchMedia('(max-width: 1023px)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReducedMotion || isMobileScreen || isTouch) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                {isMobile ? <MobileHomePage /> : <HomePage />}
              </PublicLayout>
            }
          />
          <Route
            path="/boutique"
            element={
              <PublicLayout>
                <ShopPage />
              </PublicLayout>
            }
          />
          <Route
            path="/nos-gammes"
            element={
              <PublicLayout>
                <RangesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/accessoires"
            element={
              <PublicLayout>
                <AccessoriesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/ma-routine"
            element={
              <PublicLayout>
                <RoutinePage />
              </PublicLayout>
            }
          />
          <Route
            path="/livraison"
            element={<Navigate to="/contact" replace />}
          />
          <Route
            path="/produit/:slug"
            element={
              isMobile ? (
                <MobileProductPage />
              ) : (
                <PublicLayout>
                  <ProductDetailPage />
                </PublicLayout>
              )
            }
          />
          <Route
            path="/panier"
            element={
              isMobile ? (
                <MobileCartPage />
              ) : (
                <Navigate to="/boutique" replace />
              )
            }
          />
          <Route
            path="/confirmation-commande"
            element={<MobileConfirmationPage />}
          />
          <Route
            path="/a-propos"
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />
          <Route
            path="/elles-ont-sublime-leur-afro"
            element={
              <PublicLayout>
                <TestimonialsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/temoignages"
            element={<Navigate to="/elles-ont-sublime-leur-afro" replace />}
          />
          <Route
            path="/avis"
            element={<Navigate to="/elles-ont-sublime-leur-afro" replace />}
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="produits" element={<AdminProductsPage />} />
            <Route path="produits/nouveau" element={<AdminProductEditPage />} />
            <Route path="produits/:id" element={<AdminProductEditPage />} />
            <Route path="temoignages" element={<AdminTestimonialsPage />} />
            <Route path="reglages" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFoundPage />
              </PublicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;
