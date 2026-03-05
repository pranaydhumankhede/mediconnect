import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const fields = user?.role === "patient"
    ? [["Email", user.email], ["Role", "Patient"], ["Member Since", "2025"]]
    : [["Email", user.email], ["Role", "Doctor"], ["Verified", "Yes"]];

  return (
    <div className="gradient-page min-h-screen py-10 px-6">
      <div className="max-w-xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-6">My Profile</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="hero-grad p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-3">
              {user?.name?.[0]}
            </div>
            <h2 className="text-xl font-extrabold text-white">{user?.name}</h2>
            <p className="text-white/70 text-sm mt-1">{user?.email}</p>
            <span className="inline-flex items-center mt-3 px-3 py-1 bg-white/20 rounded-full text-xs text-white font-semibold capitalize">
              {user?.role}
            </span>
          </div>

          {/* Fields */}
          <div className="p-6 space-y-3">
            {fields.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-semibold text-slate-800">{value}</span>
              </div>
            ))}

            {user?.role === "doctor" && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl mt-4">
                <Shield size={16} className="text-emerald-600" />
                <span className="text-sm text-emerald-700 font-medium">Verified Medical Professional</span>
              </div>
            )}

            <button onClick={handleLogout}
              className="w-full mt-4 py-3 border-2 border-red-100 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
