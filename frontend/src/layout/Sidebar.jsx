import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({
  activeMenu = "/",
  onMenuClick,
  routes = [],
  currentPath = "/",
  collapsed = false,
}) {
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null); // Track hover state for tooltips
  const navigate = useNavigate();
  const location = useLocation();
  const [branchInfo, setBranchInfo] = useState(null);

  useEffect(() => {
    const fetchBranchInfo = async () => {
      try {
        const info = await window.api.getActiveBranch(); // ✅ same as Navbar
        if (info) setBranchInfo(info);
      } catch (err) {
        console.error("Error fetching branch info:", err);
      }
    };

    fetchBranchInfo();
  }, []);

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label);
      } else {
        // Close all other dropdowns and open this one
        return [label];
      }
    });
  };

  const handleMenuClick = (item) => {
    if (collapsed && item.hasDropdown && item.children) {
      // When sidebar is collapsed, navigate to first child route
      // Combine parent URL with child URL
      const fullUrl = item.url + item.children[0].url;
      navigate(fullUrl);
      onMenuClick?.(fullUrl);
      return;
    }

    if (item.hasDropdown && item.children) {
      // Only toggle dropdown, don't navigate
      toggleDropdown(item.label);
    } else {
      // Close all dropdowns when navigating to non-dropdown items
      setOpenDropdowns([]);
      // Navigate to the route
      navigate(item.url);
      onMenuClick?.(item.url);
    }
  };

  const handleDropdownItemClick = (subItem, parentItem) => {
    const fullUrl = parentItem.url + subItem.url;
    // Keep the parent dropdown open when clicking child items
    // Don't change openDropdowns state here
    navigate(fullUrl);
    onMenuClick?.(fullUrl);
  };

  // Check if current path matches any dropdown item
  const isDropdownItemActive = (subItem, parentItem) => {
    const fullUrl = parentItem.url + subItem.url;
    return location.pathname === fullUrl;
  };

  const isParentActive = (item) => {
    // Check if current path matches this item
    if (location.pathname === item.url) return true;

    // Check if any children match current path
    if (item.hasDropdown && item.children) {
      return item.children.some((child) => {
        const childUrl = item.url + child.url;
        return location.pathname === childUrl;
      });
    }
    return false;
  };

  // Auto-open dropdown if current path is a child route, close others
  useEffect(() => {
    let shouldOpenDropdown = null;

    routes.forEach((route) => {
      if (route.hasDropdown && route.children) {
        const hasActiveChild = route.children.some((child) => {
          const childUrl = route.url + child.url;
          return location.pathname === childUrl;
        });

        if (hasActiveChild) {
          shouldOpenDropdown = route.label;
        }
      }
    });

    // Only keep the dropdown open that has an active child
    if (shouldOpenDropdown) {
      setOpenDropdowns([shouldOpenDropdown]);
    } else {
      // If navigating to a non-child route, close all dropdowns
      const currentRoute = routes.find(
        (route) => location.pathname === route.url
      );
      if (currentRoute && !currentRoute.hasDropdown) {
        setOpenDropdowns([]);
      } else if (!currentRoute) {
        // If current path doesn't match any route, close all dropdowns
        setOpenDropdowns([]);
      }
    }
  }, [location.pathname, routes]);

  // Handle collapse animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Match this with your CSS transition duration

    return () => clearTimeout(timer);
  }, [collapsed]);

  // Close all dropdowns when sidebar is collapsed
  useEffect(() => {
    if (collapsed) {
      setOpenDropdowns([]);
    }
  }, [collapsed]);

  return (
    <div
      className={`h-full flex flex-col border-r-2 transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${
        collapsed ? "w-[60px]" : "w-62"
      }`}
    >
      {branchInfo && (
        <div
          className="mt-3 px-4 py-2 text-sm font-semibold text-[#000080] bg-white dark:bg-gray-700 rounded-[40px] mx-2 mb-3 text-center shadow-sm cursor-pointer"
          title={`
Branch: ${branchInfo.name}
ID: ${branchInfo.id}
Restaurant: ${branchInfo.restaurant_id}
Address: ${branchInfo.address?.replace(/\n/g, ", ")}
`}
        >
          {branchInfo.name}
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 px-1 py-3 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {routes.map((item, index) => {
          const isActive = isParentActive(item);
          const iconColor = isActive ? "#ffffff" : "currentColor"; // For Lucide icons
          const iconFilter = isActive
            ? "brightness(0) invert(1)" // Makes SVG white
            : "brightness(0) invert(0)";

          return (
            <div key={index}>
              <div
                className={`relative group flex items-center justify-between cursor-pointer transition-colors ${
                  isActive
                    ? "bg-[#000080] text-white rounded-[40px] h-[42px] px-4 py-2"
                    : "rounded-[40px] h-[42px] px-4 py-2 transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:rounded-[40px]"
                }`}
                onClick={() => handleMenuClick(item)}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                aria-label={item.label}
              >
                {/* <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 min-w-[20px]" />
                  <span
                    className={`font-medium text-sm transition-opacity duration-300 overflow-hidden whitespace-nowrap ${
                      collapsed ? "opacity-0 w-0" : "opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </div> */}

                {/* Icon + Label */}
                <div className="flex items-center gap-2">
                  {item.icon &&
                    (typeof item.icon === "string" ? (
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="h-5 w-5 min-w-[20px] transition-all"
                        style={{ filter: iconFilter }}
                      />
                    ) : (
                      <item.icon
                        className="h-5 w-5 min-w-[20px] transition-all"
                        color={iconColor}
                      />
                    ))}
                  <span>{item.label}</span>
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-2">
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 text-gray-400 ${
                          openDropdowns.includes(item.label) ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                )}

                {/* Tooltip for collapsed sidebar and non-active items */}
                {collapsed && !isActive && hoveredItem === item.label && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50">
                    <div
                      role="tooltip"
                      className="px-2 py-1 text-xs rounded-md border shadow-md whitespace-nowrap bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600"
                    >
                      {item.label}
                    </div>
                  </div>
                )}
              </div>

              {!collapsed && item.hasDropdown && item.children && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdowns.includes(item.label)
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 mt-1 pr-4 space-y-1">
                    {item.children.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className={`px-3 py-2 text-sm cursor-pointer transition-colors rounded-[40px] ${
                          isDropdownItemActive(subItem, item)
                            ? "bg-blue-100 text-[#000080] font-medium"
                            : "transition-colors duration-300 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => handleDropdownItemClick(subItem, item)}
                      >
                        <span className="pl-2">{subItem.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Customer Site Button */}
      <div className="flex-shrink-0">
        <Button
          className={`bg-[#000080] hover:bg-[#000060] text-white py-3 rounded-none w-full h-12 transition-all duration-300 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span
            className={`font-medium transition-opacity duration-300 overflow-hidden whitespace-nowrap ${
              collapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            Customer Site
          </span>
          <ExternalLink
            className={`h-4 w-4 transition-all duration-300 ${
              collapsed ? "ml-0" : "ml-2"
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
