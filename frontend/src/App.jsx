import React, { Suspense, useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
const Layout = React.lazy(() => import("./layout/Layout"));
const RestaurantLogin = React.lazy(() => import("./pages/RestaurantLogin"));
import SiteLoader from "./components/SiteLoader";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // On first render, check localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true"); // persist login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // clear login
  };

  if (loading) {
    return <SiteLoader />;
  }

  return (
    <Router basename="/">
      <ThemeProvider>
        {isAuthenticated ? (
          <Suspense fallback={<SiteLoader />}>
            <Layout onLogout={handleLogout} />
          </Suspense>
        ) : (
          <Suspense fallback={<SiteLoader />}>
            <RestaurantLogin setIsAuthenticated={handleLogin} />
          </Suspense>
        )}
      </ThemeProvider>
    </Router>
  );
}

export default App;
