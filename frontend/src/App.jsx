import React, { Suspense, useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
const Layout = React.lazy(() => import('./layout/Layout'));
const RestaurantLogin = React.lazy(() => import('./pages/RestaurantLogin'));
import SiteLoader from "./components/SiteLoader";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Router basename="/">
      <ThemeProvider>
       {
					   isAuthenticated
							? <Suspense fallback={<SiteLoader />}><Layout /></Suspense>
							: <Suspense fallback={<SiteLoader/>}><RestaurantLogin setIsAuthenticated={setIsAuthenticated} /></Suspense>
				}
        </ThemeProvider>
    </Router>
  );
}

export default App;
