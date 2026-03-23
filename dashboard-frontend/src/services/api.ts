import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

interface AxiosRequestWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@App:token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestWithRetry;

    // Ignora erros que não são 401 ou são de rotas de auth
    if (
      error.response?.status !== 401 ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/forgot-password") ||
      originalRequest.url?.includes("/auth/reset-password")
    ) {
      return Promise.reject(error);
    }

    // Se já tentou refresh, faz logout
    if (originalRequest._retry) {
      logout();
      return Promise.reject(error);
    }

    // Se já está refreshing, coloca na fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true, // ✅ Envia o cookie
        }
      );

      const newAccessToken = data.access_token;

      if (!newAccessToken) {
        throw new Error("No access token in refresh response");
      }

      console.log("✅ Token refreshed successfully");

      // Atualiza token no localStorage
      localStorage.setItem("@App:token", newAccessToken);

      // Atualiza header da requisição original
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      // Processa fila de requisições
      processQueue(null, newAccessToken);
      isRefreshing = false;

      return axios(originalRequest);
    } catch (err) {
      console.error("❌ Refresh token failed:", err);
      processQueue(err, null);
      isRefreshing = false;
      logout();
      return Promise.reject(err);
    }
  }
);

function logout() {
  console.log("🚪 Logout triggered");
  localStorage.clear();
  window.location.href = "/login";
}

export default api;

export { logout };
