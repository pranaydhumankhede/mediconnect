import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/appointments/");
      setAppointments(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const book = async (payload) => {
    const res = await api.post("/appointments/", payload);
    setAppointments((prev) => [res.data.data, ...prev]);
    return res.data.data;
  };

  const updateStatus = async (id, status) => {
    const res = await api.patch(`/appointments/${id}/status`, { status });
    setAppointments((prev) => prev.map((a) => (a.id === id ? res.data.data : a)));
    return res.data.data;
  };

  return { appointments, loading, error, book, updateStatus, refetch: fetchAppointments };
}
