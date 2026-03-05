-- ============================================================
-- MediConnect — Seed Data (Development)
-- ============================================================

-- Symptoms
INSERT INTO symptoms (code, label, category) VALUES
    ('fever',            'High Fever (>102°F)',           'systemic'),
    ('mild_fever',       'Mild Fever (99–102°F)',          'systemic'),
    ('headache',         'Severe Headache',                'neurological'),
    ('body_ache',        'Body / Muscle Ache',             'musculoskeletal'),
    ('chills',           'Chills & Shivering',             'systemic'),
    ('fatigue',          'Extreme Fatigue',                'systemic'),
    ('rash',             'Skin Rash',                      'dermatological'),
    ('joint_pain',       'Joint Pain',                     'musculoskeletal'),
    ('nausea',           'Nausea / Vomiting',              'gastrointestinal'),
    ('abdominal_pain',   'Abdominal Pain',                 'gastrointestinal'),
    ('diarrhea',         'Diarrhea',                       'gastrointestinal'),
    ('cough',            'Cough',                          'respiratory'),
    ('sore_throat',      'Sore Throat',                    'respiratory'),
    ('runny_nose',       'Runny / Blocked Nose',           'respiratory'),
    ('shortness_breath', 'Shortness of Breath',            'respiratory'),
    ('chest_pain',       'Chest Pain / Tightness',         'cardiovascular'),
    ('dizziness',        'Dizziness / Lightheadedness',    'neurological'),
    ('frequent_urination','Frequent Urination',            'endocrine'),
    ('blurred_vision',   'Blurred Vision',                 'ophthalmological'),
    ('excessive_thirst', 'Excessive Thirst / Hunger',      'endocrine')
ON CONFLICT (code) DO NOTHING;

-- Sample doctors (passwords must be set separately via the API)
-- These are placeholder rows for development reference.
INSERT INTO diseases (code, name, category, severity, advice, consult_when) VALUES
    ('dengue',     'Dengue Fever',          'major',  'High',     'Stay hydrated, paracetamol only, monitor platelets.', 'Immediately within 24 hours.'),
    ('malaria',    'Malaria',               'major',  'High',     'Blood smear test required. Do not self-medicate.',     'Immediately same day.'),
    ('typhoid',    'Typhoid Fever',         'major',  'High',     'Requires antibiotics. Maintain strict food hygiene.',  'Within 24 hours.'),
    ('viral_fever','Viral Fever',           'common', 'Moderate', 'Rest, hydration, paracetamol. Resolves in 5–7 days.', 'If fever persists 3+ days.'),
    ('hypertension','Hypertension',         'major',  'High',     'Monitor BP. Reduce sodium. Never skip medications.',   'Today if BP > 180/120.'),
    ('diabetes',   'Diabetes Type 2',       'major',  'High',     'HbA1c test needed. Reduce carbs, exercise daily.',     'Within 48 hours.'),
    ('common_cold','Common Cold',           'common', 'Low',      'Rest, warm fluids, saline drops. Vitamin C helps.',    'Only if symptoms worsen or last 10+ days.'),
    ('covid',      'COVID-19 (Suspected)',  'major',  'High',     'Isolate, get PCR test, monitor SpO2.',                 'Immediately if SpO2 < 95%.')
ON CONFLICT (code) DO NOTHING;
