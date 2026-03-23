import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { RevenueChart } from "../../components/dashboard/RevenueChart";
import { CategoryChart } from "../../components/dashboard/CategoryChart";
import { RecentOrdersTable } from "../../components/dashboard/RecentOrdersTable";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { DateRangePicker } from "../../components/dashboard/DateRangePicker";

import { useAnalytics } from "../../hooks/useAnalytics";
import TopProductsChart from "../../components/dashboard/TopProductChart";

export const Overview = () => {
  const {
    stats,
    revenueData,
    categoryData,
    topProducts,
    recentOrders,
    loading,
    range,
    setRange,
    refresh,
  } = useAnalytics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const calculateAvgOrderValue = () => {
    const revenue = Number(stats?.totalRevenue || 0);
    const orders = Number(stats?.ordersCount || 0);
    return orders > 0 ? revenue / orders : 0;
  };

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-500/20 rounded-full" />
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0" />
        </div>
        <p className="text-gray-400 animate-pulse font-medium">
          Synchronizing data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header com DateRangePicker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time metrics and performance management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker selectedRange={range} onRangeChange={setRange} />
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2.5 bg-[#1C1C26] border border-white/5 rounded-xl hover:bg-[#2D2D3F] transition-all text-gray-400 disabled:opacity-50 group"
            aria-label="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 ${
                loading
                  ? "animate-spin text-purple-400"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(Number(stats?.totalRevenue || 0))}
          icon={DollarSign}
          trend={{
            value: stats?.revenueGrowth || 0,
            isPositive: (stats?.revenueGrowth || 0) >= 0,
          }}
          color="purple"
        />
        <MetricCard
          title="Total Orders"
          value={stats?.ordersCount || 0}
          icon={ShoppingCart}
          trend={{
            value: stats?.ordersGrowth || 0,
            isPositive: (stats?.ordersGrowth || 0) >= 0,
          }}
          color="blue"
        />
        <MetricCard
          title="Active Customers"
          value={stats?.customersCount || 0}
          icon={Users}
          trend={{
            value: stats?.customersGrowth || 0,
            isPositive: (stats?.customersGrowth || 0) >= 0,
          }}
          color="green"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(calculateAvgOrderValue())}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-112.5">
          <RevenueChart data={revenueData || []} />
        </div>
        <div className="min-h-112.5">
          <CategoryChart data={categoryData || []} />
        </div>
      </div>

      {/* Bottom Section: Orders, Feed & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Pedidos Recentes (Ocupa 2 colunas) */}
        <div className="lg:col-span-2">
          <RecentOrdersTable data={recentOrders || []} loading={loading} />
        </div>

        {/* Coluna Lateral: Top Products e Activity Feed */}
        <div className="space-y-6">
          <div className="h-fit">
            <TopProductsChart data={topProducts || []} loading={loading} />
          </div>
          <div className="h-fit">
            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* Alerta de Dados Vazios */}
      {!loading && Number(stats?.totalRevenue || 0) === 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-amber-500/80">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">
            No data found for the period of {range} days. Check if there are any
            orders with status{" "}
            <code className="bg-amber-500/10 px-1 rounded">PAID</code> in your
            database.
          </p>
        </div>
      )}
    </div>
  );
};

export default Overview;
