import { useState, useEffect } from 'react';

interface ScreenSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        isMobile: width < 768, // Moins de 768px = mobile
        isTablet: width >= 768 && width < 1024, // 768px à 1023px = tablette
        isDesktop: width >= 1024, // 1024px et plus = desktop
        width,
        height,
      });
    };

    // Vérification initiale
    checkScreenSize();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkScreenSize);
    
    // Écouter les changements d'orientation sur mobile
    window.addEventListener('orientationchange', () => {
      // Petit délai pour laisser le temps à l'orientation de changer
      setTimeout(checkScreenSize, 100);
    });

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  return screenSize;
};
