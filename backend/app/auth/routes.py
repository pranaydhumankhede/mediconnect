from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt

from app.utils.db import db
from app.models import User, Patient, Doctor
from app.utils.response import success, error

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data     = request.get_json(silent=True) or {}
    name     = data.get("name",     "").strip()
    email    = data.get("email",    "").strip().lower()
    password = data.get("password", "")
    role     = data.get("role",     "patient")

    if not all([name, email, password]):
        return error("name, email, and password are required.", 422)
    if role not in ("patient", "doctor"):
        return error("role must be 'patient' or 'doctor'.", 422)

    if User.query.filter_by(email=email).first():
        return error("An account with this email already exists.", 409)

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user   = User(email=email, password_hash=hashed, role=role)
    db.session.add(user)
    db.session.flush()          # populate user.id before linking profile

    if role == "patient":
        db.session.add(Patient(user_id=user.id, full_name=name))
    else:
        db.session.add(Doctor(user_id=user.id, full_name=name))

    db.session.commit()

    token = create_access_token(identity={"id": user.id, "role": role, "name": name})
    return success(
        {"token": token, "user": {"id": user.id, "name": name, "role": role, "email": email}},
        "Account created successfully.",
        201,
    )


@auth_bp.post("/login")
def login():
    data     = request.get_json(silent=True) or {}
    email    = data.get("email",    "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return error("email and password are required.", 422)

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return error("Invalid credentials.", 401)

    profile = (
        Patient.query.filter_by(user_id=user.id).first()
        if user.role == "patient"
        else Doctor.query.filter_by(user_id=user.id).first()
    )
    name  = profile.full_name if profile else email
    token = create_access_token(identity={"id": user.id, "role": user.role, "name": name})

    return success({
        "token": token,
        "user":  {"id": user.id, "name": name, "role": user.role, "email": email},
    })


@auth_bp.get("/me")
@jwt_required()
def me():
    return success(get_jwt_identity())
