import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { productsService, type Product } from "../../services/productsService";
import { ProductCard } from "../../components/products/ProductCard";
import { ProductModal } from "../../components/products/ProductModal";
import { useAuth } from "../../hooks/useAuth";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) loadProducts();
  }, [user, statusFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters =
        statusFilter !== "ALL" ? { status: statusFilter as any } : undefined;
      const data = await productsService.getAll(filters);
      setProducts(data);
    } catch (err: any) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (cleanFormData: any) => {
    try {
      if (editingProduct) {
        await productsService.update(editingProduct.id, cleanFormData);
      } else {
        await productsService.create(cleanFormData);
      }
      loadProducts();
    } catch (error: any) {
      
      throw error;
    }
  };

  const handleDelete = async (product: Product) => {
    
    if (user?.role !== "ADMIN") {
      alert("Only admins can deactivate products.");
      return;
    }

    if (confirm(`Are you sure you want to deactivate ${product.name}?`)) {
      try {
        await productsService.deactivate(product.id);
        loadProducts();
      } catch (err: any) {
        alert(err.response?.data?.message || "Error deactivating product");
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400">Inventory and catalog management.</p>
        </div>

        {/* Botão visível apenas para Admin/Manager conforme o seu Backend */}
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-2xl font-bold text-white hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
          >
            <Plus size={20} /> Add Product
          </button>
        )}
      </div>

      <div className="flex gap-4 bg-[#13131A] p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1C1C26] border border-white/5 rounded-xl pl-10 py-2.5 text-white focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-[#1C1C26] border border-white/5 rounded-xl px-4 text-gray-300 focus:outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
};

export default Products;
