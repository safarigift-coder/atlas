"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Shield,
  ArrowRight,
  Check,
  Plus,
  User,
  MapPin,
  Calendar,
  Briefcase,
  Layers,
  Target,
  Image as ImageIcon,
  Bell,
  Clock,
  Globe,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { AtlasLogo } from "@/components/brand/AtlasLogo";
import {
  AtlasOnboardingData,
  saveLocalOnboardingData,
} from "@/lib/onboarding-storage";
import { soundManager } from "@/lib/sound";

export interface AtlasOnboardingProps {
  onFinishOnboarding: () => void;
}

export function AtlasOnboarding({ onFinishOnboarding }: AtlasOnboardingProps) {
  const [step, setStep] = useState<number>(1);

  // Step 2: Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  );
  const [birthday, setBirthday] = useState("");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("");
  const [occupation, setOccupation] = useState("Creative Entrepreneur");
  const [customOccupation, setCustomOccupation] = useState("");

  const occupationOptions = [
    "Student",
    "Designer",
    "Developer",
    "Photographer",
    "Architect",
    "Freelancer",
    "Creative Entrepreneur",
    "Other",
  ];

  // Step 3: What are you becoming? (Journey)
  const journeyOptions = [
    "Designer",
    "Developer",
    "Creative Entrepreneur",
    "Video Editor",
    "Photographer",
    "Architect",
    "Student",
    "Business Owner",
    "Content Creator",
    "Artist",
  ];
  const [selectedJourney, setSelectedJourney] = useState<string[]>([
    "Creative Entrepreneur",
  ]);

  const toggleJourney = (j: string) => {
    soundManager.playCheck(true);
    if (selectedJourney.includes(j)) {
      if (selectedJourney.length > 1) {
        setSelectedJourney(selectedJourney.filter((x) => x !== j));
      }
    } else {
      setSelectedJourney([...selectedJourney, j]);
    }
  };

  // Step 4: Skills & Level
  const skillOptions = [
    "Photoshop",
    "Illustrator",
    "After Effects",
    "Premiere Pro",
    "Lightroom",
    "Canva",
    "Figma",
    "UI Design",
    "Web Development",
    "3D",
    "Animation",
    "Marketing",
    "Sales",
    "Writing",
    "Other",
  ];
  const [selectedSkills, setSelectedSkills] = useState<
    { name: string; level: string }[]
  >([
    { name: "Figma", level: "Intermediate" },
    { name: "UI Design", level: "Intermediate" },
  ]);
  const [currentSkillLevel, setCurrentSkillLevel] = useState("Intermediate");

  const toggleSkill = (sk: string) => {
    soundManager.playCheck(true);
    const exists = selectedSkills.find((s) => s.name === sk);
    if (exists) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s.name !== sk));
      }
    } else {
      setSelectedSkills([
        ...selectedSkills,
        { name: sk, level: currentSkillLevel },
      ]);
    }
  };

  const updateSkillLevel = (lvl: string) => {
    setCurrentSkillLevel(lvl);
    setSelectedSkills(selectedSkills.map((s) => ({ ...s, level: lvl })));
  };

  // Step 5: Goals
  const goalOptions = [
    "Build a portfolio",
    "Find freelance clients",
    "Start a business",
    "Graduate",
    "Master After Effects",
    "Learn Web Development",
    "Become financially independent",
    "Buy my first laptop",
    "Support my family",
    "Travel",
  ];
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    "Build a portfolio",
    "Become financially independent",
  ]);
  const [customGoal, setCustomGoal] = useState("");

  const toggleGoal = (g: string) => {
    soundManager.playCheck(true);
    if (selectedGoals.includes(g)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((x) => x !== g));
      }
    } else {
      setSelectedGoals([...selectedGoals, g]);
    }
  };

  const addCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoal.trim()) return;
    if (!selectedGoals.includes(customGoal.trim())) {
      setSelectedGoals([...selectedGoals, customGoal.trim()]);
    }
    setCustomGoal("");
  };

  // Step 6: Vision
  const [visionText, setVisionText] = useState(
    "I am working toward total creative freedom and financial independence—building world-class products, owning my own studio, and leaving a legacy that inspires others."
  );

  // Step 7: The Promise
  const todayStr = new Date().toISOString().split("T")[0];
  const [promiseText, setPromiseText] = useState(
    "I promise that I will show up every single day, build my creative portfolio, and honor the vision I have for my family and my future. I refuse to settle for an ordinary life."
  );
  const [promiseSignature, setPromiseSignature] = useState("");

  // Step 8: Preferences
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [startOfWeek, setStartOfWeek] = useState<"Monday" | "Sunday">("Monday");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);

  // Step 9: Animated dashboard creation state
  const [creationStage, setCreationStage] = useState(0);

  const handleStartCreation = () => {
    setStep(9);
    soundManager.playCheck(true);

    const stages = [1, 2, 3, 4, 5];
    stages.forEach((st, idx) => {
      setTimeout(() => {
        setCreationStage(st);
        if (st === 5) {
          setTimeout(() => {
            setStep(10);
          }, 1200);
        }
      }, idx * 900);
    });
  };

  const handleFinishAndEnter = async () => {
    soundManager.playVictory(true);

    const activeName =
      preferredName.trim() || firstName.trim() || "Creator";
    const activeOcc =
      occupation === "Other" && customOccupation.trim()
        ? customOccupation.trim()
        : occupation;

    const data: AtlasOnboardingData = {
      firstName: firstName.trim() || "Creator",
      lastName: lastName.trim(),
      preferredName: activeName,
      profilePhotoUrl: profilePhotoUrl.trim(),
      birthday: birthday,
      country: country.trim() || "Global",
      city: city.trim(),
      occupation: activeOcc,
      journey: selectedJourney,
      skills: selectedSkills,
      goals: selectedGoals,
      visionText: visionText.trim(),
      promiseText: promiseText.trim(),
      promiseSignature: promiseSignature.trim() || activeName,
      preferences: {
        theme,
        reminderTime,
        startOfWeek,
        language,
        notifications,
      },
    };

    // 1. Save locally in localStorage/IndexedDB
    saveLocalOnboardingData(data);

    // 2. Sync with backend database via API
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error("Failed to sync onboarding to server:", e);
    }

    onFinishOnboarding();
  };

  const nextStep = () => {
    if (step === 2 && !firstName.trim()) {
      alert("Please enter your First Name to continue.");
      return;
    }
    soundManager.playCheck(true);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    soundManager.playCheck(true);
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#09090B] text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-8 select-none overflow-y-auto">
      {/* Cinematic Luminous Background & Noise */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Header & Step Progress Bar */}
      {step < 9 && (
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <AtlasLogo size="sm" variant="evolving" streak={14} />
            <span className="text-xs font-black tracking-widest uppercase text-white">
              ATLAS SETUP
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum) => (
              <div
                key={sNum}
                className={`w-8 h-1 rounded-full transition-all duration-300 ${
                  sNum <= step ? "bg-emerald-500" : "bg-zinc-800"
                }`}
              />
            ))}
            <span className="ml-2 text-xs font-mono font-bold text-zinc-500">
              {step}/8
            </span>
          </div>
        </div>
      )}

      {/* Main Step Cards */}
      <div className="relative z-10 w-full max-w-2xl my-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center space-y-8 bg-[#121215]/90 border border-white/10 rounded-3xl p-8 sm:p-14 shadow-2xl backdrop-blur-2xl"
            >
              <AtlasLogo size="3xl" variant="evolving" streak={14} animated />

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                  Welcome to Atlas.
                </h1>
                <div className="text-xl sm:text-2xl font-black tracking-widest text-emerald-400 uppercase">
                  Build. Create. Become.
                </div>
                <p className="text-base sm:text-lg font-medium text-zinc-300 pt-2">
                  Your journey starts today. Let's configure your personal operating system.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={nextStep}
                  className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 text-black font-black text-base uppercase tracking-widest transition duration-300 shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-98"
                >
                  <span>Begin</span>
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PERSONAL INFORMATION */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#121215]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  STEP 2 OF 8 • PERSONAL INFORMATION
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Who are you?
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  All onboarding data is stored locally and securely in your database.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (!preferredName) setPreferredName(e.target.value);
                    }}
                    placeholder="Gift"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Safari"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Preferred Name (Display Name)
                  </label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="Gift"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Birthday (optional)
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    City (optional)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">
                  Occupation
                </label>
                <div className="flex flex-wrap gap-2">
                  {occupationOptions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccupation(occ)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                        occupation === occ
                          ? "bg-emerald-500 text-black border-emerald-400 shadow-md"
                          : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>

                {occupation === "Other" && (
                  <input
                    type="text"
                    value={customOccupation}
                    onChange={(e) => setCustomOccupation(e.target.value)}
                    placeholder="Enter custom occupation..."
                    className="mt-3 w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Profile Picture URL (optional)
                </label>
                <input
                  type="url"
                  value={profilePhotoUrl}
                  onChange={(e) => setProfilePhotoUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: WHAT ARE YOU BECOMING? */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#121215]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  STEP 3 OF 8 • IDENTITY DIRECTIVE
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  What are you becoming?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Which describes your journey? Select all that apply.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {journeyOptions.map((j) => {
                  const isSelected = selectedJourney.includes(j);
                  return (
                    <button
                      key={j}
                      type="button"
                      onClick={() => toggleJourney(j)}
                      className={`p-4 rounded-2xl text-left text-sm font-extrabold transition border flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20"
                          : "bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <span>{j}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SKILLS & LEVEL */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#121215]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  STEP 4 OF 8 • CREATIVE ARSENAL
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Skills & Proficiency
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Select your skills and declare your current proficiency baseline.
                </p>
              </div>

              {/* Skill Level Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-zinc-400">
                  Current Overall Skill Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Beginner", "Intermediate", "Advanced", "Professional"].map(
                    (lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => updateSkillLevel(lvl)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                          currentSkillLevel === lvl
                            ? "bg-blue-500 text-black border-blue-400 shadow-md"
                            : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {lvl}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Skills Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-zinc-400">
                  Select Your Skills (Multi-select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((sk) => {
                    const isSelected = selectedSkills.some(
                      (s) => s.name === sk
                    );
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleSkill(sk)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition border flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-emerald-500 text-black border-emerald-400 shadow-md"
                            : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <span>{sk}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: GOALS */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#121215]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  STEP 5 OF 8 • STRATEGIC OBJECTIVES
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  What are your biggest goals?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Select your primary targets or add custom goals that will anchor your progress.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((opt) => {
                  const isSelected = selectedGoals.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleGoal(opt)}
                      className={`p-4 rounded-2xl text-left text-sm font-extrabold transition border flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-500 text-black border-emerald-400 shadow-lg"
                          : "bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}

                {/* Display any custom added items */}
                {selectedGoals
                  .filter((g) => !goalOptions.includes(g))
                  .map((customOpt) => (
                    <button
                      key={customOpt}
                      type="button"
                      onClick={() => toggleGoal(customOpt)}
                      className="p-4 rounded-2xl text-left text-sm font-extrabold bg-emerald-500 text-black border border-emerald-400 shadow-lg flex items-center justify-between"
                    >
                      <span>{customOpt}</span>
                      <Check className="w-4 h-4" />
                    </button>
                  ))}
              </div>

              {/* Add Custom Goal */}
              <form
                onSubmit={addCustomGoal}
                className="flex items-center gap-3 pt-2 max-w-md"
              >
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Add custom goal (e.g. Master After Effects)..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs"
                >
                  + Add
                </button>
              </form>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: VISION */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#121215]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  STEP 6 OF 8 • THE FUTURE ROOM SANCTUARY
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  What does your dream life look like?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Describe the future you are working toward. This will be saved as your permanent vision inside The Future Room.
                </p>
              </div>

              <div>
                <textarea
                  rows={6}
                  value={visionText}
                  onChange={(e) => setVisionText(e.target.value)}
                  placeholder="Describe the future you're working toward..."
                  className="w-full bg-black/40 border border-white/10 text-white font-serif text-base sm:text-lg rounded-2xl p-5 leading-relaxed focus:outline-none focus:border-emerald-500/60 transition whitespace-pre-wrap"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: THE PROMISE */}
          {step === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-gradient-to-r from-[#121215] via-[#161920] to-[#121215] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-12 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <Shield className="w-3.5 h-3.5" /> SACRED COVENANT
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Before we begin...
                </h2>
                <p className="text-sm text-zinc-300 mt-1">
                  Atlas cannot build your future. Only you can. Make one promise to yourself.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    My Promise
                  </label>
                  <textarea
                    rows={4}
                    value={promiseText}
                    onChange={(e) => setPromiseText(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 text-white font-serif text-base sm:text-lg rounded-2xl p-4 leading-relaxed focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                      Signature Field
                    </label>
                    <input
                      type="text"
                      value={
                        promiseSignature ||
                        preferredName ||
                        firstName ||
                        "Creator"
                      }
                      onChange={(e) => setPromiseSignature(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-black/60 border border-white/20 text-emerald-400 font-serif text-lg rounded-xl px-4 py-2.5 text-center font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                      Today's Date
                    </label>
                    <input
                      type="text"
                      disabled
                      value={todayStr}
                      className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-2.5 text-center font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  <span>Sign My Promise</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 8: PREFERENCES */}
          {step === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#121215]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  STEP 8 OF 8 • SYSTEM CONFIGURATION
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Preferences
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Choose your theme, reminder schedule, and language settings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Theme */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["dark", "light", "system"] as const).map((thm) => (
                      <button
                        key={thm}
                        type="button"
                        onClick={() => setTheme(thm)}
                        className={`py-2.5 rounded-xl text-xs font-bold uppercase transition border ${
                          theme === thm
                            ? "bg-emerald-500 text-black border-emerald-400 shadow-md"
                            : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {thm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reminder Time */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">
                    Daily Reminder Time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start of Week */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">
                    Start of Week
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Monday", "Sunday"] as const).map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setStartOfWeek(day)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                          startOfWeek === day
                            ? "bg-blue-500 text-black border-blue-400 shadow-md"
                            : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <div className="text-sm font-bold text-white">
                    Notification Preferences
                  </div>
                  <div className="text-xs text-zinc-400">
                    Receive daily briefing and focus reminders
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                    notifications
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}
                >
                  {notifications ? "Enabled" : "Disabled"}
                </button>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStartCreation}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25"
                >
                  Create Workspace
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 9: CREATE DASHBOARD ANIMATION */}
          {step === 9 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-8 bg-[#121215]/90 border border-white/10 rounded-3xl p-10 sm:p-16 shadow-2xl backdrop-blur-2xl"
            >
              <AtlasLogo size="2xl" variant="evolving" streak={14} animated />

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Creating your workspace...
                </h2>
                <div className="text-sm font-mono font-bold text-emerald-400 h-6">
                  {creationStage === 1 && "Building Dashboard..."}
                  {creationStage === 2 && "Preparing Future Room..."}
                  {creationStage === 3 && "Creating Legacy..."}
                  {creationStage === 4 && "Preparing The Mirror..."}
                  {creationStage === 5 && "Almost Ready..."}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-64 h-2 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                <motion.div
                  initial={{ width: "10%" }}
                  animate={{ width: `${(creationStage / 5) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 10: WELCOME HOME */}
          {step === 10 && (
            <motion.div
              key="step-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8 bg-[#121215]/90 border border-white/10 rounded-3xl p-10 sm:p-16 shadow-2xl backdrop-blur-2xl"
            >
              <AtlasLogo size="3xl" variant="evolving" streak={14} animated />

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  Welcome, {preferredName || firstName || "Creator"}.
                </h1>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 uppercase tracking-widest">
                  Today is Day 1.
                </div>
                <p className="text-base sm:text-lg font-medium text-zinc-300 pt-1">
                  Every masterpiece begins with a single step.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleFinishAndEnter}
                  className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 text-black font-black text-base uppercase tracking-widest transition duration-300 shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-98"
                >
                  <span>Enter Atlas</span>
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
