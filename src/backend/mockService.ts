// Intelligent bilingual medical character mock responses fallback (English + Hinglish/Hindi script)
// Dynamically adapts to any name, gender, complaint, and medical history

function detectLanguage(text: string): "english" | "hindi-devanagari" | "hinglish" {
  // Check for Devanagari characters
  if (/[\u0900-\u097F]/.test(text)) {
    return "hindi-devanagari";
  }

  const query = text.toLowerCase();
  
  // List of common Hindi/Hinglish words (e.g. pronouns, verbs, prepositions, particles, nouns)
  const hinglishKeywords = [
    "kya", "hai", "hain", "hu", "hoon", "ho", "apne", "apka", "aapka", "naam", 
    "taklif", "pareshani", "dard", "bukhar", "thoda", "mera", "meri", "mere", 
    "se", "ko", "mein", "kaise", "kese", "acha", "achha", "ji", "haa", 
    "haan", "na", "nahi", "nahin", "bataye", "batayein", "bataiye", "dawa", 
    "dawai", "shikayat", "dikkat", "khoon", "peshab", "jalan", "peeth", 
    "kamardard", "saans", "khansi", "gale", "kharaash", "khokh", "apna", 
    "apni", "tumhara", "tumhari", "aap", "tum", "tu", "kar", "raha", "rahi", 
    "rahe", "gaya", "gayi", "gaye", "tha", "thi", "bol", "bolo", 
    "kuch", "kuchh", "yeh", "woh", "voh", "ki", "ka", "ke", "namaste", 
    "pranam", "shukriya", "darr"
  ];

  // Tokenize the input string into lowercase words
  const words = query.split(/[^a-zA-Z]/).filter(Boolean);
  
  // Count how many Hinglish keywords are present
  let hinglishCount = 0;
  for (const word of words) {
    if (hinglishKeywords.includes(word)) {
      hinglishCount++;
    }
  }

  if (hinglishCount >= 1) {
    return "hinglish";
  }
  return "english";
}

