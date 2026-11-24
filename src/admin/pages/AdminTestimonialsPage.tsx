import React, { useState } from 'react';
import {
  MessageSquare,
  PlusCircle,
  Trash2,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Check,
  Edit2,
  Upload,
  Video,
  Play,
  Film,
  Link as LinkIcon,
  X,
  ExternalLink,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/common/Button';
import { Testimonial } from '@/types';
import { supabase } from '@/lib/supabase';
import { parseVideoUrl, captureVideoFrame } from '@/lib/videoUtils';

type ModerationTab = 'en-attente' | 'publies' | 'masques';
type VideoSourceType = 'link' | 'upload';

export const AdminTestimonialsPage: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, products } =
    useSettingsStore();

  const [activeTab, setActiveTab] = useState<ModerationTab>('publies');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'photo'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  // New photo testimonial state
  const [photoClientName, setPhotoClientName] = useState('');
  const [photoCity, setPhotoCity] = useState('Cotonou');
  const [photoRating, setPhotoRating] = useState(5);
  const [photoProductName, setPhotoProductName] = useState('Gamme Hydratation');
  const [photoContent, setPhotoContent] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // New video testimonial state
  const [videoClientName, setVideoClientName] = useState('Cliente Vérifiée');
  const [videoCity, setVideoCity] = useState('Cotonou');
  const [videoRating, setVideoRating] = useState(5);
  const [videoProductId, setVideoProductId] = useState('');
  const [videoContent, setVideoContent] = useState('');
  const [videoDurationInput, setVideoDurationInput] = useState('');
  const [videoSourceType, setVideoSourceType] = useState<VideoSourceType>('link');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPosterFile, setVideoPosterFile] = useState<File | null>(null);
  const [capturedPosterUrl, setCapturedPosterUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoFormError, setVideoFormError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Classify testimonials by tab
  const pendingList = testimonials.filter(
    (t) => t.status === 'pending' || (!t.isVisible && t.status !== 'hidden')
  );
  const publishedList = testimonials.filter(
    (t) => t.isVisible && t.status !== 'pending' && t.status !== 'hidden'
  );
  const hiddenList = testimonials.filter(
    (t) => t.status === 'hidden' || (!t.isVisible && t.status !== 'pending')
  );

  const baseList =
    activeTab === 'en-attente'
      ? pendingList
      : activeTab === 'publies'
      ? publishedList
      : hiddenList;

  const currentList = baseList.filter((item) => {
    if (filterType === 'video') return Boolean(item.videoUrl);
    if (filterType === 'photo') return !item.videoUrl;
    return true;
  });

  // Actions
  const handleApprove = async (t: Testimonial) => {
    await updateTestimonial(t.id, { isVisible: true, status: 'approved' });
    showToast(`Avis de ${t.clientName} approuvé et publié !`);
  };

  const handleHide = async (t: Testimonial) => {
    await updateTestimonial(t.id, { isVisible: false, status: 'hidden' });
    showToast(`Avis de ${t.clientName} masqué.`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer définitivement ce témoignage ?')) {
      await deleteTestimonial(id);
      showToast('Témoignage supprimé.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await updateTestimonial(editingItem.id, {
      clientName: editingItem.clientName,
      city: editingItem.city,
      rating: editingItem.rating,
      productName: editingItem.productName,
      content: editingItem.content,
      videoUrl: editingItem.videoUrl,
      videoPosterUrl: editingItem.videoPosterUrl,
      videoDuration: editingItem.videoDuration,
    });
    setEditingItem(null);
    showToast('Témoignage mis à jour.');
  };

  // Create Photo Testimonial
  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoClientName || !photoContent) return;

    setIsPhotoUploading(true);
    let avatarUrl: string | undefined = undefined;

    if (photoFile && supabase) {
      try {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `reviews/${fileName}`;
        const { error: uploadErr } = await supabase.storage
          .from('testimonials')
          .upload(filePath, photoFile);

        if (!uploadErr) {
          const { data } = supabase.storage.from('testimonials').getPublicUrl(filePath);
          avatarUrl = data.publicUrl;
        }
      } catch (err) {
        console.warn('Image upload skipped', err);
      }
    }

    await addTestimonial({
      clientName: photoClientName,
      city: photoCity,
      rating: photoRating,
      productName: photoProductName,
      content: photoContent,
      avatarUrl,
      photoUrl: avatarUrl,
      isVisible: true,
      status: 'approved',
      isDemo: false,
    });

    setIsPhotoUploading(false);
    showToast('Témoignage photo ajouté et publié !');
    setShowAddPhotoModal(false);
    setPhotoClientName('');
    setPhotoContent('');
    setPhotoFile(null);
  };

  // Detect and handle Video File Selection (with auto-poster & duration)
  const handleVideoFileChange = async (file: File | null) => {
    setVideoFormError(null);
    setVideoFile(file);
    setCapturedPosterUrl('');

    if (!file) return;

    // 50MB limit check
    if (file.size > 50 * 1024 * 1024) {
      setVideoFormError('Le fichier vidéo est trop lourd. La taille maximale autorisée est de 50 Mo.');
      setVideoFile(null);
      return;
    }

    try {
      const { posterDataUrl, durationStr } = await captureVideoFrame(file);
      setCapturedPosterUrl(posterDataUrl);
      if (!videoDurationInput) {
        setVideoDurationInput(durationStr);
      }
    } catch (err) {
      console.warn('Could not auto-generate video poster frame:', err);
    }
  };

  // Create Video Testimonial
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoFormError(null);

    let finalVideoUrl = '';
    let finalPosterUrl = '';
    let finalSource: 'youtube' | 'upload' | 'url' = 'url';

    if (videoSourceType === 'link') {
      if (!videoUrlInput.trim()) {
        setVideoFormError('Veuillez renseigner un lien vidéo (YouTube, Vimeo ou MP4 direct).');
        return;
      }
      const parsed = parseVideoUrl(videoUrlInput);
      if (!parsed.type) {
        setVideoFormError('Format de lien non reconnu. Utilisez un lien YouTube, Vimeo ou un fichier vidéo direct (.mp4, .webm).');
        return;
      }

      finalVideoUrl = videoUrlInput.trim();
      finalSource = parsed.type === 'youtube' ? 'youtube' : 'url';
      finalPosterUrl = parsed.posterUrl || capturedPosterUrl || '';
    } else {
      // Source is file upload
      if (!videoFile) {
        setVideoFormError('Veuillez sélectionner un fichier vidéo (MP4, WebM ou MOV, max 50 Mo).');
        return;
      }

      if (videoFile.size > 50 * 1024 * 1024) {
        setVideoFormError('Le fichier dépasse 50 Mo. Veuillez réduire la taille ou utiliser un lien YouTube.');
        return;
      }

      if (!supabase) {
        setVideoFormError('Supabase n’est pas connecté sur cette instance. En mode local/démo, veuillez choisir « Coller un lien (YouTube/MP4) ».');
        return;
      }

      setIsVideoUploading(true);
      setUploadProgress(20);

      try {
        const fileExt = videoFile.name.split('.').pop() || 'mp4';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploadProgress(50);
        const { error: uploadErr } = await supabase.storage
          .from('testimonial-videos')
          .upload(filePath, videoFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadErr) {
          throw new Error(`Erreur lors de l'envoi Supabase : ${uploadErr.message}`);
        }

        setUploadProgress(85);
        const { data: publicUrlData } = supabase.storage
          .from('testimonial-videos')
          .getPublicUrl(filePath);

        finalVideoUrl = publicUrlData.publicUrl;
        finalSource = 'upload';
      } catch (err: any) {
        setIsVideoUploading(false);
        setVideoFormError(err?.message || "Erreur lors de l'envoi de la vidéo.");
        return;
      }
    }

    // Optional custom poster image upload
    if (videoPosterFile && supabase) {
      try {
        const ext = videoPosterFile.name.split('.').pop() || 'jpg';
        const posterName = `poster-${Date.now()}.${ext}`;
        const { error: pErr } = await supabase.storage
          .from('testimonial-videos')
          .upload(posterName, videoPosterFile);
        if (!pErr) {
          const { data } = supabase.storage.from('testimonial-videos').getPublicUrl(posterName);
          finalPosterUrl = data.publicUrl;
        }
      } catch (pErr) {
        console.warn('Poster upload skipped:', pErr);
      }
    } else if (!finalPosterUrl && capturedPosterUrl) {
      // Use captured canvas frame as fallback
      finalPosterUrl = capturedPosterUrl;
    }

    const selectedProduct = products.find((p) => p.id === videoProductId);

    await addTestimonial({
      clientName: videoClientName.trim() || 'Cliente Vérifiée',
      city: videoCity.trim() || 'Cotonou',
      rating: videoRating,
      productName: selectedProduct?.name,
      productId: selectedProduct?.id,
      content: videoContent.trim(),
      videoUrl: finalVideoUrl,
      videoPosterUrl: finalPosterUrl,
      videoSource: finalSource,
      videoDuration: videoDurationInput.trim() || '0:45',
      isVisible: true,
      status: 'approved',
      isDemo: false,
    });

    setIsVideoUploading(false);
    setUploadProgress(100);
    showToast('Témoignage vidéo publié avec succès !');
    setShowAddVideoModal(false);

    // Reset video form
    setVideoClientName('Cliente Vérifiée');
    setVideoCity('Cotonou');
    setVideoRating(5);
    setVideoProductId('');
    setVideoContent('');
    setVideoDurationInput('');
    setVideoUrlInput('');
    setVideoFile(null);
    setVideoPosterFile(null);
    setCapturedPosterUrl('');
    setUploadProgress(0);
  };

  const parsedUrlPreview = parseVideoUrl(videoUrlInput);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brun-nuit text-creme-light px-6 py-3 rounded-2xl shadow-2xl border border-or/40 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-cuivre">
            Preuve Sociale & Modération
          </span>
          <h1 className="font-serif text-3xl font-bold text-brun-nuit mt-1">
            Gestion des Témoignages Clientes
          </h1>
          <p className="text-xs sm:text-sm text-brun-nuit/70">
            Validez les avis, gérez les photos de résultats et publiez de nouveaux témoignages vidéo en format stories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowAddPhotoModal(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            + Témoignage Photo
          </Button>

          <Button
            variant="terracotta"
            size="md"
            onClick={() => setShowAddVideoModal(true)}
            leftIcon={<Video className="w-4 h-4" />}
          >
            + Ajouter un témoignage vidéo
          </Button>
        </div>
      </div>

      {/* Tabs & Type Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sable/50 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('publies')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'publies'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm'
                : 'text-brun-nuit/60 hover:text-brun-nuit'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Publiés ({publishedList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('en-attente')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'en-attente'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                : 'text-brun-nuit/60 hover:text-brun-nuit'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>En attente ({pendingList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('masques')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'masques'
                ? 'bg-gray-200 text-gray-800 border border-gray-300 shadow-sm'
                : 'text-brun-nuit/60 hover:text-brun-nuit'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Masqués ({hiddenList.length})</span>
          </button>
        </div>

        {/* Format Filter (Tous / Vidéos / Photos) */}
        <div className="flex items-center gap-1.5 bg-sable/30 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-white text-brun-nuit shadow-sm'
                : 'text-brun-nuit/60 hover:text-brun-nuit'
            }`}
          >
            Tous ({baseList.length})
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              filterType === 'video'
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-brun-nuit/60 hover:text-brun-nuit'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Vidéos ({baseList.filter((t) => Boolean(t.videoUrl)).length})</span>
          </button>
          <button
            onClick={() => setFilterType('photo')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterType === 'photo'
                ? 'bg-white text-brun-nuit shadow-sm'
                : 'text-brun-nuit/60 hover:text-brun-nuit'
            }`}
          >
            Photos ({baseList.filter((t) => !t.videoUrl).length})
          </button>
        </div>
      </div>

      {/* Testimonials Cards Grid */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((t) => {
            const isVideo = Boolean(t.videoUrl);
            return (
              <div
                key={t.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 bg-white border shadow-luxury transition-all ${
                  isVideo ? 'border-or/60 ring-1 ring-or/30' : 'border-sable/60'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      {/* Video Badge */}
                      {isVideo ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-terracotta text-white shadow-sm">
                          <Video className="w-3 h-3" />
                          <span>Vidéo {t.videoDuration ? `(${t.videoDuration})` : ''}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sable/40 text-brun-nuit">
                          Photo
                        </span>
                      )}

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 ml-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < t.rating ? 'text-or fill-or' : 'text-sable fill-sable/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        t.status === 'pending' || (!t.isVisible && t.status !== 'hidden')
                          ? 'bg-amber-100 text-amber-800'
                          : t.isVisible
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {t.status === 'pending' || (!t.isVisible && t.status !== 'hidden')
                        ? 'En attente'
                        : t.isVisible
                        ? 'Publié'
                        : 'Masqué'}
                    </span>
                  </div>

                  {/* Video Thumbnail Preview if Video */}
                  {isVideo && (
                    <div className="mb-3 relative aspect-video w-full rounded-2xl overflow-hidden bg-black/90 border border-sable/50">
                      <img
                        src={t.videoPosterUrl || t.photoUrl || '/products/lifestyle/gamme-complete-portrait-afro.jpg'}
                        alt={t.clientName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/80 text-brun-nuit flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-current translate-x-0.5 text-terracotta" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        Source : {t.videoSource || 'Lien'}
                      </div>
                    </div>
                  )}

                  {/* Quote Content */}
                  {t.content && (
                    <p className="text-xs sm:text-sm text-brun-nuit/80 leading-relaxed italic mb-3">
                      « {t.content} »
                    </p>
                  )}

                  {t.productName && (
                    <span className="inline-block text-[10px] font-semibold text-terracotta bg-sable/30 px-2.5 py-0.5 rounded-full border border-sable mb-3">
                      {t.productName}
                    </span>
                  )}
                </div>

                {/* Author Info & Actions */}
                <div className="pt-3 border-t border-sable/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {t.avatarUrl || t.photoUrl ? (
                      <img
                        src={t.avatarUrl || t.photoUrl}
                        alt={t.clientName}
                        className="w-9 h-9 rounded-full object-cover border border-cuivre/30 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-terracotta to-terracotta-deep text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        {getInitials(t.clientName || 'C V')}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-xs text-brun-nuit truncate">
                        {t.clientName || 'Cliente Vérifiée'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-brun-nuit/60">
                        <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                        <span>{t.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!t.isVisible ? (
                      <button
                        onClick={() => handleApprove(t)}
                        className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                        title="Approuver et publier"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleHide(t)}
                        className="p-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        title="Masquer"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => setEditingItem(t)}
                      className="p-1.5 rounded-xl text-brun-nuit/60 hover:text-brun-nuit hover:bg-sable/30 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-xl text-brun-nuit/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-sable/50 max-w-md mx-auto p-8">
          <MessageSquare className="w-8 h-8 text-cuivre mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg font-bold text-brun-nuit">
            Aucun témoignage trouvé
          </h3>
          <p className="text-xs text-brun-nuit/70 mt-1">
            {filterType === 'video'
              ? 'Aucune vidéo dans cette catégorie. Cliquez sur « + Ajouter un témoignage vidéo » pour en créer une.'
              : 'Tous les avis reçus sont à jour.'}
          </p>
        </div>
      )}

      {/* =========================================================================
          MODAL 1 : AJOUTER UN TÉMOIGNAGE VIDÉO (Spécifique Demande Client)
      ========================================================================= */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 bg-brun-nuit/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-or/40 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sable/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brun-nuit">
                    Ajouter un Témoignage Vidéo
                  </h3>
                  <p className="text-[11px] text-brun-nuit/60">
                    Sera immédiatement visible dans la section « Elles Témoignent en Vidéo ».
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddVideoModal(false)}
                className="p-1.5 rounded-full hover:bg-sable/30 text-brun-nuit/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {videoFormError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{videoFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateVideo} className="space-y-4">
              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit">
                    Prénom / Nom cliente
                  </label>
                  <input
                    type="text"
                    required
                    value={videoClientName}
                    onChange={(e) => setVideoClientName(e.target.value)}
                    placeholder="ex: Amina S."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-sable bg-creme/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit">
                    Ville
                  </label>
                  <input
                    type="text"
                    required
                    value={videoCity}
                    onChange={(e) => setVideoCity(e.target.value)}
                    placeholder="ex: Cotonou"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-sable bg-creme/20"
                  />
                </div>
              </div>

              {/* Rating & Duration Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit">
                    Note globale
                  </label>
                  <select
                    value={videoRating}
                    onChange={(e) => setVideoRating(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-sable bg-white"
                  >
                    <option value={5}>5 / 5 (Parfait)</option>
                    <option value={4}>4 / 5 (Très bon)</option>
                    <option value={3}>3 / 5 (Correct)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit">
                    Durée vidéo (ex: 0:42)
                  </label>
                  <input
                    type="text"
                    value={videoDurationInput}
                    onChange={(e) => setVideoDurationInput(e.target.value)}
                    placeholder="0:45"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-sable bg-creme/20"
                  />
                </div>
              </div>

              {/* Linked Product (Optional) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit">
                  Soin ou Gamme associé(e) (optionnel)
                </label>
                <select
                  value={videoProductId}
                  onChange={(e) => setVideoProductId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-sable bg-white"
                >
                  <option value="">-- Aucun soin spécifique --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price.toLocaleString('fr-FR')} FCFA)
                    </option>
                  ))}
                </select>
              </div>

              {/* VIDEO SOURCE SELECTOR (Lien ou Import Fichier) */}
              <div className="space-y-2 pt-1 border-t border-sable/30">
                <label className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit block">
                  Source de la vidéo
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoSourceType('link')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                      videoSourceType === 'link'
                        ? 'bg-terracotta text-white border-terracotta shadow-sm'
                        : 'bg-white text-brun-nuit/75 border-sable hover:border-terracotta/40'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Lien (YouTube / Web)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoSourceType('upload')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                      videoSourceType === 'upload'
                        ? 'bg-terracotta text-white border-terracotta shadow-sm'
                        : 'bg-white text-brun-nuit/75 border-sable hover:border-terracotta/40'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Fichier (MP4 max 50Mo)</span>
                  </button>
                </div>

                {/* Option A : Paste Video Link */}
                {videoSourceType === 'link' && (
                  <div className="space-y-2 mt-2">
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... ou .mp4"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
                    />

                    {/* Live URL detection banner */}
                    {parsedUrlPreview.type && (
                      <div className="p-2.5 rounded-xl bg-sable/30 border border-sable/60 flex items-center gap-3">
                        {parsedUrlPreview.posterUrl ? (
                          <img
                            src={parsedUrlPreview.posterUrl}
                            alt="Miniature auto"
                            className="w-14 h-9 object-cover rounded-md border border-sable/50 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-9 bg-brun-nuit/20 rounded-md flex items-center justify-center text-[10px] text-brun-nuit/60">
                            Vidéo
                          </div>
                        )}
                        <div className="min-w-0 flex-1 text-xs">
                          <span className="font-bold text-terracotta uppercase text-[10px] block">
                            Format détecté : {parsedUrlPreview.type}
                          </span>
                          <span className="text-[11px] text-brun-nuit/70 truncate block">
                            Miniature et intégration prêtes.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Option B : Upload Video File (Max 50MB) */}
                {videoSourceType === 'upload' && (
                  <div className="space-y-2 mt-2">
                    <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-terracotta/40 hover:border-terracotta bg-creme/30 cursor-pointer transition-colors text-center">
                      <Film className="w-7 h-7 text-terracotta mb-1.5" />
                      <span className="text-xs font-bold text-brun-nuit">
                        {videoFile ? videoFile.name : 'Choisir un fichier vidéo (MP4, WebM, MOV)'}
                      </span>
                      <span className="text-[11px] text-brun-nuit/60 mt-0.5">
                        Limite maximale : 50 Mo • Miniature extraite automatiquement
                      </span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleVideoFileChange(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* Auto-extracted Canvas Poster Preview */}
                    {capturedPosterUrl && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                        <img
                          src={capturedPosterUrl}
                          alt="Poster généré"
                          className="w-12 h-16 object-cover rounded-lg border border-emerald-300 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-emerald-800">
                            Aperçu généré avec succès !
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            Première image capturée automatiquement pour la carte story.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Progress Bar during upload */}
                    {isVideoUploading && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-bold text-brun-nuit">
                          <span>Téléversement vers Supabase...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-sable/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-terracotta transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Custom Poster Image (Optional) */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit">
                  Image d'aperçu / Poster personnalisé (optionnel)
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl border border-sable bg-creme/20 cursor-pointer text-xs text-brun-nuit/70">
                  <Upload className="w-3.5 h-3.5 text-cuivre shrink-0" />
                  <span className="truncate">
                    {videoPosterFile ? videoPosterFile.name : 'Choisir une image de couverture...'}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVideoPosterFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Testimonial text (Optional) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit">
                  Texte du retour (facultatif)
                </label>
                <textarea
                  rows={2}
                  placeholder="Citation ou résumé des propos de la cliente dans la vidéo..."
                  value={videoContent}
                  onChange={(e) => setVideoContent(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-sable bg-creme/20 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-3 border-t border-sable/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddVideoModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="terracotta"
                  size="sm"
                  disabled={isVideoUploading}
                >
                  {isVideoUploading ? 'Envoi en cours...' : 'Publier la Vidéo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2 : AJOUTER UN TÉMOIGNAGE PHOTO (Classique)
      ========================================================================= */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-brun-nuit/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePhoto}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sable/60 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-sable/40 pb-2">
              <h3 className="font-serif text-xl font-bold text-brun-nuit">
                Nouveau Témoignage Photo
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPhotoModal(false)}
                className="p-1 rounded-full text-brun-nuit/60 hover:bg-sable/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Nom de la cliente
              </label>
              <input
                type="text"
                required
                placeholder="ex: Estelle A."
                value={photoClientName}
                onChange={(e) => setPhotoClientName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Ville / Quartier
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Cotonou"
                  value={photoCity}
                  onChange={(e) => setPhotoCity(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Note (Étoiles)
                </label>
                <select
                  value={photoRating}
                  onChange={(e) => setPhotoRating(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-white"
                >
                  <option value={5}>5 / 5 (Exceptionnel)</option>
                  <option value={4}>4 / 5 (Très bon)</option>
                  <option value={3}>3 / 5 (Moyen)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Produit concerné
              </label>
              <select
                value={photoProductName}
                onChange={(e) => setPhotoProductName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Photo du résultat
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-sable bg-creme/20 cursor-pointer text-xs text-brun-nuit/70">
                <Upload className="w-4 h-4 text-cuivre" />
                <span className="truncate">{photoFile ? photoFile.name : 'Choisir une image...'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setPhotoFile(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Texte du retour
              </label>
              <textarea
                rows={3}
                required
                placeholder="Les bénéfices constatés sur les cheveux..."
                value={photoContent}
                onChange={(e) => setPhotoContent(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-creme/20 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddPhotoModal(false)}
              >
                Annuler
              </Button>
              <Button type="submit" variant="terracotta" size="sm" disabled={isPhotoUploading}>
                {isPhotoUploading ? 'Enregistrement...' : 'Publier'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          MODAL 3 : MODIFIER UN TÉMOIGNAGE (Photo ou Vidéo)
      ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-brun-nuit/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sable/60 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-serif text-xl font-bold text-brun-nuit">
              Modifier le Témoignage {editingItem.videoUrl ? '(Vidéo)' : '(Photo)'}
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Nom de la cliente
              </label>
              <input
                type="text"
                required
                value={editingItem.clientName}
                onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Ville
              </label>
              <input
                type="text"
                required
                value={editingItem.city}
                onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Note (Étoiles)
              </label>
              <select
                value={editingItem.rating}
                onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable bg-white"
              >
                <option value={5}>5 / 5</option>
                <option value={4}>4 / 5</option>
                <option value={3}>3 / 5</option>
              </select>
            </div>

            {editingItem.videoUrl && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                    Lien Vidéo
                  </label>
                  <input
                    type="text"
                    value={editingItem.videoUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                    Durée (ex: 0:42)
                  </label>
                  <input
                    type="text"
                    value={editingItem.videoDuration || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, videoDuration: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                Avis / Texte
              </label>
              <textarea
                rows={3}
                value={editingItem.content}
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-sable resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                Annuler
              </Button>
              <Button type="submit" variant="terracotta" size="sm">
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
