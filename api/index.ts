import axios from "axios";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send session cookies for dev auth
});

// --- Clerk Bearer token support ---
// When Clerk is active, a token-getter function is registered here.
// The interceptor calls it on every request to attach a fresh JWT.
let _getToken: (() => Promise<string | null>) | null = null;

export function registerTokenGetter(fn: (() => Promise<string | null>) | null) {
  _getToken = fn;
}

api.interceptors.request.use(async (config) => {
  if (_getToken) {
    try {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // token fetch failed — proceed without auth header
    }
  }
  return config;
});
