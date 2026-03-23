// src/services/productsService.ts
import api from "./api";

export interface Product {
  stock: number;
  id: string;
  name: string;
  category: string;
  price: number;
  cost?: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  category: string;
  cost?: number;
  stock?: number;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  category?: string;
  cost?: number;
  stock?: number;
}

export interface ProductFilters {
  status?: "ACTIVE" | "INACTIVE";
  category?: string;
  orderBy?: "name" | "price" | "createdAt";
  order?: "asc" | "desc";
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

export const productsService = {
 
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();

      if (filters?.status) params.append("status", filters.status);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.orderBy) params.append("orderBy", filters.orderBy);
      if (filters?.order) params.append("order", filters.order);

      const queryString = params.toString();
      const url = `/product${queryString ? `?${queryString}` : ""}`;

      const response = await api.get<Product[]>(url, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "Products Service Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  
  getById: async (productId: string): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/product/${productId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Get Product Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },


  create: async (data: CreateProductDto): Promise<Product> => {
    // Garantir que enviamos apenas o que o backend espera no 'data'
    const payload = {
      stock: data.stock,
      name: data.name,
      price: Number(data.price), // Convertendo para garantir que vai número
      category: data.category,
      cost: data.cost ? Number(data.cost) : undefined,
    };

    const response = await api.post<Product>("/product", payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  update: async (
    productId: string,
    data: UpdateProductDto
  ): Promise<Product> => {
    const payload = {
      stock : data.stock,
      name: data.name,
      price: data.price ? Number(data.price) : undefined,
      category: data.category,
      cost: data.cost ? Number(data.cost) : undefined,
    };

    const response = await api.patch<Product>(
      `/product/${productId}`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  deactivate: async (productId: string): Promise<{ message: string }> => {
    // Note: O teu backend usa o método DELETE para chamar o deactivateProduct
    const response = await api.delete<{ message: string }>(
      `/product/${productId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};

export default productsService;
