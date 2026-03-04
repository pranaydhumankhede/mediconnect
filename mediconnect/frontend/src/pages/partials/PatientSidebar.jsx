import { Calendar, Activity, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../../components/common/Badge";

export default function PatientSidebar({ user, upcoming, onBook }) {
  const next = upcoming[0];

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mb-3">
            {user?.name?.[0]}
          </div>
          <h3 className="font-extrabold text-slate-800">{user?.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          <span className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Next appointment */}
      {next && (
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} />
            <span className="text-sm font-semibold opacity-90">Next Appointment</span>
          </div>
          <h3 className="font-extrabold text-lg">{next.doctorName}</h3>
          <p className="text-sm opacity-80 mt-1">{next.appointment_date} · {next.time_slot}</p>
          <p className="text-xs opacity-60 mt-1">{next.reason}</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <Badge status={next.status} />
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Quick Actions</h3>
        <div className="space-y-1">
          {[
            { label: "Check Symptoms", icon: <Activity size={16} className="text-blue-600" />, to: "/symptoms" },
            { label: "Book Appointment", icon: <Calendar size={16} className="text-blue-600" />, action: onBook },
          ].map((item, i) =>
            item.to ? (
              <Link key={i} to={item.to}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all">
                {item.icon}
                <span className="text-sm font-medium text-slate-700 flex-1">{item.label}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
            ) : (
              <button key={i} onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all text-left">
                {item.icon}
                <span className="text-sm font-medium text-slate-700 flex-1">{item.label}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
