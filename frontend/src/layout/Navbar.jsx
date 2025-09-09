import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RefreshCw, Maximize2, Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

import {
  POSIcon,
  OrderIcon,
  WaiterIcon,
  ReservationIcon,
  OpenResIcon,
  CloseResIcon,
  ViewIcon,
} from "../components/svgIcons"

const CloseButtonIcon = () => (
  <svg
    id="toggle-sidebar-close"
    className="w-10 h-10 transition-transform duration-200"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7M19 19l-7-7 7-7"></path>
  </svg>
)

const OpenButtonIcon = () => (
  <svg
    id="toggle-sidebar-open"
    className="w-10 h-10 transition-transform duration-200"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
  </svg>
)

export default function Navbar({ isSidebarOpen, onToggleSidebar }) {
  const { isDarkMode, toggleTheme } = useTheme()

  const navItems = [
    { icon: OrderIcon, label: "Orders", badge: "15", badgeColor: "bg-[#000080]" },
    { icon: WaiterIcon, label: "Waiter", badge: "2", badgeColor: "bg-[#000080]" },
    { icon: ReservationIcon, label: "Reservations", badge: "1", badgeColor: "bg-[#000080]" },
    { icon: OpenResIcon, label: "Open", badge: null },
    { icon: CloseResIcon, label: "Close", badge: null },
    { icon: ViewIcon, label: "View", badge: null },
    { icon: POSIcon, label: "POS", badge: null },
  ]

  return (
    <nav className="border-b px-6 py-3 transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        {/* Left section - Logo with toggle button */}
        <div className="flex justify-between gap-5">
          <img src={"./restro-logo.svg"} alt="Logo" className="h-9" />

          <Button variant="ghost" size="lg" className="p-2" onClick={onToggleSidebar}>
            {isSidebarOpen ? <CloseButtonIcon /> : <OpenButtonIcon />}
          </Button>
        </div>
        <div className="flex-1 flex justify-between ps-6">
          {/* Center section - Navigation items */}
          <div className="flex items-baseline">
            {navItems.map((item, index) => {
              const isLast = index === navItems.length - 1
              return (
                <div
                  key={index}
                  className={[
                    "relative flex items-center justify-center pr-4 mr-2",
                    !isLast ? "border-r" : "pr-0 mr-0",
                    "border-gray-200 dark:border-gray-700",
                  ].join(" ")}
                >
                  <div className="relative flex flex-col items-center justify-center gap-1 min-w-[64px]">
                    {React.createElement(item.icon, {
                      className: "h-5 w-5 transition-colors duration-300 text-gray-900 dark:text-gray-100",
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
              )
            })}
          </div>

          {/* Right section - User controls */}
          <div className="flex items-center gap-2 bg-[#000080] px-3 py-2 rounded-full">
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-white hover:bg-[#000060]">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-white hover:bg-[#000060]">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-white hover:bg-[#000060]"
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-white text-[#000080] text-xs font-semibold">A</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  )
}