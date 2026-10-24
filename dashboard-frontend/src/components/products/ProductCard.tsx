import { Package, Edit2, Trash2 } from "lucide-react";
import { type Product } from "../../services/productsService";
import { useAuth } from "../../hooks/useAuth";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  const { user } = useAuth();
  const isInactive = product.status === "INACTIVE";

  return (
    <div
      className={`bg-[#13131A] border rounded-2xl overflow-hidden group transition-all ${
        isInactive
          ? "border-white/5 opacity-60"
          : "border-white/5 hover:border-purple-500/30"
      }`}
    >
      {/* Image Placeholder */}
      <div className="h-48 bg-[#1C1C26] flex items-center justify-center relative">
        <Package className="w-12 h-12 text-gray-700" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {isInactive ? (
            <span className="bg-gray-500/20 text-gray-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase border border-gray-500/30">
              Inactive
            </span>
          ) : (
            <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase border border-green-500/30">
              Active
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-purple-400 font-medium mb-1 uppercase tracking-wider">
              {product.category}
            </p>
            <h3 className="text-white font-semibold truncate">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Price & Stock Section */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Price
              </p>
              <p className="text-lg font-bold text-white mt-0.5">
                {new Intl.NumberFormat("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                }).format(product.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Stock
              </p>
              <p
                className={`text-sm font-medium mt-0.5 ${
                  product.stock > 0 ? "text-gray-300" : "text-red-400"
                }`}
              >
                {product.stock} un
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Apenas para ADMIN e MANAGER */}
        {user?.role !== "VIEWER" && (
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button
              onClick={() => onEdit?.(product)}
              disabled={isInactive}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#1C1C26] text-gray-300 rounded-xl text-xs font-bold hover:bg-[#2D2D3F] transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete?.(product)}
              disabled={isInactive}
              className="flex items-center justify-center gap-2 py-2.5 bg-red-500/5 text-red-500/70 rounded-xl text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-red-500/10"
            >
              <Trash2 size={14} /> {isInactive ? "Deleted" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
