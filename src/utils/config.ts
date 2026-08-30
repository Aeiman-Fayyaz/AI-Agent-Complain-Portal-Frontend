/**
 * Helper to dynamically determine Backend URL for API calls and Socket.IO connections.
 * Ensures http:// or https:// protocol is always prepended.
 */
export const getBackendUrl = (): string => {
  const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  let envUrl = isLocalDev
    ? (import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL)
    : (import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_SOCKET_URL_PROD || import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL);

  if (envUrl && envUrl.trim() !== '') {
    envUrl = envUrl.trim().replace(/\/$/, '');
    if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
      envUrl = `https://${envUrl}`;
    }
    return envUrl;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5500';
    }
    return window.location.origin;
  }

  return 'http://localhost:5500';
};
