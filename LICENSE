"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Sparkles, X, ArrowRight, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { soundManager } from "@/lib/sound";
import { useAtlasStore } from "@/store/atlas-store";
import { AtlasLogo } from "@/components/brand/AtlasLogo";

export function LevelUpModal() {
  const {
    levelUpModalOpen,
    setLevelUpModalOpen,
    levelUpData,
    profile,
  } = useAtlasStore();

  useEffect(() => {
    if (levelUpModalOpen) {
      soundManager.playVictory(profile.soundEnabled);

      // Trigger golden confetti burst
      const duration = 2.0 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#F59E0B", "#10B981", "#3B82F6"],
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#F59E0B", "#10B981", "#3B82F6"],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [levelUpModalOpen, profile.soundEnabled]);

  if (!levelUpModalOpen || !levelUpData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="relative w-full max-w-md bg-[#121215] border border-amber-500/40 rounded-3xl p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Ambient Gold Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={() => setLevelUpModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-28 h-28 mx-auto mb-6 bg-gradient-to-tr from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20 relative"
          >
            <AtlasLogo
              size="2xl"
              variant="gold"
              streak={profile.currentStreak}
              animated
            />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> LEVEL UP ACHIEVED
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight mb-1">
            LEVEL {levelUpData.newLevel}
          </h2>

          <div className="text-lg font-extrabold text-amber-400 tracking-tight mb-4">
            {levelUpData.newTitle}
          </div>

          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Your daily discipline and creative output have elevated your RPG status. Keep compounding small actions into massive results.
          </p>

          <div className="flex items-center justify-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 mb-6">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">
              +{levelUpData.xpAwarded} XP Earned
            </span>
          </div>

          <button
            onClick={() => setLevelUpModalOpen(false)}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <span>Continue Building</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
