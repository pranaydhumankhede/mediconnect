"""Rule-based symptom-to-disease matching engine."""

DISEASE_RULES = [
    {
        "id": "dengue",
        "name": "Dengue Fever",
        "category": "major",
        "required": ["fever", "headache", "rash", "joint_pain"],
        "supporting": ["body_ache", "fatigue", "nausea"],
        "severity": "High",
        "advice": (
            "Seek immediate medical attention. Stay well-hydrated with oral rehydration salts. "
            "Use paracetamol only for fever — avoid ibuprofen and aspirin. "
            "Platelet count must be monitored closely."
        ),
        "consult": "Immediately — within 24 hours.",
    },
    {
        "id": "malaria",
        "name": "Malaria",
        "category": "major",
        "required": ["fever", "chills", "headache"],
        "supporting": ["body_ache", "nausea", "fatigue", "diarrhea"],
        "severity": "High",
        "advice": (
            "A peripheral blood smear or Rapid Diagnostic Test is mandatory. "
            "Do not self-medicate. Anti-malarial drugs are prescribed based on parasite type."
        ),
        "consult": "Immediately — same day.",
    },
    {
        "id": "typhoid",
        "name": "Typhoid Fever",
        "category": "major",
        "required": ["fever", "abdominal_pain", "fatigue"],
        "supporting": ["headache", "nausea", "diarrhea", "body_ache"],
        "severity": "High",
        "advice": (
            "Requires antibiotic treatment prescribed by a physician. "
            "Maintain strict food and water hygiene. Consume only boiled or purified water."
        ),
        "consult": "Within 24 hours.",
    },
    {
        "id": "viral_fever",
        "name": "Viral Fever",
        "category": "common",
        "required": ["fever", "body_ache", "fatigue"],
        "supporting": ["headache", "chills", "nausea", "sore_throat"],
        "severity": "Moderate",
        "advice": (
            "Rest and adequate hydration are key. Take paracetamol for fever. "
            "Avoid antibiotics unless prescribed. Most cases resolve in 5–7 days."
        ),
        "consult": "If fever persists beyond 3 days or exceeds 104°F.",
    },
    {
        "id": "hypertension",
        "name": "Hypertension (High BP)",
        "category": "major",
        "required": ["headache", "dizziness", "chest_pain"],
        "supporting": ["shortness_breath", "blurred_vision", "fatigue"],
        "severity": "High",
        "advice": (
            "Monitor BP daily. Reduce sodium, alcohol, and stress. "
            "Never skip prescribed antihypertensive medications."
        ),
        "consult": "Today — emergency if BP exceeds 180/120 mmHg.",
    },
    {
        "id": "diabetes",
        "name": "Diabetes (Type 2)",
        "category": "major",
        "required": ["frequent_urination", "excessive_thirst", "fatigue"],
        "supporting": ["blurred_vision", "dizziness", "body_ache"],
        "severity": "High",
        "advice": (
            "Get fasting blood glucose and HbA1c tested urgently. "
            "Reduce refined carbohydrates and sugars. Exercise 30 minutes daily."
        ),
        "consult": "Within 48 hours for confirmatory blood tests.",
    },
    {
        "id": "common_cold",
        "name": "Common Cold",
        "category": "common",
        "required": ["runny_nose", "sore_throat", "cough"],
        "supporting": ["mild_fever", "headache", "fatigue"],
        "severity": "Low",
        "advice": (
            "Rest well and stay warm. Drink warm fluids — herbal tea, warm water with honey. "
            "Saline nasal drops help with congestion. Vitamin C may reduce duration."
        ),
        "consult": "Only if symptoms worsen significantly or last beyond 10 days.",
    },
    {
        "id": "covid",
        "name": "COVID-19 (Suspected)",
        "category": "major",
        "required": ["fever", "cough", "fatigue"],
        "supporting": ["shortness_breath", "body_ache", "headache"],
        "severity": "High",
        "advice": (
            "Isolate immediately and take a COVID-19 RAT or RT-PCR test. "
            "Wear a mask. Monitor SpO2 with a pulse oximeter — seek emergency care if below 94%."
        ),
        "consult": "Immediately if SpO2 drops below 95% or breathing becomes laboured.",
    },
]


def diagnose(symptom_ids: list[str]) -> dict | None:
    best       = None
    best_score = -1.0

    for disease in DISEASE_RULES:
        req_matches  = sum(1 for s in disease["required"]   if s in symptom_ids)
        sup_matches  = sum(1 for s in disease["supporting"] if s in symptom_ids)
        req_ratio    = req_matches / len(disease["required"])
        score        = req_ratio * 10 + sup_matches * 0.5

        if req_ratio >= 0.6 and score > best_score:
            best_score = score
            best = {
                **disease,
                "confidence": min(round((score / 12) * 100), 98),
            }

    return best
