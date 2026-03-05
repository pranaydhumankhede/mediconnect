import { useState } from "react";
import { Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppointments } from "../hooks/useAppointments";
import AppointmentCard from "../components/dashboard/AppointmentCard";
import BookingModal from "../components/dashboard/BookingModal";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";

export default function AppointmentsPage() {
  const { user }  = useAuth();
  const { appointments, loading, book, updateStatus } = useAppointments();
  const [tab, setTab]             = useState("all");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selected, setSelected]   = useState(null);

  const filtered = tab === "all"
    ? appointments
    : appointments.filter((a) => a.status === tab);

  return (
    <div className="gradient-page min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Appointments</h1>
            <p className="text-slate-500 text-sm mt-1">{appointments.length} total appointment{appointments.length !== 1 ? "s" : ""}</p>
          </div>
          {user?.role === "patient" && (
            <button onClick={() => setBookingOpen(true)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 btn-glow transition-all shadow-md">
              + Book Appointment
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 shadow-sm border border-slate-100 w-fit animate-fade-in">
          {["all","pending","confirmed","completed","cancelled"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={["px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
                tab === t ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50",
              ].join(" ")}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3 animate-fade-in">
          {loading ? (
            <div className="flex justify-center py-14"><Spinner size={32} /></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Calendar size={30} />}
              title="No appointments found"
              description={tab === "all" ? "You haven't booked any appointments yet." : `No ${tab} appointments.`}
              action={user?.role === "patient" && tab === "all" && (
                <button onClick={() => setBookingOpen(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
                  Book Now
                </button>
              )}
            />
          ) : (
            filtered.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                isSelected={selected?.id === a.id}
                onClick={() => setSelected(a)}
              />
            ))
          )}
        </div>
      </div>

      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} onBook={book} />}
    </div>
  );
}
