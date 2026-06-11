/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { processChatRequest } from "@/backend/chatService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      messages, 
      patientName = "Jane Cohen", 
      patientAge = 65, 
      patientGender = "Female",
      patientComplaint = "Visible Hematuria",
      patientHistory = "Noticed bright red urine this morning.",
      patientRegion = "North America"
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing or invalid messages array" }, { status: 400 });
    }

    const apiKey = req.headers.get("x-api-key") || process.env.GEMINI_API_KEY || undefined;

    const result = await processChatRequest({
      messages,
      patientName,
      patientAge,
      patientGender,
      patientComplaint,
      patientHistory,
      patientRegion,
      apiKey,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    
    // Attempt to list available models to help the user diagnose which models their API key has access to
    let availableModelsStr = "";
    try {
      const apiKey = req.headers.get("x-api-key") || process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== "MOCK_MODE_KEY") {
        const modelsRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          const names = modelsData.models?.map((m: any) => m.name.replace("models/", "")) || [];
          if (names.length > 0) {
            availableModelsStr = " | Available models for your API key: " + names.join(", ");
          }
        }
      }
    } catch (listErr: any) {
      console.warn("Failed to list models for diagnostic:", listErr.message);
    }

    return NextResponse.json(
      { error: (error.message || "Internal Server Error during chat generation") + availableModelsStr },
      { status: 500 }
    );
  }
}

