"use client";

import Image from "next/image";
import { useCallback } from "react";

interface LandingScreenProps {
  onEnter: () => void;
  isExiting: boolean;
}

export default function LandingScreen({ onEnter, isExiting }: LandingScreenProps) {
  const handleClick = useCallback(() => {
    onEnter();
  }, [onEnter]);

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black
        transition-opacity duration-700 ease-out
        ${isExiting ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      aria-hidden={isExiting}
    >
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8">
        <div className="relative flex-1 flex items-center justify-center w-full max-w-4xl">
          <Image
            src="/KDIMAGE.png"
            alt=""
            width={800}
            height={600}
            className="object-contain max-h-[70vh] w-auto select-none"
            priority
            unoptimized
          />
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="
            mt-8 px-10 py-4 text-xl font-bold tracking-wider text-white uppercase
            rounded-lg transition-all duration-300
            hover:scale-105 hover:brightness-110
            focus:outline-none focus:ring-4 focus:ring-[#E07A5F]/50 focus:ring-offset-2 focus:ring-offset-black
            animate-landing-pulse
          "
          style={{ backgroundColor: "#E07A5F" }}
        >
          ENTER AT OWN RISK
        </button>
      </div>
    </div>
  );
}
