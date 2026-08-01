"use client";

import React from "react";
import { motion } from "framer-motion";
import { AtlasLogo } from "./AtlasLogo";
import { Plus, ArrowRight } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  streak?: number;
  className?: string;
}

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
  streak = 14,
  className = "",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-[#121215]/80 border border-zinc-800/80 rounded-3xl p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-6 select-none shadow-xl ${className}`}
    >
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        <AtlasLogo size="2xl" variant="evolving" streak={streak} />
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-2xl font-black text-white tracking-tight">
          {title}
        </h3>
        <p className="text-sm font-semibold text-emerald-400 italic">
          "{subtitle}"
        </p>
      </div>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 text-black font-black text-xs uppercase tracking-widest transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-105 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      )}
    </motion.div>
  );
}
