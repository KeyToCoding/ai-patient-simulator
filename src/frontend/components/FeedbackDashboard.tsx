"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Award, Database, RefreshCw, FileText, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { Message } from "@/frontend/types";

interface FeedbackDashboardProps {
  messages: Message[];
  onRestart: () => void;
  patientName: string;
  patientComplaint: string;
}

export default function FeedbackDashboard({ 
  messages, 
  onRestart,
  patientName,
  patientComplaint
}: FeedbackDashboardProps) {
  const [dbSaving, setDbSaving] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);
  const [clinicalScore, setClinicalScore] = useState(0);
  const [empathyScore, setEmpathyScore] = useState(0);

  // Basic analysis of messages to compute dynamic score
  const doctorMsgs = messages.filter((m) => m.sender === "doctor").map((m) => m.text.toLowerCase());
  
  // Clinical accuracy criteria checklist
  const criteria = {
    pain: doctorMsgs.some((t) => t.includes("pain") || t.includes("hurt") || t.includes("ache")),
    fever: doctorMsgs.some((t) => t.includes("fever") || t.includes("temp") || t.includes("hot")),
    history: doctorMsgs.some((t) => t.includes("history") || t.includes("medication") || t.includes("past")),
    weight: doctorMsgs.some((t) => t.includes("weight") || t.includes("loss") || t.includes("diet")),
    smoke: doctorMsgs.some((t) => t.includes("smoke") || t.includes("tobacco") || t.includes("cigarette")),
    onset: doctorMsgs.some((t) => t.includes("when") || t.includes("start") || t.includes("morning") || t.includes("first")),
  };

  // Empathy check
  const empathyWords = ["sorry", "understand", "anxious", "nervous", "worry", "fear", "comfortable", "help", "care", "okay"];
  const empathyCount = doctorMsgs.reduce((acc, text) => {
    return acc + empathyWords.filter((word) => text.includes(word)).length;
  }, 0);

  // Calculate score
  const matchedCriteriaCount = Object.values(criteria).filter(Boolean).length;
  const baseClinical = 50 + Math.round((matchedCriteriaCount / 6) * 45); // Max 95%
  const finalClinical = messages.length > 2 ? baseClinical : 35; // penalty for too short
  
  const baseEmpathy = 60 + Math.round(Math.min(empathyCount, 5) * 7); // Max 95%
  const finalEmpathy = messages.length > 2 ? baseEmpathy : 40;

  const metCriteria = {
    onset: criteria.onset,
    pain: criteria.pain,
    history: criteria.history,
    smoke: criteria.smoke
  };

  // Formulate qualitative feedback list
  const feedbackPointsList: string[] = [];
  const improvementsList: string[] = [];
  
  const complaintLower = patientComplaint.toLowerCase();
  const hasPainOrColic = complaintLower.includes("pain") || complaintLower.includes("swelling") || complaintLower.includes("stiffness") || complaintLower.includes("ache") || complaintLower.includes("dard") || complaintLower.includes("sujan");

  if (criteria.pain) {
    feedbackPointsList.push(
      hasPainOrColic 
        ? "Inquired about the presence or characteristics of pain/discomfort, vital for acute presentations."
        : "Inquired about pain or discomfort to rule out painful etiologies of the chief complaint."
    );
  } else {
    improvementsList.push(
      hasPainOrColic
        ? "Missed exploring the characteristics, severity, or radiation of the patient's pain."
        : "Consider asking about accompanying pain or discomfort to narrow down the differential diagnoses."
    );
  }

  if (criteria.onset) {
    feedbackPointsList.push("Established the chronological onset and duration of the chief complaint.");
  } else {
    improvementsList.push("Should clarify the exact timeline and progression of when the symptoms first started.");
  }

  if (criteria.history) {
    feedbackPointsList.push("Reviewed the patient's past medical history, comorbidities, and active medications.");
  } else {
    improvementsList.push("Did not thoroughly review the patient's background medical history or current medications.");
  }

  if (criteria.smoke) {
    feedbackPointsList.push("Screened for lifestyle factors (smoking/alcohol) or general environmental exposures.");
  } else {
    improvementsList.push("Consider screening for lifestyle risk factors (smoking/alcohol habits) which are crucial for this etiology.");
  }

  if (empathyCount >= 2) {
    feedbackPointsList.push("Demonstrated strong bedside manner, validating the patient's concerns and anxiety.");
  } else {
    improvementsList.push("Try incorporating reassuring, empathetic statements to comfort the anxious patient.");
  }

  const feedbackPoints = feedbackPointsList.length > 0 ? feedbackPointsList : ["Attempted a basic diagnosis run."];
  const improvements = improvementsList.length > 0 ? improvementsList : ["Continue refining diagnostic questioning speed."];

  useEffect(() => {
    // Trigger score animation after mount
    const timer = setTimeout(() => {
      setClinicalScore(finalClinical);
      setEmpathyScore(finalEmpathy);
    }, 500);

    return () => clearTimeout(timer);
  }, [finalClinical, finalEmpathy]);

  // Handle mock saving to database
  const handleSaveToDatabase = async () => {
    setDbSaving(true);
    setDbSaved(false);
    
    // Structure schema payload matching MongoDB Atlas format
    const dbPayload = {
      sessionId: `sess_${Date.now()}`,
      timestamp: new Date().toISOString(),
      patientName: patientName,
      scores: {
        clinicalAccuracy: clinicalScore,
        empathy: empathyScore,
      },
      transcript: messages.map((m) => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp,
      })),
      feedback: {
        strengths: feedbackPoints,
        improvements: improvements,
      }
    };

    console.log("Preparing MongoDB Atlas upload payload:", dbPayload);

    // Mock Next.js api fetch request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setDbSaving(false);
    setDbSaved(true);
  };

  // Helper to get score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-teal-600 dark:text-teal-400 stroke-teal-600 dark:stroke-teal-400";
    if (score >= 70) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-teal-50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-400";
    if (score >= 70) return "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-500";
    return "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-500";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in p-2">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400">
              <Award className="w-6 h-6" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Simulation Completed
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
            Review your diagnostic scores, bedside manner analysis, and export the session log to the clinical registry database.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSaveToDatabase}
            disabled={dbSaving || dbSaved}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 border ${
              dbSaved
                ? "bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-600"
                : "bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 border-transparent cursor-pointer"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{dbSaving ? "Saving to MongoDB..." : dbSaved ? "Saved to Atlas!" : "Save Session Logs"}</span>
          </button>

          <button
            onClick={onRestart}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 text-sm font-semibold rounded-xl transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Start New Case</span>
          </button>
        </div>
      </div>

      {/* Grid: Scores & Qualitative Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clinical Accuracy Ring */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
            Clinical Accuracy Score
          </h3>
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className={`fill-none transition-all duration-1000 ease-out ${getScoreColor(clinicalScore)}`}
                strokeWidth="10"
                strokeDasharray={376.8}
                strokeDashoffset={376.8 - (376.8 * clinicalScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                {clinicalScore}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                Accuracy
              </span>
            </div>
          </div>
          <div className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold ${getScoreBg(clinicalScore)}`}>
            {clinicalScore >= 85 ? "Excellent Diagnosis" : clinicalScore >= 70 ? "Satisfactory" : "Needs Review"}
          </div>
        </div>

        {/* Empathy Ring */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
            Empathy & Bedside Score
          </h3>
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className={`fill-none transition-all duration-1000 ease-out ${getScoreColor(empathyScore)}`}
                strokeWidth="10"
                strokeDasharray={376.8}
                strokeDashoffset={376.8 - (376.8 * empathyScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                {empathyScore}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                Bedside Manner
              </span>
            </div>
          </div>
          <div className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold ${getScoreBg(empathyScore)}`}>
            {empathyScore >= 85 ? "Highly Empathetic" : empathyScore >= 70 ? "Empathetic" : "Cold Demeanor"}
          </div>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-teal-600 dark:text-teal-400" />
              Competency Checklist
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${metCriteria.onset ? "bg-teal-500" : "bg-slate-300"}`}></span>
                Symptom onset & duration checks
              </li>
              <li className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${metCriteria.pain ? "bg-teal-500" : "bg-slate-300"}`}></span>
                Associated pain/discomfort evaluation
              </li>
              <li className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${metCriteria.history ? "bg-teal-500" : "bg-slate-300"}`}></span>
                Medical history & medication review
              </li>
              <li className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${metCriteria.smoke ? "bg-teal-500" : "bg-slate-300"}`}></span>
                Lifestyle & comorbidity screening
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Total Dialogue Turn Count: <span className="font-bold text-slate-600 dark:text-slate-350">{messages.length} lines</span>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <CheckCircle className="w-4.5 h-4.5 mr-1.5 text-teal-600 dark:text-teal-400" />
            Clinical Strengths & Insights
          </h3>
          <ul className="space-y-3">
            {feedbackPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <AlertCircle className="w-4.5 h-4.5 mr-1.5 text-amber-500" />
            Recommended Improvements
          </h3>
          <ul className="space-y-3">
            {improvements.map((point, index) => (
              <li key={index} className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transcript Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
          <FileText className="w-4.5 h-4.5 mr-1.5 text-teal-650" />
          Consultation Transcript Log
        </h3>
        <div className="max-h-80 overflow-y-auto space-y-3 border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/10">
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col space-y-1 pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                msg.sender === "doctor" ? "text-teal-600 dark:text-teal-400" : "text-indigo-600 dark:text-indigo-400"
              }`}>
                {msg.sender === "doctor" ? "Doctor" : `Patient (${patientName})`}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-355 leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
