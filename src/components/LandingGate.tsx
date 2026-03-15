"use client";

import { useState } from "react";
import LandingScreen from "./LandingScreen";

export default function LandingGate({ children }: { children: React.ReactNode }) {
  const [showLanding, setShowLanding] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowLanding(false);
      setIsExiting(false);
    }, 700);
  };

  return (
    <>
      {children}
      {showLanding && (
        <LandingScreen onEnter={handleEnter} isExiting={isExiting} />
      )}
    </>
  );
}
