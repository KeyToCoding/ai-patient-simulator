/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Mic, Volume2, VolumeX, AlertCircle, PlayCircle, Loader2 } from "lucide-react";
import { Message } from "@/frontend/types";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  onCompleteSimulation: () => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  patientName: string;
  patientGender: string;
  speechLang: "en-IN" | "hi-IN";
  setSpeechLang: (lang: "en-IN" | "hi-IN") => void;
  selectedVoiceName: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isTyping,
  onCompleteSimulation,
  voiceEnabled,
  setVoiceEnabled,
  patientName,
  patientGender,
  speechLang,
  setSpeechLang,
  selectedVoiceName,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Set up SpeechRecognition Web API - runs/recreates when speechLang changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = speechLang; // Dynamically set English (India) or Hindi (India)

          rec.onstart = () => {
            setIsRecording(true);
            setRecordingError(null);
          };

          rec.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              setInputText((prev) => (prev ? prev + " " + transcript : transcript));
            }
          };

          rec.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === "not-allowed") {
              setRecordingError("Microphone permission denied.");
            } else {
              setRecordingError(`Error: ${event.error}`);
            }
            setIsRecording(false);
          };

          rec.onend = () => {
            setIsRecording(false);
          };

          recognitionRef.current = rec;
        }
      } catch (err: any) {
        console.error("Failed to initialize Speech Recognition:", err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [speechLang]);

  const handleStartRecording = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!recognitionRef.current) {
      setRecordingError("Speech recognition is not supported or blocked in this context.");
      return;
    }
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopRecording = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const speakText = useCallback((text: string) => {
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Detect if text contains Hindi characters (Devanagari)
        const isHindiText = /[\u0900-\u097F]/.test(text);
        utterance.lang = isHindiText ? "hi-IN" : "en-IN";

        const isMale = patientGender.toLowerCase() === "male";
        const voices = window.speechSynthesis.getVoices();

        let chosenVoice = null;

        // 1. Try to find the user's explicitly selected voice first
        if (selectedVoiceName) {
          chosenVoice = voices.find((v) => v.name === selectedVoiceName);
        }

        // 2. If no voice selected, try matching dynamic accents (en-IN / hi-IN) + Gender
        if (!chosenVoice) {
          chosenVoice = voices.find((voice) => {
            const name = voice.name.toLowerCase();
            const lang = voice.lang.toLowerCase();
            
            const langMatch = isHindiText 
              ? (lang.startsWith("hi") || name.includes("hindi"))
              : (lang.startsWith("en-in") || name.includes("india"));
              
            if (!langMatch) return false;

            if (isMale) {
              return name.includes("male") || name.includes("ravi") || name.includes("hemant") || name.includes("rishi") || name.includes("david") || name.includes("george");
            } else {
              return name.includes("female") || name.includes("heera") || name.includes("kalpana") || name.includes("zira") || name.includes("samantha") || name.includes("isha") || name.includes("lekha");
            }
          });
        }

        // 3. Fallback to language matching only
        if (!chosenVoice) {
          chosenVoice = voices.find((voice) => {
            const name = voice.name.toLowerCase();
            const lang = voice.lang.toLowerCase();
            return isHindiText 
              ? (lang.startsWith("hi") || name.includes("hindi"))
              : (lang.startsWith("en-in") || name.includes("india"));
          });
        }

        // 4. Generic gender matching
        if (!chosenVoice) {
          chosenVoice = voices.find((voice) => {
            const name = voice.name.toLowerCase();
            if (isMale) {
              return name.includes("male") || name.includes("david") || name.includes("google uk english male");
            } else {
              return name.includes("female") || name.includes("zira") || name.includes("samantha") || name.includes("google us english");
            }
          });
        }

        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }

        utterance.pitch = isMale ? 0.82 : 1.0; // Deeper pitch for male patients
        utterance.rate = 0.92; // Slightly slower speed for older patients
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("Speech synthesis failed:", err);
    }
  }, [patientGender, selectedVoiceName]);

  // Speaks out the last message if it's from the patient and voice is enabled
  useEffect(() => {
    if (messages.length > 0 && voiceEnabled) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "patient") {
        speakText(lastMessage.text);
      }
    }
  }, [messages, voiceEnabled, speakText]);

  const firstName = patientName.split(" ")[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
            Consultation Channel
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Speak or type questions. {firstName} responds in English or Hindi/Hinglish.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Voice toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              voiceEnabled
                ? "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/50 text-teal-600 dark:text-teal-400"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
            }`}
            title={voiceEnabled ? "Voice output enabled" : "Voice output disabled"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* End Simulation Button */}
          <button
            onClick={onCompleteSimulation}
            className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs px-3.5 py-2 rounded-xl font-semibold transition-colors flex items-center space-x-1"
          >
            <span>Complete Consultation</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <div className="max-w-sm">
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                No conversation started
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Begin the consultation in English or Hindi (e.g. &quot;Apne symptoms ke baare me batayein&quot;).
              </p>
            </div>
            <button
              onClick={() => onSendMessage(`Hello Mr${patientGender === "Male" ? "" : "s"}. ${firstName}, I'm your doctor today. What brings you in?`)}
              className="mt-2 text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              Send Standard Greeting
            </button>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm relative group ${
                  msg.sender === "doctor"
                    ? "bg-teal-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/50 rounded-tl-none"
                }`}
              >
                {/* Voice play button for patient messages */}
                {msg.sender === "patient" && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-opacity"
                    title="Speak text"
                  >
                    <PlayCircle className="w-5 h-5" />
                  </button>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right ${
                    msg.sender === "doctor"
                      ? "text-teal-100/75"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {msg.sender === "doctor" ? "Dr. Card" : "Patient"} •{" "}
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/50 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{firstName} is thinking</span>
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Recording Error Alert */}
      {recordingError && (
        <div className="px-6 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs border-t border-red-100 dark:border-red-900/30 flex items-center">
          <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
          <span>{recordingError}</span>
          <button
            onClick={() => setRecordingError(null)}
            className="ml-auto hover:underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Input Area */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          {/* Hold to Speak Button */}
          <button
            onMouseDown={handleStartRecording}
            onMouseUp={handleStopRecording}
            onMouseLeave={handleStopRecording}
            onTouchStart={handleStartRecording}
            onTouchEnd={handleStopRecording}
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-center ${
              isRecording
                ? "bg-rose-500 border-rose-500 text-white animate-pulse scale-105 shadow-md shadow-rose-200 dark:shadow-rose-950/30"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-800"
            }`}
            title={`Hold to Speak (Accent: ${speechLang === "hi-IN" ? "Hindi" : "English India"})`}
          >
            {isRecording ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Accent Toggle Pill */}
          <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 text-xs">
            <button
              type="button"
              onClick={() => setSpeechLang("en-IN")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                speechLang === "en-IN"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
              title="Set mic accent to English (India)"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setSpeechLang("hi-IN")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                speechLang === "hi-IN"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-450 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
              title="Set mic accent to Hindi (India)"
            >
              HI
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder={
              isRecording
                ? `Listening in ${speechLang === "hi-IN" ? "Hindi" : "English India"}...`
                : `Ask ${firstName} a question (Hindi/English)...`
            }
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isTyping || !inputText.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:text-slate-300 disabled:dark:text-slate-600 text-white font-medium p-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-2 text-center flex justify-between items-center px-1">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Tip: Press HI to speak in Hindi/Hinglish. Microphone requires a secure domain (e.g. localhost).
          </span>
          <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
            Active patient: {firstName} ({patientGender})
          </span>
        </div>
      </div>
    </div>
  );
}
