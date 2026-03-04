-- ============================================================
-- MediConnect — Row Level Security Policies
-- ============================================================

ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients     ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors      ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports      ENABLE ROW LEVEL SECURITY;

-- users: each user reads/updates only their own row
CREATE POLICY users_self_select ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_self_update ON users FOR UPDATE USING (auth.uid() = id);

-- patients: patient can CRUD their own profile; doctors can read
CREATE POLICY patients_own        ON patients FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY patients_doctor_read ON patients FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'doctor')
);

-- doctors: doctors manage their own profile; patients can read all
CREATE POLICY doctors_own         ON doctors FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY doctors_public_read ON doctors FOR SELECT USING (TRUE);

-- appointments: patient sees their own; doctor sees assigned
CREATE POLICY appt_patient ON appointments FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
);
CREATE POLICY appt_doctor ON appointments FOR ALL USING (
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
);

-- reports: patients see only their own
CREATE POLICY reports_own ON reports FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
);
