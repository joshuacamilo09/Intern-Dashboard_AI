// src/services/ordersService.ts
import api from "./api";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtSale: number;
}

export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELED" | "REFUNDED";
  createdAt: string;
}

export const ordersService = {

  create: async (orderData: {
    customerId: string;
    items: { productId: string; quantity: number }[];
  }) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    try {
      const token = localStorage.getItem("@App:token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "Orders Service Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getById: async (orderId: string): Promise<Order> => {
    const token = localStorage.getItem("@App:token");
    const response = await api.get(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateStatus: async (orderId: string, status: string): Promise<Order> => {
    const token = localStorage.getItem("@App:token");
    const response = await api.patch(
      `/orders/${orderId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default ordersService;
