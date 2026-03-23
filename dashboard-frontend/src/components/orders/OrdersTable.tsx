import { Eye } from "lucide-react";
import type { Order } from "../../services/ordersService";
import StatusBadge from "./OrdersStatusBadge";

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

export const OrdersTable = ({ orders, onViewDetails }: OrdersTableProps) => {
  return (
    <div className="bg-[#13131A] border border-white/5 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-white/2 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-purple-400">
                    #{order.id.slice(-6).toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {order.customer?.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-white">
                  {new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(order.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="p-2 hover:bg-purple-500/10 rounded-lg text-gray-400 hover:text-purple-400 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {/* O botão MoreVertical foi removido daqui */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;