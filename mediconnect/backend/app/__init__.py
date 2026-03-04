from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()

from app.utils.db import db


def create_app():
    app = Flask(__name__)

    # ── Config ────────────────────────────────────────────────────────────────
    app.config["SECRET_KEY"]               = os.getenv("FLASK_SECRET_KEY", "dev-secret")
    app.config["JWT_SECRET_KEY"]           = os.getenv("JWT_SECRET_KEY",   "dev-jwt-secret")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))

    # ── MySQL via SQLAlchemy ───────────────────────────────────────────────────
    MYSQL_USER = os.getenv("MYSQL_USER",     "root")
    MYSQL_PASS = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST = os.getenv("MYSQL_HOST",     "localhost")
    MYSQL_PORT = os.getenv("MYSQL_PORT",     "3306")
    MYSQL_DB   = os.getenv("MYSQL_DATABASE", "mediconnect")

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASS}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ── Extensions ────────────────────────────────────────────────────────────
    db.init_app(app)
    CORS(app, origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")])
    JWTManager(app)

    # ── Auto-create tables on first run ───────────────────────────────────────
    with app.app_context():
        from app import models          # noqa: F401  — registers all models
        db.create_all()

    # ── Blueprints ────────────────────────────────────────────────────────────
    from app.auth.routes         import auth_bp
    from app.appointments.routes import appointments_bp
    from app.symptoms.routes     import symptoms_bp
    from app.doctors.routes      import doctors_bp
    from app.patients.routes     import patients_bp

    app.register_blueprint(auth_bp,          url_prefix="/api/auth")
    app.register_blueprint(appointments_bp,  url_prefix="/api/appointments")
    app.register_blueprint(symptoms_bp,      url_prefix="/api/symptoms")
    app.register_blueprint(doctors_bp,       url_prefix="/api/doctors")
    app.register_blueprint(patients_bp,      url_prefix="/api/patients")

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "MediConnect API v1 (MySQL)"}

    return app
