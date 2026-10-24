import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onSwitch: () => void;
}

export const LoginForm = ({ onSwitch }: LoginFormProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Tenta realizar o login via AuthContext
      await signIn({ email, password });

      // Se chegar aqui, o AuthContext já redirecionará via AppRoutes
      console.log("✅ Login realizado com sucesso");
    } catch (err: any) {
      console.error("❌ Erro capturado no Formulário:", err);

      // Tratamento para evitar o erro de 'undefined'
      if (err.response) {
        // O servidor respondeu com um status de erro (4xx, 5xx)
        const message = err.response.data?.message;
        setError(
          Array.isArray(message)
            ? message[0]
            : message || "Invalid email or password"
        );
      } else if (err.request) {
        // A requisição foi feita mas não houve resposta (Backend offline)
        setError(
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
        );
      } else {
        // Erro na configuração da requisição
        setError("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full max-w-md"
    >
      <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
      <p className="text-gray-400 mb-8">
        Don't have an account ?{" "}
        <button
          onClick={onSwitch}
          className="text-purple-500 font-semibold hover:text-purple-400 transition-colors"
        >
          Sign up
        </button>
      </p>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm flex items-center gap-3"
          >
            {/* GARANTE QUE ESTA LINHA ESTÁ ASSIM: */}
            <span className="flex-1">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@nexus.com"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)} // Simples assim
          required
          disabled={loading}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)} // Simples assim
            required
            disabled={loading}
          />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-purple-500 hover:text-purple-400 transition-colors"
            >
              Forgot password ?
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
          <input
            type="checkbox"
            id="remember"
            className="accent-purple-600 w-4 h-4 rounded border-[#3E3E55] bg-[#2D2D3F]"
          />
          <label htmlFor="remember" className="cursor-pointer select-none">
            Remember me for 30 days
          </label>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      {/* Opções de Social Login */}
      <div className="mt-8">
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-white/5 w-full"></div>
          <span className="bg-[#13131A] px-3 text-xs text-gray-500 uppercase absolute">
            Or login with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-3 border border-white/5 rounded-xl text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            Google (unavailable for now)
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-3 border border-white/5 rounded-xl text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            Apple (unavailable for now)
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default LoginForm;
