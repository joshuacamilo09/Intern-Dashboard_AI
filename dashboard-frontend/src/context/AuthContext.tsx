import React, { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import type { User, LoginDTO } from "../types/auth";
import { usersService } from "../services/userService";

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  logout: () => void;
  signIn(credentials: LoginDTO): Promise<void>;
  signOut(): void;
  /**
   * Permite atualizar os dados do usuário logado manualmente no estado global.
   * Útil para refletir alterações de perfil (nome, email) instantaneamente.
   */
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = localStorage.getItem("@App:user");
      const storageToken = localStorage.getItem("@App:token");

      if (storageUser && storageToken) {
        try {
          setUser(JSON.parse(storageUser));
        } catch (error) {
          console.error("Error parsing storage user.", error);
          localStorage.removeItem("@App:user");
        }
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signIn = useCallback(async (credentials: LoginDTO) => {
    try {
      const data = await authService.login(credentials);

      // Estrutura: data { user, tokens: { access_token, refreshToken } }
      const { user: userData, tokens } = data;

      setUser(userData);
      localStorage.setItem("@App:user", JSON.stringify(userData));
      localStorage.setItem("@App:token", tokens.access_token);
      localStorage.setItem("@App:refreshToken", tokens.refreshToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Chama a rota @Post('logout') do NestJS
      await usersService.logoutBackend();
    } catch (error) {
      console.error("Error invalidating session on the server.", error);
    } finally {
      // Limpa tudo localmente, independentemente de erro no server
      localStorage.removeItem("@App:user");
      localStorage.removeItem("@App:token");
      localStorage.removeItem("@App:refreshToken");
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signOut,
        logout: signOut,
        setUser, // Expondo a função para os componentes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
