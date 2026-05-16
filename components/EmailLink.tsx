"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** The raw email address. Used for both clipboard and mailto fallback. */
  email: string;
  /** What to display. Defaults to the email itself. */
  display?: React.ReactNode;
  className?: string;
  /** Fires after a successful clipboard write. Used by the footer to
   *  trigger a confetti burst when a visitor copies the address. */
  onCopied?: () => void;
};

/**
 * Email link that copies to the clipboard on click (instead of firing
 * mailto), with a small "Copied" flash. Modifier-click / middle-click fall
 * through to the native mailto so power users can still open a mail client.
 */
export function EmailLink({ email, display, className = "", onCopied }: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  async function handle(e: React.MouseEvent<HTMLAnchorElement>) {
    // Preserve power-user escape hatches
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      // Tactile confirmation on devices that support it. Android + Chrome honors
      // this; iOS Safari silently ignores. Skip for users who prefer reduced motion.
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!reduced && typeof navigator.vibrate === "function") {
        navigator.vibrate(15);
      }
      onCopied?.();
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <span className="inline-flex items-baseline gap-2">
      <a
        href={`mailto:${email}`}
        onClick={handle}
        data-cursor="copy"
        data-cursor-label="Copy address"
        className={className}
      >
        {display ?? email}
      </a>
      <span
        aria-live="polite"
        className="select-none text-[11.5px] transition-opacity duration-200"
        style={{
          opacity: copied ? 1 : 0,
          color: "var(--color-accent)",
        }}
      >
        Copied
      </span>
    </span>
  );
}
