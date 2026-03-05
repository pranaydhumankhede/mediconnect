-- ============================================================
-- MediConnect — MySQL Seed Data (Development)
-- Creates 2 sample patients and 2 sample doctors.
-- Passwords are bcrypt hashes of 'demo123'.
-- ============================================================

USE mediconnect;

-- ── Sample Users ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO users (id, email, password_hash, role) VALUES
(
    'u-aarav-0001',
    'aarav.sharma@email.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8n6Y5JsRkrOPKt4R9Ey',
    'patient'
),
(
    'u-priya-0002',
    'priya.mehta@email.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8n6Y5JsRkrOPKt4R9Ey',
    'patient'
),
(
    'u-rohan-0003',
    'dr.rohan@mediconnect.in',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8n6Y5JsRkrOPKt4R9Ey',
    'doctor'
),
(
    'u-ananya-0004',
    'dr.ananya@mediconnect.in',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8n6Y5JsRkrOPKt4R9Ey',
    'doctor'
);

-- ── Sample Patients ───────────────────────────────────────────────────────────
INSERT IGNORE INTO patients (id, user_id, full_name, date_of_birth, gender, blood_group, phone) VALUES
(
    'p-aarav-0001', 'u-aarav-0001',
    'Aarav Sharma', '1997-04-15', 'Male', 'B+', '+91 98765 43210'
),
(
    'p-priya-0002', 'u-priya-0002',
    'Priya Mehta', '1991-09-22', 'Female', 'O+', '+91 91234 56789'
);

-- ── Sample Doctors ────────────────────────────────────────────────────────────
INSERT IGNORE INTO doctors (id, user_id, full_name, specialty, experience_years, rating, consultation_fee, available_days, is_verified) VALUES
(
    'd-rohan-0001', 'u-rohan-0003',
    'Dr. Rohan Verma', 'General Physician', 12, 4.90, 600, 'Mon,Wed,Fri', 1
),
(
    'd-ananya-0002', 'u-ananya-0004',
    'Dr. Ananya Iyer', 'Internal Medicine', 9, 4.80, 750, 'Tue,Thu,Sat', 1
);

-- ── Sample Appointments ───────────────────────────────────────────────────────
INSERT IGNORE INTO appointments (id, patient_id, doctor_id, appointment_date, time_slot, reason, status) VALUES
(
    'a-0001', 'p-aarav-0001', 'd-rohan-0001',
    '2025-07-18', '10:30 AM', 'Seasonal fever and fatigue', 'confirmed'
),
(
    'a-0002', 'p-priya-0002', 'd-ananya-0002',
    '2025-07-20', '11:00 AM', 'Blood sugar monitoring', 'pending'
);
