import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Testimonial, SiteSettings } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_TESTIMONIALS } from '@/lib/demoData';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface SiteStoreState {
  settings: SiteSettings;
  products: Product[];
  testimonials: Testimonial[];
  isLoading: boolean;
  
  // Settings actions
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  
  // Product actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (orderedIds: string[]) => Promise<void>;
  
  // Testimonial actions
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt'>) => Promise<Testimonial>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  
  // Sync
  fetchFromBackend: () => Promise<void>;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SiteStoreState>()(
  persist<SiteStoreState, any>(
    (set, get) => ({
      settings: INITIAL_SETTINGS,
      products: INITIAL_PRODUCTS,
      testimonials: INITIAL_TESTIMONIALS,
      isLoading: false,

      updateSettings: async (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));

        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.from('settings').upsert({
              key: 'main',
              value: get().settings,
              updated_at: new Date().toISOString(),
            });
          } catch (err) {
            console.error('Failed to sync settings with Supabase:', err);
          }
        }
      },

      setProducts: (products) => set({ products }),

      addProduct: async (productData) => {
        const id = `prod-${Date.now()}`;
        const newProduct: Product = {
          ...productData,
          id,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          products: [newProduct, ...state.products],
        }));

        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.from('products').insert([
              {
                id: newProduct.id,
                name: newProduct.name,
                slug: newProduct.slug,
                category: newProduct.category,
                category_label: newProduct.categoryLabel,
                subtitle: newProduct.subtitle,
                short_description: newProduct.shortDescription,
                long_description: newProduct.longDescription,
                composition: newProduct.composition,
                benefits: newProduct.benefits,
                usage_instructions: newProduct.usageInstructions,
                price: newProduct.price,
                original_price: newProduct.originalPrice,
                images: newProduct.images,
                variants: newProduct.variants,
                badge: newProduct.badge,
                is_featured: newProduct.isFeatured,
                is_published: newProduct.isPublished,
                in_stock: newProduct.inStock,
                display_order: newProduct.displayOrder,
              },
            ]);
          } catch (err) {
            console.error('Failed to insert product in Supabase:', err);
          }
        }

        return newProduct;
      },

      updateProduct: async (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));

        if (isSupabaseConfigured && supabase) {
          try {
            const dbUpdates: Record<string, any> = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
            if (updates.category !== undefined) dbUpdates.category = updates.category;
            if (updates.categoryLabel !== undefined) dbUpdates.category_label = updates.categoryLabel;
            if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle;
            if (updates.price !== undefined) dbUpdates.price = updates.price;
            if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
            if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
            if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;
            if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
            if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
            if (updates.longDescription !== undefined) dbUpdates.long_description = updates.longDescription;
            if (updates.composition !== undefined) dbUpdates.composition = updates.composition;
            if (updates.benefits !== undefined) dbUpdates.benefits = updates.benefits;
            if (updates.usageInstructions !== undefined) dbUpdates.usage_instructions = updates.usageInstructions;
            if (updates.images !== undefined) dbUpdates.images = updates.images;
            if (updates.variants !== undefined) dbUpdates.variants = updates.variants;
            if (updates.badge !== undefined) dbUpdates.badge = updates.badge;
            if (updates.displayOrder !== undefined) dbUpdates.display_order = updates.displayOrder;

            await supabase.from('products').update(dbUpdates).eq('id', id);
          } catch (err) {
            console.error('Failed to update product in Supabase:', err);
          }
        }
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.from('products').delete().eq('id', id);
          } catch (err) {
            console.error('Failed to delete product in Supabase:', err);
          }
        }
      },

      reorderProducts: async (orderedIds: string[]) => {
        set((state) => {
          const map = new Map<string, Product>(state.products.map((p) => [p.id, p]));
          const reordered: Product[] = [];
          orderedIds.forEach((id: string, index: number) => {
            const prod = map.get(id);
            if (prod) {
              reordered.push({ ...prod, displayOrder: index });
              map.delete(id);
            }
          });
          map.forEach((prod) => reordered.push(prod));
          return { products: reordered };
        });
      },

      addTestimonial: async (testimonialData) => {
        const id = `testi-${Date.now()}`;
        const newTestimonial: Testimonial = {
          ...testimonialData,
          id,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          testimonials: [newTestimonial, ...state.testimonials],
        }));

        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.from('testimonials').insert([
              {
                id: newTestimonial.id,
                client_name: newTestimonial.clientName,
                city: newTestimonial.city,
                rating: newTestimonial.rating,
                content: newTestimonial.content,
                product_name: newTestimonial.productName,
                product_id: newTestimonial.productId,
                avatar_url: newTestimonial.avatarUrl,
                photo_url: newTestimonial.photoUrl,
                hair_type: newTestimonial.hairType,
                usage_duration: newTestimonial.usageDuration,
                video_url: newTestimonial.videoUrl,
                video_poster_url: newTestimonial.videoPosterUrl,
                video_source: newTestimonial.videoSource,
                video_duration: newTestimonial.videoDuration,
                status: newTestimonial.status || 'approved',
                is_visible: newTestimonial.isVisible,
                is_demo: newTestimonial.isDemo,
              },
            ]);
          } catch (err) {
            console.error('Failed to insert testimonial in Supabase:', err);
          }
        }

        return newTestimonial;
      },

      updateTestimonial: async (id, updates) => {
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));

        if (isSupabaseConfigured && supabase) {
          try {
            const dbUpdates: Record<string, any> = {};
            if (updates.clientName !== undefined) dbUpdates.client_name = updates.clientName;
            if (updates.city !== undefined) dbUpdates.city = updates.city;
            if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
            if (updates.content !== undefined) dbUpdates.content = updates.content;
            if (updates.productName !== undefined) dbUpdates.product_name = updates.productName;
            if (updates.productId !== undefined) dbUpdates.product_id = updates.productId;
            if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
            if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
            if (updates.hairType !== undefined) dbUpdates.hair_type = updates.hairType;
            if (updates.usageDuration !== undefined) dbUpdates.usage_duration = updates.usageDuration;
            if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
            if (updates.videoPosterUrl !== undefined) dbUpdates.video_poster_url = updates.videoPosterUrl;
            if (updates.videoSource !== undefined) dbUpdates.video_source = updates.videoSource;
            if (updates.videoDuration !== undefined) dbUpdates.video_duration = updates.videoDuration;
            if (updates.status !== undefined) dbUpdates.status = updates.status;
            if (updates.isVisible !== undefined) dbUpdates.is_visible = updates.isVisible;

            await supabase
              .from('testimonials')
              .update(dbUpdates)
              .eq('id', id);
          } catch (err) {
            console.error('Failed to update testimonial in Supabase:', err);
          }
        }
      },

      deleteTestimonial: async (id) => {
        set((state) => ({
          testimonials: state.testimonials.filter((t) => t.id !== id),
        }));

        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.from('testimonials').delete().eq('id', id);
          } catch (err) {
            console.error('Failed to delete testimonial in Supabase:', err);
          }
        }
      },

      fetchFromBackend: async () => {
        if (!isSupabaseConfigured || !supabase) return;

        set({ isLoading: true });
        try {
          // Fetch settings
          const { data: settingsData } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'main')
            .single();

          if (settingsData?.value) {
            const fetched = { ...settingsData.value };
            // Clear legacy announcement text if still present in database
            if (fetched.announcementText?.includes('Livraison partout')) {
              fetched.announcementText = '';
            }
            set((state) => ({
              settings: { ...state.settings, ...fetched },
            }));
          }

          // Fetch products
          const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .order('display_order', { ascending: true });

          if (productsData && productsData.length > 0) {
            const mappedProducts: Product[] = productsData.map((row: any) => ({
              id: row.id,
              name: row.name,
              slug: row.slug,
              category: row.category,
              subtitle: row.subtitle,
              shortDescription: row.short_description || '',
              longDescription: row.long_description || '',
              composition: row.composition || [],
              benefits: row.benefits || [],
              usageInstructions: row.usage_instructions,
              price: row.price,
              originalPrice: row.original_price,
              images: row.images || [],
              variants: row.variants || [],
              badge: row.badge,
              isFeatured: row.is_featured,
              isPublished: row.is_published,
              inStock: row.in_stock,
              displayOrder: row.display_order,
              createdAt: row.created_at,
            }));
            set({ products: mappedProducts });
          }

          // Fetch testimonials
          const { data: testimonialsData } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

          if (testimonialsData && testimonialsData.length > 0) {
            const mappedTestimonials: Testimonial[] = testimonialsData.map((row: any) => ({
              id: row.id,
              clientName: row.client_name,
              city: row.city,
              rating: row.rating,
              content: row.content,
              productName: row.product_name,
              productId: row.product_id,
              avatarUrl: row.avatar_url,
              photoUrl: row.photo_url || row.avatar_url,
              hairType: row.hair_type,
              usageDuration: row.usage_duration,
              videoUrl: row.video_url,
              videoPosterUrl: row.video_poster_url,
              videoSource: row.video_source,
              videoDuration: row.video_duration,
              status: row.status || (row.is_visible ? 'approved' : 'pending'),
              isVisible: row.is_visible,
              isDemo: row.is_demo,
              createdAt: row.created_at,
            }));
            set({ testimonials: mappedTestimonials });
          }
        } catch (err) {
          console.error('Error fetching data from Supabase:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      resetToDefaults: () => {
        set({
          settings: INITIAL_SETTINGS,
          products: INITIAL_PRODUCTS,
          testimonials: INITIAL_TESTIMONIALS,
        });
      },
    }),
    {
      name: 'delaafro-site-data',
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (!version || version < 3) {
          return {
            ...persistedState,
            products: INITIAL_PRODUCTS,
          };
        }
        return persistedState;
      },
      merge: (persistedState: any, currentState: any) => {
        // Filter out false/demo testimonials & remove personal names
        const realTestimonials = (persistedState?.testimonials || []).filter(
          (t: any) => !t.isDemo
        );
        const hasOldNamedTestimonials = persistedState?.testimonials?.some((t: any) =>
          !t.videoUrl && t.clientName && t.clientName !== 'Cliente Vérifiée'
        );
        const shouldResetTestimonials = !persistedState?.testimonials || persistedState?.testimonials.length === 0 || hasOldNamedTestimonials;
        const finalTestimonials = shouldResetTestimonials ? INITIAL_TESTIMONIALS : realTestimonials;

        const hasOldDeliveryNotice = persistedState?.settings?.deliveryNotice?.includes('Cotonou') ||
          persistedState?.settings?.announcementText?.includes('Cotonou') ||
          !!persistedState?.settings?.deliveryZones;

        return {
          ...currentState,
          ...persistedState,
          products: persistedState?.products || INITIAL_PRODUCTS,
          testimonials: finalTestimonials,
          settings: {
            ...INITIAL_SETTINGS,
            ...(persistedState?.settings || {}),
            deliveryNotice: hasOldDeliveryNotice ? INITIAL_SETTINGS.deliveryNotice : (persistedState?.settings?.deliveryNotice || INITIAL_SETTINGS.deliveryNotice),
            announcementText:
              persistedState?.settings?.announcementText?.includes('Livraison partout') ||
              persistedState?.settings?.announcementText?.includes('Cotonou') ||
              hasOldDeliveryNotice
                ? ''
                : (persistedState?.settings?.announcementText || ''),
            instagramUrl: persistedState?.settings?.instagramUrl?.includes('delaafro_')
              ? persistedState.settings.instagramUrl
              : INITIAL_SETTINGS.instagramUrl,
            facebookUrl: persistedState?.settings?.facebookUrl?.includes('dela.afro')
              ? persistedState.settings.facebookUrl
              : INITIAL_SETTINGS.facebookUrl,
            snapchatUrl: persistedState?.settings?.snapchatUrl || INITIAL_SETTINGS.snapchatUrl,
            pinterestUrl: persistedState?.settings?.pinterestUrl || INITIAL_SETTINGS.pinterestUrl,
          },
        };
      },
      partialize: (state: any) =>
        ({
          settings: state.settings,
          products: state.products,
          testimonials: state.testimonials,
        } as any),
    }
  )
);

// Synchronisation temps réel inter-onglets (Cross-Tab Sync)
// Quand l'administrateur modifie un produit ou un réglage dans un onglet admin,
// l'onglet vitrine se met immédiatement à jour sans nécessiter de rechargement.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'delaafro-site-data' && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed?.state) {
          useSettingsStore.setState({
            ...(parsed.state.settings ? { settings: parsed.state.settings } : {}),
            ...(parsed.state.products ? { products: parsed.state.products } : {}),
            ...(parsed.state.testimonials ? { testimonials: parsed.state.testimonials } : {}),
          });
        }
      } catch (err) {
        console.error('Erreur synchronisation inter-onglets:', err);
      }
    }
  });
}

// Souscription Realtime Supabase (si une base de données distante est configurée)
export function initRealtimeSync(): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('delaafro-realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        useSettingsStore.getState().fetchFromBackend();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        useSettingsStore.getState().fetchFromBackend();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        useSettingsStore.getState().fetchFromBackend();
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  } catch (err) {
    console.error('Erreur initialisation Realtime Supabase:', err);
    return () => {};
  }
}


