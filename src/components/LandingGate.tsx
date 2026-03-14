"use client";

import { useState, useEffect } from "react";
import LandingScreen from "./LandingScreen";

const STORAGE_KEY = "irb-landing-dismissed";

export default function LandingGate({ children }: { children: React.ReactNode }) {
  const [showLanding, setShowLanding] = useState<boolean | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    setShowLanding(!dismissed);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
    }
    setTimeout(() => {
      setShowLanding(false);
      setIsExiting(false);
    }, 700);
  };

  if (showLanding === null) {
    return (
      <>
        {children}
        <div className="fixed inset-0 z-[100] bg-black" aria-hidden />
      </>
    );
  }

  return (
    <>
      {children}
      {showLanding && (
        <LandingScreen onEnter={handleEnter} isExiting={isExiting} />
      )}
    </>
  );
}
