import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
      
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      alert("Error requesting link. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#13131A] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1C1C26] p-8 rounded-3xl border border-[#2D2D3F] shadow-2xl">
        {!sent ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">
              Recover Password
            </h1>
            <p className="text-gray-400 mb-8">
              We will send a link to your email.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="E-mail"
                placeholder="your@email.com"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" loading={loading}>
                Send Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <h1 className="text-2xl font-bold text-white mb-2">
              Verify your email
            </h1>
            <p className="text-gray-400 mb-8">
              <strong>
                If your email address is registered, the link will arrive
                shortly.
              </strong>
            </p>
          </div>
        )}
        <Link
          to="/login"
          className="mt-6 block text-center text-[#7C3AED] hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
