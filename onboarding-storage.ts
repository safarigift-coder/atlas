"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtlasLogo } from "./AtlasLogo";
import { soundManager } from "@/lib/sound";

export interface SplashScreenProps {
  onFinish: () => void;
  streak?: number;
  soundEnabled?: boolean;
}

export function SplashScreen({
  onFinish,
  streak = 14,
  soundEnabled = true,
}: SplashScreenProps) {
  const [stage, setStage] = useState<"logo" | "text" | "fadeout">("logo");

  useEffect(() => {
    soundManager.playCheck(soundEnabled);

    const textTimer = setTimeout(() => {
      setStage("text");
    }, 700);

    const fadeTimer = setTimeout(() => {
      setStage("fadeout");
    }, 2200);

    const endTimer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish, soundEnabled]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[100] bg-[#09090B] flex flex-col items-center justify-center select-none"
      >
        {/* Subtle Ambient Radial Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Centered Evolving Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <AtlasLogo size="3xl" variant="evolving" streak={streak} animated />
          </motion.div>

          {/* Title & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: stage === "text" || stage === "fadeout" ? 1 : 0,
              y: stage === "text" || stage === "fadeout" ? 0 : 10,
            }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-widest uppercase">
              ATLAS
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-emerald-400 uppercase">
              Build. Create. Become.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
