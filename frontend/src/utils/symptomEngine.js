export const SYMPTOMS = [
  { id: "fever",            label: "High Fever (>102°F)" },
  { id: "mild_fever",       label: "Mild Fever (99–102°F)" },
  { id: "headache",         label: "Severe Headache" },
  { id: "body_ache",        label: "Body / Muscle Ache" },
  { id: "chills",           label: "Chills & Shivering" },
  { id: "fatigue",          label: "Extreme Fatigue" },
  { id: "rash",             label: "Skin Rash" },
  { id: "joint_pain",       label: "Joint Pain" },
  { id: "nausea",           label: "Nausea / Vomiting" },
  { id: "abdominal_pain",   label: "Abdominal Pain" },
  { id: "diarrhea",         label: "Diarrhea" },
  { id: "cough",            label: "Cough" },
  { id: "sore_throat",      label: "Sore Throat" },
  { id: "runny_nose",       label: "Runny / Blocked Nose" },
  { id: "shortness_breath", label: "Shortness of Breath" },
  { id: "chest_pain",       label: "Chest Pain / Tightness" },
  { id: "dizziness",        label: "Dizziness / Lightheadedness" },
  { id: "frequent_urination","label": "Frequent Urination" },
  { id: "blurred_vision",   label: "Blurred Vision" },
  { id: "excessive_thirst", label: "Excessive Thirst / Hunger" },
];

const RULES = [
  {
    id: "dengue", name: "Dengue Fever", category: "major", severity: "High",
    required: ["fever","headache","rash","joint_pain"],
    supporting: ["body_ache","fatigue","nausea"],
    advice: "Seek immediate medical attention. Stay well-hydrated. Use paracetamol only for fever — avoid ibuprofen and aspirin. Platelet count must be monitored closely.",
    consult: "Immediately — within 24 hours.",
  },
  {
    id: "malaria", name: "Malaria", category: "major", severity: "High",
    required: ["fever","chills","headache"],
    supporting: ["body_ache","nausea","fatigue","diarrhea"],
    advice: "A peripheral blood smear or Rapid Diagnostic Test is mandatory. Do not self-medicate. Anti-malarials are prescribed based on parasite type.",
    consult: "Immediately — same day.",
  },
  {
    id: "typhoid", name: "Typhoid Fever", category: "major", severity: "High",
    required: ["fever","abdominal_pain","fatigue"],
    supporting: ["headache","nausea","diarrhea","body_ache"],
    advice: "Requires antibiotic treatment from a physician. Maintain strict food hygiene. Drink only boiled or purified water.",
    consult: "Within 24 hours.",
  },
  {
    id: "viral_fever", name: "Viral Fever", category: "common", severity: "Moderate",
    required: ["fever","body_ache","fatigue"],
    supporting: ["headache","chills","nausea","sore_throat"],
    advice: "Rest and hydration are key. Take paracetamol for fever. Avoid antibiotics unless prescribed. Most cases resolve in 5–7 days.",
    consult: "If fever persists beyond 3 days or exceeds 104°F.",
  },
  {
    id: "hypertension", name: "Hypertension (High BP)", category: "major", severity: "High",
    required: ["headache","dizziness","chest_pain"],
    supporting: ["shortness_breath","blurred_vision","fatigue"],
    advice: "Monitor blood pressure daily. Reduce sodium intake. Never skip prescribed antihypertensive medications.",
    consult: "Today — emergency if BP exceeds 180/120 mmHg.",
  },
  {
    id: "diabetes", name: "Diabetes (Type 2)", category: "major", severity: "High",
    required: ["frequent_urination","excessive_thirst","fatigue"],
    supporting: ["blurred_vision","dizziness","body_ache"],
    advice: "Get fasting blood glucose and HbA1c tested urgently. Reduce refined carbohydrates. Exercise 30 minutes daily.",
    consult: "Within 48 hours for confirmatory blood tests.",
  },
  {
    id: "common_cold", name: "Common Cold", category: "common", severity: "Low",
    required: ["runny_nose","sore_throat","cough"],
    supporting: ["mild_fever","headache","fatigue"],
    advice: "Rest and stay warm. Drink warm fluids — herbal tea, warm water with honey. Saline nasal drops help. Vitamin C may reduce duration.",
    consult: "Only if symptoms worsen or last beyond 10 days.",
  },
  {
    id: "covid", name: "COVID-19 (Suspected)", category: "major", severity: "High",
    required: ["fever","cough","fatigue"],
    supporting: ["shortness_breath","body_ache","headache"],
    advice: "Isolate immediately. Get a COVID-19 RAT or RT-PCR test. Wear a mask. Monitor SpO2 — seek emergency care if below 94%.",
    consult: "Immediately if SpO2 drops below 95% or breathing becomes laboured.",
  },
];

export function diagnose(selectedIds) {
  let best = null, bestScore = -1;
  for (const r of RULES) {
    const reqMatch = r.required.filter((s) => selectedIds.includes(s)).length;
    const supMatch = r.supporting.filter((s) => selectedIds.includes(s)).length;
    const ratio    = reqMatch / r.required.length;
    const score    = ratio * 10 + supMatch * 0.5;
    if (ratio >= 0.6 && score > bestScore) {
      bestScore = score;
      best = { ...r, confidence: Math.min(Math.round((score / 12) * 100), 98) };
    }
  }
  return best;
}

export function generateTxtReport(patientName, selectedIds, diagnosis) {
  const now     = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const symList = selectedIds
    .map((id) => SYMPTOMS.find((s) => s.id === id)?.label || id)
    .map((l) => "  • " + l)
    .join("\n");

  return [
    "═══════════════════════════════════════════",
    "         MEDICONNECT SYMPTOM REPORT        ",
    "     Powered by AI Diagnostic Engine       ",
    "═══════════════════════════════════════════",
    "",
    `Patient Name   : ${patientName}`,
    `Report Date    : ${now} (IST)`,
    `Report ID      : MC-${Date.now().toString().slice(-8)}`,
    "",
    "───────────────────────────────────────────",
    "SYMPTOMS REPORTED",
    "───────────────────────────────────────────",
    symList,
    "",
    "───────────────────────────────────────────",
    "PRELIMINARY DIAGNOSIS",
    "───────────────────────────────────────────",
    `Condition      : ${diagnosis.name}`,
    `Category       : ${diagnosis.category === "major" ? "Major / Serious" : "Common Illness"}`,
    `Severity Level : ${diagnosis.severity}`,
    `Confidence     : ~${diagnosis.confidence}%`,
    "",
    "───────────────────────────────────────────",
    "MEDICAL ADVICE",
    "───────────────────────────────────────────",
    diagnosis.advice,
    "",
    "───────────────────────────────────────────",
    "WHEN TO SEE A DOCTOR",
    "───────────────────────────────────────────",
    diagnosis.consult,
    "",
    "───────────────────────────────────────────",
    "DISCLAIMER",
    "───────────────────────────────────────────",
    "This report is generated by a rule-based symptom checker",
    "and is NOT a substitute for professional medical diagnosis.",
    "Please consult a licensed physician for accurate treatment.",
    "",
    "═══════════════════════════════════════════",
    "        © MediConnect Health Pvt. Ltd.     ",
    "         www.mediconnect.in | 2025         ",
    "═══════════════════════════════════════════",
  ].join("\n");
}
