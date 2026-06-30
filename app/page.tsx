"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/landing-page";
import DashboardPage from "@/components/dashboard-page";

export default function Home() {
  const [isInApp, setIsInApp] = useState(false);
  const isDarkMode = false;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("app") === "true") {
        setIsInApp(true);
      }
    }
  }, []);

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

