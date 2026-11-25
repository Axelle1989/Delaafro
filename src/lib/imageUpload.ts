import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export async function uploadImageToStorage(
  file: File,
  folder: 'site' | 'products' = 'site'
): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Format non supporté. Utilisez JPG, PNG, WebP ou AVIF.');
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Image trop lourde (maximum 5 Mo).');
  }

  // Upload vers Supabase Storage (bucket public "products")
  if (isSupabaseConfigured && supabase) {
    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const baseName = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';

    const filePath = `${folder}/${Date.now()}-${baseName}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Erreur upload Supabase Storage : ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
    if (!data?.publicUrl) {
      throw new Error("Impossible d'obtenir l'URL publique de l'image.");
    }
    return data.publicUrl;
  }

  // Fallback local/démo (sans Supabase) : Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Impossible de lire le fichier image.'));
    reader.readAsDataURL(file);
  });
}
