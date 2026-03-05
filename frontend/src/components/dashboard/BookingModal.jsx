import { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import Spinner from "../common/Spinner";
import api from "../../utils/api";

const TIME_SLOTS = [
  "09:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "02:00 PM","03:00 PM","04:00 PM","05:00 PM"
];

export default function BookingModal({ onClose, onBook, preselectedDoctor }) {
  const [step, setStep]       = useState(preselectedDoctor ? 2 : 1);
  const [doctor, setDoctor]   = useState(preselectedDoctor || null);
  const [doctors, setDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [form, setForm]       = useState({ date: "", time: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  // Fetch real doctors from MySQL on mount
  useEffect(() => {
    if (preselectedDoctor) return;
    setLoadingDocs(true);
    api.get("/doctors/")
      .then((res) => setDoctors(res.data.data || []))
      .catch(() => setError("Failed to load doctors. Please try again."))
      .finally(() => setLoadingDocs(false));
  }, [preselectedDoctor]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleBook = async () => {
    if (!doctor) { setError("Please select a doctor."); return; }
    if (!form.date || !form.time || !form.reason.trim()) {
      setError("All fields are required."); return;
    }
    setLoading(true);
    setError("");
    try {
      await onBook({
        doctor_id:        doctor.id,
        appointment_date: form.date,
        time_slot:        form.time,
        reason:           form.reason,
      });
      setSuccess(true);
      setTimeout(onClose, 2200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">Appointment Booked!</h3>
            <p className="text-slate-500 text-sm mt-2">
              You'll receive a confirmation shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-slate-800">
                {step === 1 ? "Choose a Doctor" : "Book Appointment"}
              </h3>
              <button onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">
                {error}
              </p>
            )}

            {/* Step 1 — Select Doctor */}
            {step === 1 && (
              <div className="space-y-3">
                {loadingDocs ? (
                  <div className="flex justify-center py-8">
                    <Spinner size={28} />
                  </div>
                ) : doctors.length === 0 ? (
                  <p className="text-center text-slate-400 py-8 text-sm">
                    No doctors available. Make sure the backend is running.
                  </p>
                ) : (
                  doctors.map((d) => (
                    <button key={d.id}
                      onClick={() => { setDoctor(d); setStep(2); }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {d.full_name.split(" ").filter(w => w !== "Dr.").map(w => w[0]).slice(0,2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 text-sm">{d.full_name}</div>
                        <div className="text-xs text-slate-500">{d.specialty}</div>
                      </div>
                      <div className="text-sm font-bold text-emerald-600">
                        ₹{d.consultation_fee}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Step 2 — Fill Form */}
            {step === 2 && (
              <>
                {/* Selected doctor preview */}
                {doctor && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {doctor.full_name.split(" ").filter(w => w !== "Dr.").map(w => w[0]).slice(0,2).join("")}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{doctor.full_name}</div>
                      <div className="text-xs text-slate-500">
                        {doctor.specialty} · ₹{doctor.consultation_fee}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Date
                    </label>
                    <input type="d
                    ate"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={form.date}
                      onChange={set("date")}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Time Slot
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={form.time}
                      onChange={set("time")}>
                      <option value="">Select a time slot</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Reason for Visit
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      rows={3}
                      placeholder="Brief description of your health concern…"
                      value={form.reason}
                      onChange={set("reason")}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-5">
                  {!preselectedDoctor && (
                    <button onClick={() => { setStep(1); setError(""); }}
                      className="px-4 py-3 text-sm text-slate-500 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all">
                      ← Back
                    </button>
                  )}
                  <button onClick={handleBook} disabled={loading}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 btn-glow transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading
                      ? <><Spinner size={16} /> Booking…</>
                      : "Confirm Appointment"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}