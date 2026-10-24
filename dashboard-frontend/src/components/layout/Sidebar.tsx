import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  X,
  ShieldCheck, // Ícone para a SolveCode
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const Sidebar = ({ isOpen, onClose, isMobile }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const menuItems = [
    {
      section: "NAVIGATION",
      items: [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/dashboard",
          badge: null,
        },
        { icon: ShoppingCart, label: "Orders", path: "/orders", badge: null },
        { icon: Package, label: "Products", path: "/products", badge: null },
        { icon: Users, label: "Customers", path: "/customers", badge: null },
        {
          icon: BarChart3,
          label: "AI analytics",
          path: "/analytics",
          badge: "",
        },
      ],
    },
    // NOVA SEÇÃO: BRAND / PRODUCT
    {
      section: "PRODUCT FROM: ",
      items: [
        {
          icon: ShieldCheck,
          label: "SolveCode",
          path: "/about",
          badge: "Official",
        },
      ],
    },
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const effectiveCollapsed = isMobile ? false : isCollapsed;

  return (
    <>
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      <motion.div
        initial={isMobile ? { x: -280 } : { x: 0 }}
        animate={{
          x: isMobile && !isOpen ? -280 : 0,
          width: effectiveCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          h-screen bg-[#13131A] border-r border-white/5 flex flex-col
          ${isMobile ? "fixed left-0 top-0 z-50" : "relative"}
        `}
      >
        {/* Logo atualizado para Vortex Control */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <AnimatePresence mode="wait">
            {!effectiveCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg tracking-tight">
                    Analytics
                  </h1>
                  <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest leading-none">
                    obsidian
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isMobile ? (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#1C1C26] border border-white/5 flex items-center justify-center hover:bg-[#2D2D3F]"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-8 h-8 rounded-lg bg-[#1C1C26] border border-white/5 flex items-center justify-center hover:bg-[#2D2D3F]"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Search Bar */}
        {!effectiveCollapsed && (
          <div className="px-4 pt-6 pb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick search..."
                className="w-full bg-[#1C1C26] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-purple-500/50 outline-none transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#2D2D3F] border border-white/5 rounded text-xs text-gray-500">
                /
              </kbd>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-[#2D2D3F] scrollbar-track-transparent">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              {!effectiveCollapsed && (
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-3">
                  {section.section}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group
                        ${
                          isActive
                            ? "bg-purple-600/10 text-white shadow-lg shadow-purple-500/5"
                            : "text-gray-400 hover:bg-[#1C1C26] hover:text-white"
                        }
                        ${effectiveCollapsed ? "justify-center" : ""}
                      `}
                    >
                      {isActive && !effectiveCollapsed && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-500 rounded-r-full"
                        />
                      )}

                      <Icon
                        className={`${
                          isActive
                            ? "text-purple-400"
                            : "text-gray-400 group-hover:text-white"
                        } ${effectiveCollapsed ? "w-6 h-6" : "w-5 h-5"}`}
                      />

                      {!effectiveCollapsed && (
                        <>
                          <span className="text-sm font-medium flex-1 text-left">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.label === "SolveCode"
                                  ? "bg-purple-500 text-white"
                                  : "bg-[#2D2D3F] text-gray-400"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade Card oculto quando colapsado */}
        {!effectiveCollapsed && (
          <div className="px-4 pb-4">
            <div className="bg-linear-to-br from-purple-600/10 to-transparent border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">
                System Status
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-white font-medium">
                  SolveCode Cloud Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Settings */}
        <div className="border-t border-white/5 px-4 py-4">
          <div className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-white/5 text-white"
                      : "text-gray-400 hover:bg-[#1C1C26] hover:text-white"
                  } ${effectiveCollapsed ? "justify-center" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                  {!effectiveCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-white/5 p-4 bg-[#0D0D12]">
          <div
            className={`flex items-center gap-3 ${
              effectiveCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                  user?.name || "User"
                }`}
                alt={user?.name}
                className="w-10 h-10 rounded-xl ring-2 ring-purple-500/10"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0D0D12]" />
            </div>

            {!effectiveCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-purple-400 font-black uppercase tracking-tighter">
                    {user?.role || "VIEWER"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg bg-[#1C1C26] flex items-center justify-center hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;