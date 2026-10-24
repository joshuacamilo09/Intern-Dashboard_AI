import { useState, useCallback } from "react";
import {
  productsService,
  type Product,
  type ProductFilters,
} from "../services/productsService";
import { useAuth } from "./useAuth";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadProducts = useCallback(async (filters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getAll(filters);
      setProducts(data);
    } catch (err: any) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (data: any) => {
    if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
      throw new Error("Permission denied to create products.");
    }
    const response = await productsService.create(data);
    await loadProducts(); // Atualiza a lista após criar
    return response;
  };

  const updateProduct = async (id: string, data: any) => {
    if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
      throw new Error("Permission denied to edit products.");
    }
    const response = await productsService.update(id, data);
    await loadProducts();
    return response;
  };

  const deleteProduct = async (id: string) => {
    if (user?.role !== "ADMIN") {
      throw new Error("Only administrators can disable products.");
    }
    const response = await productsService.deactivate(id);
    await loadProducts();
    return response;
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
