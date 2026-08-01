"use client";

import React from "react";
import {
  Flame,
  CheckSquare,
  Timer,
  Briefcase,
  Palette,
  Sparkles,
  Menu,
  Terminal,
  Compass,
} from "lucide-react";
import { useAtlasStore, NavTab } from "@/store/atlas-store";

export function MobileBottomNav({
  onOpenMenu,
}: {
  onOpenMenu: () => void;
}) {
  const { activeTab, setActiveTab, dailyMissions, setCmdOpen } =
    useAtlasStore();

  const missionsCompleted = dailyMissions.filter((m) => m.completed).length;
  const missionsTotal = dailyMissions.length;

  const tabs: {
    id: NavTab;
    label: string;
    icon: any;
    badge?: string;
  }[] = [
    { id: "futureroom", label: "Future", icon: Compass },
    { id: "dashboard", label: "Home", icon: Flame },
    {
      id: "missions",
      label: "Mission",
      icon: CheckSquare,
      badge: `${missionsCompleted}/${missionsTotal}`,
    },
    { id: "pomodoro", label: "Focus", icon: Timer },
    { id: "crm", label: "CRM", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: Palette },
  ];

  return (
    <>
      {/* Floating Action Button for Quick Commands on Mobile */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setCmdOpen(true)}
          className="w-12 h-12 rounded-2xl bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 flex items-center justify-center font-black transition active:scale-95"
          title="Open Command Palette"
        >
          <Terminal className="w-6 h-6" />
        </button>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition relative ${
                  isActive
                    ? "text-emerald-400 font-bold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-3 text-[9px] font-bold px-1 py-0.2 rounded-full bg-emerald-500 text-black">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={onOpenMenu}
            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-zinc-500 hover:text-zinc-300 transition"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
