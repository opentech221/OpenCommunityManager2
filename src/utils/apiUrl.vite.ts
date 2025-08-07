import { API_BASE_URL } from '../services/config';

export function apiUrl(path: string) {
  // Si l'URL est déjà complète, la retourner telle quelle
  if (/^https?:\/\//.test(path)) return path;
  
  let finalUrl: string;
  
  // Si le path commence déjà par /api, on utilise seulement la base URL sans /api
  if (path.startsWith('/api')) {
    const baseWithoutApi = API_BASE_URL.replace(/\/api$/, '');
    finalUrl = `${baseWithoutApi}${path}`;
  } else {
    // Sinon, utiliser notre configuration centralisée normalement
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    finalUrl = `${API_BASE_URL}${cleanPath}`;
  }
  
  console.log(`🔗 [apiUrl] ${path} -> ${finalUrl}`);
  return finalUrl;
}
