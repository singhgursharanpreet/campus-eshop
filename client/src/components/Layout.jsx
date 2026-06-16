import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Store,
  ShoppingCart,
  Package,
  Tag,
  BarChart2,
  User,
  LogOut,
} from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
        location.pathname === to
          ? "bg-[#b6532a] text-white"
          : "text-[#7b6b61] hover:bg-[#eee4dc]"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#faf7f3]">
      <header className="sticky top-0 z-40 bg-[#faf7f3]/90 backdrop-blur-md border-b border-[#e8ded6]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Store className="w-6 h-6 text-[#b6532a]" />
            <span className="font-display text-xl font-semibold tracking-tight">
              Campus Market
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLink("/sell", "Sell", Tag)}
            {navLink("/seller-dashboard", "Dashboard", BarChart2)}
            {navLink("/orders", "Orders", Package)}
            {navLink("/profile", "Profile", User)}
            {navLink("/cart", "Cart", ShoppingCart)}

            <button
              onClick={logout}
              className="p-2 rounded-full text-[#7b6b61] hover:bg-[#eee4dc] transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}