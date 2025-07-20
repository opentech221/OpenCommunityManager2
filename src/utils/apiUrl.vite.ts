export function apiUrl(path: string) {
  const base = import.meta.env.VITE_BACKEND_URL || '';
  if (/^https?:\/\//.test(path)) return path;
  return base.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path);
}