export function getMockResponse(
  doctorText: string, 
  gender: string, 
  name: string,
  complaint: string,
  history: string
): string {
  const query = doctorText.toLowerCase();
  const isMale = gender.toLowerCase() === "male";
  const firstName = name.split(" ")[0];

  const detectedLang = detectLanguage(doctorText);
  const isHindiScript = detectedLang === "hindi-devanagari";
  const isHinglish = detectedLang === "hinglish";

  // 1. GREETINGS
  if (
    query.includes("hello") || query.includes("hi ") || query.includes("morning") || query.includes("afternoon") ||
    query.includes("namaste") || query.includes("pranam") || query.includes("kese") || query.includes("kaise") ||
    query.includes("नमस्ते") || query.includes("प्रणाम") || query.includes("कैसे") || query.includes("कैसा")
  ) {
    if (isHindiScript) {
      return `नमस्ते डॉक्टर। शुक्रिया। मेरा नाम ${firstName} है। मैं आज थोड़ा नर्वस हूँ।`;
    }
    if (isHinglish) {
      return `Namaste doctor. Thank you. Mera naam ${firstName} hai. Main thoda nervous hoon aaj.`;
    }
    return `Hello doctor. Thank you. My name is ${firstName}. I am rather nervous today.`;
  }

  // 2. CHIEF COMPLAINT (What happened?)
  if (
    query.includes("bring you") || query.includes("wrong") || query.includes("happen") || query.includes("symptom") || query.includes("problem") ||
    query.includes("kya hua") || query.includes("taklif") || query.includes("shikayat") || query.includes("dikkat") || query.includes("pareshani") || query.includes("bimari") ||
    query.includes("क्या हुआ") || query.includes("तकलीफ") || query.includes("शिकायत") || query.includes("दिक्कत") || query.includes("परेशानी") || query.includes("बीमारी")
  ) {
    if (isHindiScript) {
      return `डॉक्टर, मुझे यह परेशानी है: "${complaint}"। यह देख कर मैं बहुत घबरा ${isMale ? "गया" : "गई"} हूँ।`;
    }
    if (isHinglish) {
      return `Doctor, mujhe yeh pareshani hai: "${complaint}". Yeh dekh kar main bohot ghabra ${isMale ? "gaya" : "gayi"} hoon.`;
    }
    return `Doctor, I came in because of this: "${complaint}". I'm really worried about it.`;
  }

  // 3. HISTORY & MEDICATIONS
  if (
    query.includes("medication") || query.includes("medicine") || query.includes("history") || query.includes("past") ||
    query.includes("dawa") || query.includes("dawai") || query.includes("itihas") || query.includes("pehle") ||
    query.includes("दवा") || query.includes("दवाई") || query.includes("इतिहास") || query.includes("पहले")
  ) {
    if (isHindiScript) {
      return `डॉक्टर, मेरे केस की डिटेल्स और हिस्ट्री यह है: ${history}`;
    }
    if (isHinglish) {
      return `Doctor, mere case ki details aur history yeh hai: ${history}`;
    }
    return `Here are my medical history details, doctor: ${history}`;
  }

  // 4. PAIN / DISCOMFORT
  if (
    query.includes("pain") || query.includes("hurt") || query.includes("ache") || query.includes("burn") || query.includes("sting") ||
    query.includes("dard") || query.includes("jalan") || query.includes("taklif") ||
    query.includes("दर्द") || query.includes("जलन") || query.includes("तकलीफ")
  ) {
    const hasPain = complaint.toLowerCase().includes("pain") || complaint.toLowerCase().includes("dard") || history.toLowerCase().includes("pain") || history.toLowerCase().includes("dard") || complaint.toLowerCase().includes("दर्द") || history.toLowerCase().includes("दर्द");
    if (hasPain) {
      if (isHindiScript) {
        return `हाँ डॉक्टर, मुझे दर्द हो रहा है। यह बहुत तकलीफ दे रहा है।`;
      }
      if (isHinglish) {
        return `Haan doctor, mujhe dard ho raha hai. Yeh bohot taklif de raha hai.`;
      }
      return `Yes doctor, I am experiencing pain. It is quite uncomfortable.`;
    } else {
      if (isHindiScript) {
        return `नहीं डॉक्टर, मुझे वहां कोई दर्द या जलन नहीं हो रही है। दर्दरहित है।`;
      }
      if (isHinglish) {
        return `Nahi doctor, mujhe waha koi dard ya jalan nahi ho rahi hai. Painless hai.`;
      }
      return `No doctor, I am not experiencing any pain or burning sensations there. It is painless.`;
    }
  }

  // 5. FEVER / INFECTION
  if (
    query.includes("fever") || query.includes("temp") || query.includes("hot") ||
    query.includes("bukhar") || query.includes("garam") ||
    query.includes("बुखार") || query.includes("गर्म")
  ) {
    const hasFever = history.toLowerCase().includes("fever") || history.toLowerCase().includes("bukhar") || complaint.toLowerCase().includes("fever") || history.toLowerCase().includes("बुखार") || complaint.toLowerCase().includes("बुखार");
    if (hasFever) {
      if (isHindiScript) {
        return "हाँ डॉक्टर, मुझे बुखार लग रहा है और शरीर गर्म है।";
      }
      if (isHinglish) {
        return "Haan doctor, mujhe bukhar lag raha hai aur sharir garam hai.";
      }
      return "Yes doctor, I have been running a fever and feeling hot.";
    } else {
      if (isHindiScript) {
        return "नहीं डॉक्टर, बुखार तो नहीं लग रहा है।";
      }
      if (isHinglish) {
        return "Nahi doctor, bukhar to nahi lag raha hai.";
      }
      return "No doctor, I don't feel like I have a fever.";
    }
  }

  // 6. SMOKING / TOBACCO
  if (
    query.includes("smoke") || query.includes("tobacco") || query.includes("cigarette") || query.includes("bidi") || query.includes("tambaku") ||
    query.includes("धूम्रपान") || query.includes("तम्बाकू") || query.includes("सिगरेट") || query.includes("बीड़ी")
  ) {
    const hasSmoking = history.toLowerCase().includes("smoke") || history.toLowerCase().includes("cigarette") || history.toLowerCase().includes("bidi") || history.toLowerCase().includes("धूम्रपान") || history.toLowerCase().includes("सिगरेट");
    if (hasSmoking) {
      if (isHindiScript) {
        return `हाँ डॉक्टर, मैं पिछले चालीस साल से सिगरेट/बीड़ी ${isMale ? "पीता" : "पीती"} हूँ।`;
      }
      if (isHinglish) {
        return `Haan doctor, main pichle chalis saal se cigarette/bidi ${isMale ? "peeta" : "peeti"} hoon.`;
      }
      return `Yes doctor, I have smoked a pack of cigarettes daily for the past forty years.`;
    } else {
      if (isHindiScript) {
        return `नहीं डॉक्टर, मैं स्मोक या तम्बाकू का सेवन नहीं ${isMale ? "करता" : "करती"} हूँ।`;
      }
      if (isHinglish) {
        return `Nahi doctor, main smoke ya tambaku ka sevan nahi ${isMale ? "karta" : "karti"} hoon.`;
      }
      return `No doctor, I do not smoke or use tobacco products.`;
    }
  }

  // GENERAL FALLBACK PRESERVING CHARACTER
  if (isHindiScript) {
    return `मुझे इस बारे में ज़्यादा नहीं पता डॉक्टर। बस इस दिक्कत से डर लग रहा है।`;
  }
  if (isHinglish) {
    return `Mujhe is baare mein zyada nahi pata doctor. Bas is dikkat se darr lag raha hai.`;
  }
  return `I'm not quite sure about that, doctor. I'm just very anxious about my current symptoms.`;
}
