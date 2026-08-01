"use client";

import React from "react";
import { motion } from "framer-motion";

export interface AtlasLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "hero";
  variant?: "monochrome" | "white" | "black" | "gradient" | "evolving" | "gold" | "founder";
  streak?: number;
  animated?: boolean;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function AtlasLogo({
  size = "md",
  variant = "evolving",
  streak = 14,
  animated = false,
  className = "",
  showText = false,
  textClassName = "",
}: AtlasLogoProps) {
  // Determine pixel sizes
  const sizeMap: Record<string, { w: number; h: number; font: string }> = {
    xs: { w: 18, h: 18, font: "text-xs" },
    sm: { w: 24, h: 24, font: "text-sm" },
    md: { w: 32, h: 32, font: "text-base" },
    lg: { w: 40, h: 40, font: "text-xl" },
    xl: { w: 56, h: 56, font: "text-2xl" },
    "2xl": { w: 80, h: 80, font: "text-4xl" },
    "3xl": { w: 112, h: 112, font: "text-6xl" },
    hero: { w: 144, h: 144, font: "text-7xl" },
  };

  const { w, h, font } = sizeMap[size] || sizeMap.md;

  // Determine evolving streak styles
  const isFounder = streak >= 1000 || variant === "founder";
  const isSunrise = (streak >= 365 && streak < 1000) || variant === "gradient";
  const isShimmer = streak >= 100 && streak < 365;
  const isGoldOutline = (streak >= 30 && streak < 100) || variant === "gold";
  const isSoftGlow = streak >= 7 && streak < 30;

  // Colors
  const primaryFill =
    variant === "white"
      ? "#FFFFFF"
      : variant === "black"
      ? "#000000"
      : isFounder
      ? "url(#founderGoldGrad)"
      : isGoldOutline
      ? "#F59E0B"
      : "#10B981";

  const secondaryFill =
    variant === "white"
      ? "#E4E4E7"
      : variant === "black"
      ? "#27272A"
      : isFounder
      ? "url(#founderDarkGrad)"
      : "#18181B";

  // Drop shadow filters for evolving streak
  let filterStyle = "";
  if (isFounder) {
    filterStyle = "drop-shadow(0 0 20px rgba(245, 158, 11, 0.85))";
  } else if (isSunrise) {
    filterStyle = "drop-shadow(0 0 18px rgba(249, 115, 22, 0.6))";
  } else if (isShimmer) {
    filterStyle = "drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))";
  } else if (isGoldOutline) {
    filterStyle = "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))";
  } else if (isSoftGlow) {
    filterStyle = "drop-shadow(0 0 10px rgba(16, 185, 129, 0.45))";
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative inline-flex items-center justify-center">
        {/* Sunrise Gradient Background Behind Logo for 365+ Day Streak */}
        {isSunrise && (
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/30 to-purple-600/30 blur-md animate-atlas-sunrise pointer-events-none" />
        )}

        {/* Founder Golden Aura for 1000+ Day Streak */}
        {isFounder && (
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-500/40 via-yellow-400/30 to-emerald-500/30 blur-lg animate-pulse pointer-events-none" />
        )}

        {/* Evolving Geometric Mountain Peak SVG Logo */}
        <motion.svg
          width={w}
          height={h}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: filterStyle }}
          animate={
            animated || isShimmer || isFounder
              ? {
                  scale: [1, 1.03, 1],
                  opacity: [0.95, 1, 0.95],
                }
              : undefined
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <defs>
            {/* Linear & Radial Gradients */}
            <linearGradient id="founderGoldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            <linearGradient id="founderDarkGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#27272A" />
              <stop offset="100%" stopColor="#09090B" />
            </linearGradient>

            <linearGradient id="emeraldGrad" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            {/* Shimmer Overlay Filter */}
            <linearGradient id="shimmerGrad" x1="-100%" y1="0%" x2="200%" y2="0%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Exterior Sharp Mountain Ascent (A-Summmit Peak) */}
          <path
            d="M50 10L90 85H10L50 10Z"
            fill={variant === "white" ? "#FFFFFF" : "url(#emeraldGrad)"}
            stroke={isGoldOutline ? "#F59E0B" : isFounder ? "#FDE047" : "rgba(255,255,255,0.15)"}
            strokeWidth={isGoldOutline || isFounder ? "3.5" : "2"}
            strokeLinejoin="round"
          />

          {/* Interior Stylized Shadow Facet / Directional Core */}
          <path
            d="M50 10L70 85H50V10Z"
            fill={secondaryFill}
            fillOpacity="0.45"
          />

          {/* Central Summit Ascent Arrow (Upward Trajectory) */}
          <path
            d="M50 35L62 65H38L50 35Z"
            fill={
              variant === "white"
                ? "#09090B"
                : variant === "black"
                ? "#FFFFFF"
                : "#09090B"
            }
          />

          {/* Shimmer overlay path for 100+ Day streak */}
          {isShimmer && (
            <path
              d="M50 10L90 85H10L50 10Z"
              fill="url(#shimmerGrad)"
              className="animate-atlas-shimmer"
            />
          )}
        </motion.svg>
      </div>

      {showText && (
        <span className={`font-black tracking-tight text-white ${font} ${textClassName}`}>
          ATLAS<span className="text-emerald-400 font-extrabold ml-1">OS</span>
        </span>
      )}
    </div>
  );
}
