"use client";

import React, { useState, useEffect } from "react";
import { Heart, Activity, AlertCircle, FileText, User, HelpCircle, ShieldCheck } from "lucide-react";

interface PatientFileProps {
  name: string;
  age: number;
  gender: string;
  complaint: string;
  history: string;
  medications?: string;
  allergies?: string;
  region?: string;
  stgGuideline?: string;
  differentials?: string[];
}

export default function PatientFile({
  name = "Jane Cohen",
  age = 65,
  gender = "Female",
  complaint = "Visible Hematuria",
  history = "Noticed bright red urine this morning. No dysuria, no fever, no flank pain. Patient is anxious but polite.",
  medications = "Lisinopril 10mg daily",
  allergies = "Penicillin (Mild rash)",
  region = "General",
  stgGuideline = "First line: Urine microscopy, USG KUB. Rule out malignancy in elderly patients. Referral to Urology for cystoscopy.",
  differentials = [
    "Urinary Tract Infection (UTI / पेशाब की नली में इन्फेक्शन)",
    "Nephrolithiasis (Kidney stones / गुर्दे की पथरी)",
    "Urothelial Carcinoma (Bladder cancer / मूत्राशय का कैंसर)",
    "Glomerulonephritis (Kidney filter की सूजन)"
  ]
}: PatientFileProps) {
  // Live vitals states for premium aesthetic
  const [pulse, setPulse] = useState(74);
  const [systolic, setSystolic] = useState(132);
  const [diastolic, setDiastolic] = useState(84);
  const [respRate, setRespRate] = useState(16);
  const [temp, setTemp] = useState(98.4);
  
  // Historical trends for dynamic graphing
  const [pulseHistory, setPulseHistory] = useState<number[]>([74, 76, 75, 73, 75, 76, 74, 73, 75, 74, 75, 74]);
  const [bpHistory, setBpHistory] = useState<number[]>([130, 132, 131, 128, 132, 133, 131, 130, 133, 132, 131, 132]);

  // Fluctuating vitals effect to look "live"
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate next pulse
      const pulseDiff = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
      setPulse((prev) => {
        const next = prev + pulseDiff;
        const finalVal = next >= 60 && next <= 95 ? next : 74;
        setPulseHistory((history) => [...history.slice(1), finalVal]);
        return finalVal;
      });
      
      // Calculate next systolic BP
      const bpDiff = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
      setSystolic((prev) => {
        const next = prev + bpDiff;
        const finalVal = next >= 115 && next <= 140 ? next : 130;
        setBpHistory((history) => [...history.slice(1), finalVal]);
        return finalVal;
      });
      
      setDiastolic((prev) => {
        const diff = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
        return prev + diff >= 70 && prev + diff <= 90 ? prev + diff : 84;
      });
      
      setRespRate((prev) => {
        const diff = Math.random() > 0.5 ? 1 : -1;
        return prev + diff >= 14 && prev + diff <= 18 ? prev + diff : prev;
      });
      
      setTemp((prev) => {
        const diff = (Math.random() > 0.5 ? 0.1 : -0.1) * (Math.random() > 0.5 ? 1 : 0);
        const next = prev + diff;
        return next >= 97.8 && next <= 99.1 ? next : 98.4;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Helper to map values to SVG height (range: 50-110 for Pulse, 90-160 for Systolic BP)
  const getPulseY = (val: number) => 70 - ((val - 50) / 60) * 55;
  const getBpY = (val: number) => 70 - ((val - 90) / 70) * 55;

  const pulsePoints = pulseHistory.map((val, idx) => {
    const x = (idx * 300) / (pulseHistory.length - 1);
    const y = getPulseY(val);
    return `${x},${y}`;
  });
  const pulseLinePath = `M ${pulsePoints.join(" L ")}`;
  const pulseAreaPath = `M 0,80 L ${pulsePoints.join(" L ")} L 300,80 Z`;

  const bpPoints = bpHistory.map((val, idx) => {
    const x = (idx * 300) / (bpHistory.length - 1);
    const y = getBpY(val);
    return `${x},${y}`;
  });
  const bpLinePath = `M ${bpPoints.join(" L ")}`;
  const bpAreaPath = `M 0,80 L ${bpPoints.join(" L ")} L 300,80 Z`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-5 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-white backdrop-blur-sm">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold tracking-tight">{name}</h2>
              <span className="bg-teal-500/30 text-[9px] px-2 py-0.5 rounded-full border border-teal-400/20 font-bold uppercase">
                Active Case
              </span>
            </div>
            <p className="text-teal-100 text-xs mt-0.5">
              {gender === "Male" ? "Male (Purush / पुरुष)" : "Female (Mahila / महिला)"}, Age {age} • {region}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Record Content */}
      <div className="p-5 space-y-5 flex-1 overflow-y-auto">
        {/* Vitals Panel */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center">
            <Activity className="w-3.5 h-3.5 mr-1 text-teal-500" />
            Vitals Telemetry (शारीरिक जांच)
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Heart Rate */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                  Pulse (धड़कन)
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  {pulse} <span className="text-xs font-normal text-slate-500">BPM</span>
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                  B.P. (ब्लड प्रेशर)
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  {systolic}/{diastolic} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-teal-500" />
              </div>
            </div>

            {/* Respiration */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                  Respiration (सांस)
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  {respRate} <span className="text-xs font-normal text-slate-500">/min</span>
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-500" />
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                  Temp (तापमान)
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  {temp.toFixed(1)} <span className="text-xs font-normal text-slate-500">°F</span>
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          </div>
          
          {/* Vitals Real-time Trend Graph */}
          <div className="mt-3.5 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Vitals Real-time Trends (शारीरिक लक्षण ग्राफ)
              </span>
              <div className="flex space-x-3 text-[8px] font-bold">
                <span className="flex items-center text-rose-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1"></span>
                  HR (BPM): {pulse}
                </span>
                <span className="flex items-center text-teal-650 dark:text-teal-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1"></span>
                  SYS BP (mmHg): {systolic}
                </span>
              </div>
            </div>
            <div className="relative h-16 w-full overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pulseGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#fda4af" />
                  </linearGradient>
                  <linearGradient id="pulseAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="bpGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="bpAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference lines */}
                <line x1="0" y1={getPulseY(100)} x2="300" y2={getPulseY(100)} stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
                <line x1="0" y1={getPulseY(80)} x2="300" y2={getPulseY(80)} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.25" />
                <line x1="0" y1={getPulseY(60)} x2="300" y2={getPulseY(60)} stroke="#0d9488" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.2" />
                
                {/* BP Area & Line */}
                <path d={bpAreaPath} fill="url(#bpAreaGradient)" />
                <path d={bpLinePath} fill="none" stroke="url(#bpGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Pulse Area & Line */}
                <path d={pulseAreaPath} fill="url(#pulseAreaGradient)" />
                <path d={pulseLinePath} fill="none" stroke="url(#pulseGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* End Point Markers */}
                <circle cx="300" cy={getPulseY(pulseHistory[pulseHistory.length - 1])} r="2.5" fill="#f43f5e" />
                <circle cx="300" cy={getBpY(bpHistory[bpHistory.length - 1])} r="2.5" fill="#06b6d4" />
              </svg>
            </div>
            <div className="flex justify-between items-center text-[7px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide mt-1">
              <span>-40 seconds</span>
              <span className="flex items-center text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                Live Telemetry Plot
              </span>
              <span>Now (अब)</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Chief Complaint */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-teal-500" />
            Chief Complaint (मुख्य शिकायत)
          </h3>
          <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 rounded-xl">
            <p className="text-xs font-bold text-rose-800 dark:text-rose-455">
              {complaint}
            </p>
          </div>
        </div>

        {/* History of Present Illness */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1 text-teal-500" />
            Clinical Notes (मरीज का इतिहास)
          </h3>
          <div className="bg-slate-50 dark:bg-slate-855 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5">
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              {history}
            </p>
            {differentials && differentials.length > 0 && (
              <div className="text-[10px] bg-slate-200/40 dark:bg-slate-800 p-2 rounded-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  Differential Diagnoses (संभावित रोग):
                </span>
                <ul className="list-disc pl-3.5 space-y-0.5 font-medium">
                  {differentials.map((diff, idx) => (
                    <li key={idx}>{diff}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* STG & ICMR Treatment Guideline */}
        {stgGuideline && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-650" />
              STG & ICMR Guidelines (मानक नैदानिक ​​निर्देश)
            </h3>
            <div className="p-3.5 bg-teal-50/50 dark:bg-teal-950/10 border border-teal-100 dark:border-teal-900/30 rounded-xl">
              <p className="text-xs text-teal-800 dark:text-teal-400 font-semibold leading-relaxed">
                {stgGuideline}
              </p>
            </div>
          </div>
        )}

        {/* Allergies / Meds */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              Allergies (एलर्जी)
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
              allergies.toLowerCase().includes("none")
                ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-350 border-slate-200 dark:border-slate-700"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-450 border-amber-200 dark:border-amber-900/30"
            }`}>
              {allergies}
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              Medications (दवाइयां)
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400 border border-teal-200 dark:border-teal-900/30">
              {medications}
            </span>
          </div>
        </div>

        {/* Bilingual Medical Glossary */}
        <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center">
            <HelpCircle className="w-3 h-3 mr-1 text-teal-650" />
            Medical Glossary (शब्दावली)
          </h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
            <div>• <span className="font-bold text-slate-700 dark:text-slate-300">Hematuria:</span> Peshab me khoon</div>
            <div>• <span className="font-bold text-slate-700 dark:text-slate-300">Dysuria:</span> Peshab me jalan/dard</div>
            <div>• <span className="font-bold text-slate-700 dark:text-slate-300">Flank Pain:</span> Peeth/Kamar dard</div>
            <div>• <span className="font-bold text-slate-700 dark:text-slate-300">Hypertension:</span> High blood pressure</div>
          </div>
        </div>
      </div>

      {/* Patient Footer */}
      <div className="bg-slate-50 dark:bg-slate-855 p-3.5 border-t border-slate-200 dark:border-slate-850 text-center text-[9px] text-slate-400 dark:text-slate-500 font-mono">
        ELECTRONIC HEALTH RECORD • SECURE ACCESS ONLY
      </div>
    </div>
  );
}
