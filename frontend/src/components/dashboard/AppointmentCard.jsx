import Badge from "../common/Badge";

export default function AppointmentCard({ appointment, onClick, isSelected }) {
  const { doctorName, patientName, appointment_date, time_slot, reason, status } = appointment;
  const displayName = doctorName || patientName || "Unknown";

  return (
    <div
      onClick={onClick}
      className={[
        "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border",
        isSelected
          ? "border-blue-300 bg-blue-50"
          : "border-transparent bg-slate-50 hover:border-blue-100 hover:bg-blue-50/40",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {displayName[0]}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-800 truncate">{displayName}</div>
          <div className="text-xs text-slate-500 mt-0.5">{appointment_date} · {time_slot}</div>
          <div className="text-xs text-slate-400 mt-0.5 italic truncate">{reason}</div>
        </div>
      </div>
      <Badge status={status} />
    </div>
  );
}
