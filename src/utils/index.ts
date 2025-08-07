// Utilitaires et fonctions helpers pour l'application
import { apiUrl } from './apiUrl.vite';

// Export de la fonction apiUrl depuis l'implémentation réelle
export { apiUrl };

/**
 * Convertit une date en ISO string de manière sécurisée
 */
export const safeToISOString = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;
  
  let dateObj: Date;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return null;
  }
  
  if (isNaN(dateObj.getTime())) {
    console.warn('⚠️ [safeToISOString] Date invalide:', date);
    return null;
  }
  
  return dateObj.toISOString();
};

/**
 * Convertit une date en format YYYY-MM-DD de manière sécurisée
 */
export const safeDateToInputString = (date: Date | string | null | undefined): string => {
  const isoString = safeToISOString(date);
  return isoString ? isoString.split('T')[0] : '';
};

/**
 * Formate une date en français
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'Date non renseignée';
  
  let dateObj: Date;
  
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return 'Date invalide';
  }
  
  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) {
    return 'Date invalide';
  }
  
  return dateObj.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formate une date avec l'heure
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'Date non renseignée';
  
  let dateObj: Date;
  
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return 'Date invalide';
  }
  
  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) {
    return 'Date invalide';
  }
  
  return dateObj.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formate un montant en FCFA
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount).replace('XOF', 'FCFA');
};

/**
 * Formate un numéro de téléphone
 */
export const formatPhoneNumber = (phone: string): string => {
  // Supprime tous les caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Formate pour les numéros sénégalais (+221 XX XXX XX XX)
  if (cleaned.startsWith('+221')) {
    const number = cleaned.slice(4);
    if (number.length === 9) {
      return `+221 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
    }
  }
  
  // Formate pour les numéros guinéens (+224 XXX XXX XXX)
  if (cleaned.startsWith('+224')) {
    const number = cleaned.slice(4);
    if (number.length === 9) {
      return `+224 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    }
  }
  
  return phone;
};

/**
 * Calcule le pourcentage de changement
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Génère une couleur aléatoire pour les avatars
 */
export const getRandomAvatarColor = (name: string): string => {
  const colors = [
    'bg-primary-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-red-500',
    'bg-yellow-500',
  ];
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Obtient les initiales d'un nom
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone (Sénégal, Guinée, Mali, etc.)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Supprime tous les espaces et caractères spéciaux
  const cleanPhone = phone.replace(/[\s\-().]/g, '');
  
  // Vérifie les formats courants pour l'Afrique de l'Ouest
  const phoneRegex = /^(\+221|221|77|78|70|76|75)[0-9]{7,8}$|^(\+224|224)[0-9]{8,9}$|^(\+223|223)[0-9]{8}$|^(\+226|226)[0-9]{8}$/;
  
  // Accepte aussi les formats avec espaces
  const phoneWithSpacesRegex = /^\+221\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$|^\+224\s?\d{3}\s?\d{3}\s?\d{3}$|^\+223\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;
  
  return phoneRegex.test(cleanPhone) || phoneWithSpacesRegex.test(phone);
};

/**
 * Génère un identifiant unique
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function pour limiter les appels
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Convertit une taille de fichier en format lisible
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Vérifie si une date est passée
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Calcule le nombre de jours entre deux dates
 */
export const daysBetweenDates = (date1: Date | string, date2: Date | string): number => {
  const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(dateObj2.getTime() - dateObj1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ...existing code...
// URL de l'API backend
// ...existing code...

// ...existing code...
