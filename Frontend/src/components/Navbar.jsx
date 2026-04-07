import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = (() => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch { return null; }
  })();

  const storedUser = (() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); }
    catch { return null; }
  })();

  const displayName = storedUser?.name || "User";
  const role = storedUser?.role || user?.role || "";
  const initial = displayName.charAt(0).toUpperCase();
  const profilePic = storedUser?.profilePicture || null;

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = role === "driver"
    ? [{ label: "Dashboard", path: "/driver-dashboard" }]
    : [{ label: "Find Ride", path: "/passenger-dashboard" }];

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 bg-[var(--bg)] border-b border-[var(--border)] flex items-center justify-between px-4 md:px-7 shadow-[0_1px_12px_rgba(0,0,0,0.06)] transition-colors">

      {/* Logo */}
      <Link to="/" className="font-black text-xl tracking-tight text-[var(--text)] no-underline select-none">
        Cab<span className="text-[var(--primary)]">Share</span>
      </Link>

      {/* Desktop Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ label, path }) => (
          <Link key={path} to={path} className={`font-semibold text-sm px-4 py-2 rounded-lg transition-all no-underline ${isActive(path) ? 'text-[var(--primary)] bg-[rgba(99,102,241,0.08)]' : 'text-[var(--text-muted)] hover:bg-[var(--card)]'}`}>
            {label}
          </Link>
        ))}
      </div>

      {/* Desktop Right side */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <Link to="/profile" className="no-underline">
              <div className={`flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full border transition-all cursor-pointer ${isActive('/profile') ? 'bg-[rgba(99,102,241,0.06)] border-[var(--primary)]' : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)] text-sm'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                  {profilePic ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" /> : initial}
                </div>
                <div>
                  <div className="font-bold text-[0.82rem] text-[var(--text)] leading-[1.2]">{displayName}</div>
                  <div className="text-[0.68rem] text-[var(--text-muted)] capitalize leading-none">{role}</div>
                </div>
              </div>
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-transparent border border-[var(--border)] text-[var(--text-muted)] font-semibold text-[0.82rem] transition-colors hover:bg-red-50 hover:border-red-300 hover:text-red-500 cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text)] no-underline font-semibold text-sm hover:bg-[var(--card)] transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white no-underline font-semibold text-sm shadow-md hover:-translate-y-[1px] hover:shadow-lg transition-all">
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button className="md:hidden p-2 -mr-2 text-[var(--text)] rounded-full bg-transparent border-0 cursor-pointer focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

    </nav>
    
    {/* Mobile Overlay Menu */}
    {menuOpen && (
      <div className="fixed top-16 left-0 right-0 z-[999] bg-[var(--bg)] border-b border-[var(--border)] shadow-lg flex flex-col p-4 gap-4 md:hidden animate-in slide-in-from-top duration-200">
        {user ? (
          <>
            <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] no-underline">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-[1.2rem] shrink-0 overflow-hidden">
                  {profilePic ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover rounded-full" /> : initial}
              </div>
              <div>
                <div className="font-bold text-[1rem] text-[var(--text)] leading-tight">{displayName}</div>
                <div className="text-[0.8rem] text-[var(--text-muted)] capitalize mt-1">View Profile</div>
              </div>
            </Link>
            <div className="flex flex-col gap-2">
               {navLinks.map(({ label, path }) => (
                 <Link key={path} to={path} onClick={() => setMenuOpen(false)} className="font-bold tracking-wide text-[0.95rem] p-3.5 rounded-lg bg-[rgba(99,102,241,0.05)] text-[var(--primary)] text-center no-underline border border-[rgba(99,102,241,0.2)] active:scale-[0.98] transition-transform">
                   {label}
                 </Link>
               ))}
            </div>
            <button onClick={handleLogout} className="mt-2 w-full p-3.5 rounded-lg bg-red-50 text-red-600 font-bold border border-red-200 text-center text-[0.95rem] active:scale-[0.98] transition-all cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3 pb-2">
             <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full p-3.5 rounded-lg border border-[var(--border)] text-[var(--text)] no-underline font-bold tracking-wide text-center bg-[var(--card)] active:scale-[0.98]">
               Login
             </Link>
             <Link to="/signup" onClick={() => setMenuOpen(false)} className="w-full p-3.5 rounded-lg bg-[var(--primary)] text-white no-underline font-bold tracking-wide text-center active:scale-[0.98]">
               Sign Up
             </Link>
          </div>
        )}
      </div>
    )}
    </>
  );
};

export default Navbar;