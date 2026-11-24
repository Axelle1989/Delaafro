/**
 * Utility functions for Video Testimonials
 * Supports YouTube, Vimeo, and direct MP4/WebM video files.
 */

export interface ParsedVideoInfo {
  type: 'youtube' | 'vimeo' | 'file' | null;
  videoId?: string;
  embedUrl?: string;
  posterUrl?: string;
  isDirectFile?: boolean;
}

export function parseVideoUrl(rawUrl: string): ParsedVideoInfo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: null };
  }

  const url = rawUrl.trim();

  // 1. YouTube Detection
  // Matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  const ytMatch =
    url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      posterUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isDirectFile: false,
    };
  }

  // 2. Vimeo Detection
  // Matches:
  // - https://vimeo.com/VIDEO_ID
  // - https://player.vimeo.com/video/VIDEO_ID
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      posterUrl: '', // Vimeo requires API for thumbnail; user can upload poster
      isDirectFile: false,
    };
  }

  // 3. Direct Video File (.mp4, .webm, .mov, or Supabase storage video)
  const isVideoExt = /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
  const isStorageUrl = url.includes('supabase.co/storage') && url.includes('testimonial-videos');
  const isGenericHttp = /^https?:\/\//i.test(url);

  if (isVideoExt || isStorageUrl || isGenericHttp) {
    return {
      type: 'file',
      embedUrl: url,
      posterUrl: '',
      isDirectFile: true,
    };
  }

  return { type: null };
}

/**
 * Checks if an iframe URL belongs strictly to approved secure domains.
 */
export function isAllowedIframeUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.startsWith('https://www.youtube-nocookie.com/embed/') ||
    url.startsWith('https://player.vimeo.com/video/')
  );
}

/**
 * Format duration in seconds to "m:ss" (e.g. 42 -> "0:42", 75 -> "1:15")
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Capture poster frame and duration from a local video File in the browser.
 */
export async function captureVideoFrame(
  file: File
): Promise<{ posterDataUrl: string; durationStr: string; durationSeconds: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      const durationSeconds = video.duration || 0;
      const durationStr = formatDuration(durationSeconds);

      // Seek to 0.5s or 10% of video to get a meaningful frame (not black first frame)
      const seekTime = Math.min(0.5, durationSeconds > 1 ? 1 : 0);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 1280;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const posterDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          URL.revokeObjectURL(objectUrl);
          resolve({
            posterDataUrl,
            durationStr: formatDuration(video.duration || 0),
            durationSeconds: video.duration || 0,
          });
        } else {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Canvas 2D context not available'));
        }
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Erreur de lecture de la vidéo'));
    };
  });
}
