import { API_BASE_URL } from '../services/config';

export function apiUrl(path: string) {
  // Si l'URL est déjà complète, la retourner telle quelle
  if (/^https?:\/\//.test(path)) return path;
  
  // Utiliser notre configuration centralisée
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
