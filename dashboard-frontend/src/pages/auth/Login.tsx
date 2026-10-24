// src/pages/auth/Login.tsx
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

export const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn({ email, password });
    } catch (err) {
      alert("invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#13131A] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-[#1C1C26] rounded-3xl overflow-hidden shadow-2xl border border-[#2D2D3F]">
        {/* Lado Esquerdo - Visual */}
        <div className="hidden md:block relative bg-[url('https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2070')] bg-cover bg-center">
          <div className="absolute inset-0 bg-linear-to-t from-[#13131A] to-transparent opacity-60" />
          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-3xl font-bold mb-2">Capturing Moments,</h2>
            <p className="text-gray-300">Creating Data Intelligence.</p>
          </div>
        </div>

        {/* Lado Direito - Form */}
        <div className="p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">
            Enter your details to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              placeholder="example@email.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="accent-[#7C3AED]" /> Remember
                me
              </label>

              {/* Substituindo o <Link> pela tag <a> nativa */}
              <a
                href="/dashboard-frontend/src/pages/auth/ForgotPassword.tsx"
                className="text-[#7C3AED] hover:underline transition-all"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#2D2D3F] text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-[#7C3AED] font-bold">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
