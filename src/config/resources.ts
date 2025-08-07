// Configuration pour le module de gestion des ressources
export const RESOURCE_CONFIG = {
  // Limites et contraintes
  limits: {
    maxHumanResources: 1000,
    maxMaterialResources: 5000,
    maxSkillsPerPerson: 20,
    maxSearchResults: 100,
    maxExportRecords: 10000
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100
  },

  // Mots-clés de recherche populaires
  popularKeywords: {
    human: [
      'communication', 
      'informatique', 
      'gestion', 
      'animation', 
      'formation', 
      'comptabilité',
      'marketing',
      'juridique',
      'secrétariat',
      'événementiel'
    ],
    material: [
      'ordinateur', 
      'projecteur', 
      'table', 
      'hp', 
      'epson', 
      'bureau', 
      'réunion',
      'microphone',
      'écran',
      'imprimante',
      'véhicule',
      'sono'
    ]
  },

  // Validations
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    serialNumber: /^[A-Z0-9-_]{3,50}$/i,
    minNameLength: 2,
    maxNameLength: 100,
    maxDescriptionLength: 1000,
    maxNotesLength: 2000
  },

  // Messages de feedback
  messages: {
    success: {
      humanAdded: 'Nouvelle personne ajoutée avec succès.',
      materialAdded: 'Nouveau matériel ajouté avec succès.',
      humanDeleted: 'Ressource humaine supprimée avec succès.',
      materialDeleted: 'Ressource matérielle supprimée avec succès.',
      exported: 'Export réalisé avec succès.'
    },
    error: {
      networkError: 'Erreur de connexion. Veuillez réessayer.',
      validationError: 'Veuillez vérifier les informations saisies.',
      notFound: 'Ressource introuvable.',
      unauthorized: 'Action non autorisée.',
      serverError: 'Erreur serveur. Veuillez contacter le support.'
    },
    warning: {
      duplicateEmail: 'Cette adresse email est déjà utilisée.',
      duplicateSerial: 'Ce numéro de série existe déjà.',
      warrantyExpired: 'La garantie de cet équipement a expiré.',
      maintenanceNeeded: 'Cet équipement nécessite une maintenance.'
    }
  },

  // Couleurs pour les statuts
  statusColors: {
    availability: {
      DISPONIBLE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      OCCUPÉ: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      UTILISÉ: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      INDISPONIBLE: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      EN_MAINTENANCE: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    },
    condition: {
      EXCELLENT: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      BON: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      MOYEN: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      MAUVAIS: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    }
  },

  // Configuration d'export
  export: {
    formats: ['csv', 'json'],
    csvDelimiter: ',',
    csvEncoding: 'utf-8-bom',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['human', 'material', 'both']
  },

  // Configuration des notifications
  notifications: {
    autoHide: true,
    hideAfter: 3000, // 3 secondes
    maxNotifications: 5,
    position: 'top-right'
  },

  // Maintenance et alertes
  maintenance: {
    warrantyAlertDays: 30, // Alerte 30 jours avant expiration
    maintenanceReminderDays: 90, // Rappel de maintenance tous les 90 jours
    deprecationRate: 0.15 // 15% de dépréciation par an par défaut
  },

  // URLs et endpoints (pour futur)
  api: {
    baseUrl: process.env.REACT_APP_API_URL || '/api',
    endpoints: {
      humanResources: '/human-resources',
      materialResources: '/material-resources',
      export: '/export',
      import: '/import',
      categories: '/categories'
    }
  },

  // Cache et performances
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100 // Nombre max d'entrées en cache
  },

  // Interface utilisateur
  ui: {
    defaultTab: 'human',
    animationDuration: 200,
    debounceDelay: 300, // Délai pour la recherche
    cardMinHeight: 200,
    cardMaxHeight: 400,
    floatingButtonPosition: { bottom: 24, right: 24 }
  }
} as const;

// Types dérivés de la configuration
export type AvailabilityStatus = keyof typeof RESOURCE_CONFIG.statusColors.availability;
export type ConditionStatus = keyof typeof RESOURCE_CONFIG.statusColors.condition;
export type ExportFormat = typeof RESOURCE_CONFIG.export.formats[number];
export type ExportType = typeof RESOURCE_CONFIG.export.allowedTypes[number];
