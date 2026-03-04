import { Link } from "react-router-dom";
import { Activity, Calendar, Shield, ClipboardList, Heart } from "lucide-react";

const FEATURES = [
  { icon: <Activity size={24} />, title: "AI Symptom Analysis", desc: "Rule-based engine maps your symptoms to probable conditions with severity scoring and detailed advice." },
  { icon: <Calendar size={24} />, title: "Smart Scheduling", desc: "Book appointments with verified doctors. Real-time slot availability and instant confirmation." },
  { icon: <Shield size={24} />, title: "Privacy First", desc: "Row-level security, end-to-end encryption, and HIPAA-aligned data handling for complete peace of mind." },
  { icon: <ClipboardList size={24} />, title: "Detailed Reports", desc: "Get downloadable medical reports with diagnosis, advice, and doctor consultation guidance." },
];

const STATS = [
  { value: "50,000+", label: "Patients Served" },
  { value: "2,400+",  label: "Verified Doctors" },
  { value: "98.6%",   label: "Accuracy Rate" },
  { value: "4.9★",    label: "User Rating" },
];

export default function HomePage() {
  return (
    <div className="gradient-page min-h-screen">
      {/* Hero */}
      <section className="hero-grad px-6 py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-10  right-20  w-32 h-32 rounded-full bg-white/5 float" />
        <div className="absolute bottom-10 left-16  w-20 h-20 rounded-full bg-teal-400/10 float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2  right-1/4 w-16 h-16 rounded-full bg-blue-300/10 float" style={{ animationDelay: "0.8s" }} />

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm text-white/90 font-medium mb-6">
            <Heart size={14} className="text-red-300" />
            India's Most Trusted Health Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Your Health,{" "}
            <span className="bg-gradient-to-r from-teal-300 to-cyan-200 bg-clip-text text-transparent">
              Intelligently Managed
            </span>
          </h1>
          <p className="text-lg text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            From AI-powered symptom analysis to seamless doctor appointments — MediConnect brings complete healthcare to your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/symptoms" className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold shadow-xl hover:shadow-2xl btn-glow transition-all flex items-center justify-center gap-2">
              <Activity size={18} /> Check Symptoms Free
            </Link>
            <Link to="/register" className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/25 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-extrabold text-blue-700">{s.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Everything You Need</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">A complete healthcare ecosystem for patients and doctors alike.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-lift animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-10 text-center shadow-2xl">
          <Heart size={32} className="text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Start Your Health Journey Today</h2>
          <p className="text-white/75 mb-8">Join 50,000+ patients already managing their health with MediConnect.</p>
          <Link to="/register" className="inline-block px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:shadow-xl btn-glow transition-all">
            Get Started — It's Free
          </Link>
        </div>
      </section>
    </div>
  );
}
