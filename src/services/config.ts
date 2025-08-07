/**
 * Configuration centralisée pour les services API
 */

// Configuration API avec fallback automatique
export const getApiBaseUrl = () => {
  // En production, utiliser l'URL Railway directement
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_BACKEND_URL || 'https://opencommunitymanager2.up.railway.app/api';
  }
  // En développement, utiliser le proxy local
  return import.meta.env.VITE_BACKEND_URL || '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Configuration pour les requêtes fetch avec CORS
export const getFetchConfig = (options: RequestInit = {}): RequestInit => ({
  headers: {
    'Content-Type': 'application/json',
    ...options.headers,
  },
  credentials: 'include',
  ...options,
});

// Helper pour construire les URLs d'API
export const buildApiUrl = (endpoint: string) => {
  const baseUrl = API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Debug des URLs
console.log('🔧 [Config] Environment:', import.meta.env.MODE);
console.log('🔧 [Config] VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
console.log('🔧 [Config] API_BASE_URL:', API_BASE_URL);

// Test des URLs générées
console.log('🧪 [Config] Test URL /auth/login:', buildApiUrl('/auth/login'));
console.log('🧪 [Config] Test URL /finances:', buildApiUrl('/finances'));
