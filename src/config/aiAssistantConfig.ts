// Configuration globale de l'assistant IA pour toute l'application

import { useLocation } from 'react-router-dom';

interface AIAssistantConfig {
  enabled: boolean;
  size: 'small' | 'medium' | 'large';
  position: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left';
  theme: 'light' | 'dark' | 'auto';
  defaultExpanded: boolean;
  contextualSuggestions: boolean;
}

// Configuration par défaut de l'assistant IA
export const DEFAULT_AI_CONFIG: AIAssistantConfig = {
  enabled: true,
  size: 'medium',
  position: 'bottom-left',
  theme: 'auto',
  defaultExpanded: false,
  contextualSuggestions: true
};

// Configuration spécifique par page
export const PAGE_AI_CONFIGS: Record<string, Partial<AIAssistantConfig>> = {
  '/': {
    defaultExpanded: false,
    size: 'medium'
  },
  '/dashboard': {
    defaultExpanded: false,
    size: 'medium',
    contextualSuggestions: true
  },
  '/finances': {
    size: 'large',
    defaultExpanded: false,
    contextualSuggestions: true
  },
  '/finances/budget': {
    size: 'large',
    defaultExpanded: false
  },
  '/finances/transactions': {
    size: 'medium',
    defaultExpanded: false
  },
  '/members': {
    size: 'medium',
    defaultExpanded: false,
    contextualSuggestions: true
  },
  '/events': {
    size: 'medium',
    defaultExpanded: false,
    contextualSuggestions: true
  },
  '/guidance': {
    size: 'large',
    defaultExpanded: true,  // Ouvert par défaut sur la page guidance
    contextualSuggestions: true
  },
  '/guidance/diagnostic': {
    size: 'large',
    defaultExpanded: true,
    contextualSuggestions: true
  },
  '/guidance/recommendations': {
    size: 'large',
    defaultExpanded: false,
    contextualSuggestions: true
  },
  '/guidance/compliance': {
    size: 'medium',
    defaultExpanded: false,
    contextualSuggestions: true
  },
  '/resources': {
    size: 'medium',
    defaultExpanded: false,
    contextualSuggestions: true
  },
  '/reports': {
    size: 'large',
    defaultExpanded: false,
    contextualSuggestions: true
  },
  '/settings': {
    size: 'small',
    defaultExpanded: false,
    contextualSuggestions: false
  }
};

// Hook pour obtenir la configuration de l'assistant selon la page
export const useAIAssistantConfig = (): AIAssistantConfig => {
  const location = useLocation();
  const path = location.pathname;
  
  // Recherche d'une configuration exacte
  let pageConfig = PAGE_AI_CONFIGS[path];
  
  // Si pas de configuration exacte, recherche par correspondance partielle
  if (!pageConfig) {
    const matchingPath = Object.keys(PAGE_AI_CONFIGS).find(configPath => 
      path.startsWith(configPath) && configPath !== '/'
    );
    if (matchingPath) {
      pageConfig = PAGE_AI_CONFIGS[matchingPath];
    }
  }
  
  return {
    ...DEFAULT_AI_CONFIG,
    ...pageConfig
  };
};

// Suggestions contextuelles par type de page
export const CONTEXTUAL_SUGGESTIONS = {
  dashboard: [
    "Comment améliorer nos performances ?",
    "Analyser nos indicateurs clés",
    "Recommandations prioritaires"
  ],
  finance: [
    "Optimiser notre budget",
    "Analyser nos ratios financiers",
    "Préparer le rapport financier",
    "Gérer les cotisations"
  ],
  members: [
    "Améliorer l'engagement des membres",
    "Optimiser les cotisations",
    "Organiser des activités attractives",
    "Fidéliser nos adhérents"
  ],
  events: [
    "Planifier un événement efficacement",
    "Maximiser la participation",
    "Gérer la logistique",
    "Évaluer le succès d'un événement"
  ],
  guidance: [
    "Évaluer notre maturité organisationnelle",
    "Identifier nos axes d'amélioration",
    "Planifier notre développement",
    "Améliorer notre gouvernance"
  ],
  compliance: [
    "Vérifier nos obligations légales",
    "Mettre à jour nos statuts",
    "Préparer l'assemblée générale",
    "Gérer la conformité RGPD"
  ],
  resources: [
    "Optimiser nos ressources",
    "Rechercher des subventions",
    "Gérer nos partenariats",
    "Développer notre réseau"
  ],
  reports: [
    "Analyser nos performances",
    "Préparer le rapport annuel",
    "Créer des tableaux de bord",
    "Mesurer notre impact"
  ],
  settings: [
    "Configurer mon compte",
    "Gérer les permissions",
    "Optimiser les paramètres",
    "Sauvegarder mes données"
  ]
};

// Fonction pour obtenir les suggestions contextuelles
export const getContextualSuggestions = (pageType: string): string[] => {
  return CONTEXTUAL_SUGGESTIONS[pageType as keyof typeof CONTEXTUAL_SUGGESTIONS] || 
         CONTEXTUAL_SUGGESTIONS.dashboard;
};
