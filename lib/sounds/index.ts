import { defineSound, setMasterVolume } from "@web-kits/audio";
import type { SoundDefinition } from "@web-kits/audio";
import * as playful from "./playful";

// Draggable scroller — mechanical jog-dial clicks. Each tick is a short
// noise-led transient with a square-wave body for a hard, plastic edge
// (vs. the sine-based playful patches used elsewhere on the site). Three
// velocity tiers; gain ramps down as velocity rises so fast flicks don't
// machine-gun the user.
const wheelTickSlow: SoundDefinition = {
  layers: [
    {
      source: { type: "square", frequency: { start: 220, end: 110 } },
      envelope: { attack: 0, decay: 0.025, sustain: 0, release: 0.012 },
      gain: 0.16,
    },
    {
      source: { type: "noise" },
      envelope: { attack: 0, decay: 0.018, sustain: 0, release: 0.01 },
      gain: 0.06,
    },
  ],
};
const wheelTickMid: SoundDefinition = {
  layers: [
    {
      source: { type: "square", frequency: { start: 320, end: 180 } },
      envelope: { attack: 0, decay: 0.018, sustain: 0, release: 0.008 },
      gain: 0.13,
    },
    {
      source: { type: "noise" },
      envelope: { attack: 0, decay: 0.014, sustain: 0, release: 0.008 },
      gain: 0.05,
    },
  ],
};
const wheelTickFast: SoundDefinition = {
  layers: [
    {
      source: { type: "square", frequency: { start: 480, end: 280 } },
      envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.006 },
      gain: 0.09,
    },
    {
      source: { type: "noise" },
      envelope: { attack: 0, decay: 0.01, sustain: 0, release: 0.006 },
      gain: 0.035,
    },
  ],
};
// Release: short noise sweep, like a wheel being let go.
const wheelRelease: SoundDefinition = {
  source: { type: "noise" },
  envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.03 },
  gain: 0.07,
};
// Settle: a final, slightly heavier mechanical click — the detent landing.
const wheelSettle: SoundDefinition = {
  layers: [
    {
      source: { type: "square", frequency: { start: 200, end: 90 } },
      envelope: { attack: 0, decay: 0.04, sustain: 0, release: 0.02 },
      gain: 0.18,
    },
    {
      source: { type: "noise" },
      envelope: { attack: 0, decay: 0.025, sustain: 0, release: 0.012 },
      gain: 0.08,
    },
  ],
};

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
 * at moments where audio rewards an action (palette, lightbox, transitions,
 * copy, easter egg). No hover sounds, no per-keystroke feedback. Sounds
 * are off by default; users opt in from the command palette.
 */
type SoundKey =
  | "paletteOpen" // command palette opens (⌘K or click)
  | "paletteClose" // palette closes
  | "paletteRun" // user activates an item (Enter / click)
  | "tabSwitch" // case study device tab change
  | "copy" // copy email confirmation
  | "success" // ascending chime for milestones
  | "confetti" // pop + arpeggio + sparkle (easter egg)
  | "lightboxOpen" // image lightbox opens
  | "lightboxClose" // image lightbox closes
  | "pageTransition" // case study / page enter via TransitionLink
  | "wheelTickSlow" // scroller: tick crossing at low velocity (~softer)
  | "wheelTickMid" // scroller: tick crossing at medium velocity
  | "wheelTickFast" // scroller: tick crossing at high velocity (~sharper)
  | "wheelRelease" // scroller: pointer released, inertia begins
  | "wheelSettle"; // scroller: snap spring completes

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
    lightboxOpen: defineSound(playful.pop),
    lightboxClose: defineSound(playful.collapse),
    pageTransition: defineSound(playful.swoosh),
    wheelTickSlow: defineSound(wheelTickSlow),
    wheelTickMid: defineSound(wheelTickMid),
    wheelTickFast: defineSound(wheelTickFast),
    wheelRelease: defineSound(wheelRelease),
    wheelSettle: defineSound(wheelSettle),
  };
  primed = true;
}

const SOUND_FLAG = "sound-enabled";

/** Returns true if the user has opted in to UI sounds. Defaults to false. */
export function isSoundEnabled() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SOUND_FLAG) === "1";
  } catch {
    return false;
  }
}

/** Persist the user's sound preference. */
export function setSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_FLAG, enabled ? "1" : "0");
    window.dispatchEvent(new CustomEvent("sound:toggled", { detail: enabled }));
  } catch {
    // localStorage can be unavailable in private mode / iframes.
  }
}

function shouldPlay() {
  if (typeof window === "undefined") return false;
  if (!isSoundEnabled()) return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  return true;
}

/**
 * Play a named sound. No-ops on the server, when sounds are off, when audio
 * is blocked, or when the user prefers reduced motion. Lazy-creates the
 * audio context on first call so it's bound to a real user gesture.
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

/**
 * Force-play a sound regardless of the global toggle. Used for the toggle's
 * own confirmation chime so the user hears feedback when they enable sounds.
 */
export function playForce(name: SoundKey) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  try {
    if (!primed) init();
    cache?.[name]?.();
  } catch {
    /* silent */
  }
}
