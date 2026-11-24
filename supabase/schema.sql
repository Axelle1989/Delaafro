-- ==============================================================================
-- DELAAFRO — Schéma Supabase Postgres & Politiques RLS
-- Marque béninoise de soins capillaires naturels pour cheveux crépus
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES CATÉGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE DES PRODUITS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('gamme', 'soin', 'accessoire')),
    category_label TEXT,
    subtitle TEXT,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    composition TEXT[],
    benefits TEXT[] NOT NULL DEFAULT '{}',
    usage_instructions TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    original_price NUMERIC CHECK (original_price IS NULL OR original_price >= price),
    images TEXT[] NOT NULL DEFAULT '{}',
    variants JSONB DEFAULT '[]'::jsonb,
    badge TEXT CHECK (badge IS NULL OR badge IN ('Nouveau', 'Best-seller', 'Promo', 'Coup de Cœur')),
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    in_stock BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE DES TÉMOIGNAGES
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    city TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    product_name TEXT,
    avatar_url TEXT,
    photo_url TEXT,
    hair_type TEXT,
    usage_duration TEXT,
    video_url TEXT,
    video_poster_url TEXT,
    video_source TEXT,
    video_duration TEXT,
    status TEXT DEFAULT 'approved',
    is_visible BOOLEAN DEFAULT true NOT NULL,
    is_demo BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE DES PARAMÈTRES GÉNÉRAUX & WHATSAPP
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TRIGGER AUTOMATIQUE POUR UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_products_updated
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Politiques Categories :
-- Lecture publique autorisée pour tous
CREATE POLICY "Categories are readable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- Écriture réservée aux utilisateurs authentifiés (admin)
CREATE POLICY "Categories are editable by authenticated users"
    ON public.categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politiques Products :
-- Tout le monde peut voir les produits publiés
CREATE POLICY "Published products are readable by everyone"
    ON public.products FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

-- L'admin authentifié a tous les droits (insertion, modification, suppression)
CREATE POLICY "Products are editable by authenticated admin"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politiques Testimonials :
-- Tout le monde peut lire les témoignages visibles
CREATE POLICY "Visible testimonials are readable by everyone"
    ON public.testimonials FOR SELECT
    USING (is_visible = true OR auth.role() = 'authenticated');

CREATE POLICY "Testimonials are editable by authenticated admin"
    ON public.testimonials FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politiques Settings :
-- Lecture publique autorisée
CREATE POLICY "Settings are readable by everyone"
    ON public.settings FOR SELECT
    USING (true);

CREATE POLICY "Settings are editable by authenticated admin"
    ON public.settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 8. BUCKET SUPABASE STORAGE POUR LES IMAGES ET VIDÉOS
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-videos', 'testimonial-videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Products Bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

CREATE POLICY "Public Access Testimonial Videos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'testimonial-videos');

CREATE POLICY "Authenticated users can upload to Products Bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload to Testimonial Videos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'testimonial-videos');

CREATE POLICY "Authenticated users can update/delete in Products Bucket"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can update/delete in Testimonial Videos"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'testimonial-videos');

