import fs from "fs";
import path from "path";

const logPath = path.join(process.cwd(), "chat_debug.log");

export function logRequest(
  patientName: string,
  patientGender: string,
  patientAge: number,
  patientRegion: string,
  patientComplaint: string,
  patientHistory: string,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
) {
  try {
    const logData = `\n[${new Date().toISOString()}] REQUEST\nPatient: ${patientName} (${patientGender}, ${patientAge}, ${patientRegion})\nComplaint: ${patientComplaint}\nHistory: ${patientHistory}\nConversation History: ${JSON.stringify(contents.map(c => c.role + ": " + c.parts[0].text))}\n`;
    fs.appendFileSync(logPath, logData);
  } catch (logErr) {
    console.error("Logging failed:", logErr);
  }
}

export function logResponse(successModelName: string, responseText: string) {
  try {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] RESPONSE (Model: ${successModelName})\nText: "${responseText}"\n`);
  } catch {
    // ignore
  }
}
