import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppContent from "./AppContent";
import RestaurantLogin from "./pages/RestaurantLogin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route
            path="*"
            element={<RestaurantLogin setIsAuthenticated={setIsAuthenticated} />}
          />
        ) : (
          <Route
            path="/*"
            element={<AppContent setIsAuthenticated={setIsAuthenticated} />}
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
