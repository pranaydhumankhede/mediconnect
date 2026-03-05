import { Download, RotateCcw, AlertTriangle, ClipboardList, Clock } from "lucide-react";

const SEVERITY_STYLES = {
  Low:      "bg-emerald-50 border-emerald-200 text-emerald-800",
  Moderate: "bg-amber-50  border-amber-200  text-amber-800",
  High:     "bg-red-50    border-red-200    text-red-800",
};

export default function DiagnosisResult({ result, symptoms, selectedIds, onReset, onDownload }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Main diagnosis card */}
      <div className={["rounded-3xl border-2 p-8", SEVERITY_STYLES[result.severity]].join(" ")}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Preliminary Diagnosis</span>
            <h2 className="text-2xl font-extrabold mt-1">{result.name}</h2>
            <p className="text-sm opacity-70 mt-1 capitalize">
              {result.category === "major" ? "Major / Serious condition" : "Common illness"} · ~{result.confidence}% confidence
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold">{result.confidence}%</div>
            <div className="text-xs opacity-60">Match</div>
          </div>
        </div>
      </div>

      {/* Advice & Consult */}
      <div className="grid md:grid-cols-2 gap-5">
        <InfoCard icon={<ClipboardList size={16} className="text-blue-500" />} title="Medical Advice">
          {result.advice}
        </InfoCard>
        <InfoCard icon={<Clock size={16} className="text-amber-500" />} title="When to See a Doctor">
          {result.consult}
        </InfoCard>
      </div>

      {/* Symptoms summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Symptoms You Reported</h3>
        <div className="flex flex-wrap gap-2">
          {selectedIds.map((id) => (
            <span key={id} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              {symptoms.find((s) => s.id === id)?.label}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Medical Disclaimer:</strong> This is a preliminary AI assessment and is not a substitute for professional medical diagnosis. Always consult a licensed physician.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onDownload}
          className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 btn-glow transition-all shadow-md flex items-center justify-center gap-2">
          <Download size={16} /> Download Report (.txt)
        </button>
        <button onClick={onReset}
          className="flex-1 py-3.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <RotateCcw size={16} /> Check Again
        </button>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">{icon}{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}
