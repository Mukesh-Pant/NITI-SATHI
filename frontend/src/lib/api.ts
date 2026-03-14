import axios from "axios";
import { API_BASE_URL } from "./constants";
import type {
  TokenResponse,
  User,
  Session,
  SessionDetail,
  ChatResponse,
  LegalDocument,
} from "@/types";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// JWT interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem("access_token", data.access_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (email: string, password: string, full_name: string) =>
    api.post<TokenResponse>("/auth/signup", { email, password, full_name }),

  login: (email: string, password: string) =>
    api.post<TokenResponse>("/auth/login", { email, password }),

  getMe: () => api.get<User>("/auth/me"),

  updateMe: (data: { full_name?: string; preferred_language?: string }) =>
    api.put<User>("/auth/me", data),
};

// Sessions API
export const sessionsAPI = {
  list: () => api.get<Session[]>("/sessions"),

  create: (language = "en") => api.post<Session>("/sessions", { language }),

  get: (id: string) => api.get<SessionDetail>(`/sessions/${id}`),

  update: (id: string, title: string) =>
    api.put<Session>(`/sessions/${id}`, { title }),

  delete: (id: string) => api.delete(`/sessions/${id}`),
};

// Chat API
export const chatAPI = {
  send: (message: string, session_id?: string, language = "en") =>
    api.post<ChatResponse>("/chat", { message, session_id, language }),

  streamUrl: (message: string, session_id?: string, language = "en") => {
    const params = new URLSearchParams({
      message,
      language,
      ...(session_id && { session_id }),
    });
    const token = localStorage.getItem("access_token");
    return `${API_BASE_URL}/chat/stream?${params.toString()}&token=${token}`;
  },
};

// Documents API
export const documentsAPI = {
  list: () => api.get<LegalDocument[]>("/documents"),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id: string) => api.delete(`/documents/${id}`),
};

export default api;
