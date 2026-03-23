import { useState, useCallback } from "react";
import ordersService, { type Order } from "../services/ordersService";
import { useAuth } from "./useAuth";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getAll();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error loading orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
      throw new Error("No permission to update orders.");
    }
    const response = await ordersService.updateStatus(orderId, status);
    await loadOrders(); 
    return response;
  };

  return {
    orders,
    loading,
    error,
    loadOrders,
    updateOrderStatus,
  };
};
