export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  region: string;
  complaint: string;
  medications: string;
  allergies: string;
  history: string;
  stgGuideline: string;
  differentials: string[];
}

export const PATIENTS: Patient[] = [
  {
    id: "jane",
    name: "Jane Cohen",
    age: 65,
    gender: "Female",
    region: "North America",
    complaint: "Visible Hematuria (Painless blood in urine)",
    medications: "Lisinopril 10mg daily",
    allergies: "Penicillin (Mild rash)",
    history: "Noticed bright red urine when voiding this morning. The episode was completely painless (no dysuria, no flank tenderness). She reports no fever, chills, or weight changes. Mild hypertension, controlled with Lisinopril. Patient is visibly anxious but remains highly cooperative and polite.",
    stgGuideline: "First-line: Urine microscopy, USG KUB. Rule out malignancy in elderly patients (>60 years). Referral to Urology for urgent cystoscopy and Contrast-Enhanced CT (CECT) Urography.",
    differentials: [
      "Urothelial Carcinoma / Bladder cancer (मूत्राशय का कैंसर)",
      "Urinary Tract Infection (UTI / यूरिन इन्फेक्शन)",
      "Nephrolithiasis / Kidney stones (गुर्दे की पथरी)",
      "Glomerulonephritis (किडनी फिल्टर की सूजन)"
    ]
  },
  {
    id: "aarav",
    name: "Aarav Sharma",
    age: 65,
    gender: "Male",
    region: "North India",
    complaint: "Substernal Chest Pain & Radiating Arm Pain (सीने में तेज दर्द और भारीपन)",
    medications: "Amlodipine 5mg daily (BP ki dawa)",
    allergies: "None known",
    history: "Experienced sudden, crushing retrosternal chest pain radiating to the left arm for the past hour. Associated with sweating (diaphoresis) and mild shortness of breath. No history of trauma. Mild hypertension controlled with Amlodipine. Extremely anxious.",
    stgGuideline: "Emergency ACS Protocol: Immediate 12-lead ECG and cardiac biomarkers (Troponin-I). Administer loading dose: Aspirin 150-325mg (chewed) + Clopidogrel 300mg + Atorvastatin 80mg. Secure IV access, monitor vitals, and refer for urgent coronary angiography (PCI).",
    differentials: [
      "Acute Myocardial Infarction / Heart Attack (दिल का दौरा)",
      "Aortic Dissection (धमनी का फटना)",
      "Gastroesophageal Reflux Disease / GERD (एसिडिटी/गैस)",
      "Angina Pectoris (हृदय शूल)"
    ]
  },
  {
    id: "arjun",
    name: "Arjun Verma",
    age: 62,
    gender: "Male",
    region: "North India",
    complaint: "Chronic Cough with Blood-Tinged Sputum (लगातार खांसी और बलगम में खून)",
    medications: "Metoprolol 25mg daily (BP ki dawa)",
    allergies: "Sulfa drugs",
    history: "Coughing for the past 3 weeks, recently noticed streaks of blood in the sputum. Reports low-grade evening fever, night sweats, fatigue, and unexplained weight loss of 5 kg. Long-term history of smoking (1 pack daily).",
    stgGuideline: "National Tuberculosis Elimination Programme (NTEP) & ICMR: Request two sputum specimens for Acid-Fast Bacilli (AFB) microscopy and CBNAAT (GeneXpert) for drug sensitivity. Perform Chest X-Ray PA view. Notify on Ni-kshay portal and initiate daily FDC Anti-TB therapy (2HRZE + 4HR).",
    differentials: [
      "Pulmonary Tuberculosis / TB (टीबी की बीमारी)",
      "Bronchogenic Carcinoma / Lung Cancer (फेफड़ों का कैंसर)",
      "Chronic Bronchitis / COPD (सीओपीडी)",
      "Bronchiectasis (फेफड़ों की नली का फैलना)"
    ]
  },
  {
    id: "rohan",
    name: "Rohan Gupta",
    age: 67,
    gender: "Male",
    region: "Central India",
    complaint: "Painless Yellowing of Eyes and Dark Urine (आंखों और पेशाब का पीला होना)",
    medications: "Atorvastatin 10mg daily (Cholesterol ki dawa)",
    allergies: "None known",
    history: "Noticed yellow discoloration of the sclera and mustard-colored dark urine over the past 2 weeks. Associated with generalized itching (pruritus) and clay-colored stools. Reports significant loss of appetite and 4 kg weight loss. No acute abdominal pain or fever.",
    stgGuideline: "Obstructive Jaundice Guidelines: Obtain Liver Function Tests (LFT) showing conjugate hyperbilirubinemia and elevated Alkaline Phosphatase (ALP). Request Abdominal USG to assess biliary tract dilation. Order Contrast CT abdomen or MRCP. Rule out periampullary or pancreatic head malignancy. Urgent gastroenterology referral.",
    differentials: [
      "Periampullary / Pancreatic Head Carcinoma (अग्नाशय का कैंसर)",
      "Choledocholithiasis / Common Bile Duct Stone (पित्त की नली में पथरी)",
      "Acute Viral Hepatitis (लिवर की सूजन)",
      "Drug-Induced Liver Injury / DILI (दवाइयों से लिवर को नुकसान)"
    ]
  },
  {
    id: "sai",
    name: "Sai Reddy",
    age: 70,
    gender: "Male",
    region: "South India",
    complaint: "Urinary Frequency, Hesitancy, and Nocturia (पेशाब का बार-बार आना और कम धार)",
    medications: "Amlodipine 10mg daily (BP ki dawa)",
    allergies: "None known",
    history: "Complains of progressive difficulty in starting urination, weak urinary stream, waking up 4-5 times at night to void (nocturia), and a feeling of incomplete bladder emptying over the past 6 months. No fever or pain during urination.",
    stgGuideline: "ICMR Benign Prostatic Hyperplasia (BPH) Guidelines: Perform Digital Rectal Examination (DRE) to evaluate prostate size/nodules. Order Urine Routine, Serum PSA (to screen for malignancy), and USG KUB with Post-Void Residual (PVR) volume. Initiate alpha-blocker therapy (Tamsulosin 0.4mg) if indicated.",
    differentials: [
      "Benign Prostatic Hyperplasia / BPH (प्रोस्टेट ग्रंथि का बढ़ना)",
      "Prostate Adenocarcinoma / Prostate Cancer (प्रोस्टेट का कैंसर)",
      "Neurogenic Bladder (मूत्राशय की तंत्रिका कमजोरी)",
      "Urethral Stricture (मूत्रमार्ग का सिकुड़ना)"
    ]
  },
  {
    id: "vikram",
    name: "Vikram Nair",
    age: 64,
    gender: "Male",
    region: "South India",
    complaint: "Sudden Severe Right Flank Pain radiating to Groin (कमर से पेट की तरफ आने वाला तेज दर्द)",
    medications: "Losartan 50mg daily (BP ki dawa)",
    allergies: "Penicillin",
    history: "Sudden onset of agonizing, colicky right flank pain radiating downward to the groin and testicle. Accompanied by nausea and 2 episodes of vomiting. Unable to lie still due to severe pain. No fever.",
    stgGuideline: "Renal Colic & Nephrolithiasis STG: Immediate pain management with NSAIDs (injection Diclofenac or Tramadol). Request Non-Contrast CT KUB (preferred) or USG KUB to check for calculus. Encourage hydration if no obstruction. Start medical expulsive therapy (Tamsulosin 0.4mg) for stones <10mm. Referral if febrile or renal dysfunction occurs.",
    differentials: [
      "Urolithiasis / Kidney & Ureteric Stones (गुर्दे या मूत्रमार्ग की पथरी)",
      "Acute Pyelonephritis (गुर्दे का संक्रमण)",
      "Acute Appendicitis (अपेन्डिसाइटिस)",
      "Biliary Colic (पित्ताशय का दर्द)"
    ]
  },
  {
    id: "ananya",
    name: "Ananya Iyer",
    age: 63,
    gender: "Female",
    region: "South India",
    complaint: "Severe Fatigue, Palpitations, and Exertional Dyspnea (जल्दी थक जाना और सांस फूलना)",
    medications: "Lisinopril 10mg daily (BP ki dawa)",
    allergies: "None known",
    history: "Progressive, severe fatigue and generalized weakness over 3 months. Gets out of breath climbing a flight of stairs. Reports palpitations, dizziness on standing, and pale conjunctiva. Follows a strict vegetarian diet.",
    stgGuideline: "Nutritional Anemia Guidelines (Anemia Mukt Bharat): Request Complete Blood Count (CBC) to check Hemoglobin levels (<12 g/dL), Hematocrit, MCV (indicating microcytic hypochromic cells), and Serum Ferritin. Rule out occult gastrointestinal blood loss. Initiate oral iron supplementation (100mg elemental iron + Folic Acid daily) and advise vitamin C intake.",
    differentials: [
      "Iron Deficiency Anemia (खून की कमी)",
      "Vitamin B12 / Folate Deficiency Anemia (विटामिन बी12 की कमी)",
      "Hypothyroidism (थायराइड ग्रंथि की कमजोरी)",
      "Chronic Heart Failure / CHF (हृदय की कमजोरी)"
    ]
  },
  {
    id: "diya",
    name: "Diya Patel",
    age: 65,
    gender: "Female",
    region: "West India",
    complaint: "Excessive Thirst, Frequent Urination, and Weight Loss (बार-बार प्यास लगना, पेशाब आना और वजन घटना)",
    medications: "Lisinopril 5mg daily (BP ki dawa)",
    allergies: "Penicillin",
    history: "Noticed dry mouth and drinking 5+ liters of water daily (polydipsia) for the past 6 weeks. Frequently urinates at night (polyuria). Lost 5 kg in 1 month despite having a good appetite. Feels persistently tired.",
    stgGuideline: "ICMR Type 2 Diabetes Guidelines: Perform Fasting Blood Glucose (FBG), Post-Prandial Glucose (PPG), or HbA1c test. FBG >= 126 mg/dL or HbA1c >= 6.5% confirms diagnosis. Initiate lifestyle modification and Metformin 500mg daily. Assess for diabetic complications (retinopathy, neuropathy, nephropathy) and lipid profiles.",
    differentials: [
      "Type 2 Diabetes Mellitus (मधुमेह / शुगर)",
      "Diabetes Insipidus (दुर्लभ मूत्र रोग)",
      "Primary Polydipsia (अत्यधिक पानी पीने की आदत)",
      "Hyperthyroidism (थायराइड की अतिसक्रियता)"
    ]
  },
  {
    id: "priya",
    name: "Priya Sen",
    age: 66,
    gender: "Female",
    region: "East India",
    complaint: "Burning Sensation During Urination and Suprapubic Pain (पेशाब में जलन और पेट के निचले हिस्से में दर्द)",
    medications: "Hydrochlorothiazide 12.5mg daily (BP ki dawa)",
    allergies: "None known",
    history: "Experienced severe burning during urination for the last 2 days. Reports increased frequency, urgency, and dull aching pain in the lower abdomen (suprapubic area). No fever, chills, vaginal discharge, or flank tenderness.",
    stgGuideline: "Uncomplicated Urinary Tract Infection (UTI) STG: Perform Urine Routine & Microscopy showing significant pyuria (>10 WBCs/hpf) and bacteriuria. Prescribe empiric first-line oral antibiotic: Nitrofurantoin 100mg BID for 5 days OR Cotrimoxazole (Trimethoprim/Sulfamethoxazole) BID for 3 days. Encourage high oral fluid intake.",
    differentials: [
      "Acute Cystitis / UTI (यूरिन इन्फेक्शन)",
      "Vulvovaginitis (योनि का संक्रमण)",
      "Interstitial Cystitis (क्रोनिक मूत्राशय दर्द)",
      "Bladder Calculi (मूत्राशय की पथरी)"
    ]
  },
  {
    id: "ishita",
    name: "Ishita Vishwakarma",
    age: 61,
    gender: "Female",
    region: "Central India",
    complaint: "Sudden Weakness in Left Arm & Drooping of Face (बाएं हाथ में कमजोरी और मुंह का टेढ़ा होना)",
    medications: "Lisinopril 20mg daily (BP ki dawa)",
    allergies: "Aspirin",
    history: "Sudden onset of weakness in left upper and lower limbs about 2 hours ago, causing her to fall. Family noticed slurred speech and facial asymmetry (drooping of left corner of mouth). Has history of poorly controlled hypertension.",
    stgGuideline: "Stroke Management Guidelines & ICMR: Code Red emergency. Immediate non-contrast CT Brain to rule out hemorrhage. Assess eligibility for IV Thrombolysis (r-tPA) if ischemic stroke onset is <4.5 hours and no contraindications (allergy to Aspirin requires alternative antiplatelets like Clopidogrel). Avoid lowering BP unless >220/120 mmHg. Admit to Stroke ICU.",
    differentials: [
      "Acute Ischemic Stroke (मस्तिष्क पक्षाघात / स्ट्रोक)",
      "Intracerebral Hemorrhage / Hemorrhagic Stroke (ब्रेन हैमरेज)",
      "Transient Ischemic Attack / TIA (क्षणिक स्ट्रोक)",
      "Bell's Palsy (चेहरे का लकवा - facial nerve palsy)"
    ]
  },
  {
    id: "meera",
    name: "Meera Joshi",
    age: 68,
    gender: "Female",
    region: "North India",
    complaint: "Severe Chronic Knee Joint Pain & Stiffness (घुटनों में दर्द और चलने में परेशानी)",
    medications: "Lisinopril 10mg daily (BP ki dawa)",
    allergies: "Penicillin",
    history: "Bilateral knee joint pain for the past 5 years, gradually worsening. The pain is exacerbated by prolonged standing, walking, or climbing stairs, and relieved by resting. Reports joint stiffness in the morning lasting 10-15 minutes. Mild swelling and crepitus noted.",
    stgGuideline: "ICMR Osteoarthritis (OA) Knee Guidelines: Obtain weight-bearing AP & Lateral radiographs of bilateral knees to check for joint space narrowing and osteophytes. Recommend weight management, physical therapy (quadriceps strengthening), and joint protection. Prescribe oral Paracetamol or short-course selective NSAIDs + Proton Pump Inhibitor (PPI) coverage. Consider intra-articular therapies or joint replacement for end-stage OA.",
    differentials: [
      "Knee Osteoarthritis / OA (घुटने का घिसना)",
      "Rheumatoid Arthritis (गठिया / रूमेटाइड अर्थराइटिस)",
      "Chronic Gouty Arthritis (यूरिक एसिड वाला गठिया)",
      "Anserine Bursitis (घुटने के पास की सूजन)"
    ]
  },
  {
    id: "aditya",
    name: "Aditya Mishra",
    age: 69,
    gender: "Male",
    region: "North India",
    complaint: "Progressive Shortness of Breath and Wheezing (सांस फूलना, घरघराहट और बलगम वाली खांसी)",
    medications: "Amlodipine 5mg daily (BP ki dawa)",
    allergies: "None known",
    history: "Chronic productive cough with whitish phlegm for over 10 years, which he attributed to 'smoker's cough'. Over the last 6 months, developed progressive breathlessness on exertion, now experiencing an acute flare-up with audible chest wheezing. Smoked 1 pack of bidis daily for 40 years.",
    stgGuideline: "COPD Management & ICMR Guidelines: Perform Spirometry (FEV1/FVC < 0.70 post-bronchodilator) for confirmation. For acute exacerbation: Administer oxygen therapy (maintain saturation 88-92%), nebulized short-acting bronchodilators (Levosalbutamol + Ipratropium Bromide), and oral Prednisolone 40mg daily for 5 days. Counsel intensively on smoking cessation.",
    differentials: [
      "Chronic Obstructive Pulmonary Disease / COPD (दमा-फेफड़े की बीमारी)",
      "Bronchial Asthma (अस्थमा)",
      "Congestive Heart Failure / CHF (दिल की विफलता)",
      "Pulmonary Tuberculosis (टीबी)"
    ]
  },
  {
    id: "kavya",
    name: "Kavya Rao",
    age: 60,
    gender: "Female",
    region: "South India",
    complaint: "Recurrent Right Upper Abdomen Pain post-meals (पेट के दाहिने ऊपरी भाग में दर्द और उल्टी जैसा लगना)",
    medications: "Lisinopril 10mg daily (BP ki dawa)",
    allergies: "None known",
    history: "Complains of episodic, sharp, stabbing pain in the right upper quadrant of the abdomen radiating to the right scapula. Pain typically starts 1 hour after consuming fatty meals (e.g., fried food, ghee), lasts 2-3 hours, and is associated with nausea and bloating.",
    stgGuideline: "Gallstone Disease Guidelines: Perform abdominal Ultrasonography (USG) to confirm presence of gallbladder stones (cholelithiasis). Advise low-fat diet. During acute colicky episodes, keep nil-per-oral (NPO) and administer antispasmodics (Drotaverine or Dicyclomine) and analgesics. Refer to general surgery for elective laparoscopic cholecystectomy.",
    differentials: [
      "Cholelithiasis / Biliary Colic (पित्ताशय की पथरी का दर्द)",
      "Acute Cholecystitis (पित्ताशय की थैली की सूजन)",
      "Peptic Ulcer Disease / Gastritis (गैस या पेट का अल्सर)",
      "Acute Pancreatitis (अग्नाशय की सूजन)"
    ]
  },
  {
    id: "rahul",
    name: "Rahul Das",
    age: 71,
    gender: "Male",
    region: "East India",
    complaint: "Severe Joint Pain and Swelling in Right Great Toe (पैर के अंगूठे में तेज दर्द and लाल सूजन)",
    medications: "Amlodipine 10mg daily (BP ki dawa)",
    allergies: "None known",
    history: "Woke up in the middle of the night with sudden, unbearable pain, swelling, and redness in the right first metatarsophalangeal joint. The joint is extremely hot and sensitive, unable to bear even a bedsheet. Reports eating red meat and drinking alcohol yesterday.",
    stgGuideline: "Acute Gouty Arthritis STG: Perform serum uric acid test (though it can be normal during acute flare). Provide rapid pain relief with oral NSAIDs (Indomethacin 50mg TID or Naproxen) or low-dose Colchicine (0.5mg BID/TID). Do NOT initiate allopurinol during the acute phase. Advise hydration and dietary restriction of purine-rich foods.",
    differentials: [
      "Acute Gout (गठिया रोग)",
      "Septic Arthritis (जोड़ में जीवाणु संक्रमण)",
      "Cellulitis (त्वचा का गंभीर संक्रमण)",
      "Pseudogout (कैल्शियम पाइरोफॉस्फेट जमाव)"
    ]
  },
  {
    id: "sneha",
    name: "Sneha Kulkarni",
    age: 67,
    gender: "Female",
    region: "West India",
    complaint: "Epigastric Burning Pain and Acid Reflux (पेट के ऊपरी हिस्से में जलन और खट्टी डकारें)",
    medications: "Lisinopril 10mg daily (BP ki dawa)",
    allergies: "Penicillin",
    history: "Burning epigastric pain for 4 weeks, occurring 2-3 hours after meals or late at night, frequently waking her up. Pain is partially relieved by eating food or taking antacids. Associated with frequent belching, abdominal bloating, and sour taste in mouth.",
    stgGuideline: "ICMR Peptic Ulcer Disease (PUD) / Dyspepsia Guidelines: Check for Helicobacter pylori infection using non-invasive tests (Urea Breath Test or stool antigen) or endoscopy if red flags exist. Start empirical Proton Pump Inhibitor (PPI) therapy (e.g., Pantoprazole 40mg BID) for 4-8 weeks. Counsel patient to avoid NSAIDs, spicy food, smoking, and caffeine.",
    differentials: [
      "Peptic Ulcer Disease / PUD (पेट का अल्सर)",
      "Gastroesophageal Reflux Disease / GERD (जीईआरडी / एसिडिटी)",
      "Gastritis (गैस्ट्राइटिस - पेट की परत की सूजन)",
      "Atypical Cardiac Ischemia (असामान्य हृदय दर्द)"
    ]
  }
];
