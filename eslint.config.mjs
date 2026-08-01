"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Monitor,
  Shield,
  Zap,
} from "lucide-react";
import { AtlasLogo } from "@/components/brand/AtlasLogo";
import { useAtlasStore } from "@/store/atlas-store";

let deferredPrompt: any = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: any) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

export function InstallPwaModal() {
  const { installModalOpen, setInstallModalOpen, profile } = useAtlasStore();
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installStatus, setInstallStatus] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");
      setIsStandalone(Boolean(standalone));

      const ios =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(Boolean(ios));
    }
  }, [installModalOpen]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setInstallStatus("ATLAS OS installed successfully to your device!");
          deferredPrompt = null;
          setTimeout(() => setInstallModalOpen(false), 2500);
        } else {
          setInstallStatus("Installation canceled.");
        }
      } catch (err: any) {
        setInstallStatus("Error during installation prompt.");
      }
    } else {
      setInstallStatus(
        isIOS
          ? "Follow the iOS Safari instructions below to install."
          : "Your browser does not support automatic install prompts. Use your browser menu (Install / Add to Home Screen)."
      );
    }
  };

  if (!installModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-lg bg-[#121215] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-left"
        >
          {/* Subtle glow background */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={() => setInstallModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
            <AtlasLogo size="lg" variant="evolving" streak={profile.currentStreak} animated />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
                <Zap className="w-3 h-3" /> NATIVE PWA EXPERIENCE
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Install ATLAS OS
              </h3>
              <p className="text-xs text-zinc-400">
                Install as a standalone native app on your iOS, Android, macOS, or Windows device.
              </p>
            </div>
          </div>

          {/* Standalone status check */}
          {isStandalone ? (
            <div className="my-6 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
              <div>
                <div className="font-extrabold text-sm">
                  ATLAS OS is already installed!
                </div>
                <div className="text-xs text-emerald-300/80 mt-0.5">
                  You are currently running in standalone native mode.
                </div>
              </div>
            </div>
          ) : (
            <div className="my-6 space-y-6">
              {/* 3 Native Upsides */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <div className="text-xs font-bold text-white">
                    Dock & Desktop
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Dedicated app icon on iOS, Android & macOS
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <div className="text-xs font-bold text-white">
                    Fullscreen Focus
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Zero browser URL bar or distractions
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <div className="text-xs font-bold text-white">
                    Offline Caching
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Fast instant loading & permanent PostgreSQL
                  </div>
                </div>
              </div>

              {/* 1-Click Install Button if supported */}
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-black font-black text-sm uppercase tracking-widest transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Install ATLAS OS Now</span>
                </button>

                {installStatus && (
                  <div className="text-xs font-semibold text-emerald-400 text-center">
                    {installStatus}
                  </div>
                )}
              </div>

              {/* Step-by-step instructions for iOS Safari / Safari / Chrome */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  {isIOS
                    ? "iOS Safari Installation Instructions:"
                    : "Browser Manual Install Guide:"}
                </div>

                {isIOS ? (
                  <ol className="space-y-2 text-xs text-zinc-300 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                        1
                      </span>
                      <span>
                        Tap the <strong className="text-white">Share icon</strong> (<Share2 className="w-3.5 h-3.5 inline text-blue-400" />) in Safari's bottom toolbar.
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                        2
                      </span>
                      <span>
                        Scroll down and select <strong className="text-white">"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-emerald-400" />).
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                        3
                      </span>
                      <span>
                        Tap <strong className="text-white">"Add"</strong> in the top right corner.
                      </span>
                    </li>
                  </ol>
                ) : (
                  <ol className="space-y-2 text-xs text-zinc-300 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                        1
                      </span>
                      <span>
                        In Chrome / Edge, click the <strong className="text-white">Install icon</strong> (<Download className="w-3.5 h-3.5 inline text-emerald-400" />) in the right side of your address bar.
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                        2
                      </span>
                      <span>
                        Or click the three-dot browser menu and select <strong className="text-white">"Install ATLAS OS..."</strong> or <strong className="text-white">"Cast/Save → Create Shortcut..."</strong>.
                      </span>
                    </li>
                  </ol>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>ATLAS OS • STANDALONE NATIVE PWA</span>
            <button
              onClick={() => setInstallModalOpen(false)}
              className="font-bold text-zinc-300 hover:text-white"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
