import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Menu, X, Cross } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout }   = useAuth();
  const location           = useLocation();
  const navigate           = useNavigate();
  const [open, setOpen]    = useState(false);

  const isActive = (path) => location.pathname === path;

  const publicLinks  = [
    { to: "/",        label: "Home" },
    { to: "/about",   label: "About" },
    { to: "/symptoms",label: "Symptom Checker" },
  ];
  const privateLinks = [
    { to: "/dashboard",     label: "Dashboard" },
    { to: "/symptoms",      label: "Symptom Checker" },
    { to: "/appointments",  label: "Appointments" },
    { to: "/profile",       label: "Profile" },
  ];
  const links = user ? privateLinks : publicLinks;

  const handleLogout = () => { logout(); navigate("/"); setOpen(false); };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="pulse-cross">
                <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                MediConnect
              </span>
              <p className="text-xs text-slate-400 leading-none -mt-0.5">Healthcare Platform</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={[
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(l.to)
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                ].join(" ")}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3 ml-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-xs text-white font-bold">
                    {user.name?.[0]}
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{user.name?.split(" ")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3">
                <Link to="/login" className="px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 btn-glow transition-all shadow-md">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1 animate-fade-in">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={[
                "block px-4 py-2.5 rounded-lg text-sm font-medium",
                isActive(l.to) ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 font-medium">
              Logout
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="flex-1 py-2.5 text-center text-sm text-blue-600 border border-blue-200 rounded-lg font-semibold">Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="flex-1 py-2.5 text-center text-sm bg-blue-600 text-white rounded-lg font-semibold">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
