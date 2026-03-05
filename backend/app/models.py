import uuid
from datetime import datetime
from app.utils.db import db


def _uuid():
    return str(uuid.uuid4())


class User(db.Model):
    __tablename__ = "users"

    id            = db.Column(db.String(36),  primary_key=True, default=_uuid)
    email         = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role          = db.Column(db.Enum("patient", "doctor"), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"


class Patient(db.Model):
    __tablename__ = "patients"

    id            = db.Column(db.String(36), primary_key=True, default=_uuid)
    user_id       = db.Column(db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"),
                              unique=True, nullable=False)
    full_name     = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date,        nullable=True)
    gender        = db.Column(db.Enum("Male", "Female", "Other"), nullable=True)
    blood_group   = db.Column(db.String(10),  nullable=True)
    phone         = db.Column(db.String(20),  nullable=True)
    address       = db.Column(db.Text,        nullable=True)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    appointments  = db.relationship("Appointment", backref="patient", lazy=True,
                                    foreign_keys="Appointment.patient_id")

    def __repr__(self):
        return f"<Patient {self.full_name}>"


class Doctor(db.Model):
    __tablename__ = "doctors"

    id               = db.Column(db.String(36), primary_key=True, default=_uuid)
    user_id          = db.Column(db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"),
                                 unique=True, nullable=False)
    full_name        = db.Column(db.String(255), nullable=False)
    specialty        = db.Column(db.String(255), default="General Physician")
    experience_years = db.Column(db.Integer,     default=0)
    rating           = db.Column(db.Numeric(3, 2), default=0.0)
    consultation_fee = db.Column(db.Integer,     default=500)
    available_days   = db.Column(db.String(100), nullable=True)   # "Mon,Wed,Fri"
    bio              = db.Column(db.Text,        nullable=True)
    is_verified      = db.Column(db.Boolean,     default=False)
    created_at       = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at       = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    appointments     = db.relationship("Appointment", backref="doctor", lazy=True,
                                       foreign_keys="Appointment.doctor_id")

    def __repr__(self):
        return f"<Doctor {self.full_name}>"


class Appointment(db.Model):
    __tablename__ = "appointments"

    id               = db.Column(db.String(36), primary_key=True, default=_uuid)
    patient_id       = db.Column(db.String(36),
                                 db.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id        = db.Column(db.String(36),
                                 db.ForeignKey("doctors.id",  ondelete="CASCADE"), nullable=False)
    appointment_date = db.Column(db.Date,   nullable=False)
    time_slot        = db.Column(db.String(20), nullable=False)
    reason           = db.Column(db.Text,   nullable=False)
    status           = db.Column(
        db.Enum("pending", "confirmed", "completed", "cancelled"),
        default="pending", nullable=False
    )
    notes            = db.Column(db.Text, nullable=True)
    created_at       = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at       = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id":               self.id,
            "appointment_date": str(self.appointment_date),
            "time_slot":        self.time_slot,
            "reason":           self.reason,
            "status":           self.status,
            "doctorName":       self.doctor.full_name  if self.doctor  else "",
            "patientName":      self.patient.full_name if self.patient else "",
            "created_at":       str(self.created_at),
        }


class Report(db.Model):
    __tablename__ = "reports"

    id           = db.Column(db.String(36),  primary_key=True, default=_uuid)
    patient_id   = db.Column(db.String(36),
                             db.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    symptoms     = db.Column(db.Text,        nullable=False)   # comma-separated symptom codes
    diagnosis_id = db.Column(db.String(100), nullable=False)   # disease code e.g. "dengue"
    confidence   = db.Column(db.Integer,     nullable=True)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Report {self.diagnosis_id} for patient {self.patient_id}>"
