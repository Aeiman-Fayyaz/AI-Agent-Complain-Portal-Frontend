/**
 * Helper to dynamically determine Backend URL for API calls and Socket.IO connections.
 * Ensures http:// or https:// protocol is always prepended.
 */
export const getBackendUrl = (): string => {
  let envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
  
  if (envUrl && envUrl.trim() !== '') {
    envUrl = envUrl.trim().replace(/\/$/, '');
    // Ensure protocol is present
    if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
      envUrl = `https://${envUrl}`;
    }
    return envUrl;
  }

  // Local development fallback: automatically target http://localhost:5000
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    // Production deployment fallback (same origin)
    return window.location.origin;
  }

  return 'http://localhost:5000';
};
