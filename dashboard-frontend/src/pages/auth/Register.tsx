import { motion } from "framer-motion";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      {/* Container Principal Animado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full grid md:grid-cols-2 bg-brand-card rounded-3xl overflow-hidden shadow-2xl border border-brand-border min-h-162.5"
      >
        {/* Lado Esquerdo - Visual (Igual ao Login para consistência) */}
        <div className="hidden md:block relative bg-[url('https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2070')] bg-cover bg-center">
          <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-transparent opacity-80" />
          <div className="absolute bottom-10 left-10 z-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Start your journey,
            </h2>
            <p className="text-gray-300">Join our analytics community today.</p>
          </div>
        </div>

        {/* Lado Direito - Form de Registo */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <RegisterForm onSwitch={() => navigate("/login")} />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;