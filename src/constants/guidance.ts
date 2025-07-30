import type { OrganizationalMaturityLevel } from '../types/guidance';

// Niveaux de maturité organisationnelle (5 niveaux)
export const MATURITY_LEVELS: OrganizationalMaturityLevel[] = [
  {
    id: 1,
    name: "🌱 Émergent",
    description: "Structure de base, documentation minimale",
    icon: "Seedling",
    color: "bg-green-100 text-green-800",
    requirements: [
      "Statuts déposés en préfecture",
      "Bureau constitué (minimum Président, Trésorier, Secrétaire)",
      "Assemblée générale constitutive tenue",
      "Compte bancaire ouvert"
    ],
    benefits: [
      "Existence légale reconnue",
      "Possibilité de recevoir des dons",
      "Éligibilité aux subventions de base"
    ]
  },
  {
    id: 2,
    name: "🏗️ Structuré",
    description: "Gouvernance établie, processus définis",
    icon: "Building",
    color: "bg-blue-100 text-blue-800",
    requirements: [
      "Règlement intérieur adopté",
      "Procès-verbaux systématiques",
      "Plan d'action annuel défini",
      "Système de cotisations en place",
      "Roles et responsabilités clarifiés"
    ],
    benefits: [
      "Fonctionnement interne structuré",
      "Meilleure organisation des activités",
      "Crédibilité renforcée auprès des partenaires"
    ]
  },
  {
    id: 3,
    name: "⚙️ Organisé",
    description: "Procédures optimisées, contrôles internes",
    icon: "Settings",
    color: "bg-purple-100 text-purple-800",
    requirements: [
      "Procédures documentées et appliquées",
      "Gestion financière rigoureuse",
      "Système de reporting en place",
      "Formation des dirigeants réalisée",
      "Outils de gestion modernes utilisés"
    ],
    benefits: [
      "Efficacité opérationnelle optimisée",
      "Réduction des risques",
      "Capacité de croissance maîtrisée"
    ]
  },
  {
    id: 4,
    name: "🎯 Optimisé",
    description: "Performance mesurée, amélioration continue",
    icon: "Target",
    color: "bg-orange-100 text-orange-800",
    requirements: [
      "Indicateurs de performance définis",
      "Évaluation d'impact régulière",
      "Système qualité en place",
      "Innovation dans les pratiques",
      "Partenariats stratégiques développés"
    ],
    benefits: [
      "Impact social mesurable",
      "Reconnaissance sectorielle",
      "Accès aux financements majeurs"
    ]
  },
  {
    id: 5,
    name: "🚀 Excellence",
    description: "Innovation, leadership sectoriel, impact mesurable",
    icon: "Rocket",
    color: "bg-red-100 text-red-800",
    requirements: [
      "Leadership sectoriel reconnu",
      "Innovation et R&D actives",
      "Influence sur les politiques publiques",
      "Essaimage et multiplication",
      "Standards d'excellence certifiés"
    ],
    benefits: [
      "Référence sectorielle",
      "Impact systémique",
      "Pérennité assurée"
    ]
  }
];

// Catégories de compliance
export const COMPLIANCE_CATEGORIES = {
  legal: {
    name: "Conformité Légale",
    icon: "Scale",
    color: "text-red-600",
    description: "Respect des obligations légales et réglementaires"
  },
  governance: {
    name: "Gouvernance",
    icon: "Users",
    color: "text-blue-600",
    description: "Structure de gouvernance et processus décisionnels"
  },
  financial: {
    name: "Gestion Financière",
    icon: "DollarSign",
    color: "text-green-600",
    description: "Transparence et rigueur financière"
  },
  operational: {
    name: "Fonctionnement",
    icon: "Cog",
    color: "text-purple-600",
    description: "Efficacité opérationnelle et qualité des services"
  }
} as const;

// Checks de compliance par défaut
export const DEFAULT_COMPLIANCE_CHECKS = [
  // Conformité Légale
  {
    id: "legal_statuts",
    category: "legal" as const,
    title: "Statuts déposés et à jour",
    description: "Les statuts sont déposés en préfecture et reflètent la situation actuelle",
    required: true,
    status: "pending" as const
  },
  {
    id: "legal_reglement",
    category: "legal" as const,
    title: "Règlement intérieur adopté",
    description: "Le règlement intérieur complète les statuts et est voté en AG",
    required: true,
    status: "pending" as const
  },
  {
    id: "legal_ag_annuelle",
    category: "legal" as const,
    title: "Assemblée générale annuelle",
    description: "L'AG annuelle est tenue dans les délais réglementaires",
    required: true,
    status: "pending" as const
  },
  
  // Gouvernance
  {
    id: "gov_bureau",
    category: "governance" as const,
    title: "Bureau constitué",
    description: "Le bureau est élu et comprend au minimum Président, Trésorier, Secrétaire",
    required: true,
    status: "pending" as const
  },
  {
    id: "gov_pv",
    category: "governance" as const,
    title: "Procès-verbaux systématiques",
    description: "Toutes les réunions font l'objet de PV archivés",
    required: true,
    status: "pending" as const
  },
  
  // Gestion Financière
  {
    id: "fin_compte_bancaire",
    category: "financial" as const,
    title: "Compte bancaire dédié",
    description: "L'association dispose d'un compte bancaire exclusivement dédié",
    required: true,
    status: "pending" as const
  },
  {
    id: "fin_comptabilite",
    category: "financial" as const,
    title: "Tenue de la comptabilité",
    description: "La comptabilité est tenue de manière rigoureuse et à jour",
    required: true,
    status: "pending" as const
  },
  
  // Fonctionnement
  {
    id: "op_plan_action",
    category: "operational" as const,
    title: "Plan d'action annuel",
    description: "Un plan d'action est défini et suivi annuellement",
    required: false,
    status: "pending" as const
  }
];

// Templates de documents par type d'organisation
export const DOCUMENT_TEMPLATES = {
  statuts: {
    association_culturelle: "Template spécialisé pour associations culturelles...",
    association_sportive: "Template spécialisé pour associations sportives...",
    association_humanitaire: "Template spécialisé pour associations humanitaires...",
    mutuelle: "Template spécialisé pour mutuelles...",
    cooperative: "Template spécialisé pour coopératives..."
  }
} as const;

// Modules de guidance disponibles
export const GUIDANCE_MODULES = [
  {
    id: "structuration_initiale",
    title: "Structuration Initiale",
    description: "Guide complet pour créer et structurer votre organisation",
    category: "structuration" as const,
    maturityLevel: 1,
    duration: "2-3 semaines",
    steps: [
      {
        id: "step_1",
        title: "Définir la mission et vision",
        description: "Clarifier l'objet social et les objectifs",
        type: "form" as const,
        content: "Formulaire guidé pour définir mission, vision, valeurs",
        resources: ["Guide méthodologique", "Exemples sectoriels"],
        estimatedTime: "2-3 heures",
        completed: false
      },
      {
        id: "step_2",
        title: "Rédiger les statuts",
        description: "Créer les statuts adaptés à votre organisation",
        type: "template" as const,
        content: "Template de statuts personnalisable",
        resources: ["Modèles sectoriels", "Guide juridique"],
        estimatedTime: "4-6 heures",
        completed: false
      }
    ],
    prerequisites: [],
    outcomes: ["Statuts rédigés", "Mission clarifiée", "Gouvernance définie"]
  }
] as const;
