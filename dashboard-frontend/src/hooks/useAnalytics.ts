import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";
import type {
  DashboardStats,
  RevenueData,
  CategoryData,
  TopProduct,
  RecentOrder,
} from "../services/analyticsService";

export const useAnalytics = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7); // Padrão: 7 dias

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log(
        `📊 Dashboard: Solicitando dados dos últimos ${range} dias...`
      );

      // Todas as chamadas agora usam o 'range' de forma consistente
      const [
        statsData,
        revenueChartData,
        categoryDistData,
        topProductsData,
        ordersData,
      ] = await Promise.all([
        analyticsService.getStats(range), 
        analyticsService.getRevenueChart(range),
        analyticsService.getCategoryDistribution(range),
        analyticsService.getTopProducts(5, range),
        analyticsService.getRecentOrders(10),
      ]);

      setStats(statsData);
      setRevenueData(revenueChartData);
      setCategoryData(categoryDistData);
      setTopProducts(topProductsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [range]); // Importante: recarrega quando o usuário muda o seletor de datas

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = () => {
    fetchData();
  };

  return {
    stats,
    revenueData,
    categoryData,
    topProducts,
    recentOrders,
    loading,
    range,
    setRange,
    refresh,
  };
};
