import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { getMockResponse } from "./mockService";
import { logRequest, logResponse } from "./logger";

export interface ChatMessage {
  sender: "doctor" | "patient";
  text: string;
}

export interface ChatRequestParams {
  messages: ChatMessage[];
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientComplaint: string;
  patientHistory: string;
  patientRegion: string;
  apiKey?: string | null;
}

export interface ChatResponseResult {
  text: string;
  isMock: boolean;
  modelUsed?: string;
  error?: string;
}

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

export async function processChatRequest(params: ChatRequestParams): Promise<ChatResponseResult> {
  const {
    messages,
    patientName,
    patientAge,
    patientGender,
    patientComplaint,
    patientHistory,
    patientRegion,
    apiKey
  } = params;

  const doctorMessage = messages[messages.length - 1].text;
  const detectedLang = detectLanguage(doctorMessage);
  let languageDirective = "";

  if (detectedLang === "hindi-devanagari") {
    languageDirective = `\n\nCRITICAL LANGUAGE CONSTRAINT: The doctor spoke to you in Hindi (Devanagari script). You MUST respond in Hindi using the Devanagari script (e.g. नमस्ते, मुझे दर्द है). Do NOT respond in English or Hinglish.`;
  } else if (detectedLang === "hinglish") {
    languageDirective = `\n\nCRITICAL LANGUAGE CONSTRAINT: The doctor spoke to you in Hinglish (Hindi written in Roman/Latin script). You MUST respond in Hinglish/Roman script Hindi (e.g. Namaste, mujhe dard hai). Do NOT respond in English or Devanagari script.`;
  } else {
    languageDirective = `\n\nCRITICAL LANGUAGE CONSTRAINT: The doctor spoke to you in English. You MUST respond in English. Do NOT respond in Hindi or Hinglish.`;
  }

  // Construct bilingual clinical system prompt dynamically based on patient choice
  const isMale = patientGender.toLowerCase() === "male";
  const SYSTEM_INSTRUCTION = `You are ${patientName}, a ${patientAge}-year-old ${isMale ? "man" : "woman"} from ${patientRegion} presenting with: "${patientComplaint}". Clinical history details: "${patientHistory}". You are nervous but polite and cooperative.

Roleplay Rules:
1. Act as the patient. Do not break character or mention that you are an AI.
2. Keep your answers concise (1-3 sentences max). You MUST always finish your sentences and thoughts completely. Never stop generating mid-sentence.
3. Language Guideline:
   - Match the doctor's language and script exactly. Do not mix them.
   - If the doctor speaks to you in English, respond in English.
   - If the doctor speaks to you in Hindi script, respond in Hindi script (Devanagari).
   - If the doctor speaks to you in Hinglish/Latin-script Hindi, respond in Hinglish/Latin-script Hindi.
4. Filter Avoidance (Crucial): To avoid triggering AI content filters, do not generate detailed clinical analysis, drug names, or diagnostic terms yourself. Instead, express your concerns as a patient: focus on how you feel (anxious, scared, in pain, weak) and ask the doctor for reassurance (e.g. "Is it serious?", "Will I get better?", "Thank you, doctor").${languageDirective}`;

  const activeApiKey = apiKey || process.env.GEMINI_API_KEY;

  if (!activeApiKey || activeApiKey === "MOCK_MODE_KEY") {
    // Mock mode fallback response tailored for name/gender/language/complaint/history
    const mockReply = getMockResponse(doctorMessage, patientGender, patientName, patientComplaint, patientHistory);
    
    // Simulate typical network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      text: mockReply,
      isMock: true,
    };
  }

  // Call actual Gemini API
  const genAI = new GoogleGenerativeAI(activeApiKey);
  
  // Map conversation array to Gemini contents format
  // Doctor is 'user', Patient is 'model'
  const contents = messages.map((m) => ({
    role: m.sender === "doctor" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  // Log request payload
  logRequest(
    patientName,
    patientGender,
    patientAge,
    patientRegion,
    patientComplaint,
    patientHistory,
    contents
  );

  let result;
  let successModelName = "gemini-2.5-flash";

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      safetySettings,
    });
    result = await model.generateContent({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.2,
      },
    });
    successModelName = "gemini-2.5-flash";
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.warn("gemini-2.5-flash failed, attempting fallback to gemini-2.0-flash:", errMsg);
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: SYSTEM_INSTRUCTION,
        safetySettings,
      });
      result = await model.generateContent({
        contents: contents,
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.2,
        },
      });
      successModelName = "gemini-2.0-flash";
    } catch (e2: unknown) {
      const errMsg2 = e2 instanceof Error ? e2.message : String(e2);
      console.warn("gemini-2.0-flash failed, attempting fallback to gemini-flash-latest:", errMsg2);
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-flash-latest",
          systemInstruction: SYSTEM_INSTRUCTION,
          safetySettings,
        });
        result = await model.generateContent({
          contents: contents,
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.2,
          },
        });
        successModelName = "gemini-flash-latest";
      } catch (e3: unknown) {
        const errMsg3 = e3 instanceof Error ? e3.message : String(e3);
        console.warn("gemini-flash-latest failed, attempting fallback to gemini-pro-latest:", errMsg3);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-latest",
          systemInstruction: SYSTEM_INSTRUCTION,
          safetySettings,
        });
        result = await model.generateContent({
          contents: contents,
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.2,
          },
        });
        successModelName = "gemini-pro-latest";
      }
    }
  }

  const responseText = result.response.text();

  // Log response
  logResponse(successModelName, responseText);

  return {
    text: responseText.trim(),
    isMock: false,
    modelUsed: successModelName,
  };
}
