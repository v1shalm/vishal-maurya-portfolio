"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { links } from "@/lib/links";
import {
  isSoundEnabled,
  setSoundEnabled,
  playForce,
} from "@/lib/sounds";

type Item = {
  href: string;
  label: string;
  external?: boolean;
};

const items: Item[] = [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/pixels", label: "Pixels" },
  { href: "/playground", label: "Playground" },
  { href: links.email, label: "Email me", external: true },
  { href: links.linkedin, label: "LinkedIn", external: true },
  { href: links.resume, label: "Resume", external: true },
];

/**
 * Mobile-only nav menu that replaces the Let's Connect CTA on small
 * viewports. A bold yellow pill toggles to ink "Close" and reveals an
 * ink-coloured dropdown card with all primary destinations. Closes on
 * outside click, Esc, or after picking a destination.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [soundsOn, setSoundsOn] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hydrate the toggle from localStorage and stay in sync if another
  // surface (e.g. command palette on a tablet) flips the preference.
  useEffect(() => {
    setSoundsOn(isSoundEnabled());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setSoundsOn(typeof detail === "boolean" ? detail : isSoundEnabled());
    };
    window.addEventListener("sound:toggled", onChange);
    return () => window.removeEventListener("sound:toggled", onChange);
  }, []);

  const toggleSounds = () => {
    const next = !soundsOn;
    setSoundEnabled(next);
    // Tactile click on every flip; success chime only when enabling.
    playForce("wheelTickFast");
    if (next) playForce("success");
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer as EventListener);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer as EventListener);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Trigger keeps the yellow shell in both states; only the inset shadow
  // recipe changes so an open trigger reads as "pressed in" rather than
  // changing colour, which kept the menu feeling tied to the brand pill.
  const triggerShadowClosed = [
    "inset 0 -3px 6px rgba(0, 0, 0, 0.12)",
    "inset 0 1px 0 rgba(255, 255, 255, 0.45)",
  ].join(", ");
  const triggerShadowOpen = [
    "inset 0 3px 6px rgba(132, 121, 4, 0.55)",
    "inset 0 1px 0 rgba(150, 138, 0, 0.5)",
    "inset 0 -1px 0 rgba(255, 250, 200, 0.6)",
  ].join(", ");

  return (
    <div ref={containerRef} className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-yellow-edge)] bg-[color:var(--color-yellow)] px-4 py-2 text-[14px] font-bold tracking-tight text-ink transition-[box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.97]"
        style={{ boxShadow: open ? triggerShadowOpen : triggerShadowClosed }}
      >
        <span>{open ? "Close" : "Menu"}</span>
        <span aria-hidden className="relative block h-3 w-3">
          <span
            className="absolute left-0 top-1/2 block h-[1.5px] w-3 rounded-full bg-current transition-transform duration-200 ease-out"
            style={{
              transform: open
                ? "translateY(-50%) rotate(45deg)"
                : "translateY(-3px) rotate(0)",
            }}
          />
          <span
            className="absolute left-0 top-1/2 block h-[1.5px] w-3 rounded-full bg-current transition-transform duration-200 ease-out"
            style={{
              transform: open
                ? "translateY(-50%) rotate(-45deg)"
                : "translateY(2px) rotate(0)",
            }}
          />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Site navigation"
          className="mobile-nav-panel absolute right-0 top-[calc(100%+10px)] z-[90] w-[260px] origin-top-right rounded-2xl border border-[color:var(--color-yellow-edge)] p-1 shadow-[0_24px_48px_-16px_rgba(132,121,4,0.45),0_8px_16px_-8px_rgba(12,12,16,0.18)]"
          style={{
            backgroundColor: "var(--color-yellow)",
            boxShadow:
              "0 24px 48px -16px rgba(132,121,4,0.45), 0 8px 16px -8px rgba(12,12,16,0.18), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -3px 6px rgba(132,121,4,0.18)",
          }}
        >
          <ul className="flex flex-col">
            {items.map((item) => {
              const className =
                "mobile-nav-item block rounded-xl px-4 py-3 text-[17px] font-bold tracking-tight text-ink transition-[background-color,color,transform] duration-150 ease-out hover:bg-[color:var(--color-y-ink)] hover:text-[color:var(--color-yellow)] active:scale-[0.97] focus-visible:outline-none focus-visible:bg-[color:var(--color-y-ink)] focus-visible:text-[color:var(--color-yellow)]";
              return (
                <li key={item.href} role="none">
                  {item.external ? (
                    <a
                      role="menuitem"
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={() => setOpen(false)}
                      className={className}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      role="menuitem"
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={className}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
            <li role="none">
              <button
                role="menuitem"
                type="button"
                onClick={toggleSounds}
                aria-pressed={soundsOn}
                className="mobile-nav-item flex w-full items-center justify-between rounded-xl px-4 py-3 text-[17px] font-bold tracking-tight text-ink transition-[background-color,color,transform] duration-150 ease-out hover:bg-[color:var(--color-y-ink)] hover:text-[color:var(--color-yellow)] active:scale-[0.97] focus-visible:outline-none focus-visible:bg-[color:var(--color-y-ink)] focus-visible:text-[color:var(--color-yellow)]"
              >
                <span>Sounds</span>
                <NavSoundToggle on={soundsOn} />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Compact sound toggle pill rendered at the right edge of the mobile
 * nav's Sounds row. Mirrors the command palette toggle's styling
 * (yellow track when on, slate when off, dark thumb that slides) but
 * sized down to read inline next to the row label.
 */
function NavSoundToggle({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex shrink-0 items-center"
      style={{ width: 36, height: 20 }}
    >
      <span
        className="relative h-full w-full rounded-full"
        style={{
          background: on
            ? "linear-gradient(180deg, #fff486 0%, #fdf004 38%, #ddc806 100%)"
            : "linear-gradient(180deg, #d8d8dc 0%, #c4c4c9 50%, #a8a8af 100%)",
          boxShadow: on
            ? "0 1.5px 0 rgba(0,0,0,0.15) inset, 0 -1px 0 rgba(255,255,255,0.55) inset, 0 0 0 1px rgba(0,0,0,0.10)"
            : "0 1.5px 0 rgba(0,0,0,0.10) inset, 0 -1px 0 rgba(255,255,255,0.45) inset, 0 0 0 1px rgba(0,0,0,0.08)",
          transition: "background 200ms ease-out, box-shadow 200ms ease-out",
        }}
      >
        <span
          className="pointer-events-none absolute left-1.5 right-1.5 top-[2px] h-[3px] rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0))",
            opacity: on ? 1 : 0.5,
          }}
        />
        <span
          className="absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full"
          style={{
            left: on ? "calc(100% - 17px)" : "3px",
            background: "#1a1810",
            boxShadow:
              "0 1.5px 3px rgba(0,0,0,0.30), 0 0 0 1px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.4)",
            transition: "left 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </span>
    </span>
  );
}
