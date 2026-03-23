import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#7C3AED", "#A855F7", "#6366F1", "#3B82F6"];

interface CategoryChartProps {
  data: any[];
}

export const CategoryChart = ({ data }: CategoryChartProps) => {
  // Garantimos que os valores são números (evita erro de string do banco)
  const chartData =
    data
      ?.map((item) => ({
        label: item.label || item.category || "Outros",
        value: Number(item.value || item.revenue || 0),
      }))
      .filter((item) => item.value > 0) || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#13131A] border border-white/5 p-6 rounded-2xl w-full h-full flex flex-col"
    >
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg">Revenue by Category</h3>
        <p className="text-gray-500 text-sm">Sales distribution</p>
      </div>

      <div className="flex-1 w-full min-h-75">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="label" // Crucial para a legenda e tooltip funcionarem
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1C1C26",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "8px 12px",
                }}
                itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                labelStyle={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
                cursor={{ fill: "transparent" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-gray-400 text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600 italic text-center p-4">
              Categoires without sales during the period
          </div>
        )}
      </div>
    </motion.div>
  );
};
