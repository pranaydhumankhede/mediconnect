from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.utils.db import db
from app.models import Appointment, Patient, Doctor
from app.utils.response import success, error

appointments_bp = Blueprint("appointments", __name__)
VALID_STATUSES  = ("pending", "confirmed", "completed", "cancelled")


@appointments_bp.get("/")
@jwt_required()
def list_appointments():
    identity = get_jwt_identity()

    if identity["role"] == "patient":
        patient = Patient.query.filter_by(user_id=identity["id"]).first()
        if not patient:
            return success([])
        rows = (
            Appointment.query
            .filter_by(patient_id=patient.id)
            .order_by(Appointment.appointment_date.desc())
            .all()
        )
    else:
        doctor = Doctor.query.filter_by(user_id=identity["id"]).first()
        if not doctor:
            return success([])
        rows = (
            Appointment.query
            .filter_by(doctor_id=doctor.id)
            .order_by(Appointment.appointment_date.desc())
            .all()
        )

    return success([a.to_dict() for a in rows])


@appointments_bp.post("/")
@jwt_required()
def book_appointment():
    identity = get_jwt_identity()
    if identity["role"] != "patient":
        return error("Only patients can book appointments.", 403)

    data      = request.get_json(silent=True) or {}
    doctor_id = data.get("doctor_id")
    date      = data.get("appointment_date")
    time_slot = data.get("time_slot")
    reason    = data.get("reason", "").strip()

    if not all([doctor_id, date, time_slot, reason]):
        return error("doctor_id, appointment_date, time_slot, and reason are required.", 422)

    patient = Patient.query.filter_by(user_id=identity["id"]).first()
    if not patient:
        return error("Patient profile not found.", 404)

    if not Doctor.query.get(doctor_id):
        return error("Doctor not found.", 404)

    clash = (
        Appointment.query
        .filter_by(doctor_id=doctor_id, appointment_date=date, time_slot=time_slot)
        .filter(Appointment.status != "cancelled")
        .first()
    )
    if clash:
        return error("This time slot is already booked. Please choose another.", 409)

    appt = Appointment(
        patient_id=patient.id, doctor_id=doctor_id,
        appointment_date=date,  time_slot=time_slot,
        reason=reason,          status="pending",
    )
    db.session.add(appt)
    db.session.commit()
    return success(appt.to_dict(), "Appointment booked successfully.", 201)


@appointments_bp.patch("/<appointment_id>/status")
@jwt_required()
def update_status(appointment_id):
    identity   = get_jwt_identity()
    new_status = (request.get_json(silent=True) or {}).get("status")

    if new_status not in VALID_STATUSES:
        return error(f"status must be one of: {', '.join(VALID_STATUSES)}", 422)

    appt = Appointment.query.get(appointment_id)
    if not appt:
        return error("Appointment not found.", 404)

    # Role-based permission check
    if identity["role"] == "doctor":
        doctor = Doctor.query.filter_by(user_id=identity["id"]).first()
        if not doctor or appt.doctor_id != doctor.id:
            return error("Access denied.", 403)

    if identity["role"] == "patient":
        patient = Patient.query.filter_by(user_id=identity["id"]).first()
        if not patient or appt.patient_id != patient.id:
            return error("Access denied.", 403)
        if new_status != "cancelled":
            return error("Patients may only cancel appointments.", 403)

    appt.status = new_status
    db.session.commit()
    return success(appt.to_dict(), f"Appointment marked as {new_status}.")


@appointments_bp.delete("/<appointment_id>")
@jwt_required()
def delete_appointment(appointment_id):
    identity = get_jwt_identity()
    appt     = Appointment.query.get(appointment_id)

    if not appt:
        return error("Appointment not found.", 404)

    patient = Patient.query.filter_by(user_id=identity["id"]).first()
    if not patient or appt.patient_id != patient.id:
        return error("Access denied.", 403)

    db.session.delete(appt)
    db.session.commit()
    return success(message="Appointment deleted.")
