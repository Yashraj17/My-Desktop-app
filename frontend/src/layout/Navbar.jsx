import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Maximize2, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { LogOut } from "lucide-react"; // Add logout icon
import { useNavigate } from "react-router-dom";

import {
  POSIcon,
  OrderIcon,
  WaiterIcon,
  ReservationIcon,
  OpenResIcon,
  CloseResIcon,
  ViewIcon,
} from "../components/svgIcons";

const CloseButtonIcon = () => (
  <svg
    id="toggle-sidebar-close"
    className="w-10 h-10 transition-transform duration-200"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 19l-7-7 7-7M19 19l-7-7 7-7"
    ></path>
  </svg>
);

const OpenButtonIcon = () => (
  <svg
    id="toggle-sidebar-open"
    className="w-10 h-10 transition-transform duration-200"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 5l7 7-7 7M5 5l7 7-7 7"
    ></path>
  </svg>
);


export default function Navbar({ isSidebarOpen, onToggleSidebar, onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [todayReservations, setTodayReservations] = useState(0);
  const [todayOrder, setTodayOrder] = useState(0);
  const navigate = useNavigate();
  const [branchInfo, setBranchInfo] = useState(null); // 🏷️ Added for branch info

  const handleSignOut = () => {
    onLogout(); // call the App.js logout
  };

  // Fetch today's reservations
  useEffect(() => {
    const fetchTodayReservations = async () => {
      try {
        const reservations = await window.api.getReservations();
        const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const count = reservations.filter((r) =>
          r.reservation_date_time.startsWith(todayDate)
        ).length;
        setTodayReservations(count);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      }
    };

    const fetchTodayOrder = async () => {
      try {
        const reservations = await window.api.getOrders();
        const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const count = reservations.filter(
          (r) => r.date_time.startsWith(todayDate)
          //r.date_time.startsWith("2025-09-27T11:47:13.000000Z")
        ).length;
        console.log("oredr...", reservations);
        setTodayOrder(count);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    // 🏷️ Fetch branch info from local storage or DB
    const fetchBranchInfo = async () => {
      try {
        const info = await window.api.getActiveBranch(); // 🧩 must exist in preload.js
        if (info) setBranchInfo(info);
        console.log(info, "branch info");
      } catch (err) {
        console.error("Error fetching branch info:", err);
      }
    };

    fetchTodayReservations();
    fetchTodayOrder();
    fetchBranchInfo();
  }, []);

  const navItems = [
    {
      icon: OrderIcon,
      label: "Orders",
      badge: todayOrder > 0 ? String(todayOrder) : "0", // dynamic badge
      badgeColor: "bg-[#000080]", // fixed: proper key-value
    },
    {
      icon: WaiterIcon,
      label: "Waiter",
      badge: "2",
      badgeColor: "bg-[#000080]",
    },
    {
      icon: ReservationIcon,
      label: "Reservations",
      badge: todayReservations > 0 ? String(todayReservations) : "0", // dynamic badge
      badgeColor: "bg-[#000080]", // fixed: proper key-value
      onClick: () => navigate("/reservations"), // <-- navigation added
    },
    { icon: OpenResIcon, label: "Open", badge: null },
    { icon: CloseResIcon, label: "Close", badge: null },
    { icon: ViewIcon, label: "View", badge: null },
    { icon: POSIcon, label: "POS", badge: null },
  ];

  return (
    <nav className="border-b px-6 py-3 transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        {/* Left section - Logo with toggle button */}
        <div className="flex justify-between gap-5">
          <img src={"./restro-logo.svg"} alt="Logo" className="h-9" />

          <Button
            variant="ghost"
            size="lg"
            className="p-2"
            onClick={onToggleSidebar}
          >
            {isSidebarOpen ? <CloseButtonIcon /> : <OpenButtonIcon />}
          </Button>
        </div>

        {/* {branchInfo && (
          <div
            className="text-sm font-semibold mr-3 bg-white text-[#000080] px-3 py-1 rounded-full shadow-sm cursor-pointer"
            title={`
Name: ${branchInfo.name}
ID: ${branchInfo.id}
Restaurant: ${branchInfo.restaurant_id}
Address: ${branchInfo.address?.replace(/\n/g, ", ")}
Created: ${
              branchInfo.created_at
                ? new Date(branchInfo.created_at).toLocaleDateString()
                : "-"
            }
Updated: ${
              branchInfo.updated_at
                ? new Date(branchInfo.updated_at).toLocaleDateString()
                : "-"
            }
`}
          >
            {branchInfo.name || `Branch ID: ${branchInfo.id}`}
          </div>
        )} */}

        <div className="flex-1 flex justify-between ps-6">
          {/* Center section - Navigation items */}
          <div className="flex items-baseline">
            {navItems.map((item, index) => {
              const isLast = index === navItems.length - 1;
              return (
                <div
                  key={index}
                  className={[
                    "relative flex items-center justify-center pr-4 mr-2",
                    !isLast ? "border-r" : "pr-0 mr-0",
                    "border-gray-200 dark:border-gray-700",
                  ].join(" ")}
                  onClick={item.onClick} // <-- attach navigation here
                  style={{ cursor: item.onClick ? "pointer" : "default" }}
                >
                  <div className="relative flex flex-col items-center justify-center gap-1 min-w-[64px]">
                    {React.createElement(item.icon, {
                      className:
                        "h-5 w-5 transition-colors duration-300 text-gray-900 dark:text-gray-100",
                    })}

                    {item.badge && (
                      <Badge
                        className={`absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] leading-none ${item.badgeColor} text-white flex items-center justify-center rounded-full`}
                      >
                        {item.badge}
                      </Badge>
                    )}

                    <span className="text-[14px] font-medium leading-tight transition-colors duration-300 text-gray-800 dark:text-gray-200">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right section - User controls */}
          <div className="flex items-center gap-2 bg-[#000080] px-3 py-2 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-white hover:bg-[#000060]"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-white hover:bg-[#000060]"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-white hover:bg-[#000060]"
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-white text-[#000080] text-xs font-semibold">
                A
              </AvatarFallback>
            </Avatar>
            {/* Sign Out button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-white hover:bg-[#000060]"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
