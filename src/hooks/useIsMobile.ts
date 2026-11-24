import { useState, useEffect } from 'react';

/**
 * Hook to detect mobile/tablet screens (< 1024px)
 * Initialized synchronously with matchMedia to prevent any flash or layout shift.
 */
export function useIsMobile(query = '(max-width: 1023px)'): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      (mediaQuery as any).addListener(handler);
    }

    setIsMobile(mediaQuery.matches);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        (mediaQuery as any).removeListener(handler);
      }
    };
  }, [query]);

  return isMobile;
}

export default useIsMobile;
