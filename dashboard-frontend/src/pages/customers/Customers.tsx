import { useState, useEffect } from "react";
import {
  customersService,
  type Customer,
} from "../../services/customersService";
import { CustomerTable } from "../../components/customers/CustomerTable";
import { CreateCustomerModal } from "../../components/customers/CreateCustomerModal";
import { Search, UserPlus, Users, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCustomers();
    }
  }, [user]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customersService.getAll();
      setCustomers(data);
    } catch (error: any) {
      console.error("Failed to load customers", error);
      setError(error.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "ACTIVE").length,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Customers</h1>
            <p className="text-gray-400 mt-1">
              Customer base and consumption analysis.
            </p>
          </div>
          {user?.role !== "VIEWER" && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
            >
              <UserPlus size={20} /> Add Customer
            </button>
          )}
        </div>

        {/* Stats Cards */}
        {!loading && !error && customers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#13131A] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-[#13131A] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Active
              </p>
              <p className="text-2xl font-bold text-green-500 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="bg-[#13131A] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-blue-500 mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-[#13131A] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Total Revenue
              </p>
              <p className="text-lg font-bold text-purple-400 mt-1 truncate">
                {new Intl.NumberFormat("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                  notation: "compact",
                  compactDisplay: "short",
                  maximumFractionDigits: 1,
                }).format(stats.totalRevenue)}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#13131A] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="text-red-500 font-semibold mb-1">
                  Error Loading Customers
                </h3>
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={loadCustomers}
                  className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && customers.length === 0 && (
          <div className="bg-[#13131A] border border-white/5 rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Customers Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start building your customer base by adding your first customer.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all"
              >
                Add First Customer
              </button>
            </div>
          </div>
        )}

        {/* Customer Table */}
        {!loading && !error && filteredCustomers.length > 0 && (
          <CustomerTable
            customers={filteredCustomers}
            onView={(customer) => console.log("View customer:", customer)}
          />
        )}
      </div>

      {/* Modal de Criação */}
      {isCreateModalOpen && (
        <CreateCustomerModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            loadCustomers();
          }}
        />
      )}
    </>
  );
};

export default Customers;
