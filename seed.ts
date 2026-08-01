"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtlasLogo } from "./AtlasLogo";

export interface LoadingScreenProps {
  message?: string;
  streak?: number;
}

export function LoadingScreen({
  message = "Loading ATLAS OS...",
  streak = 14,
}: LoadingScreenProps) {
  const quotes = [
    "Consistency beats motivation.",
    "Keep climbing.",
    "One day at a time.",
    "Professionals show up.",
    "The climb is the reward.",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % quotes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-6"
      >
        <AtlasLogo size="xl" variant="evolving" streak={streak} animated />

        {/* Minimal Progress Bar */}
        <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 rounded-full"
          />
        </div>

        {/* Message and Rotating Quotes */}
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            {message}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-extrabold text-zinc-300 italic"
            >
              "{quotes[quoteIndex]}"
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
