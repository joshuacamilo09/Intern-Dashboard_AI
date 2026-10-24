import { useState } from "react";
import { X, Save } from "lucide-react";
import customersService from "../../services/customersService";

export const CreateCustomerModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await customersService.create(formData);
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error creating customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">New Client</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Full Name
            </label>
            <input
              required
              className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-purple-500"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              E-mail
            </label>
            <input
              required
              type="email"
              className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-purple-500"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone Number (Optional)
            </label>
            <input
              className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-purple-500"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={18} /> {loading ? "Salvando..." : "Criar Cliente"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateCustomerModal;