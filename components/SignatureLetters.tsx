"use client";

import { useRef } from "react";
import { Letters, type LettersHandle } from "@kumailnanji/letters";

/**
 * Handwritten "Vishal" signature that draws itself on first paint and replays
 * on hover. Uses the site's accent orange so it reads as a brand signoff.
 */
export function SignatureLetters({ className = "" }: { className?: string }) {
  const ref = useRef<LettersHandle>(null);

  return (
    <span
      role="img"
      aria-label="Vishal signature"
      onMouseEnter={() => ref.current?.replay()}
      className={`inline-block ${className}`.trim()}
      style={{ lineHeight: 0 }}
    >
      <Letters
        ref={ref}
        text="Vishal"
        color="#FF4A05"
        strokeWidth={2}
        autoPlay
        loop
        loopPauseMs={1200}
        className="block h-16 w-auto md:h-24"
        style={{ display: "block" }}
      />
    </span>
  );
}
