import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Upload,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/common/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { Product, ProductCategory, ProductVariant } from '@/types';
import { slugify } from '@/lib/formatters';
import { PRODUCT_PLACEHOLDER } from '@/lib/productImage';
import { uploadImageToStorage } from '@/lib/imageUpload';

const productSchema = z.object({
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  slug: z.string().min(2, 'Le slug est requis'),
  category: z.enum(['gamme', 'soin', 'accessoire']),
  categoryLabel: z.string().optional(),
  subtitle: z.string().optional(),
  shortDescription: z.string().min(10, 'Description courte requise (au moins 10 caractères)'),
  longDescription: z.string().min(20, 'Description longue requise (au moins 20 caractères)'),
  price: z.coerce.number().min(500, 'Le prix doit être au moins de 500 FCFA'),
  originalPrice: z.coerce.number().optional(),
  badge: z.enum(['', 'Nouveau', 'Best-seller', 'Promo', 'Coup de Cœur', 'Idéal cheveux à forte porosité']).optional(),
  porosity: z.enum(['', 'forte', 'moyenne', 'faible', 'toutes']).optional(),
  needsStudioPhoto: z.boolean().optional(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  inStock: z.boolean(),
  usageInstructions: z.string().optional(),
  images: z.array(z.string().min(1)).min(1, 'Au moins une image requise'),
  benefits: z.array(z.string()).min(1, 'Au moins un bénéfice requis'),
  composition: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'nouveau';

  const { products, addProduct, updateProduct } = useSettingsStore();
  const existingProduct = isNew ? undefined : products.find((p) => p.id === id);

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [benefitInput, setBenefitInput] = useState('');
  const [compositionInput, setCompositionInput] = useState('');
  const [variantsList, setVariantsList] = useState<ProductVariant[]>(
    existingProduct?.variants || []
  );

  const [variantName, setVariantName] = useState('');
  const [variantColorHex, setVariantColorHex] = useState('#E5A9B4');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: existingProduct?.name || '',
      slug: existingProduct?.slug || '',
      category: existingProduct?.category || 'soin',
      categoryLabel: existingProduct?.categoryLabel || '',
      subtitle: existingProduct?.subtitle || '',
      shortDescription: existingProduct?.shortDescription || '',
      longDescription: existingProduct?.longDescription || '',
      price: existingProduct?.price || 3500,
      originalPrice: existingProduct?.originalPrice || undefined,
      badge: existingProduct?.badge || '',
      porosity: existingProduct?.porosity || '',
      needsStudioPhoto: existingProduct?.needsStudioPhoto ?? false,
      isFeatured: existingProduct?.isFeatured ?? false,
      isPublished: existingProduct?.isPublished ?? true,
      inStock: existingProduct?.inStock ?? true,
      usageInstructions: existingProduct?.usageInstructions || '',
      images: existingProduct?.images || [],
      benefits: existingProduct?.benefits || [
        'Hydratation intense et continue',
        'Facilite le coiffage sans casse',
      ],
      composition: existingProduct?.composition || ['Beurre de karité brut du Bénin', 'Huile de ricin'],
    },
  });

  const watchedValues = watch();

  // Auto-slugify name if new product
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    if (isNew) {
      setValue('slug', slugify(val));
    }
  };

  // Images management
  const addImage = () => {
    if (imageUrlInput.trim()) {
      const current = watch('images') || [];
      setValue('images', [...current, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleUploadProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadImageToStorage(file, 'products');
      const current = watch('images') || [];
      setValue('images', [...current, publicUrl]);
      toast.success('Photo importée ! Cliquez sur Enregistrer pour publier.');
    } catch (err: any) {
      toast.error(err?.message || "Impossible d'importer l'image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const current = watch('images') || [];
    setValue(
      'images',
      current.filter((_, i) => i !== index)
    );
  };

  // Benefits management
  const addBenefit = () => {
    if (benefitInput.trim()) {
      const current = watch('benefits') || [];
      setValue('benefits', [...current, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    const current = watch('benefits') || [];
    setValue(
      'benefits',
      current.filter((_, i) => i !== index)
    );
  };

  // Composition management
  const addComposition = () => {
    if (compositionInput.trim()) {
      const current = watch('composition') || [];
      setValue('composition', [...current, compositionInput.trim()]);
      setCompositionInput('');
    }
  };

  const removeComposition = (index: number) => {
    const current = watch('composition') || [];
    setValue(
      'composition',
      current.filter((_, i) => i !== index)
    );
  };

  // Variant addition
  const handleAddVariant = () => {
    if (variantName.trim()) {
      setVariantsList([
        ...variantsList,
        {
          name: variantName.trim(),
          colorName: variantName.trim(),
          colorHex: variantColorHex,
          inStock: true,
        },
      ]);
      setVariantName('');
    }
  };

  const removeVariant = (index: number) => {
    setVariantsList(variantsList.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    const payload = {
      ...data,
      badge: data.badge === '' ? undefined : (data.badge as any),
      porosity: data.porosity === '' ? undefined : (data.porosity as any),
      variants: variantsList.length > 0 ? variantsList : undefined,
      displayOrder: existingProduct?.displayOrder ?? products.length,
    };

    if (isNew) {
      await addProduct(payload);
      setToastMessage('Nouveau produit créé avec succès !');
    } else {
      await updateProduct(id, payload);
      setToastMessage('Produit modifié avec succès !');
    }

    setTimeout(() => {
      navigate('/admin/produits');
    }, 1200);
  };

  // Live preview product object
  const previewProduct: Product = {
    id: existingProduct?.id || 'preview',
    name: watchedValues.name || 'Nom du soin DELAAFRO',
    slug: watchedValues.slug || 'nom-du-soin',
    category: watchedValues.category || 'soin',
    categoryLabel: watchedValues.categoryLabel || 'Rituel Soin',
    subtitle: watchedValues.subtitle,
    shortDescription: watchedValues.shortDescription || 'Description courte du produit...',
    longDescription: watchedValues.longDescription || '',
    price: Number(watchedValues.price) || 3500,
    originalPrice: watchedValues.originalPrice ? Number(watchedValues.originalPrice) : undefined,
    images: watchedValues.images?.length > 0 ? watchedValues.images : [
      PRODUCT_PLACEHOLDER,
    ],
    variants: variantsList,
    badge: (watchedValues.badge as any) || undefined,
    isFeatured: watchedValues.isFeatured ?? false,
    isPublished: watchedValues.isPublished ?? true,
    inStock: watchedValues.inStock ?? true,
    benefits: watchedValues.benefits || [],
    displayOrder: 0,
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brun-nuit text-creme-light px-6 py-3 rounded-2xl shadow-2xl border border-or/40 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/produits"
            className="p-2.5 rounded-2xl bg-white border border-sable text-brun-nuit hover:text-terracotta transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-cuivre">
              Formulaire Produit
            </span>
            <h1 className="font-serif text-3xl font-bold text-brun-nuit mt-0.5">
              {isNew ? 'Créer un Nouveau Soin' : `Modifier « ${existingProduct?.name} »`}
            </h1>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-sable/60 space-y-6"
        >
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-brun-nuit border-b border-sable/30 pb-2">
              Informations Principales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Nom du Soin *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  onChange={handleNameChange}
                  placeholder="ex: Baume Nourrissant au Karité"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
                />
                {errors.name && (
                  <p className="text-[11px] text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Identifiant URL (Slug) *
                </label>
                <input
                  type="text"
                  {...register('slug')}
                  placeholder="baume-nourrissant-karite"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
                />
                {errors.slug && (
                  <p className="text-[11px] text-red-600">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Catégorie *
                </label>
                <select
                  {...register('category')}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-white text-brun-nuit focus:outline-none focus:border-terracotta"
                >
                  <option value="gamme">Gamme Complète</option>
                  <option value="soin">Soin Individuel</option>
                  <option value="accessoire">Accessoire & Satin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Label de Catégorie (Optionnel)
                </label>
                <input
                  type="text"
                  {...register('categoryLabel')}
                  placeholder="ex: Rituel Quotidien"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Badge Commercial
                </label>
                <select
                  {...register('badge')}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-white text-brun-nuit focus:outline-none focus:border-terracotta"
                >
                  <option value="">Aucun badge</option>
                  <option value="Best-seller">Best-seller (Doré)</option>
                  <option value="Idéal cheveux à forte porosité">Idéal cheveux à forte porosité</option>
                  <option value="Nouveau">Nouveau</option>
                  <option value="Promo">Promo</option>
                  <option value="Coup de Cœur">Coup de Cœur</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Sous-titre poétique
                </label>
                <input
                  type="text"
                  {...register('subtitle')}
                  placeholder="ex: Infusion intense pour cheveux secs et cassants"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Cible Porosité Capillaire
                </label>
                <select
                  {...register('porosity')}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-white text-brun-nuit focus:outline-none focus:border-terracotta"
                >
                  <option value="">Non précisée / Toutes</option>
                  <option value="forte">Forte Porosité (cuticules ouvertes)</option>
                  <option value="moyenne">Porosité Moyenne (normale)</option>
                  <option value="faible">Faible Porosité (cuticules fermées)</option>
                  <option value="toutes">Toutes porosités</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Promotions */}
          <div className="space-y-4 pt-4 border-t border-sable/30">
            <h3 className="font-serif text-lg font-bold text-brun-nuit border-b border-sable/30 pb-2">
              Tarification & Stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Prix de Vente (FCFA) *
                </label>
                <input
                  type="number"
                  {...register('price')}
                  placeholder="15000"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
                />
                {errors.price && (
                  <p className="text-[11px] text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Prix Barré Promo (FCFA - Optionnel)
                </label>
                <input
                  type="number"
                  {...register('originalPrice')}
                  placeholder="17500"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>

            {/* Quick Checkbox Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-brun-nuit cursor-pointer">
                <input
                  type="checkbox"
                  {...register('inStock')}
                  className="w-4 h-4 rounded text-terracotta focus:ring-terracotta border-sable"
                />
                <span>En stock au Bénin</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-brun-nuit cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isFeatured')}
                  className="w-4 h-4 rounded text-terracotta focus:ring-terracotta border-sable"
                />
                <span>Mettre en avant (Accueil)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-brun-nuit cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isPublished')}
                  className="w-4 h-4 rounded text-terracotta focus:ring-terracotta border-sable"
                />
                <span>Publié (Visible boutique)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-amber-800 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('needsStudioPhoto')}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                />
                <span>Photo studio à remplacer</span>
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4 pt-4 border-t border-sable/30">
            <h3 className="font-serif text-lg font-bold text-brun-nuit border-b border-sable/30 pb-2">
              Descriptions & Conseils
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Description courte (Cartes et aperçus) *
              </label>
              <textarea
                rows={2}
                {...register('shortDescription')}
                placeholder="Résumé percutant des bénéfices..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
              />
              {errors.shortDescription && (
                <p className="text-[11px] text-red-600">{errors.shortDescription.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Description complète (Page produit) *
              </label>
              <textarea
                rows={4}
                {...register('longDescription')}
                placeholder="Histoire, texture, bienfaits en profondeur..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
              />
              {errors.longDescription && (
                <p className="text-[11px] text-red-600">{errors.longDescription.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Conseils d'utilisation
              </label>
              <textarea
                rows={2}
                {...register('usageInstructions')}
                placeholder="Gestuelle recommandée (quantité, moment d'application)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          {/* Images Management */}
          <div className="space-y-4 pt-4 border-t border-sable/30">
            <h3 className="font-serif text-lg font-bold text-brun-nuit border-b border-sable/30 pb-2">
              Galerie Photos (URLs / Fichiers)
            </h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta text-white text-xs font-semibold cursor-pointer hover:bg-terracotta/90 transition-colors shrink-0">
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Importer une photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleUploadProductImage}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Ou coller une URL https://... / chemin /products/..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
              />
              <Button type="button" variant="outline" size="sm" onClick={addImage}>
                Ajouter URL
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {watch('images')?.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-sable group">
                  <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {errors.images && (
              <p className="text-[11px] text-red-600">{errors.images.message}</p>
            )}
          </div>

          {/* Variants / Color Swatches */}
          <div className="space-y-4 pt-4 border-t border-sable/30">
            <h3 className="font-serif text-lg font-bold text-brun-nuit border-b border-sable/30 pb-2">
              Variantes & Couleurs (Pour Accessoires)
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Nom (ex: Rose Poudré)"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-sable bg-creme/20"
              />
              <input
                type="color"
                value={variantColorHex}
                onChange={(e) => setVariantColorHex(e.target.value)}
                className="w-10 h-9 p-0.5 rounded-xl border border-sable cursor-pointer"
                title="Code couleur"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                Ajouter la variante
              </Button>
            </div>

            {variantsList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {variantsList.map((v, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sable/40 border border-sable text-xs text-brun-nuit"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: v.colorHex }}
                    />
                    <span>{v.name}</span>
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-brun-nuit/50 hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Benefits & Composition */}
          <div className="space-y-4 pt-4 border-t border-sable/30">
            <h3 className="font-serif text-lg font-bold text-brun-nuit border-b border-sable/30 pb-2">
              Bénéfices & Composition
            </h3>

            {/* Benefits */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit block">
                Bénéfices clés *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ex: Réduit la casse dès 1 semaine"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-sable bg-creme/20"
                />
                <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {watch('benefits')?.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-feuille/10 text-feuille-dark text-xs border border-feuille/20"
                  >
                    <span>✓ {b}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(idx)}
                      className="text-red-500 hover:text-red-700 ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Composition */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit block">
                Ingrédients / Flacons inclus
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ex: Shampoing doux sans sulfates (250 ml)"
                  value={compositionInput}
                  onChange={(e) => setCompositionInput(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-sable bg-creme/20"
                />
                <Button type="button" variant="outline" size="sm" onClick={addComposition}>
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {watch('composition')?.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sable/30 text-brun-nuit text-xs border border-sable"
                  >
                    <span>• {c}</span>
                    <button
                      type="button"
                      onClick={() => removeComposition(idx)}
                      className="text-red-500 hover:text-red-700 ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-sable/30 flex justify-end gap-3">
            <Link to="/admin/produits">
              <Button type="button" variant="outline" size="md">
                Annuler
              </Button>
            </Link>
            <Button
              type="submit"
              variant="terracotta"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </form>

        {/* Right Column: Live Product Card Preview */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brun-nuit/60">
            <Eye className="w-4 h-4 text-terracotta" />
            <span>Aperçu en Direct sur le Site</span>
          </div>

          <div className="pointer-events-none">
            <ProductCard product={previewProduct} />
          </div>

          <div className="p-4 rounded-2xl bg-sable/30 border border-sable/60 text-xs text-brun-nuit/70 space-y-1">
            <p className="font-semibold text-terracotta">💡 Conseil de présentation :</p>
            <p>
              Les titres courts et évocateurs couplés à une photo contrastée sous lumière chaude attirent 3 fois plus de commandes WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

