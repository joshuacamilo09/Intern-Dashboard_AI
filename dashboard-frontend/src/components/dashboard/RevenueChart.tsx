import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: any[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const chartData =
    data?.map((item) => ({
      name: item.name || item.date || "---",
      revenue: Number(item.revenue || item.amount || 0),
    })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#13131A] border border-white/5 p-6 rounded-2xl w-full h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">Revenue Overview</h3>
          <p className="text-gray-500 text-sm">Period Revenue</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-75">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#2D2D3F"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 10 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 10 }}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1C1C26",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7C3AED"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600 italic">
            No revenue data available for this period
          </div>
        )}
      </div>
    </motion.div>
  );
};
