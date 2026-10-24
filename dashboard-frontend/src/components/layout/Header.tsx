import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Gera breadcrumbs baseado na rota
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);

    const breadcrumbMap: Record<string, string> = {
      dashboard: "Dashboard",
      orders: "Orders",
      products: "Products",
      customers: "Customers",
      analytics: "Analytics",
      settings: "Settings",
    };

    if (segments.length === 0) return ["Dashboard"];
    return segments.map((segment) => breadcrumbMap[segment] || segment);
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-20 bg-[#13131A] border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Menu Button + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl bg-[#1C1C26] border border-white/5 flex items-center justify-center hover:bg-[#2D2D3F] transition-all"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-600">/</span>}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-white font-medium"
                    : "text-gray-500"
                }
              >
                {crumb}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:block relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 bg-[#1C1C26] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>

        <button className="relative w-10 h-10 rounded-xl bg-[#1C1C26] border border-white/5 flex items-center justify-center hover:bg-[#2D2D3F] transition-all group">
          <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* User Dropdown - ALINHADO À ESQUERDA */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#1C1C26] transition-all border border-transparent hover:border-white/5"
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                user?.name || "User"
              }`}
              alt={user?.name}
              className="w-9 h-9 rounded-lg ring-2 ring-purple-500/20"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-gray-500 leading-none">
                {user?.role || "VIEWER"}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 hidden md:block transition-transform ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showUserMenu && (
            <>
              {/* Overlay para fechar ao clicar fora */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />

              {/* Menu com left-0 para alinhar à esquerda do botão */}
              <div className="absolute left-0 top-full mt-2 w-56 bg-[#1C1C26] border border-white/5 rounded-xl shadow-2xl overflow-hidden z-20">
                <div className="p-4 border-b border-white/5 bg-white/1">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#2D2D3F] rounded-lg transition-all"
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <div className="h-px bg-white/5 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;