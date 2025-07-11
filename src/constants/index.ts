export const APP_NAME = 'Open Community Manager';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  COTISATIONS: '/cotisations',
  EVENTS: '/events',
  FINANCES: '/finances',
  DOCUMENTS: '/documents',
  MESSAGES: '/messages',
  PUBLIC_PROFILE: '/public-profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  BILLING: '/billing',
  SECURITY: '/security',
  // Pages légales et support
  LEGAL: '/legal',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HELP: '/help',
  // Pages supplémentaires
  DOCUMENTATION: '/documentation',
  CONTACT: '/contact',
  TRAINING: '/training',
  DEMO: '/demo',
} as const;

export const MEMBER_ROLES = {
  PRESIDENT: 'Président(e)',
  VICE_PRESIDENT: 'Vice-Président(e)',
  SECRETARY: 'Secrétaire',
  TREASURER: 'Trésorier(ière)',
  MEMBER: 'Membre',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'Espèces',
  BANK_TRANSFER: 'Virement bancaire',
  MOBILE_MONEY: 'Mobile Money',
  CHECK: 'Chèque',
} as const;

export const PAYMENT_STATUS = {
  PAID: 'Payé',
  PENDING: 'En attente',
  OVERDUE: 'En retard',
} as const;

export const MEMBER_STATUS = {
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  INACTIVE: 'Inactif',
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'Recette',
  EXPENSE: 'Dépense',
} as const;

export const DOCUMENT_TYPES = {
  PV: 'Procès-verbal',
  FINANCIAL_REPORT: 'Rapport financier',
  STATUTES: 'Statuts',
  OTHER: 'Autre',
} as const;

export const COLORS = {
  PRIMARY: '#6600cc',
  ORANGE: '#FF6600',
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_500: '#6b7280',
  GRAY_900: '#111827',
} as const;
