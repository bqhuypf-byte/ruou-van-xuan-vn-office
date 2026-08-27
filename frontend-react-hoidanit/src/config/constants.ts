export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/** Origin the API server runs on (API_BASE_URL minus the `/api/v1` path) — uploaded files are served from here. */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+\/?$/, '');
