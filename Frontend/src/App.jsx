import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import BecomeDriver from "./pages/BecomeDriver";
import PassengerDashboard from "./pages/passengerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import RideTracking from "./pages/ridetracking";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import DriverHistory from "./pages/DriverHistory";

const hideNavOn = ["/", "/login", "/signup"];

const Layout = ({ children }) => {
  const location = useLocation();
  const showNav = !hideNavOn.includes(location.pathname);
  return (
    <>
      {showNav && <Navbar />}
      <div style={{ paddingTop: showNav ? "60px" : "0" }}>
        {children}
      </div>
    </>
  );
};

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/driver-details" element={<BecomeDriver />} />
            <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/ride-tracking" element={<RideTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/driver-history" element={<DriverHistory />} />
          </Routes>
        </Layout>
      </Router>

      {/* Floating Global Dark Mode Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          position: "fixed", bottom: "24px", left: "24px", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "48px", height: "48px", borderRadius: "50%",
          background: "var(--card)", border: "1px solid var(--border)",
          color: "var(--text)", cursor: "pointer", transition: "all 0.2s",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        }}
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <Sun size={22} /> : <Moon size={22} />}
      </button>
    </div>
  );
}

export default App;