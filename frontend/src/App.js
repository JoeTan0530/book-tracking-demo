import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";

// css
import "./assets/css";
import "bootstrap/dist/css/bootstrap.min.css";

// pages import
import LoginPage from "./pages/LoginPage.tsx";

function App() {
  return (
    <div className="main-display">
      <Router>
        <Routes>
          <Route path="*" element={<LoginPage />} />

          {/* 404 route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
