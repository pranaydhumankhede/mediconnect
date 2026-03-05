import { Check } from "lucide-react";

export default function SymptomGrid({ symptoms, selected, onToggle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {symptoms.map((s) => {
        const active = selected.includes(s.id);
        return (
          <button key={s.id} onClick={() => onToggle(s.id)}
            className={[
              "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200",
              active
                ? "border-blue-500 bg-blue-50 text-blue-800"
                : "border-slate-150 bg-slate-50 hover:border-slate-300 text-slate-700 hover:bg-white",
            ].join(" ")}
          >
            <div className={["w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
              active ? "border-blue-500 bg-blue-500" : "border-slate-300"].join(" ")}>
              {active && <Check size={10} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm font-medium">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
