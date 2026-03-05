import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";

export default function AuthForm({ mode }) {
  const isLogin        = mode === "login";
  const { login, register } = useAuth();
  const navigate       = useNavigate();

  const [form, setForm]       = useState({ name: "", email: "", password: "", role: "patient" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password, form.role);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800">{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="text-slate-500 text-sm mt-1">{isLogin ? "Sign in to MediConnect" : "Join 50,000+ users on MediConnect"}</p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        {!isLogin && (
          <Field label="Full Name">
            <input className={inputCls} placeholder="Aarav Sharma" value={form.name} onChange={set("name")} />
          </Field>
        )}
        <Field label="Email Address">
          <input type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Password">
          <input type="password" className={inputCls} placeholder="••••••••" value={form.password} onChange={set("password")}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        </Field>
        {!isLogin && (
          <Field label="I am a">
            <div className="grid grid-cols-2 gap-3">
              {["patient", "doctor"].map((r) => (
                <button key={r} type="button" onClick={() => setForm((p) => ({ ...p, role: r }))}
                  className={["py-3 rounded-xl text-sm font-semibold border-2 transition-all capitalize",
                    form.role === r ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300",
                  ].join(" ")}>
                  {r === "patient" ? "🧑 Patient" : "👨‍⚕️ Doctor"}
                </button>
              ))}
            </div>
          </Field>
        )}
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="w-full mt-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 btn-glow transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2">
        {loading ? <><Spinner size={18} /><span>Please wait…</span></> : isLogin ? "Sign In →" : "Create Account →"}
      </button>

      <p className="text-center text-sm text-slate-500 mt-5">
        {isLogin ? "New here? " : "Already have an account? "}
        <Link to={isLogin ? "/register" : "/login"} className="text-blue-600 font-semibold hover:underline">
          {isLogin ? "Create account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}

const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
