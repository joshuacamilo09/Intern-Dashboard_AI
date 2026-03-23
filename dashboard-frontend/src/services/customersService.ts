// src/services/customersService.ts
import api from "./api";

export interface Customer {
  ordersCount: number;
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("@App:token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const customersService = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<Customer[]>("/customers", {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Customers Service Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getById: async (customerId: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${customerId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  create: async (data: {
    name: string;
    email: string;
    phone?: string;
  }): Promise<Customer> => {
    const response = await api.post<Customer>("/customers", data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  update: async (
    customerId: string,
    data: { name?: string; email?: string; phone?: string }
  ): Promise<Customer> => {
    const response = await api.patch<Customer>(
      `/customers/${customerId}`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  deactivate: async (customerId: string): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>(
      `/customers/${customerId}/deactivate`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};

export default customersService;
