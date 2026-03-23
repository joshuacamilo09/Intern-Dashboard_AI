// src/components/customers/CustomerTable.tsx
import { type Customer } from "../../services/customersService";
import { Phone } from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  onView?: (customer: Customer) => void;
}

export const CustomerTable = ({ customers, onView }: CustomerTableProps) => {
  return (
    <div className="bg-[#13131A] border border-white/5 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-white/2 transition-colors cursor-pointer group"
                onClick={() => onView?.(customer)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                      {customer.phone && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                          <Phone size={10} />
                          {customer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      customer.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-300">
                    {customer.totalOrders}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-white">
                    {new Intl.NumberFormat("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 2,
                    }).format(customer.totalSpent)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {customers.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;