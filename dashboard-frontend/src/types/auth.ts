export type UserRole = "ADMIN" | "MANAGER" | "VIEWER";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refreshToken: string;
  };
}
