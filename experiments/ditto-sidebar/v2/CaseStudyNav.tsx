"use client";

import { useEffect, useState } from "react";
import type { CaseSection } from "@/lib/works";

/**
 * v2: Same Ditto-style sidebar geometry and motion, restyled to fit
 * the portfolio's palette and edge language.
 *
 * Differences from v1:
 * - Spine fill switched from cream `#ECE9E5` to the portfolio's
 *   `--color-bg-elevated` so it sits naturally on white pages.
 * - Active tile uses portfolio palette (magenta primary, yellow / ink
 *   for accents) instead of Ditto's per-step colors.
 * - Active dot is now a square (matches the portfolio's
 *   sharp-cornered hero block / button language) instead of a circle.
 * - Label font size uses the portfolio's section-header weights.
 *
 * Geometry, branch SVGs, and motion timings are unchanged so v1 ↔ v2
 * comparisons stay 1:1 visually except for the styling.
 */

// Portfolio palette mapped onto Ditto's 7 step slots.
const STEP_COLORS = [
  "#f91ca9", // magenta primary
  "#fdf004", // yellow
  "#0a0a0a", // ink
  "#f91ca9",
  "#fdf004",
  "#0a0a0a",
  "#f91ca9",
];

const SPINE_FILL = "oklch(0.96 0.002 260)"; // --color-bg-elevated
const PAGE_BG = "#ffffff"; // --color-bg
const MUTED = "oklch(0.55 0.004 260)"; // --color-muted

const EASE_LINK = "cubic-bezier(.23, 1, .32, 1)";
const EASE_BRANCH = "cubic-bezier(.165, .84, .44, 1)";

const BRANCH_HEIGHT_ACTIVE = "clamp(30px, 13vh, 116px)";

const BRANCH_TOP_PATH =
  "M58.317 0.98819C58.317 91.8255 80.5983 99.6376 80.5983 132.244L0.598267 132.244C0.598267 99.6376 22.8795 91.8255 22.8795 0.98819L58.317 0.98819Z";

const BRANCH_BOTTOM_PATH =
  "M22.8795 132C22.8795 41.1626 0.59828 33.3506 0.598282 0.743893L80.5983 0.743896C80.5983 33.3506 58.3171 41.1627 58.3171 132L22.8795 132Z";

export function CaseStudyNav({ sections }: { sections: CaseSection[] }) {
  const items = sections.map((s, i) => ({
    id: `section-${i}`,
    label: s.label,
    color: STEP_COLORS[i % STEP_COLORS.length],
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
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Case study contents"
      style={{
        position: "relative",
        width: 40,
        height: "85vh",
        paddingTop: "6vh",
        paddingBottom: "6vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        background: SPINE_FILL,
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
      }}
    >
      <style>{`
        .ditto-v2-link::before {
          content: "";
          position: absolute;
          inset: -12px -4px;
          min-width: 40px;
          min-height: 40px;
        }
        .ditto-v2-link:active {
          transform: scale(0.96);
        }
        .ditto-v2-text:active {
          transform: translateY(-50%) scale(0.96);
        }
      `}</style>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <StickyItem
            key={item.id}
            id={item.id}
            label={item.label}
            color={item.color}
            isActive={isActive}
          />
        );
      })}
    </nav>
  );
}

function StickyItem({
  id,
  label,
  color,
  isActive,
}: {
  id: string;
  label: string;
  color: string;
  isActive: boolean;
}) {
  // Inner mark contrasts against the active tile. On magenta or yellow
  // we use ink; on the ink-on-ink case we use white.
  const innerColor = color === "#0a0a0a" ? "#ffffff" : "#0a0a0a";

  return (
    <div
      style={{
        position: "relative",
        paddingTop: "1vh",
        paddingBottom: "1vh",
      }}
    >
      <BranchWrap shape="top" expanded={isActive} />

      {/* Mirror v1's structure exactly: an <a> with width/height that
         transitions, containing an SVG circle that fills the link.
         The only v2 difference is the SVG <rect> instead of <circle>
         so the dot is square (matches portfolio hero-block edges). */}
      <a
        href={`#${id}`}
        className="ditto-v2-link"
        style={{
          display: "block",
          position: "relative",
          width: isActive ? 80 : 40,
          height: isActive ? 80 : 17,
          padding: isActive ? 12 : 0,
          background: isActive ? color : SPINE_FILL,
          color: isActive ? innerColor : MUTED,
          transitionProperty:
            "width, height, background-color, padding, transform",
          transitionDuration: ".6s",
          transitionTimingFunction: EASE_LINK,
          boxSizing: "border-box",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 17 17"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={{ display: "block" }}
        >
          <rect x="0" y="0" width="17" height="17" fill="currentColor" />
        </svg>
      </a>

      <BranchWrap shape="bottom" expanded={isActive} />

      <a
        href={`#${id}`}
        className="ditto-v2-text"
        style={{
          position: "absolute",
          top: "50%",
          left: isActive ? 120 : 80,
          transform: "translateY(-50%)",
          color: isActive ? "#0a0a0a" : MUTED,
          fontWeight: isActive ? 700 : 500,
          fontSize: isActive ? "1.625rem" : "1rem",
          letterSpacing: isActive ? "-0.02em" : "0",
          lineHeight: 1,
          whiteSpace: "nowrap",
          textDecoration: "none",
          fontFamily: "var(--font-sans)",
          transitionProperty: "left, color, font-size, transform",
          transitionDuration: ".4s, .2s, .2s, .15s",
          transitionTimingFunction: `${EASE_BRANCH}, linear, linear, ${EASE_LINK}`,
          padding: "8px 12px",
          margin: "-8px -12px",
        }}
      >
        {label}
      </a>
    </div>
  );
}

function BranchWrap({
  shape,
  expanded,
}: {
  shape: "top" | "bottom";
  expanded: boolean;
}) {
  const d = shape === "top" ? BRANCH_TOP_PATH : BRANCH_BOTTOM_PATH;
  return (
    <div
      aria-hidden
      style={{
        display: "block",
        width: "100%",
        height: expanded ? BRANCH_HEIGHT_ACTIVE : 0,
        overflow: "hidden",
        transition: `height .4s ${EASE_BRANCH}`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={shape === "top" ? "0 0 81 133" : "0 0 81 132"}
        preserveAspectRatio="none"
        fill="none"
        style={{ display: "block" }}
      >
        <path d={d} fill={SPINE_FILL} />
      </svg>
    </div>
  );
}
