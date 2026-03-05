import { useState } from "react";
import { Calendar, Clock, CheckCircle, Activity, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppointments } from "../hooks/useAppointments";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import BookingModal from "../components/dashboard/BookingModal";
import AppointmentCard from "../components/dashboard/AppointmentCard";
import Spinner from "../components/common/Spinner";
import PatientSidebar from "./partials/PatientSidebar";
import DoctorSidebar from "./partials/DoctorSidebar";

export default function DashboardPage() {
  const { user } = useAuth();
  return user?.role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />;
}

function PatientDashboard() {
  const { user }  = useAuth();
  const { appointments, loading, book } = useAppointments();
  const [bookingOpen, setBookingOpen]   = useState(false);
  const [activeTab, setActiveTab]       = useState("upcoming");

  const upcoming = appointments.filter((a) => ["pending","confirmed"].includes(a.status));
  const history  = appointments.filter((a) => ["completed","cancelled"].includes(a.status));

  const stats = [
    { label: "Total Visits",  value: appointments.length,                                       icon: <Calendar size={20} />, color: "bg-blue-50 text-blue-600" },
    { label: "Upcoming",      value: upcoming.length,                                            icon: <Clock size={20} />,    color: "bg-amber-50 text-amber-600" },
    { label: "Completed",     value: history.filter((a) => a.status === "completed").length,    icon: <CheckCircle size={20}/>,color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="gradient-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-extrabold text-slate-800">
            Good morning, <span className="text-blue-600">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's your health overview for today.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 animate-fade-in">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-lift">
                  <div className={["w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.color].join(" ")}>{s.icon}</div>
                  <div className="text-2xl font-extrabold text-slate-800">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-1">
                  {["upcoming","history"].map((t) => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      className={["px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
                        activeTab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50",
                      ].join(" ")}>
                      {t === "upcoming" ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
                    </button>
                  ))}
                </div>
                <button onClick={() => setBookingOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 btn-glow transition-all shadow-sm">
                  + Book Appointment
                </button>
              </div>
              <div className="p-5 space-y-3">
                {loading ? (
                  <div className="flex justify-center py-10"><Spinner size={28} /></div>
                ) : (activeTab === "upcoming" ? upcoming : history).length === 0 ? (
                  <EmptyState
                    icon={<Calendar size={28} />}
                    title={`No ${activeTab} appointments`}
                    action={activeTab === "upcoming" && (
                      <button onClick={() => setBookingOpen(true)} className="text-sm text-blue-600 font-semibold hover:underline">
                        Book one now →
                      </button>
                    )}
                  />
                ) : (
                  (activeTab === "upcoming" ? upcoming : history).map((a) => (
                    <AppointmentCard key={a.id} appointment={a} />
                  ))
                )}
              </div>
            </div>
          </div>

          <PatientSidebar user={user} upcoming={upcoming} onBook={() => setBookingOpen(true)} />
        </div>
      </div>

      {bookingOpen && (
        <BookingModal onClose={() => setBookingOpen(false)} onBook={book} />
      )}
    </div>
  );
}

function DoctorDashboard() {
  const { user } = useAuth();
  const { appointments, loading, updateStatus } = useAppointments();
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcoming = appointments.filter((a) => ["pending","confirmed"].includes(a.status));
  const history  = appointments.filter((a) => ["completed","cancelled"].includes(a.status));
  const today    = new Date().toISOString().split("T")[0];
  const todayCount = upcoming.filter((a) => a.appointment_date === today).length;

  const stats = [
    { label: "Today",     value: todayCount,                                                 icon: <Calendar size={20} />, color: "bg-blue-50 text-blue-600" },
    { label: "Upcoming",  value: upcoming.length,                                            icon: <Clock size={20} />,    color: "bg-amber-50 text-amber-600" },
    { label: "Completed", value: appointments.filter((a) => a.status === "completed").length, icon: <CheckCircle size={20}/>, color: "bg-emerald-50 text-emerald-600" },
    { label: "Pending",   value: appointments.filter((a) => a.status === "pending").length,  icon: <Activity size={20} />, color: "bg-purple-50 text-purple-600" },
  ];

  const handleStatus = async (id, status) => {
    const updated = await updateStatus(id, status);
    setSelected(updated);
  };

  return (
    <div className="gradient-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Good morning, <span className="text-blue-600">{user?.name}</span> 👨‍⚕️</h1>
            <p className="text-slate-500 mt-1">{todayCount} appointment{todayCount !== 1 ? "s" : ""} today</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-700 font-semibold">Online</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-lift">
              <div className={["w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.color].join(" ")}>{s.icon}</div>
              <div className="text-2xl font-extrabold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex gap-1">
              {["upcoming","history"].map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={["px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
                    activeTab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50",
                  ].join(" ")}>
                  {t === "upcoming" ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
                </button>
              ))}
            </div>
            <div className="p-5 space-y-3">
              {loading ? (
                <div className="flex justify-center py-10"><Spinner size={28} /></div>
              ) : (activeTab === "upcoming" ? upcoming : history).length === 0 ? (
                <EmptyState icon={<Calendar size={28} />} title={`No ${activeTab} appointments`} />
              ) : (
                (activeTab === "upcoming" ? upcoming : history).map((a) => (
                  <AppointmentCard key={a.id} appointment={a} isSelected={selected?.id === a.id} onClick={() => setSelected(a)} />
                ))
              )}
            </div>
          </div>

          <DoctorSidebar user={user} selected={selected} onUpdateStatus={handleStatus} />
        </div>
      </div>
    </div>
  );
}
