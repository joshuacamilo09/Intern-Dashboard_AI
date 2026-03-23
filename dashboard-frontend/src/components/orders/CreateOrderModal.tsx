import React, { useState, useEffect } from "react";
import Select from "react-select";
import { X, Trash2, ShoppingBag } from "lucide-react";
import api from "../../services/api";

export const CreateOrderModal = ({ isOpen, onClose, onSuccess }: any) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    items: [{ productId: "", quantity: 1, priceAtSale: 0, stock: 0 }],
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [custRes, prodRes] = await Promise.all([
            api.get("/customers"),
            api.get("/product"),
          ]);

          const customersFormatted = custRes.data.map((c: any) => ({
            value: c.id,
            label: `${c.name} (${c.email})`,
          }));

          const productsFormatted = prodRes.data.map((p: any) => ({
            value: p.id,
            // Adicionado visualização de stock no label
            label: `${p.name} - ${p.price}€ ${
              p.stock <= 0 ? "(Out of stock)" : `(${p.stock} in stock)`
            }`,
            price: p.price,
            stock: p.stock, // Guardamos o stock real aqui
            isDisabled: p.stock <= 0, // Desativa o item se não houver stock
          }));

          setCustomers(customersFormatted);
          setProducts(productsFormatted);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "#1C1C26",
      borderColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "0.75rem",
      padding: "2px",
      color: "white",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "#1C1C26",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      zIndex: 100,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isDisabled
        ? "#13131A"
        : state.isFocused
        ? "#7C3AED"
        : "#1C1C26",
      color: state.isDisabled ? "#4B5563" : "white",
      fontSize: "14px",
      cursor: state.isDisabled ? "not-allowed" : "default",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "white",
    }),
    input: (base: any) => ({
      ...base,
      color: "white",
    }),
  };

  const handleProductChange = (index: number, selectedOption: any) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      productId: selectedOption ? selectedOption.value : "",
      priceAtSale: selectedOption ? selectedOption.price : 0,
      stock: selectedOption ? selectedOption.stock : 0, // Atualiza o stock disponível para este item
    };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação extra antes de enviar
    const hasInsufficientStock = formData.items.some(
      (item) => item.quantity > item.stock
    );
    if (hasInsufficientStock) {
      alert("One or more items exceed available stock.");
      return;
    }

    try {
      await api.post("/orders", formData);
      onSuccess();
      onClose();
    } catch (error) {
      alert("Error creating order. Please check stock and try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#13131A] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-white">New order</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Client (Name or Email)
            </label>
            <Select
              options={customers}
              styles={customStyles}
              placeholder="Search the client..."
              onChange={(option: any) =>
                setFormData({ ...formData, customerId: option.value })
              }
              noOptionsMessage={() => "No customers found."}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-400">
                Order Items
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    items: [
                      ...formData.items,
                      { productId: "", quantity: 1, priceAtSale: 0, stock: 0 },
                    ],
                  })
                }
                className="text-xs text-purple-400 hover:underline"
              >
                + Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/5"
              >
                <div className="flex-1">
                  <Select
                    options={products}
                    styles={customStyles}
                    placeholder="Product..."
                    onChange={(opt) => handleProductChange(index, opt)}
                  />
                  {item.productId && (
                    <p className="text-[10px] mt-1 text-gray-500">
                      Max available: {item.stock}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    min="1"
                    max={item.stock} // Define o máximo permitido no input
                    placeholder="Qtd"
                    className={`w-20 bg-[#1C1C26] border rounded-lg p-2.5 text-white outline-none transition-colors ${
                      item.quantity > item.stock
                        ? "border-red-500"
                        : "border-white/5"
                    }`}
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].quantity = Number(e.target.value);
                      setFormData({ ...formData, items: newItems });
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      items: formData.items.filter((_, i) => i !== index),
                    })
                  }
                  className="mt-2.5 text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold text-white shadow-lg transition-colors"
          >
            Complete Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
