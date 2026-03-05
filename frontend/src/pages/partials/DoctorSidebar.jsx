import { Shield, ClipboardList } from "lucide-react";
import Badge from "../../components/common/Badge";

export default function DoctorSidebar({ user, selected, onUpdateStatus }) {
  return (
    <div className="space-y-5 animate-slide-in">
      {selected ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ClipboardList size={16} className="text-blue-500" /> Patient Details
          </h3>
          <div className="space-y-3">
            {[
              ["Patient",     selected.patientName],
              ["Date",        `${selected.appointment_date} · ${selected.time_slot}`],
              ["Reason",      selected.reason],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-xs text-slate-400">{label}</div>
                <div className="text-sm font-semibold text-slate-700 mt-0.5">{value}</div>
              </div>
            ))}
            <div>
              <div className="text-xs text-slate-400 mb-1.5">Status</div>
              <Badge status={selected.status} />
            </div>
          </div>

          {selected.status === "pending" && (
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button onClick={() => onUpdateStatus(selected.id, "confirmed")}
                className="py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
                Confirm
              </button>
              <button onClick={() => onUpdateStatus(selected.id, "cancelled")}
                className="py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-bold hover:bg-red-100 transition-all">
                Cancel
              </button>
            </div>
          )}
          {selected.status === "confirmed" && (
            <button onClick={() => onUpdateStatus(selected.id, "completed")}
              className="w-full mt-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all">
              Mark as Completed
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center py-10">
          <ClipboardList size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Select an appointment to view patient details</p>
        </div>
      )}

      {/* Doctor badge */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl font-extrabold">
            {user?.name?.split(" ")[1]?.[0] || "D"}
          </div>
          <div>
            <div className="font-extrabold">{user?.name}</div>
            <div className="text-sm opacity-75">Medical Professional</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={14} className="opacity-70" />
          <span className="text-xs opacity-70">Verified on MediConnect</span>
        </div>
      </div>
    </div>
  );
}
