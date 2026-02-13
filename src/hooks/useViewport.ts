import { useState, useEffect } from 'react';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export interface ViewportState {
  width: number;
  height: number;
  size: ViewportSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const getViewportSize = (width: number): ViewportSize => {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const getViewportState = (): ViewportState => {
  // Handle SSR case
  if (typeof window === 'undefined') {
    return {
      width: 1024,
      height: 768,
      size: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const size = getViewportSize(width);

  return {
    width,
    height,
    size,
    isMobile: size === 'mobile',
    isTablet: size === 'tablet',
    isDesktop: size === 'desktop',
  };
};

export const useViewport = (): ViewportState => {
  const [viewport, setViewport] = useState<ViewportState>(getViewportState());

  useEffect(() => {
    const handleResize = debounce(() => {
      setViewport(getViewportState());
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};
