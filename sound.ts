"use client";

import React from "react";
import {
  Flame,
  Search,
  Timer,
  Terminal,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  Shield,
  Download,
} from "lucide-react";
import { useAtlasStore } from "@/store/atlas-store";

export function Header() {
  const {
    profile,
    focusStats,
    setCmdOpen,
    setActiveTab,
    logPomodoro,
    updateProfile,
    setInstallModalOpen,
  } = useAtlasStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-zinc-800/80 bg-[#09090B]/90 backdrop-blur-md">
      {/* Left section: Challenge & Streak status */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-tight">
          <Flame className="w-3.5 h-3.5 fill-orange-400" />
          <span>{profile.currentStreak} Day Streak</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
          <span>Day {profile.dayOfChallenge} of 30</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400">
            {focusStats.todayHours}h Focused Today
          </span>
        </div>
      </div>

      {/* Right section: Search command & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setInstallModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold uppercase tracking-wider transition shadow-sm"
          title="Install ATLAS OS as a native standalone app"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        <button
          onClick={() => setCmdOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <span className="hidden sm:inline">Search / Commands...</span>
          <kbd className="hidden sm:inline px-1 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setActiveTab("whyatlas")}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Why Atlas?</span>
        </button>

        <button
          onClick={() => setActiveTab("promise")}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-wider transition shadow-sm"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>The Promise</span>
        </button>

        <button
          onClick={() => setActiveTab("futureroom")}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-blue-500/15 to-purple-500/15 hover:from-emerald-500/25 hover:to-purple-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider transition shadow-sm"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>The Future Room</span>
        </button>

        <button
          onClick={() => setActiveTab("pomodoro")}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition"
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Focus Mode</span>
        </button>

        <button
          onClick={() => setActiveTab("missions")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Daily Mission</span>
        </button>

        <button
          onClick={() => {
            updateProfile({ soundEnabled: !profile.soundEnabled });
          }}
          title={profile.soundEnabled ? "Sound On" : "Sound Muted"}
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition"
        >
          {profile.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-600" />
          )}
        </button>
      </div>
    </header>
  );
}
