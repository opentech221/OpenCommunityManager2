export function apiUrl(path: string) {
  const base = process.env.VITE_BACKEND_URL || '';
  if (/^https?:\/\//.test(path)) return path;
  return base.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path);
}
