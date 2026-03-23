import { X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "../../services/productsService";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  product?: Product | null;
}

export const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
}: ProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    cost: 0,
    category: "",
    stock: product?.stock|| 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        cost: product.cost || 0,
        category: product.category,
        stock: product.stock || 0,
      });
    } else {
      setFormData({ name: "", price: 0, cost: 0, category: "", stock: 0 });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        cost: formData.cost ? Number(formData.cost) : undefined,
        stock: formData.stock ? Number(formData.stock) : undefined,
      };

      await onSubmit(payload);
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || "Error saving product";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#13131A] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Price (€)
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
            {/* Campo Stock mantido para visualização, mas não enviado no payload acima */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Stock (Info)
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Category
            </label>
            <input
              required
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;