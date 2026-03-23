import api from "./api";

// ============================================
// INTERFACES
// ============================================
export interface DashboardStats {
  totalRevenue: number;
  ordersCount: number;
  customersCount: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}

export interface RevenueData {
  name: string;
  revenue: number;
}

export interface CategoryData {
  label: string;
  value: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  revenue: number;
  quantity: number;
}

export interface RecentOrder {
  id: string;
  total: number;
  customer: string;
  createdAt: string;
}

export interface ActivityData {
  id: string;
  type: "order" | "customer" | "product" | "status";
  message: string;
  time: string;
  color: string;
}

// ============================================
// HELPER - CORRIGIDO PARA NORMALIZAR DATAS
// ============================================
const getParams = (days: number) => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // Final do dia de hoje

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0); // Início do dia

  console.log("📅 Date params generated:", {
    days,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

// ============================================
// SERVICE
// ============================================
export const analyticsService = {
  /**
   * Obtém as métricas principais (Cards superiores)
   */
  getStats: async (days: number): Promise<DashboardStats> => {
    console.log("📊 Fetching stats for", days, "days");
    const response = await api.get("/analytics/overview", {
      params: getParams(days),
    });
    console.log("✅ Stats received:", response.data);
    return response.data;
  },

  /**
   * Dados para o gráfico de área (Receita ao longo do tempo)
   */
  getRevenueChart: async (days: number): Promise<RevenueData[]> => {
    const params = getParams(days);
    const groupBy = days > 30 ? "month" : "day";

    console.log("📈 Fetching revenue chart:", { days, groupBy });
    const response = await api.get("/analytics/revenue", {
      params: { ...params, groupBy },
    });
    console.log("✅ Revenue data received:", response.data.length, "points");
    return response.data;
  },

  /**
   * Distribuição por categoria (Gráfico de Pizza)
   */
  getCategoryDistribution: async (days: number): Promise<CategoryData[]> => {
    console.log("🥧 Fetching category distribution for", days, "days");
    const response = await api.get("/analytics/revenue-by-category", {
      params: getParams(days),
    });
    console.log("✅ Categories received:", response.data.length, "categories");
    return response.data;
  },

  /**
   * Produtos mais vendidos
   */
  getTopProducts: async (limit = 5, days: number): Promise<TopProduct[]> => {
    console.log("🏆 Fetching top products:", { limit, days });
    const response = await api.get("/analytics/top-products", {
      params: { ...getParams(days), limit },
    });
    console.log("✅ Top products received:", response.data.length, "products");
    return response.data;
  },

  /**
   * Últimas encomendas
   */
  getRecentOrders: async (limit = 10): Promise<RecentOrder[]> => {
    console.log("📦 Fetching recent orders:", limit);
    const response = await api.get("/analytics/recent-orders", {
      params: { limit },
    });
    console.log("✅ Orders received:", response.data.length, "orders");
    return response.data;
  },

  /**
   * Feed de atividades
   */
  getRecentActivity: async (limit = 8): Promise<ActivityData[]> => {
    console.log("🔔 Fetching recent activity:", limit);
    const response = await api.get("/analytics/recent-activity", {
      params: { limit },
    });
    console.log("✅ Activities received:", response.data.length, "activities");
    return response.data;
  },
};

export default analyticsService;