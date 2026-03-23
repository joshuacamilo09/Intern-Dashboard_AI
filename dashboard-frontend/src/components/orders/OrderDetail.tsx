import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  User,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";

import { useState } from "react";
import ordersService, { type Order } from "../../services/ordersService";
import StatusBadge from "./OrdersStatusBadge";

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
  onUpdate: () => void;
}

export const OrderDetail = ({ order, onClose, onUpdate }: OrderDetailProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await ordersService.updateStatus(order.id, newStatus);
      
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Calcular totais dos items
  const itemsCount = order.items.length;
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * Number(item.priceAtSale),
    0
  );

  // Validar transições permitidas pelo backend
  const canMarkAsPaid = order.status === "PENDING";
  const canCancel = order.status === "PENDING";
  const canRefund = order.status === "PAID";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Painel Lateral (Drawer) */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-screen bg-[#13131A] border-l border-white/5 p-8 overflow-y-auto shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Order Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Header Info */}
            <div className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                  Order ID
                </p>
                <p className="text-sm text-purple-400 font-mono mt-1">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Customer Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400">
                <User size={18} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Customer
                </span>
              </div>
              <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                <p className="text-white font-medium">{order.customer.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Customer ID: {order.customer.id.slice(0, 8)}...
                </p>
              </div>
            </section>

            {/* Date Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={18} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Order Date
                </span>
              </div>
              <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                <p className="text-white text-sm">
                  {new Date(order.createdAt).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </section>

            {/* Items Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Package size={18} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Items ({itemsCount})
                </span>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-white/2 border border-white/5 rounded-xl"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">
                        Product {item.productId.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-purple-400 font-semibold text-sm">
                      {new Intl.NumberFormat("pt-PT", {
                        style: "currency",
                        currency: "EUR",
                      }).format(Number(item.priceAtSale))}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400">
                <CreditCard size={18} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Payment Summary
                </span>
              </div>
              <div className="p-4 bg-white/2 border border-white/5 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-purple-400">
                    {new Intl.NumberFormat("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(order.totalAmount)}
                  </span>
                </div>
              </div>
            </section>

            {/* Actions Section */}
            {(canMarkAsPaid || canCancel || canRefund) && (
              <section className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Update Status
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {canMarkAsPaid && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate("PAID")}
                      className="flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl hover:bg-green-500/20 transition-all text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <CheckCircle size={16} /> Mark as Paid
                    </button>
                  )}

                  {canCancel && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate("CANCELED")}
                      className="flex items-center justify-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <XCircle size={16} /> Cancel Order
                    </button>
                  )}

                  {canRefund && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate("REFUNDED")}
                      className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl hover:bg-blue-500/20 transition-all text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <DollarSign size={16} /> Refund Order
                    </button>
                  )}
                </div>

                {isUpdating && (
                  <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span>Updating status...</span>
                  </div>
                )}
              </section>
            )}

            {/* Info sobre status não modificável */}
            {order.status === "CANCELED" || order.status === "REFUNDED" ? (
              <div className="p-4 bg-gray-500/10 border border-gray-500/20 rounded-xl">
                <p className="text-xs text-gray-400 text-center">
                  This order can no longer be modified.
                </p>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
