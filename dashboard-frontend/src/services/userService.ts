// src/services/usersService.ts
import type { User } from "../types/auth";
import api from "./api";


export const usersService = {
  // GET /users
  listUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  // PATCH /users/me
  updateMe: async (data: { name?: string; email?: string }): Promise<User> => {
    const response = await api.patch("/users/me", data);
    return response.data;
  },

  // PATCH /users/:id/role
  updateUserRole: async (targetUserId: string, role: string): Promise<User> => {
    const response = await api.patch(`/users/${targetUserId}/role`, { role });
    return response.data;
  },

  // PATCH /users/:id/deactivate
  deactivateUser: async (targetUserId: string): Promise<void> => {
    await api.patch(`/users/${targetUserId}/deactivate`);
  },

  // POST /users/logout
  logoutBackend: async (): Promise<void> => {
    await api.post("/users/logout");
  },

  // POST /users/invite
  inviteMember: async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const response = await api.post("/users/invite", data);
    return response.data;
  },
};
