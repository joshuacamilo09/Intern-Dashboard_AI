import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Captura o ?token=... da URL
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Recovery token missing or invalid");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      alert(
        "Password updated successfully! Please log in with your new password."
      );
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error resetting password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#13131A] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1C1C26] p-8 rounded-3xl border border-[#2D2D3F] shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">New password</h1>
        <p className="text-gray-400 mb-8">
          Create a new, secure password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm new password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading}>
            Update password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            Cancel and return
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;