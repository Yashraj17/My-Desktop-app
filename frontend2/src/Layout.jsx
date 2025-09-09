import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  // Utility to highlight the active link
  const isActive = (path) =>
    location.pathname === path
      ? "bg-gray-700 text-yellow-300 font-semibold"
      : "hover:bg-gray-700 hover:text-yellow-200";

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <div>
        <h2>Inventory POS</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/" className={`p-2 rounded ${isActive("/")}`}>
            Dashboard
          </Link>
          <Link to="/menu-managment/categories" className={`p-2 rounded ${isActive("/menu-managment/categories")}`}>
            Item Categories
          </Link>
        </nav>
      </div>

      {/* Active Page Content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
