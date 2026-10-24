import { useEffect, useState } from "react";
import { Download, Plus, AlertCircle } from "lucide-react";
import { OrdersTable } from "../../components/orders/OrdersTable";
import { OrderDetail } from "../../components/orders/OrderDetail";
import { OrderFilters } from "../../components/orders/OrderFilters";
import { CreateOrderModal } from "../../components/orders/CreateOrderModal";
import { useOrders } from "../../hooks/useOrders";
import { useAuth } from "../../hooks/useAuth";
import { type Order } from "../../services/ordersService";

export const Orders = () => {
  const { user } = useAuth();
  const { orders, loading, error, loadOrders } = useOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Estado para controlar a visibilidade do modal de criação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (user) loadOrders();
  }, [user, loadOrders]);

  const handleViewDetails = (order: Order) => setSelectedOrder(order);
  const handleCloseDetail = () => setSelectedOrder(null);

  // Recarrega a lista após criar ou atualizar um pedido
  const handleOrderUpdate = () => loadOrders();

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Orders</h1>
            <p className="text-gray-400 mt-1">Manage and track all orders.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1C1C26] border border-white/5 rounded-xl text-sm font-medium text-gray-300 hover:bg-[#2D2D3F] transition-all">
              <Download size={18} /> Export as PDF (Soon)
            </button>

            {/* Botão agora abre o Modal */}
            {user?.role !== "VIEWER" && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 rounded-xl text-sm font-semibold text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all"
              >
                <Plus size={18} /> New Order
              </button>
            )}
          </div>
        </div>

        <OrderFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onClear={() => {
            setSearchTerm("");
            setStatusFilter("ALL");
          }}
        />

        {/* Stats rápidos */}
        {!loading && !error && orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#13131A] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {orders.length}
              </p>
            </div>
            <div className="bg-[#13131A] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Pending
              </p>
              <p className="text-2xl font-bold text-orange-500 mt-1">
                {orders.filter((o) => o.status === "PENDING").length}
              </p>
            </div>
            <div className="bg-[#13131A] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Paid
              </p>
              <p className="text-2xl font-bold text-green-500 mt-1">
                {orders.filter((o) => o.status === "PAID").length}
              </p>
            </div>
            <div className="bg-[#13131A] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Total Revenue
              </p>
              <p className="text-xl font-bold text-purple-400 mt-1 truncate">
                {new Intl.NumberFormat("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                  notation: "compact",
                  compactDisplay: "short",
                }).format(
                  orders
                    .filter((o) => o.status === "PAID")
                    .reduce((sum, o) => sum + Number(o.totalAmount), 0)
                )}
              </p>
            </div>
          </div>
        )}

        {/* Estados de UI */}
        {loading && (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
            <AlertCircle className="mx-auto mb-2" />
            <p>{error}</p>
            <button
              onClick={loadOrders}
              className="mt-2 text-sm underline font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <OrdersTable
            orders={filteredOrders}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      {/* Modal de Detalhes do Pedido */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={handleCloseDetail}
          onUpdate={handleOrderUpdate}
        />
      )}

      {isCreateModalOpen && (
        <CreateOrderModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            handleOrderUpdate();
          }}
        />
      )}
    </>
  );
};

export default Orders;
