-- ============================================================
-- MediConnect — MySQL Schema
-- Compatible with MySQL 8.0+
-- Run this in MySQL Workbench or via: mysql -u root -p mediconnect < 001_schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS mediconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mediconnect;

-- ── users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            CHAR(36)     NOT NULL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('patient','doctor') NOT NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ── patients ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
    id            CHAR(36)     NOT NULL PRIMARY KEY,
    user_id       CHAR(36)     NOT NULL UNIQUE,
    full_name     VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender        ENUM('Male','Female','Other'),
    blood_group   VARCHAR(10),
    phone         VARCHAR(20),
    address       TEXT,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── doctors ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
    id               CHAR(36)      NOT NULL PRIMARY KEY,
    user_id          CHAR(36)      NOT NULL UNIQUE,
    full_name        VARCHAR(255)  NOT NULL,
    specialty        VARCHAR(255)  NOT NULL DEFAULT 'General Physician',
    experience_years INT           NOT NULL DEFAULT 0,
    rating           DECIMAL(3,2)  DEFAULT 0.00,
    consultation_fee INT           NOT NULL DEFAULT 500,
    available_days   VARCHAR(100),          -- e.g. 'Mon,Wed,Fri'
    bio              TEXT,
    is_verified      TINYINT(1)    NOT NULL DEFAULT 0,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── appointments ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
    id               CHAR(36)  NOT NULL PRIMARY KEY,
    patient_id       CHAR(36)  NOT NULL,
    doctor_id        CHAR(36)  NOT NULL,
    appointment_date DATE      NOT NULL,
    time_slot        VARCHAR(20) NOT NULL,
    reason           TEXT      NOT NULL,
    status           ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
    notes            TEXT,
    created_at       DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appt_doctor  FOREIGN KEY (doctor_id)  REFERENCES doctors(id)  ON DELETE CASCADE,
    INDEX idx_appt_patient (patient_id),
    INDEX idx_appt_doctor  (doctor_id),
    INDEX idx_appt_date    (appointment_date)
) ENGINE=InnoDB;

-- ── reports ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
    id           CHAR(36)     NOT NULL PRIMARY KEY,
    patient_id   CHAR(36)     NOT NULL,
    symptoms     TEXT         NOT NULL,    -- comma-separated symptom codes
    diagnosis_id VARCHAR(100) NOT NULL,    -- e.g. 'dengue', 'malaria'
    confidence   INT,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_reports_patient (patient_id)
) ENGINE=InnoDB;
