import { useScreenSize } from '../hooks/useScreenSize';
import CotisationsPage from './CotisationsPage';
import CotisationsPageMobile from './CotisationsPageMobile';

/**
 * Composant intelligent qui choisit automatiquement la version mobile ou desktop
 * selon la taille de l'écran, en respectant le principe Mobile First
 */
export default function CotisationsPageResponsive() {
  const { isMobile, isTablet } = useScreenSize();

  // Mobile First : prioriser l'expérience mobile
  // Utiliser la version mobile pour mobile ET tablette
  const shouldUseMobileVersion = isMobile || isTablet;

  console.log('📱 [CotisationsPageResponsive] Détection d\'écran:', {
    isMobile,
    isTablet,
    shouldUseMobileVersion,
    screenWidth: window.innerWidth
  });

  // Sur mobile et tablette : version optimisée mobile
  if (shouldUseMobileVersion) {
    return <CotisationsPageMobile />;
  }

  // Sur desktop : version complète avec tableaux
  return <CotisationsPage />;
}
