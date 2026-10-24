// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Auth } from "../pages/auth/Auth";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Overview } from "../pages/dashboard/Overview";
import { Orders } from "../pages/orders/Orders";
import { Products } from "../pages/products/Products";
import Customers from "../pages/customers/Customers";
import { Settings } from "../pages/settings/Settings";
import About from "../pages/About";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import { AiAnalytics } from "../pages/analyticsAI";


export const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas de Auth */}
      <Route
        path="/login"
        element={!user ? <Auth /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Auth /> : <Navigate to="/dashboard" />}
      />

      {/* Rota Dashboard / Overview */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <DashboardLayout>
              <Overview />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Rota de Orders */}
      <Route
        path="/orders"
        element={
          user ? (
            <DashboardLayout>
              <Orders />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Rota de Products - Limpa */}
      <Route
        path="/products"
        element={
          user ? (
            <DashboardLayout>
              <Products />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Rota de Customers - Limpa */}
      <Route
        path="/customers"
        element={
          user ? (
            <DashboardLayout>
              <Customers />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Rota de Settings - Limpa e Corrigida */}
      <Route
        path="/settings"
        element={
          user ? (
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Rota Sobre / SolveCode - Nova */}
      <Route
        path="/about"
        element={
          user ? (
            <DashboardLayout>
              <About />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Rota de Analytics */}
      <Route
        path="/analytics"
        element={
          user ? (
            <DashboardLayout>
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white"></h1>
                <p className="text-gray-400 mt-2">
                  <AiAnalytics />
                </p>
              </div>
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Rotas de Recuperação de Senha Corrigidas */}
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />}
      />

      <Route
        path="/reset-password"
        element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />}
      />

      {/* Redirect default */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />

      {/* Redirect default */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
};

export default AppRoutes;
