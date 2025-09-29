import { useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import routes from "./route"
import { Route, Routes, useLocation } from "react-router-dom"

export default function Layout({onLogout}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState("/")
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleMenuClick = (menuUrl) => {
    setActiveMenu(menuUrl)
  }

  // Function to flatten routes for React Router
  const flattenRoutes = (routes, basePath = "") => {
    const flattened = []

    routes.forEach((route) => {
      if (route.children) {
        // Add parent route if it has a component
        if (route.component) {
          flattened.push({
            ...route,
            url: basePath + route.url,
          })
        }
        // Add children routes
        flattened.push(...flattenRoutes(route.children, basePath + route.url))
      } else {
        flattened.push({
          ...route,
          url: basePath + route.url,
        })
      }
    })

    return flattened
  }

  const flatRoutes = flattenRoutes(routes)

  return (
    <div className="h-screen overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} onLogout={onLogout} />
      <div className="flex h-[calc(100vh-64px)]">
        <div
          className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-62" : "w-[60px]"} overflow-hidden`}
        >
          <Sidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
            routes={routes}
            currentPath={location.pathname}
            collapsed={!isSidebarOpen}
          />
        </div>
        <main className="flex-1 overflow-auto">
          <Routes>
            {flatRoutes.map((route) => (
              <Route path={route.url} key={route.url} element={<route.component />} />
            ))}
          </Routes>
        </main>
      </div>
    </div>
  )
}