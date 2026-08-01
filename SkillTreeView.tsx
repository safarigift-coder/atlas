import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATLAS OS — Personal Creative Operating System",
  description: "Build. Create. Grow. Every Single Day. Personal OS for Creative Entrepreneurs.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ATLAS OS",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="bg-[#09090B] text-zinc-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-400 min-h-screen">
        {children}
      </body>
    </html>
  );
}
