import { Heart, Activity, Shield } from "lucide-react";

const SECTIONS = [
  {
    icon: <Heart size={22} className="text-red-500" />,
    title: "Our Mission",
    body: "MediConnect was founded to make quality healthcare accessible to every Indian citizen regardless of location or background. We bridge the gap between patients and doctors through intelligent, affordable technology.",
  },
  {
    icon: <Activity size={22} className="text-blue-500" />,
    title: "AI-Powered Diagnostics",
    body: "Our symptom checker uses a sophisticated rule-based engine capable of identifying 8+ common and serious conditions with high confidence. It is a first step toward informed healthcare — not a replacement for professional advice.",
  },
  {
    icon: <Shield size={22} className="text-emerald-500" />,
    title: "Security & Privacy",
    body: "We implement row-level security, JWT-based authentication, and bcrypt password hashing. Your health data is strictly private and protected in compliance with India's Digital Personal Data Protection Act, 2023.",
  },
];

export default function AboutPage() {
  return (
    <div className="gradient-page min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">About MediConnect</h1>
          <p className="text-slate-500 text-lg">Reimagining healthcare for modern India</p>
        </div>
        <div className="space-y-6">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 card-lift">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">{s.icon}</div>
                <h2 className="text-lg font-bold text-slate-800">{s.title}</h2>
              </div>
              <p className="text-slate-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
