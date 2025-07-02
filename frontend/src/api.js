// Centralized API helper for backend URL
const API_BASE = import.meta.env.VITE_API_URL;

export const apiUrl = (route) => `${API_BASE}${route}`;
