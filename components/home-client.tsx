"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/landing-page";
import DashboardPage from "@/components/dashboard-page";

export default function HomeClient() {
  const [isInApp, setIsInApp] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isDarkMode = false;

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("app") === "true") {
        setIsInApp(true);
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#042F1A]" />
          <p className="text-sm text-[#042F1A] font-medium font-sans">Loading Postrick...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "bg-[#02180c] text-[#FAF6EE] dark" : "bg-[#FAF6EE] text-[#042F1A]"} min-h-screen transition-colors duration-300`}>
      {isInApp ? (
        <DashboardPage 
          onExitApp={() => {
            setIsInApp(false);
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.delete("app");
              window.history.replaceState({}, "", url.pathname);
            }
          }} 
          isDarkMode={isDarkMode} 
        />
      ) : (
        <LandingPage 
          onEnterApp={() => {
            setIsInApp(true);
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.set("app", "true");
              window.history.replaceState({}, "", url.toString());
            }
          }} 
          isDarkMode={isDarkMode} 
        />
      )}
    </div>
  );
}
