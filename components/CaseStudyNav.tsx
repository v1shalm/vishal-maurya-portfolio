"use client";

import { useEffect, useState } from "react";
import type { CaseSection } from "@/lib/works";

type NavItem = { id: string; label: string; kicker: string };

export function CaseStudyNav({ sections }: { sections: CaseSection[] }) {
  const items: NavItem[] = sections.map((s) => ({
    id: `section-${s.kicker}`,
    label: s.label,
    kicker: s.kicker,
  }));

  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio ||
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study contents">
      <span className="text-[10.5px] uppercase tracking-[0.2em] text-muted">
        Contents
      </span>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`group relative flex items-baseline gap-3 text-[13px] leading-[1.35] transition-colors duration-300 ${
                  isActive
                    ? "text-ink"
                    : "text-muted hover:text-ink-soft"
                }`}
              >
                <span className="inline-block w-5 shrink-0 font-sans tabular-nums text-[10.5px] text-muted">
                  {item.kicker}
                </span>
                <span className="relative">{item.label}</span>
                <span
                  aria-hidden
                  className={`absolute -left-4 top-[0.55em] inline-block h-px bg-ink transition-[width,opacity] duration-300 ease-out ${
                    isActive ? "w-2 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
