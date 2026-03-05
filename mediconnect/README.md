# 🏥 MediConnect — AI-Powered Healthcare SaaS (MySQL Edition)

A production-ready full-stack healthcare platform with an AI symptom checker,
doctor appointment scheduling, and role-based dashboards.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Flask · Flask-JWT-Extended · Flask-CORS         |
| Database   | MySQL 8.0+ via SQLAlchemy + PyMySQL             |
| Auth       | JWT (custom) + bcrypt password hashing          |
| Frontend   | React 18 · React Router v6 · Tailwind CSS       |
| Icons      | Lucide React                                    |
| HTTP       | Axios with auto JWT header injection            |

---

## Quick Start

### 1. MySQL Setup

Install MySQL from https://dev.mysql.com/downloads/mysql/

```sql
CREATE DATABASE mediconnect;
```

Run the migration files in order:
```bash
mysql -u root -p mediconnect < backend/migrations/001_schema.sql
mysql -u root -p mediconnect < backend/migrations/002_seed_data.sql
```

### 2. Backend

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env        # Fill in your MySQL credentials
python run.py
```

SQLAlchemy will auto-create all tables on first run if they don't exist.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

Open **http://localhost:5173**

---

## Demo Accounts (from seed data)

| Name             | Role    | Email                       | Password |
|------------------|---------|-----------------------------|----------|
| Aarav Sharma     | Patient | aarav.sharma@email.com      | demo123  |
| Priya Mehta      | Patient | priya.mehta@email.com       | demo123  |
| Dr. Rohan Verma  | Doctor  | dr.rohan@mediconnect.in     | demo123  |
| Dr. Ananya Iyer  | Doctor  | dr.ananya@mediconnect.in    | demo123  |

---

## Project Structure

```
mediconnect/
├── backend/
│   ├── app/
│   │   ├── __init__.py          Flask app factory (MySQL config)
│   │   ├── models.py            SQLAlchemy models (User, Patient, Doctor, Appointment, Report)
│   │   ├── auth/routes.py       Register + Login + /me
│   │   ├── appointments/routes.py  Book, list, update status
│   │   ├── symptoms/
│   │   │   ├── engine.py        Rule-based diagnostic engine
│   │   │   └── routes.py        /analyze + /report
│   │   ├── doctors/routes.py    Listings + profile update
│   │   ├── patients/routes.py   Profile CRUD
│   │   └── utils/
│   │       ├── db.py            SQLAlchemy instance
│   │       └── response.py      Uniform JSON helpers
│   ├── migrations/
│   │   ├── 001_schema.sql       Full MySQL table definitions
│   │   ├── 002_seed_data.sql    Sample users, doctors, patients
│   │   └── 003_drop_tables.sql  Reset script (dev only)
│   ├── requirements.txt
│   └── run.py
│
└── frontend/                    (unchanged from original)
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        └── utils/
```

---

## API Endpoints

| Method | Endpoint                        | Auth     | Description              |
|--------|---------------------------------|----------|--------------------------|
| POST   | /api/auth/register              | Public   | Create patient/doctor    |
| POST   | /api/auth/login                 | Public   | Get JWT token            |
| GET    | /api/auth/me                    | JWT      | Current user info        |
| GET    | /api/appointments/              | JWT      | List appointments        |
| POST   | /api/appointments/              | JWT (pt) | Book appointment         |
| PATCH  | /api/appointments/:id/status    | JWT      | Update status            |
| DELETE | /api/appointments/:id           | JWT (pt) | Delete appointment       |
| POST   | /api/symptoms/analyze           | Public   | Run symptom analysis     |
| POST   | /api/symptoms/report            | JWT (pt) | Save report to DB        |
| GET    | /api/symptoms/reports           | JWT (pt) | List saved reports       |
| GET    | /api/doctors/                   | Public   | List all doctors         |
| GET    | /api/doctors/:id                | Public   | Doctor details           |
| PATCH  | /api/doctors/profile            | JWT (dr) | Update doctor profile    |
| GET    | /api/patients/profile           | JWT (pt) | Get patient profile      |
| PATCH  | /api/patients/profile           | JWT (pt) | Update patient profile   |

---

## Diseases Covered by Symptom Engine

| Disease           | Category | Severity |
|-------------------|----------|----------|
| Dengue Fever      | Major    | High     |
| Malaria           | Major    | High     |
| Typhoid Fever     | Major    | High     |
| Viral Fever       | Common   | Moderate |
| Hypertension      | Major    | High     |
| Diabetes Type 2   | Major    | High     |
| Common Cold       | Common   | Low      |
| COVID-19          | Major    | High     |

---

❤️ Author
Pranay Dhumankhede
Computer Science Engineering Student
Full-Stack Developer