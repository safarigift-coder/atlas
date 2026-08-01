"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Flame,
  CheckSquare,
  Timer,
  Briefcase,
  DollarSign,
  Palette,
  Sparkles,
  Award,
  Calendar,
  BookOpen,
  Target,
  BarChart3,
  Image,
  Quote,
  Settings,
  Terminal,
  Compass,
  Shield,
} from "lucide-react";
import { useAtlasStore, NavTab } from "@/store/atlas-store";
import { AtlasLogo } from "@/components/brand/AtlasLogo";

export function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { activeTab, setActiveTab, profile, setCmdOpen } = useAtlasStore();

  if (!isOpen) return null;

  const allItems: {
    id: NavTab;
    name: string;
    icon: any;
    category: string;
  }[] = [
    { id: "promise", name: "The Promise (Sacred Covenant)", icon: Shield, category: "Vision" },
    { id: "futureroom", name: "The Future Room", icon: Compass, category: "Vision" },
    { id: "dashboard", name: "Dashboard", icon: Flame, category: "Core" },
    { id: "missions", name: "Daily Mission", icon: CheckSquare, category: "Core" },
    { id: "pomodoro", name: "Pomodoro Focus Mode", icon: Timer, category: "Core" },
    { id: "crm", name: "Client CRM Pipeline", icon: Briefcase, category: "Business" },
    { id: "income", name: "Income Tracker", icon: DollarSign, category: "Business" },
    { id: "portfolio", name: "Creative Portfolio Gallery", icon: Palette, category: "Creative" },
    { id: "skills", name: "Skill Tree & Level XP", icon: Sparkles, category: "Creative" },
    { id: "legacy", name: "Legacy System", icon: Compass, category: "Discipline" },
    { id: "achievements", name: "Trophy Room", icon: Award, category: "Discipline" },
    { id: "calendar", name: "Color-Coded Calendar", icon: Calendar, category: "Discipline" },
    { id: "journal", name: "Daily Markdown Journal", icon: BookOpen, category: "Discipline" },
    { id: "goals", name: "Editable Goals", icon: Target, category: "Discipline" },
    { id: "analytics", name: "Analytics & Heatmaps", icon: BarChart3, category: "Discipline" },
    { id: "whyatlas", name: "Why Atlas? (Brand System)", icon: Sparkles, category: "System" },
    { id: "aicoach", name: "Atlas AI Mentor", icon: Sparkles, category: "System" },
    { id: "visionboard", name: "Vision Board", icon: Image, category: "System" },
    { id: "quotes", name: "Motivational Quotes", icon: Quote, category: "System" },
    { id: "settings", name: "OS Settings & Backup", icon: Settings, category: "System" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm lg:hidden">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-4/5 max-w-sm h-full bg-[#121215] border-l border-zinc-800 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AtlasLogo
                size="sm"
                variant="evolving"
                streak={profile.currentStreak}
              />
              <span className="font-extrabold text-white text-sm tracking-tight">
                ATLAS <span className="text-emerald-400">OS</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick command search */}
          <div className="p-3 border-b border-zinc-800/60">
            <button
              onClick={() => {
                onClose();
                setCmdOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Open Command Palette
            </button>
          </div>

          {/* Menu list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {allItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-zinc-800 text-white border border-zinc-700/80"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-emerald-400" : "text-zinc-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 text-xs text-zinc-500">
            <div>
              Streak:{" "}
              <span className="text-orange-400 font-bold">
                🔥 {profile.currentStreak} Days
              </span>
            </div>
            <div className="mt-0.5">
              Level {profile.level} • {profile.levelTitle}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
