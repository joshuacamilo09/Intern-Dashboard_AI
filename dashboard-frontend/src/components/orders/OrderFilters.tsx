import { Search, Filter, X } from "lucide-react";

interface OrderFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onClear: () => void;
}

export const OrderFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onClear,
}: OrderFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#13131A] p-4 rounded-2xl border border-white/5">
      {/* Barra de Pesquisa */}
      <div className="relative w-full md:w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by Order ID or customer..."
          value={searchTerm}
          // Usamos trim() para evitar que espaços vazios no final quebrem a pesquisa
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1C1C26] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600"
        />
      </div>

      {/* Filtros e Ações */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 bg-[#1C1C26] border border-white/5 rounded-xl px-3 py-1.5">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-sm text-gray-300 focus:outline-none cursor-pointer pr-4"
          >
            <option value="ALL">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            {/* Corrigido de CANCELLED para CANCELED para bater com o Backend/Prisma */}
            <option value="CANCELED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* Botão de Limpar */}
        {(searchTerm !== "" || statusFilter !== "ALL") && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={16} />
            <span className="hidden sm:inline">Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
