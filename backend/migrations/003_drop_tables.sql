-- ============================================================
-- MediConnect — Drop All Tables (USE WITH CAUTION)
-- Run this only to reset the database during development.
-- ============================================================

USE mediconnect;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;
