from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.utils.db import db
from app.models import Doctor
from app.utils.response import success, error

doctors_bp = Blueprint("doctors", __name__)


@doctors_bp.get("/")
def list_doctors():
    doctors = Doctor.query.order_by(Doctor.full_name).all()
    return success([{
        "id":               d.id,
        "full_name":        d.full_name,
        "specialty":        d.specialty,
        "experience_years": d.experience_years,
        "rating":           float(d.rating or 0),
        "consultation_fee": d.consultation_fee,
        "available_days":   d.available_days,
        "bio":              d.bio,
        "is_verified":      d.is_verified,
    } for d in doctors])


@doctors_bp.get("/<doctor_id>")
def get_doctor(doctor_id):
    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return error("Doctor not found.", 404)
    return success({
        "id":               doctor.id,
        "full_name":        doctor.full_name,
        "specialty":        doctor.specialty,
        "experience_years": doctor.experience_years,
        "rating":           float(doctor.rating or 0),
        "consultation_fee": doctor.consultation_fee,
        "available_days":   doctor.available_days,
        "bio":              doctor.bio,
    })


@doctors_bp.patch("/profile")
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    if identity["role"] != "doctor":
        return error("Access denied.", 403)

    doctor = Doctor.query.filter_by(user_id=identity["id"]).first()
    if not doctor:
        return error("Doctor profile not found.", 404)

    data    = request.get_json(silent=True) or {}
    allowed = ["specialty", "experience_years", "consultation_fee", "available_days", "bio"]
    for field in allowed:
        if field in data:
            setattr(doctor, field, data[field])

    db.session.commit()
    return success({"id": doctor.id, "full_name": doctor.full_name}, "Profile updated.")
