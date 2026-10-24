import { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { authService } from "../../services/authService";

interface RegisterFormProps {
  onSwitch: () => void;
}

export const RegisterForm = ({ onSwitch }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("🆕 Tentando registrar com:", formData);
    try {
      await authService.register(formData);
      console.log("✅ Registo bem-sucedido!");
      alert("Conta criada com sucesso! Podes fazer login.");
      onSwitch(); // Volta para o login após sucesso
    } catch (err: any) {
      console.error("❌ Erro no registo:", err);
      console.error("❌ Response:", err.response?.data);
      alert(err.response?.data?.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">Create an account</h1>
      <p className="text-gray-400 mb-8">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-[#7C3AED] hover:underline">
          Log in
        </button>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e: any) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="john@company.com"
          value={formData.email}
          onChange={(e: any) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          value={formData.password}
          onChange={(e: any) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <div className="flex items-start gap-3 text-sm text-gray-400">
          <input type="checkbox" className="mt-1 accent-[#7C3AED]" required />
          <span>
            I agree to the{" "}
            <a href="#" className="text-[#7C3AED] hover:underline">
              Terms & Conditions
            </a>
          </span>
        </div>

        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </form>
    </div>
  );
};
