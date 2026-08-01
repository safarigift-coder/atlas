"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2, Flame, ArrowRight, X } from "lucide-react";
import confetti from "canvas-confetti";
import { soundManager } from "@/lib/sound";
import { useAtlasStore } from "@/store/atlas-store";
import { AtlasLogo } from "@/components/brand/AtlasLogo";

export function MissionCompleteModal() {
  const {
    missionCompleteModalOpen,
    setMissionCompleteModalOpen,
    profile,
    setActiveTab,
  } = useAtlasStore();

  useEffect(() => {
    if (missionCompleteModalOpen) {
      soundManager.playVictory(profile.soundEnabled);

      // Trigger multi-stage confetti
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [missionCompleteModalOpen, profile.soundEnabled]);

  if (!missionCompleteModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="relative w-full max-w-md bg-[#121215] border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle glow background & Evolving Logo glowing behind the text */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
            <AtlasLogo
              size="hero"
              variant="evolving"
              streak={profile.currentStreak}
              animated
            />
          </div>

          <button
            onClick={() => setMissionCompleteModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-tr from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/40 rounded-full flex items-center justify-center shadow-emerald-500/20 shadow-xl"
          >
            <Trophy className="w-12 h-12 text-emerald-400" />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Checklists Done
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight mb-2">
            MISSION COMPLETE
          </h2>

          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            You showed up, executed your daily discipline, and leveled up your creative OS.
          </p>

          <div className="flex items-center justify-center gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-6">
            <div className="text-center">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">
                Current Streak
              </div>
              <div className="text-lg font-bold text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400" />
                {profile.currentStreak} Days
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">
                Badge Unlocked
              </div>
              <div className="text-lg font-bold text-emerald-400">
                🔥 7-Day Streak
              </div>
            </div>
          </div>

          <div className="text-base font-medium text-emerald-300 italic mb-6">
            "See you tomorrow."
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setMissionCompleteModalOpen(false);
                setActiveTab("achievements");
              }}
              className="flex-1 px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              Trophy Room <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMissionCompleteModalOpen(false)}
              className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-sm transition shadow-lg shadow-emerald-600/20"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
