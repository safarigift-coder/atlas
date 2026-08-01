@import "tailwindcss";

:root {
  /* ATLAS OS Official Brand Design System Variables */
  --atlas-bg-primary: #09090b;
  --atlas-bg-secondary: #121215;
  --atlas-surface: #18181b;
  --atlas-card: #121215;
  --atlas-border: #27272a;
  --atlas-text-primary: #f4f4f5;
  --atlas-text-secondary: #a1a1aa;
  --atlas-text-muted: #71717a;
  --atlas-accent: #10b981;
  --atlas-focus: #3b82f6;
  --atlas-warning: #f59e0b;
  --atlas-danger: #ef4444;
  --atlas-success: #10b981;
  --atlas-xp: #f59e0b;
  --atlas-streak: #f97316;
  --atlas-legacy: #a855f7;
  --atlas-futureroom: #06b6d4;
  --atlas-promise: #10b981;
  --atlas-mirror: #6366f1;
}

@layer utilities {
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
}

@keyframes atlasShimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes atlasSunrise {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.45;
  }
  50% {
    transform: rotate(180deg) scale(1.15);
    opacity: 0.75;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 0.45;
  }
}

@keyframes atlasGlowPulse {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 24px rgba(16, 185, 129, 0.85));
  }
}

.animate-atlas-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: atlasShimmer 3s infinite linear;
}

.animate-atlas-sunrise {
  animation: atlasSunrise 12s infinite ease-in-out;
}

.animate-atlas-glow {
  animation: atlasGlowPulse 4s infinite ease-in-out;
}

body {
  background-color: var(--atlas-bg-primary);
  color: var(--atlas-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  overflow-x: hidden;
}

::selection {
  background-color: rgba(16, 185, 129, 0.25);
  color: #10b981;
}

/* Custom dark scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #09090b;
}

::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
