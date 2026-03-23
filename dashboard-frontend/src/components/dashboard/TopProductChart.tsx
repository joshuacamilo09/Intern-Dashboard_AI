import { motion } from "framer-motion";
import { TrendingUp, Package } from "lucide-react";

interface TopProduct {
  productId: string;
  name: string;
  revenue: number;
  quantity: number;
}

interface TopProductsChartProps {
  data: TopProduct[];
  loading?: boolean;
}

export const TopProductsChart = ({ data, loading }: TopProductsChartProps) => {
  if (loading) {
    return (
      <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((p) => p.revenue), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#13131A] border border-white/5 rounded-2xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Top Products
          </h3>
          <p className="text-gray-500 text-sm">Best selling items</p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((product, index) => {
            const percentage = (product.revenue / maxRevenue) * 100;

            return (
              <motion.div
                key={product.productId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.quantity} Sold
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white shrink-0 ml-2">
                    €{product.revenue.toLocaleString()}
                  </span>
                </div>

                {/* Barra de progresso */}
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-linear-to-r from-purple-500 to-purple-400"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Package className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm">No products sold during the period.</p>
        </div>
      )}
    </motion.div>
  );
};

export default TopProductsChart;
