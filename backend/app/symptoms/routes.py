from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.utils.db import db
from app.models import Patient, Report
from app.utils.response import success, error
from .engine import diagnose

symptoms_bp = Blueprint("symptoms", __name__)


@symptoms_bp.post("/analyze")
def analyze():
    data     = request.get_json(silent=True) or {}
    symptoms = data.get("symptoms", [])

    if not isinstance(symptoms, list) or len(symptoms) < 2:
        return error("Provide at least 2 symptoms as a list.", 422)

    result = diagnose(symptoms)
    if not result:
        return success(None, "No confident match found. Please consult a doctor directly.")

    return success(result, "Diagnosis complete.")


@symptoms_bp.post("/report")
@jwt_required()
def save_report():
    identity     = get_jwt_identity()
    data         = request.get_json(silent=True) or {}
    symptoms     = data.get("symptoms", [])
    diagnosis_id = data.get("diagnosis_id", "")
    confidence   = data.get("confidence")

    if not symptoms or not diagnosis_id:
        return error("symptoms and diagnosis_id are required.", 422)

    patient = Patient.query.filter_by(user_id=identity["id"]).first()
    if not patient:
        return error("Patient profile not found.", 404)

    report = Report(
        patient_id=patient.id,
        symptoms=",".join(symptoms),        # stored as CSV string in MySQL
        diagnosis_id=diagnosis_id,
        confidence=confidence,
    )
    db.session.add(report)
    db.session.commit()

    return success({"id": report.id, "diagnosis_id": report.diagnosis_id}, "Report saved.", 201)


@symptoms_bp.get("/reports")
@jwt_required()
def list_reports():
    identity = get_jwt_identity()
    patient  = Patient.query.filter_by(user_id=identity["id"]).first()

    if not patient:
        return success([])

    reports = (
        Report.query
        .filter_by(patient_id=patient.id)
        .order_by(Report.created_at.desc())
        .all()
    )
    result = [{
        "id":           r.id,
        "symptoms":     r.symptoms.split(","),
        "diagnosis_id": r.diagnosis_id,
        "confidence":   r.confidence,
        "created_at":   str(r.created_at),
    } for r in reports]

    return success(result)
