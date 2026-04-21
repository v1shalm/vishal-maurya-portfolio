"use client";

import { useSyncExternalStore } from "react";

/**
 * Reactive hook over `window.matchMedia`. Returns false on the server and
 * during initial hydration, then the real value on the client without
 * triggering the React 19.2 `set-state-in-effect` warning.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia(query).matches;
    },
    () => false,
  );
}

const noopUnsubscribe = () => () => {};

/**
 * Returns true on Apple platforms (Mac, iPhone, iPad). Returns false during
 * SSR and initial hydration, then the real value post-hydration.
 */
export function useIsApplePlatform(): boolean {
  return useSyncExternalStore(
    noopUnsubscribe,
    () => {
      if (typeof navigator === "undefined") return false;
      return /mac|iphone|ipad|ipod/i.test(
        navigator.platform || navigator.userAgent,
      );
    },
    () => false,
  );
}
