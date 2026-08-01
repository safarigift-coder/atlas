"use client";

import React, { useEffect, useState } from "react";
import { useAtlasStore } from "@/store/atlas-store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { DashboardView } from "@/components/views/DashboardView";
import { DailyMissionView } from "@/components/views/DailyMissionView";
import { PomodoroView } from "@/components/views/PomodoroView";
import { ClientCrmView } from "@/components/views/ClientCrmView";
import { IncomeTrackerView } from "@/components/views/IncomeTrackerView";
import { PortfolioView } from "@/components/views/PortfolioView";
import { SkillTreeView } from "@/components/views/SkillTreeView";
import { AchievementsView } from "@/components/views/AchievementsView";
import { CalendarView } from "@/components/views/CalendarView";
import { JournalView } from "@/components/views/JournalView";
import { GoalsView } from "@/components/views/GoalsView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { AiCoachView } from "@/components/views/AiCoachView";
import { VisionBoardView } from "@/components/views/VisionBoardView";
import { QuotesView } from "@/components/views/QuotesView";
import { LegacyView } from "@/components/views/LegacyView";
import { FutureRoomView } from "@/components/views/FutureRoomView";
import { PromiseView } from "@/components/views/PromiseView";
import { WhyAtlasView } from "@/components/views/WhyAtlasView";
import { SettingsView } from "@/components/views/SettingsView";
import { SplashScreen } from "@/components/brand/SplashScreen";
import { LoadingScreen } from "@/components/brand/LoadingScreen";
import { CommandPaletteModal } from "@/components/modals/CommandPaletteModal";
import { MissionCompleteModal } from "@/components/modals/MissionCompleteModal";
import { LevelUpModal } from "@/components/modals/LevelUpModal";
import { ProjectDetailsModal } from "@/components/modals/ProjectDetailsModal";
import { InstallPwaModal } from "@/components/modals/InstallPwaModal";
import { AtlasOnboarding } from "@/components/onboarding/AtlasOnboarding";
import { isLocalOnboardingCompleted } from "@/lib/onboarding-storage";

export function AtlasApp() {
  const { activeTab, fetchState, isLoading, profile } = useAtlasStore();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDone = isLocalOnboardingCompleted();
      if (!isDone && profile && profile.onboardingCompleted === false) {
        setShowOnboarding(true);
      }
    }
  }, [profile?.onboardingCompleted]);

  useEffect(() => {
    fetchState();

    // Register PWA service worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Ignore service worker registration error
      });
    }
  }, [fetchState]);

  const renderActiveView = () => {
    switch (activeTab) {
      case "futureroom":
        return <FutureRoomView />;
      case "promise":
        return <PromiseView />;
      case "dashboard":
        return <DashboardView />;
      case "missions":
        return <DailyMissionView />;
      case "pomodoro":
        return <PomodoroView />;
      case "crm":
        return <ClientCrmView />;
      case "income":
        return <IncomeTrackerView />;
      case "portfolio":
        return <PortfolioView />;
      case "skills":
        return <SkillTreeView />;
      case "achievements":
        return <AchievementsView />;
      case "calendar":
        return <CalendarView />;
      case "journal":
        return <JournalView />;
      case "goals":
        return <GoalsView />;
      case "analytics":
        return <AnalyticsView />;
      case "aicoach":
        return <AiCoachView />;
      case "visionboard":
        return <VisionBoardView />;
      case "quotes":
        return <QuotesView />;
      case "legacy":
        return <LegacyView />;
      case "whyatlas":
        return <WhyAtlasView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-zinc-100 flex overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* 1. Subtle Premium Background Gradients & Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep navy/blue radial top right */}
        <div className="absolute -top-64 -right-64 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-900/10 via-blue-950/15 to-transparent blur-[140px]" />
        {/* Dark emerald radial center left */}
        <div className="absolute top-1/3 -left-64 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-emerald-950/15 via-emerald-900/10 to-transparent blur-[140px]" />
        {/* Soft SVG Noise Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay">
          <filter id="atlasNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#atlasNoise)" />
        </svg>
      </div>

      {/* 2. Desktop Sidebar */}
      <div className="relative z-10">
        <Sidebar />
      </div>

      {/* 3. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 pb-20 lg:pb-0">
        <Header />

        <main className="flex-1">
          {!splashDone ? (
            <SplashScreen
              onFinish={() => setSplashDone(true)}
              streak={profile?.currentStreak || 14}
            />
          ) : showOnboarding ? (
            <AtlasOnboarding
              onFinishOnboarding={() => {
                setShowOnboarding(false);
                fetchState();
              }}
            />
          ) : isLoading ? (
            <LoadingScreen
              message="Loading ATLAS OS..."
              streak={profile?.currentStreak || 14}
            />
          ) : (
            renderActiveView()
          )}
        </main>
      </div>

      {/* 4. Mobile Navigation & Drawer */}
      <MobileBottomNav onOpenMenu={() => setMobileDrawerOpen(true)} />
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* 5. Modals */}
      <CommandPaletteModal />
      <MissionCompleteModal />
      <LevelUpModal />
      <ProjectDetailsModal />
      <InstallPwaModal />
    </div>
  );
}
