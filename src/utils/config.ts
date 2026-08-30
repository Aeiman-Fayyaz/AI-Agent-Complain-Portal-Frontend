/**
 * Helper to dynamically determine Backend URL for API calls and Socket.IO connections.
 * Works seamlessly on:
 * - Localhost (port 5173, 5174, 3000, etc.) -> connects to http://localhost:5000
 * - Custom Vercel environment variables (VITE_API_URL / VITE_BACKEND_URL)
 * - Production deployments
 */
export const getBackendUrl = (): string => {
  // Check for explicit environment variable first
  const envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }

  // Local development fallback: automatically target http://localhost:5000
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    // Production deployment fallback (same origin or current domain)
    return window.location.origin;
  }

  return 'http://localhost:5000';
};
