/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Settings, RefreshCw, Clock, Stethoscope, ChevronRight, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import PatientFile from "@/frontend/components/PatientFile";
import ChatInterface from "@/frontend/components/ChatInterface";
import FeedbackDashboard from "@/frontend/components/FeedbackDashboard";
import { Message, WebVoice } from "@/frontend/types";
import { PATIENTS } from "@/db/patients";

export default function Home() {
  const [viewMode, setViewMode] = useState<"simulation" | "feedback">("simulation");
  const [mobileTab, setMobileTab] = useState<"file" | "chat">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isMockMode, setIsMockMode] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Dynamic Case Management
  const [activePatientIndex, setActivePatientIndex] = useState<number>(0);
  const [speechLang, setSpeechLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const [leftPanelMode, setLeftPanelMode] = useState<"chart" | "list">("chart");

  // Browser voice options lists
  const [availableVoices, setAvailableVoices] = useState<WebVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  // Load configuration from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("gemini_api_key");
      const storedMockMode = localStorage.getItem("mock_mode_active");
      const storedVoice = localStorage.getItem("voice_enabled");
      const storedPatientIndex = localStorage.getItem("active_patient_index");

      // Defer state updates to avoid synchronous setState warnings in effects
      Promise.resolve().then(() => {
        if (storedKey) setApiKey(storedKey);
        if (storedMockMode !== null) setIsMockMode(storedMockMode === "true");
        if (storedVoice !== null) setVoiceEnabled(storedVoice === "true");
        if (storedPatientIndex !== null) {
          const idx = parseInt(storedPatientIndex);
          if (idx >= 0 && idx < PATIENTS.length) {
            setActivePatientIndex(idx);
          }
        }
      });
    }
  }, []);

  // Set up and load browser voices dynamically (onvoiceschanged handles async load in Chrome/Edge)
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Map to serializable format
        const mappedVoices = voices.map((v) => ({
          name: v.name,
          lang: v.lang,
        }));
        setAvailableVoices(mappedVoices);

        // Load stored voice choice or seek default en-IN voice
        const storedVoice = localStorage.getItem("selected_voice_name");
        if (storedVoice && voices.some((v) => v.name === storedVoice)) {
          setSelectedVoiceName(storedVoice);
        } else {
          const defaultIndianVoice = voices.find(
            (v) =>
              v.lang === "en-IN" ||
              v.lang.startsWith("en-IN") ||
              v.name.toLowerCase().includes("india") ||
              v.name.toLowerCase().includes("indian")
          );
          if (defaultIndianVoice) {
            setSelectedVoiceName(defaultIndianVoice.name);
          }
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && viewMode === "simulation") {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, viewMode]);

  // Handle configuration updates
  const handleSaveSettings = (newKey: string, useMock: boolean) => {
    setApiKey(newKey);
    setIsMockMode(useMock);
    localStorage.setItem("gemini_api_key", newKey);
    localStorage.setItem("mock_mode_active", String(useMock));
    setShowSettings(false);
    setApiError(null);
  };

  const handlePatientChange = (idx: number) => {
    setActivePatientIndex(idx);
    localStorage.setItem("active_patient_index", String(idx));
    
    // Changing the patient resets/clears current chat logs to start a fresh simulation
    setMessages([]);
    setElapsedTime(0);
    setTimerActive(true);
    setViewMode("simulation");
    setApiError(null);
  };

  const handleVoiceToggle = (enabled: boolean) => {
    setVoiceEnabled(enabled);
    localStorage.setItem("voice_enabled", String(enabled));
  };

  // Format elapsed time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Send message to Gemini API or mock handler
  const handleSendMessage = async (text: string) => {
    // 1. Add doctor message
    const docMessage: Message = {
      id: `doc_${Date.now()}`,
      sender: "doctor",
      text,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, docMessage];
    setMessages(updatedMessages);
    setIsTyping(true);
    setApiError(null);

    const currentPatient = PATIENTS[activePatientIndex];

    try {
      // 2. Fetch from backend route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "MOCK_MODE_KEY",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          patientName: currentPatient.name,
          patientAge: currentPatient.age,
          patientGender: currentPatient.gender,
          patientComplaint: currentPatient.complaint,
          patientHistory: currentPatient.history,
          patientRegion: currentPatient.region,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to communicate with patient ${currentPatient.name}`);
      }

      // 3. Add patient message
      const patientMessage: Message = {
        id: `pat_${Date.now()}`,
        sender: "patient",
        text: data.text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, patientMessage]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || `An unexpected error occurred while communicating with ${currentPatient.name}.`);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setElapsedTime(0);
    setTimerActive(true);
    setViewMode("simulation");
    setMobileTab("chat");
    setApiError(null);
  };

  const handleCompleteSimulation = () => {
    setTimerActive(false);
    setViewMode("feedback");
  };

  const activeProfile = PATIENTS[activePatientIndex];

  return (
    <div className="h-dvh overflow-hidden bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Clinical Dashboard Navigation */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-teal-600 rounded-xl text-white shadow-md shadow-teal-500/25">
              <Stethoscope className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Clinical Simulation Suite
              </h1>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                  Active Case: {activeProfile.name} ({activeProfile.region})
                </span>
              </div>
            </div>
          </div>

          {/* Active stats & Controls */}
          <div className="flex items-center space-x-3">
            {/* Session Timer */}
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Session: {formatTime(elapsedTime)}</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleRestart}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
              title="Reset Case Simulation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl transition-all relative"
              title="Simulator Configuration"
            >
              <Settings className="w-4 h-4" />
              {(isMockMode || activePatientIndex !== 0) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className={`flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col min-h-0 ${viewMode === "simulation" ? "overflow-hidden" : "overflow-y-auto"}`}>
        {apiError && (
          <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 text-sm rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Simulation Error</span>
              <p className="mt-0.5">{apiError}</p>
              {isMockMode === false && !apiKey && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="mt-2 text-xs font-semibold text-rose-750 underline"
                >
                  Configure API Key or Enable Mock Mode
                </button>
              )}
            </div>
          </div>
        )}

        {viewMode === "simulation" ? (
          <>
            {/* Mobile View Toggle Tabs */}
            <div className="flex md:hidden bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 mb-4">
              <button
                onClick={() => setMobileTab("file")}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${
                  mobileTab === "file"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Patient Chart
              </button>
              <button
                onClick={() => setMobileTab("chat")}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${
                  mobileTab === "chat"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Consultation Dialogue
              </button>
            </div>

            {/* Split Screen Workspace Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
              {/* Left Column: Patient File Card or Dynamic Cases Database */}
              <div
                className={`${
                  mobileTab === "file" ? "flex" : "hidden"
                } md:flex flex-col md:col-span-1 h-full min-h-0 space-y-3`}
              >
                {/* Visual Panels Switcher */}
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold shadow-sm">
                  <button
                    onClick={() => setLeftPanelMode("chart")}
                    className={`flex-1 py-2 text-center rounded-lg transition-all ${
                      leftPanelMode === "chart"
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    Active Chart
                  </button>
                  <button
                    onClick={() => setLeftPanelMode("list")}
                    className={`flex-1 py-2 text-center rounded-lg transition-all ${
                      leftPanelMode === "list"
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    Cases Directory ({PATIENTS.length})
                  </button>
                </div>

                {/* Left Panel Workspace */}
                <div className="flex-1 min-h-0">
                  {leftPanelMode === "chart" ? (
                    <PatientFile
                      name={activeProfile.name}
                      age={activeProfile.age}
                      gender={activeProfile.gender}
                      complaint={activeProfile.complaint}
                      history={activeProfile.history}
                      medications={activeProfile.medications}
                      allergies={activeProfile.allergies}
                      region={activeProfile.region}
                      stgGuideline={(activeProfile as any).stgGuideline}
                      differentials={(activeProfile as any).differentials}
                    />
                  ) : (
                    /* Visual Grid of Multiple Patient Cards */
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col h-full overflow-hidden">
                      <div className="mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          Case Records Database
                        </h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          Select from the dynamic files to change the simulation patient.
                        </p>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 scrollbar-thin">
                        {PATIENTS.map((p, idx) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              handlePatientChange(idx);
                              setLeftPanelMode("chart");
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              activePatientIndex === idx
                                ? "bg-teal-50/50 dark:bg-teal-950/20 border-teal-500 shadow-sm shadow-teal-500/5 ring-1 ring-teal-500/30"
                                : "bg-slate-50 hover:bg-slate-100/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-800/75"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                                {p.name}
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/20">
                                {p.region}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 space-y-1">
                              <div className="flex justify-between items-center">
                                <span>{p.gender === "Male" ? "Male (Purush / पुरुष)" : "Female (Mahila / महिला)"} • Age {p.age}</span>
                                <span className="font-bold text-[9px] text-teal-600 dark:text-teal-400">
                                  {p.medications ? p.medications.split(" (")[0] : "None"}
                                </span>
                              </div>
                              <div className="text-[9px] text-slate-400 dark:text-slate-500 italic font-medium">
                                Symptom: {p.complaint.split(" (")[0]}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Active Simulation Chat */}
              <div
                className={`${
                  mobileTab === "chat" ? "flex" : "hidden"
                } md:flex flex-col md:col-span-2 h-full min-h-0`}
              >
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  onCompleteSimulation={handleCompleteSimulation}
                  voiceEnabled={voiceEnabled}
                  setVoiceEnabled={handleVoiceToggle}
                  patientName={activeProfile.name}
                  patientGender={activeProfile.gender}
                  speechLang={speechLang}
                  setSpeechLang={setSpeechLang}
                  selectedVoiceName={selectedVoiceName}
                />
              </div>
            </div>
          </>
        ) : (
          <FeedbackDashboard 
            messages={messages} 
            onRestart={handleRestart} 
            patientName={activeProfile.name}
            patientComplaint={activeProfile.complaint}
          />
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Simulator Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure patient intelligence settings and voice capabilities.
              </p>
            </div>

            <div className="space-y-4">
              {/* Patient Case Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Select Patient Case Profile
                </label>
                <select
                  value={activePatientIndex}
                  onChange={(e) => {
                    const idx = parseInt(e.target.value);
                    handlePatientChange(idx);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold"
                >
                  {PATIENTS.map((p, idx) => (
                    <option key={p.id} value={idx}>
                      {p.name} ({p.gender === "Male" ? "M" : "F"}, Age {p.age}) • {p.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Voice Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Select Voice Accent (Browser TTS)
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => {
                    setSelectedVoiceName(e.target.value);
                    localStorage.setItem("selected_voice_name", e.target.value);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold"
                >
                  <option value="">Auto Accent Selector</option>
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                  Note: Select a voice containing &quot;India&quot; or &quot;en-IN&quot; / &quot;hi-IN&quot; for the Indian accent. If none are listed, you may need to add English (India) speech to your OS system settings.
                </span>
              </div>

              {/* API Mode Toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Simulation Brain Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsMockMode(true)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                      isMockMode
                        ? "bg-teal-50 dark:bg-teal-950/20 border-teal-500 text-teal-700 dark:text-teal-400"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    Local Mock Simulator
                    <span className="block text-[9px] font-normal text-slate-400 dark:text-slate-500 mt-0.5 font-sans">
                      No API Key required
                    </span>
                  </button>

                  <button
                    onClick={() => setIsMockMode(false)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                      !isMockMode
                        ? "bg-teal-50 dark:bg-teal-950/20 border-teal-500 text-teal-700 dark:text-teal-400"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    Gemini Live Patient
                    <span className="block text-[9px] font-normal text-slate-400 dark:text-slate-500 mt-0.5 font-sans">
                      Uses Google AI Studio
                    </span>
                  </button>
                </div>
              </div>

              {/* Gemini API Key input */}
              {!isMockMode && (
                <div className="space-y-1.5 animate-slide-down">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Google AI Studio API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                    Don&apos;t have a key? Get one for free at{" "}
                    <a
                      href="https://aistudio.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline inline-flex items-center"
                    >
                      Google AI Studio <ChevronRight className="w-2.5 h-2.5" />
                    </a>
                  </span>
                </div>
              )}

              {/* Voice toggle in settings */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Text-to-Speech Narration
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                    Speak {activeProfile.name.split(" ")[0]}&apos;s responses.
                  </span>
                </div>
                <button
                  onClick={() => handleVoiceToggle(!voiceEnabled)}
                  className="text-slate-500 dark:text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {voiceEnabled ? (
                    <ToggleRight className="w-10 h-10 text-teal-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSettings(apiKey, isMockMode)}
                className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-teal-500/10"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
