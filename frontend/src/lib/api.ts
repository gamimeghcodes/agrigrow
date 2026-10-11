// Centralized API configuration.
//
// In production, set VITE_API_URL (e.g. https://api.yourdomain.com/api) in the
// deployment environment. Falls back to the local Django dev server only when
// VITE_API_URL isn't set, so local development keeps working out of the box.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Fetch wrapper that prefixes `path` with the configured API base URL.
 * `path` should start with a leading slash, e.g. apiFetch("/listings/").
 */
export function apiFetch(path: string, options?: RequestInit) {
  return fetch(`${API_BASE_URL}${path}`, options);
}
