"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type CursorKind = "view-case-study" | "email" | "external" | "copy";

type Preset = {
  label: string;
  icon: ReactNode;
};

const presets: Record<CursorKind, Preset> = {
  "view-case-study": { label: "View case study", icon: <EyeIcon /> },
  email: { label: "Send email", icon: <MailIcon /> },
  external: { label: "Open external", icon: <ExternalIcon /> },
  copy: { label: "Copy", icon: <CopyIcon /> },
};

/**
 * Global cursor follower. On hover over `[data-cursor="<kind>"]` elements,
 * the native cursor hides and a contextual pill follows the pointer.
 * Touch / no-hover devices: completely inert.
 */
export function SmartCursor() {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<{ kind: CursorKind | null }>({
    kind: null,
  });
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setSupported(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSupported(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!supported) return;

    const onMove = (e: MouseEvent) => {
      const pill = pillRef.current;
      if (pill) {
        pill.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("[data-cursor]") as HTMLElement | null;
      const kind = (anchor?.dataset.cursor ?? null) as CursorKind | null;

      setState((prev) => (prev.kind === kind ? prev : { kind }));
    };

    const onLeave = () => setState({ kind: null });

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [supported]);

  if (!supported) return null;

  const active = state.kind !== null && presets[state.kind];

  return (
    <div
      ref={pillRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] will-change-transform"
      style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
    >
      <div
        className="inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-3.5 py-2 text-white shadow-[0_8px_24px_-12px_rgba(20,15,10,0.35)] transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: "var(--color-accent)",
          opacity: active ? 1 : 0,
          scale: active ? "1" : "0.8",
        }}
      >
        {state.kind && presets[state.kind].icon}
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] leading-none whitespace-nowrap">
          {state.kind ? presets[state.kind].label : ""}
        </span>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4h6v6" />
      <path d="M20 4L10 14" />
      <path d="M20 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h4" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </svg>
  );
}
