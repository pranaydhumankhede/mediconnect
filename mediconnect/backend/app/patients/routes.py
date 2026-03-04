from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.utils.db import db
from app.models import Patient
from app.utils.response import success, error

patients_bp = Blueprint("patients", __name__)


@patients_bp.get("/profile")
@jwt_required()
def get_profile():
    identity = get_jwt_identity()
    if identity["role"] != "patient":
        return error("Access denied.", 403)

    patient = Patient.query.filter_by(user_id=identity["id"]).first()
    if not patient:
        return error("Patient profile not found.", 404)

    return success({
        "id":           patient.id,
        "full_name":    patient.full_name,
        "date_of_birth":str(patient.date_of_birth) if patient.date_of_birth else None,
        "gender":       patient.gender,
        "blood_group":  patient.blood_group,
        "phone":        patient.phone,
        "address":      patient.address,
    })


@patients_bp.patch("/profile")
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    if identity["role"] != "patient":
        return error("Access denied.", 403)

    patient = Patient.query.filter_by(user_id=identity["id"]).first()
    if not patient:
        return error("Patient profile not found.", 404)

    data    = request.get_json(silent=True) or {}
    allowed = ["full_name", "date_of_birth", "gender", "blood_group", "phone", "address"]
    for field in allowed:
        if field in data:
            setattr(patient, field, data[field])

    db.session.commit()
    return success({"id": patient.id, "full_name": patient.full_name}, "Profile updated.")
