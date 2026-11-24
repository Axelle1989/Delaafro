-- ==============================================================================
-- MIGRATION: 20261113_add_video_testimonials.sql
-- Description: Ajout des champs vidéo pour les témoignages clientes
--              et création du bucket de stockage 'testimonial-videos'
-- ==============================================================================

-- 1. Ajout des colonnes vidéo et compléments sur public.testimonials
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS hair_type TEXT,
  ADD COLUMN IF NOT EXISTS usage_duration TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS video_poster_url TEXT,
  ADD COLUMN IF NOT EXISTS video_source TEXT,
  ADD COLUMN IF NOT EXISTS video_duration TEXT;

-- 2. Index pour accélérer le filtrage des vidéos visibles
CREATE INDEX IF NOT EXISTS idx_testimonials_video_visible
  ON public.testimonials (is_visible, created_at DESC)
  WHERE video_url IS NOT NULL;

-- 3. Création du bucket de stockage public 'testimonial-videos'
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-videos', 'testimonial-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Politiques RLS pour le bucket 'testimonial-videos'
-- Lecture publique de toutes les vidéos
CREATE POLICY "Public Access Testimonial Videos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'testimonial-videos');

-- Insertion réservée aux administrateurs authentifiés
CREATE POLICY "Authenticated admins can upload Testimonial Videos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'testimonial-videos');

-- Modification / suppression réservée aux administrateurs authentifiés
CREATE POLICY "Authenticated admins can update/delete Testimonial Videos"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'testimonial-videos');
