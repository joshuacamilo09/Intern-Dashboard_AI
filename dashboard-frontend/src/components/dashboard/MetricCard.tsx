import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: "purple" | "blue" | "green" | "orange";
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: MetricCardProps) => {
  // Variantes de cores para Ícone e Bordas baseadas no tema do dashboard
  const colorVariants = {
    purple: "text-purple-500 bg-purple-400/10 border-purple-500/20 glow-purple",
    blue: "text-blue-500 bg-blue-400/10 border-blue-500/20 glow-blue",
    green: "text-green-400 bg-green-400/10 border-green-500/20 glow-green",
    orange: "text-orange-500 bg-orange-400/10 border-orange-500/20 glow-orange",
  };

  const glowVariants = {
    purple: "bg-purple-600/5 group-hover:bg-purple-600/10",
    blue: "bg-blue-600/5 group-hover:bg-blue-600/10",
    green: "bg-green-600/5 group-hover:bg-green-600/10",
    orange: "bg-orange-600/5 group-hover:bg-orange-600/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-[#13131A] border border-white/5 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-all duration-300"
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-500 text-sm font-medium antialiased">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className={`p-3 rounded-xl border transition-colors duration-300 ${colorVariants[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend ? (
        <div className="flex items-center gap-2 relative z-10">
          {/* Lógica de cor dinâmica: Verde para positivo, Vermelho para negativo */}
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
              trend.isPositive
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-gray-600 text-[11px] font-medium">
            vs. last period
          </span>
        </div>
      ) : (
        <div className="h-5.5" />
      )}

      {/* Efeito de brilho (Glow) que reage ao hover */}
      <div
        className={`absolute -right-6 -bottom-6 w-32 h-32 blur-3xl rounded-full transition-all duration-500 ${glowVariants[color]}`}
      />
    </motion.div>
  );
};

export default MetricCard;