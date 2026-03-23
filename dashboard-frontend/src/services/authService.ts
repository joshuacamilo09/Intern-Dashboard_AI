import api from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    
    // ✅ Salva o access token
    localStorage.setItem("@App:token", response.data.access_token);
    
    // ✅ CORRIGIDO: Retorna no formato que o AuthContext espera
    return {
      user: response.data.user,
      tokens: {
        access_token: response.data.access_token,
        refreshToken: response.data.refreshToken || "", // Se vier no cookie, pode não vir na resposta
      }
    };
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post("/auth/signup", credentials);

    // ✅ Salva apenas o access token
    localStorage.setItem("@App:token", response.data.access_token);

    return {
      user: response.data.user,
      tokens: {
        access_token: response.data.access_token,
        refreshToken: response.data.refreshToken || "",
      }
    };
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const response = await api.post("/auth/reset-password", {
      token: data.token,
      password: data.password,
    });
    return response.data;
  },
};

export default authService;
