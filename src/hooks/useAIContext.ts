import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getContextualSuggestions } from '../config/aiAssistantConfig';

interface AIContext {
  currentPage: string;
  userRole: string;
  maturityLevel: number;
  pageTitle?: string;
  pageType?: 'dashboard' | 'management' | 'finance' | 'guidance' | 'reports' | 'settings';
  contextualSuggestions?: string[];
}

export const useAIContext = (): AIContext => {
  const location = useLocation();
  const params = useParams();
  const [context, setContext] = useState<AIContext>({
    currentPage: 'dashboard',
    userRole: 'membre',
    maturityLevel: 2
  });

  useEffect(() => {
    const path = location.pathname;
    const pageInfo = getPageInfo(path);
    
    setContext({
      currentPage: path,
      userRole: getUserRole(), // À connecter avec votre système d'auth
      maturityLevel: getMaturityLevel(), // À connecter avec vos données
      pageTitle: pageInfo.title,
      pageType: pageInfo.type,
      contextualSuggestions: getContextualSuggestions(pageInfo.type)
    });
  }, [location.pathname, params]);

  return context;
};

const getPageInfo = (path: string) => {
  const pathMap: Record<string, { title: string; type: AIContext['pageType'] }> = {
    '/': { title: 'Tableau de bord', type: 'dashboard' },
    '/dashboard': { title: 'Tableau de bord', type: 'dashboard' },
    '/members': { title: 'Gestion des membres', type: 'management' },
    '/events': { title: 'Gestion des événements', type: 'management' },
    '/finances': { title: 'Gestion financière', type: 'finance' },
    '/finances/budget': { title: 'Budget', type: 'finance' },
    '/finances/transactions': { title: 'Transactions', type: 'finance' },
    '/finances/reports': { title: 'Rapports financiers', type: 'reports' },
    '/guidance': { title: 'Guide organisationnel', type: 'guidance' },
    '/guidance/diagnostic': { title: 'Diagnostic organisationnel', type: 'guidance' },
    '/guidance/recommendations': { title: 'Recommandations', type: 'guidance' },
    '/guidance/compliance': { title: 'Conformité', type: 'guidance' },
    '/guidance/action-plan': { title: 'Plan d\'action', type: 'guidance' },
    '/guidance/analytics': { title: 'Analyses', type: 'reports' },
    '/resources': { title: 'Ressources', type: 'management' },
    '/settings': { title: 'Paramètres', type: 'settings' },
    '/reports': { title: 'Rapports', type: 'reports' }
  };

  // Recherche exacte d'abord
  if (pathMap[path]) {
    return pathMap[path];
  }

  // Recherche par correspondance partielle
  for (const [pattern, info] of Object.entries(pathMap)) {
    if (path.startsWith(pattern) && pattern !== '/') {
      return info;
    }
  }

  // Valeur par défaut
  return { title: 'Page', type: 'dashboard' as const };
};

const getUserRole = (): string => {
  // TODO: Connecter avec votre système d'authentification
  // Exemple: return useAuth().user?.role || 'membre';
  return 'membre';
};

const getMaturityLevel = (): number => {
  // TODO: Connecter avec vos données d'organisation
  // Exemple: return useOrganization().maturityLevel || 2;
  return 2;
};
