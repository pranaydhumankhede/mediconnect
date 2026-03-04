import { useState } from "react";
import { Activity, User, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SYMPTOMS, diagnose, generateTxtReport } from "../utils/symptomEngine";
import SymptomGrid from "../components/symptom/SymptomGrid";
import DiagnosisResult from "../components/symptom/DiagnosisResult";
import Spinner from "../components/common/Spinner";

export default function SymptomCheckerPage() {
  const { user }    = useAuth();
  const [step, setStep]           = useState(1);
  const [name, setName]           = useState(user?.name || "");
  const [nameErr, setNameErr]     = useState("");
  const [selected, setSelected]   = useState([]);
  const [result, setResult]       = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const toggle = (id) =>
    setSelected((p) => (p.includes(id) ? p.filter((s) => s !== id) : [...p, id]));

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(diagnose(selected));
      setAnalyzing(false);
      setStep(3);
    }, 1600);
  };

  const reset = () => { setStep(1); setSelected([]); setResult(null); setName(user?.name || ""); };

  const handleDownload = () => {
    if (!result) return;
    const content = generateTxtReport(name, selected, result);
    const blob    = new Blob([content], { type: "text/plain" });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href     = url;
    a.download = `MediConnect_Report_${name.replace(/\s+/g, "_")}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800">AI Symptom Checker</h1>
              <p className="text-xs text-slate-400">Rule-based diagnostic engine</p>
            </div>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  step >= s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400",
                ].join(" ")}>
                  {step > s ? <CheckCircle size={14} /> : s}
                </div>
                {s < 3 && <div className={["w-6 h-0.5", step > s ? "bg-blue-500" : "bg-slate-200"].join(" ")} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Step 1 — Name */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User size={28} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Let's get started</h2>
              <p className="text-slate-500">Confirm your name to personalise your health report.</p>
            </div>
            <div className="max-w-sm mx-auto">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Full Name</label>
              <input
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameErr(""); }}
              />
              {nameErr && <p className="text-xs text-red-500 mt-1">{nameErr}</p>}
              <button
                onClick={() => { if (!name.trim()) { setNameErr("Name is required."); return; } setStep(2); }}
                className="w-full mt-5 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 btn-glow transition-all shadow-md"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Symptoms */}
        {step === 2 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-slate-800 mb-1">Select your symptoms</h2>
              <p className="text-slate-500 text-sm">Choose all symptoms you're currently experiencing. Select at least 2.</p>
            </div>
            <SymptomGrid symptoms={SYMPTOMS} selected={selected} onToggle={toggle} />
            <div className="flex items-center justify-between mt-8">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 text-sm text-slate-500 hover:text-slate-700 font-medium">
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">{selected.length} selected</span>
                <button
                  onClick={handleAnalyze}
                  disabled={selected.length < 2 || analyzing}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 btn-glow transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzing ? <><Spinner size={16} /> Analysing…</> : "Analyse Symptoms →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Result */}
        {step === 3 && result && (
          <DiagnosisResult
            result={result}
            symptoms={SYMPTOMS}
            selectedIds={selected}
            onReset={reset}
            onDownload={handleDownload}
          />
        )}
        {step === 3 && !result && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity size={28} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">No Match Found</h2>
            <p className="text-slate-500 text-sm mb-6">The selected symptoms didn't match any condition with sufficient confidence. Try different combinations or consult a doctor directly.</p>
            <button onClick={reset} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
