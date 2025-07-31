// Mock pour apiUrl.vite.ts - évite les problèmes avec import.meta.env dans Jest

export function apiUrl(path: string): string {
  const base = 'http://localhost:5000';
  
  // Si c'est déjà une URL complète, on la retourne telle quelle
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  
  // Sinon on construit l'URL avec le base URL
  const cleanBase = base.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  
  return cleanBase + cleanPath;
}

export default apiUrl;
