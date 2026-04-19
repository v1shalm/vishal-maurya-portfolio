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
      <ul className="flex flex-col">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="group flex items-start gap-4 py-[5px]"
              >
                <span
                  aria-hidden
                  className="relative mt-[0.7em] inline-block h-px w-7 shrink-0"
                >
                  <span
                    className="absolute inset-y-0 left-0 block transition-[width,background-color,height,top] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      width: isActive ? "100%" : "50%",
                      height: isActive ? "1.5px" : "1px",
                      top: isActive ? "-0.25px" : "0",
                      backgroundColor: isActive
                        ? "var(--color-ink)"
                        : "var(--color-line)",
                    }}
                  />
                </span>
                <span
                  className={`text-[14px] leading-[1.4] text-pretty transition-colors duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isActive
                      ? "font-medium text-ink"
                      : "text-muted group-hover:text-ink-soft"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
