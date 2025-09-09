import { useLocation, Link, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import {
  LayoutGrid,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  ChevronDown,
  Utensils,
  ClipboardList,
  CalendarDays,
  DoorOpen,
  Eye,
  Monitor,
  Home,
  Table,
  Bell,
  FileText,
  User,
  Wallet,
  BarChart3,
  Boxes,
  MapPin,
  Globe, Maximize, Moon, Square,
} from "lucide-react";

import logo from "../public/restro-logo.svg";
import Dashboard from "./Dashboard";
import CategoryManagement from "./pages/menu/CategoryManagement";
import ModifierGroupManagement from "./pages/menu/ModifierGroupManagement";
import ModifierManagement from "./pages/menu/ModifierManagement";
import MenuItem from "./pages/menu/MenuItemManagement";
import MenuManagement from "./pages/menu/MenuManagement";
import RestaurantLogin from "./pages/RestaurantLogin";
import  { useEffect} from "react";

function AppContent({ setIsAuthenticated }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      if (window.api?.getStore) {
        const storedName = await window.api.getStore("name");
        setUserName(storedName || "Admin"); // fallback if not found

      }
    };
    fetchName();
  }, []);

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🔹 language filter state
  const [language, setLanguage] = useState("all");

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: Home },
    {
      name: "Menu",
      icon: Utensils,
      subMenu: [
        { path: "/menus", name: "Menus" },
        { path: "/menu-items", name: "Menu Items" },
        { path: "/categories", name: "Item Categories" },
        { path: "/modifier-groups", name: "Modifier Groups" },
        { path: "/item-modifiers", name: "Item Modifiers" },
      ],
    },
    { path: "/tables", name: "Tables", icon: Table },
    { path: "/waiter", name: "Waiter Requests", icon: Bell },
    { path: "/reservations", name: "Reservations", icon: CalendarDays },
    { path: "/pos", name: "POS", icon: Monitor },
    { path: "/orders", name: "Orders", icon: ShoppingCart },
    { path: "/customers", name: "Customers", icon: Users },
    { path: "/staff", name: "Staff", icon: User },
    { path: "/delivery", name: "Delivery Executive", icon: DoorOpen },
    {
      name: "Payments",
      icon: Wallet,
      subMenu: [{ path: "/payments/history", name: "Payment History" }],
    },
    {
      name: "Reports",
      icon: BarChart3,
      subMenu: [{ path: "/reports/sales", name: "Sales Reports" }],
    },
    {
      name: "Inventory",
      icon: Boxes,
      subMenu: [{ path: "/inventory/items", name: "Inventory Items" }],
    },
    { path: "/settings", name: "Settings", icon: Settings },

  ];
  const topMenu = [
    { name: "Orders", icon: ClipboardList, count: 15 },
    { name: "Waiter", icon: Utensils, count: 0 },
    { name: "Reservations", icon: CalendarDays, count: 8 },
    { name: "Open", icon: DoorOpen, count: 2 },
    { name: "Close", icon: X, count: 0 },
    { name: "View", icon: Eye, count: 5 },
    { name: "POS", icon: Monitor, count: 3 },
  ];

  const handleLogout = async () => {
    if (window.api?.clearStore) {
      await window.api.clearStore();
    }
    setIsAuthenticated(false);
  };
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-300 bg-white shadow-xl border-r border-gray-200
  ${sidebarOpen ? "w-64" : "w-20"}
  `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b">
          {sidebarOpen && (
            <a href="/dashboard" className="flex items-center">
              <img src={logo} alt="Logo" className="h-10" />
            </a>
          )}
          <button
            //onClick={() => setSidebarOpen(!sidebarOpen)}
              onClick={() => {
    setSidebarOpen(!sidebarOpen);
    setIsMenuOpen(false); // 🔹 also close submenu
  }}

            className="text-gray-500 hover:text-indigo-600"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Dropdown Brand */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b">
            <button className="flex items-center justify-between w-full px-4 py-2 border rounded-full text-sm font-semibold text-indigo-700">
              {/* Left side: Location Icon + Text */}
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-indigo-700" />
                <span className="font-semibold">RestroFox</span>
              </div>

              {/* Right side: Dropdown arrow */}
              <ChevronDown size={16} className="text-indigo-700" />
            </button>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 ">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.subMenu) {
              return (
                <div key={index}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-full font-medium transition 
                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? "text-white" : "text-indigo-700"}
                    />
                    {sidebarOpen && <span>{item.name}</span>}
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform ${
                        isMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isMenuOpen && (
                    <div className="ml-10 mt-2 space-y-2">
                      {item.subMenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`block px-3 py-1.5 text-sm rounded-full transition 
                      ${
                        location.pathname === sub.path
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-indigo-50"
                      }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-full font-medium transition
            ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-indigo-50"
            }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-white" : "text-indigo-700"}
                />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Right Side Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Header Menu */}
         <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-6">
            {topMenu.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className="relative flex flex-col items-center text-xs text-gray-700 hover:text-indigo-600"
                >
                  {/* Badge */}
                  {item.count > 0 && (
                    <span
                      className="absolute -top-1 -right-2 border-indigo-900 
  text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center bg-indigo-900 text-white text-[10px] font-bold"
                    >
                      {item.count}
                    </span>
                  )}

                  {/* Icon */}
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
{/* 🔹 Right Side Menu (blue bubble) */}
  <div className="flex items-center gap-3 bg-indigo-900 text-white px-4 py-2 rounded-full">
    {/* Language */}
    <button className="flex items-center gap-1 text-sm text-indigo-900">
      <Globe size={16} />
      English
    </button>

    {/* Fullscreen */}
    <button className="text-indigo-900">
      <Maximize size={16} />
    </button>

    {/* Dark Mode */}
    <button className="text-indigo-900">
      <Moon size={16} />
    </button>

    {/* Profile Circle (A) */}
    <button className="flex items-center justify-center w-6 h-6 bg-white text-indigo-900 rounded-full text-xs font-bold">
      A
    </button>

    {/* Square Icon */}
    <button className="text-indigo-900">
      <Square size={16} />
    </button>
     {/* 🔹 Logout */}
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 text-sm bg-white text-red-500 px-3 py-1 rounded-full"
    >
      <DoorOpen size={16} />
      Logout
    </button>
<p className="text-sm text-white">Welcome, {userName}</p>
          </div>
        </header>

        {/* Main Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/categories"
              element={<CategoryManagement language={language} />}
            />
            <Route path="/menus" element={<MenuManagement />} />
            <Route
              path="/menu-items"
              element={<MenuItem language={language} />}
            />
            <Route
              path="/modifier-groups"
              element={<ModifierGroupManagement />}
            />
            <Route
              path="/item-modifiers"
              element={<ModifierManagement language={language} />}
            />
          </Routes>

        </main>
      </div>
    </div>
  );
}

export default AppContent;
