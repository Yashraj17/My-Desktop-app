import { HashRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import AppContent from "./AppContent";

function App() {
  useEffect(() => {
    localStorage.setItem('branch_id', '1'); // Set branch_id manually
    window.api.setBranchId(parseInt('1')); // Send to main process
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
