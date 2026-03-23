import { motion } from "framer-motion";
import { ShoppingBag, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentOrder {
  id: string;
  total: number;
  customer: string;
  createdAt: string;
}

interface RecentOrdersTableProps {
  data: RecentOrder[];
  loading?: boolean;
}

export const RecentOrdersTable = ({
  data,
  loading,
}: RecentOrdersTableProps) => {
  if (loading) {
    return (
      <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[#13131A] border border-white/5 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            Recent Orders
          </h3>
          <p className="text-gray-500 text-sm">Latest transactions</p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider pb-3">
                  Order ID
                </th>
                <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider pb-3">
                  Customer
                </th>
                <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider pb-3">
                  Amount
                </th>
                <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider pb-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-[#1C1C26] transition-colors"
                >
                  <td className="py-4">
                    <p className="text-white text-sm font-mono">
                      #{order.id.slice(0, 8)}
                    </p>
                  </td>
                  <td className="py-4">
                    <p className="text-white text-sm">{order.customer}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-white text-sm font-semibold">
                      €
                      {Number(order.total).toLocaleString("pt-PT", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </td>
                  <td className="py-4">
                    <p className="text-gray-400 text-sm">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Package className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-sm">No order found</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentOrdersTable;