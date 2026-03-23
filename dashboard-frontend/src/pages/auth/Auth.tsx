import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "../../components/auth/LoginForm";
import { RegisterForm } from "../../components/auth/RegisterForm";
import SalesChartAnimation from "../../components/animations/SalesChartAnimation";

export const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full bg-[#13131A] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 grid md:grid-cols-2 min-h-175">
        
        {/* LADO ESQUERDO - Visual */}
        <div className="hidden md:flex flex-col p-12 bg-linear-to-br from-[#16161E] to-[#13131A] relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex-1 flex flex-col justify-center">
               <SalesChartAnimation />
            </div>
            
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                {isLogin ? "Welcome back to insights." : "Join the future of BI."}
              </h2>
              <p className="text-gray-400 text-lg">
                {isLogin 
                  ? "Monitor metrics and analyze trends in real-time." 
                  : "Scale your business with our unified analytics platform."}
              </p>
            </div>
          </div>
        </div>

        {/* LADO DIREITO - Formulário */}
        <div className="p-10 lg:p-16 flex flex-col justify-center bg-[#13131A] border-l border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? (
                <LoginForm onSwitch={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onSwitch={() => setIsLogin(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};