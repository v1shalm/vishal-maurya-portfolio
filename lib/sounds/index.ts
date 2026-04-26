import { defineSound, setMasterVolume } from "@web-kits/audio";
import type { SoundDefinition } from "@web-kits/audio";
import * as playful from "./playful";

// Confetti burst — designed for the easter egg. Six stacked layers:
// (1) a low pop with FM for the "burst"; (2-5) an ascending C major
// arpeggio (C-E-G-C in two octaves) so each layer lands like a piece
// of confetti hitting the ground; (6) a high sparkle on top for the
// shimmer. Decays are short so it reads as celebratory, not musical.
const confettiBurst: SoundDefinition = {
  layers: [
    // 1. The pop — low body of the burst
    {
      source: {
        type: "sine",
        frequency: { start: 700, end: 140 },
        fm: { ratio: 0.5, depth: 60 },
      },
      envelope: { attack: 0, decay: 0.1, sustain: 0, release: 0.04 },
      gain: 0.32,
    },
    // 2-5. Ascending arpeggio cascade — each "piece" lands one beat later
    {
      source: { type: "sine", frequency: { start: 392, end: 523 } }, // G4 → C5
      envelope: { attack: 0, decay: 0.16, sustain: 0.04, release: 0.06 },
      delay: 0.04,
      gain: 0.2,
    },
    {
      source: { type: "sine", frequency: { start: 523, end: 659 } }, // C5 → E5
      envelope: { attack: 0, decay: 0.16, sustain: 0.04, release: 0.06 },
      delay: 0.12,
      gain: 0.18,
    },
    {
      source: { type: "sine", frequency: { start: 659, end: 880 } }, // E5 → A5
      envelope: { attack: 0, decay: 0.18, sustain: 0.03, release: 0.07 },
      delay: 0.2,
      gain: 0.16,
    },
    {
      source: { type: "sine", frequency: { start: 880, end: 1318 } }, // A5 → E6
      envelope: { attack: 0, decay: 0.2, sustain: 0.02, release: 0.08 },
      delay: 0.28,
      gain: 0.14,
    },
    // 6. Sparkle — high glitter that lands after the arpeggio
    {
      source: { type: "triangle", frequency: { start: 2200, end: 3400 } },
      envelope: { attack: 0, decay: 0.09, sustain: 0, release: 0.04 },
      delay: 0.34,
      gain: 0.1,
    },
  ],
};

/**
 * Site-wide sound surface. Maps semantic names to the Playful patch from
 * the @web-kits/audio registry. Intentionally narrow — sounds only fire
 * at moments where audio rewards an action (palette open/close/run, case
 * study tab switch, copy confirmation). No hover sounds, no per-keystroke
 * feedback. Restraint is the design.
 */
type SoundKey =
  | "paletteOpen" // command palette opens (⌘K or click)
  | "paletteClose" // palette closes
  | "paletteRun" // user activates an item (Enter / click)
  | "tabSwitch" // case study device tab change
  | "copy" // copy email confirmation
  | "success" // ascending chime for milestones
  | "confetti"; // pop + arpeggio + sparkle (easter egg)

let cache: Partial<Record<SoundKey, () => void>> | null = null;
let primed = false;

function init() {
  setMasterVolume(0.55); // gentle global trim so the patch sits low
  cache = {
    paletteOpen: defineSound(playful.expand),
    paletteClose: defineSound(playful.collapse),
    paletteRun: defineSound(playful.tap),
    tabSwitch: defineSound(playful.tabSwitch),
    copy: defineSound(playful.copy),
    success: defineSound(playful.success),
    confetti: defineSound(confettiBurst),
  };
  primed = true;
}

function shouldPlay() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  return true;
}

/**
 * Play a named sound. No-ops on the server, when audio is blocked, or
 * when the user prefers reduced motion. Lazy-creates the audio context
 * on first call so it's bound to a real user gesture.
 */
export function play(name: SoundKey) {
  if (!shouldPlay()) return;
  try {
    if (!primed) init();
    cache?.[name]?.();
  } catch {
    // AudioContext can refuse to start in some embedded contexts —
    // failing silently here is preferable to crashing the UI.
  }
}
