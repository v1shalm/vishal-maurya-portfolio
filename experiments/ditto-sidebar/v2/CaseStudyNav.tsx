"use client";

import { useEffect, useState } from "react";
import type { CaseSection } from "@/lib/works";

/**
 * v2: byte-for-byte identical to v1 except for two things —
 *
 *   1. STEP_COLORS — same 7 hues but brightened a step or two so they
 *      read as more saturated / closer to the portfolio's yellow,
 *      magenta, and ink language while keeping the per-step rhythm
 *      Ditto established.
 *   2. Active link gets a soft pill shadow so the tile lifts off the
 *      cream spine, instead of sitting flat against it.
 *
 * Geometry, branch SVGs, dot shape, motion timings, and typography are
 * unchanged so v1 ↔ v2 comparisons stay 1:1 visually.
 */

// One palette, seven hues. All seven colors are locked to the same
// OKLCH lightness and chroma as our primary magenta `#f91ca9`
// (~L 0.65, C 0.27); only the hue varies so the steps stay
// identifiable as gold / violet / green / sky / orange / yellow /
// pink without one color screaming louder than the others.
const STEP_COLORS = [
  "oklch(0.65 0.27 70)", // warm gold-orange (was brown)
  "oklch(0.65 0.27 310)", // violet (was purple)
  "oklch(0.65 0.27 145)", // green
  "oklch(0.65 0.27 230)", // sky blue
  "oklch(0.65 0.27 30)", // orange (was red-orange)
  "oklch(0.65 0.27 95)", // yellow-lime (was olive)
  "oklch(0.65 0.27 358)", // pink (matches primary magenta)
];

const SPINE_FILL = "#ECE9E5";
const PAGE_BG = "#f7f5f3";
const BEIGE = "#dcd8cf";

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
        width: 40,
        height: "85vh",
        paddingTop: "6vh",
        paddingBottom: "6vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundImage: `linear-gradient(180deg, ${PAGE_BG}, ${SPINE_FILL} 5%, ${SPINE_FILL} 90%, ${PAGE_BG})`,
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
  return (
    <div
      style={{
        position: "relative",
        paddingTop: "1vh",
        paddingBottom: "1vh",
      }}
    >
      <BranchWrap shape="top" expanded={isActive} />

      <a
        href={`#${id}`}
        className="ditto-v2-link"
        style={{
          display: "block",
          position: "relative",
          width: isActive ? 80 : 40,
          height: isActive ? 80 : 17,
          padding: isActive ? 12 : 0,
          // Active tile: a subtle vertical gradient on top of the
          // base color so the surface reads as lit from above rather
          // than a flat block. Inactive: plain cream so the spine
          // stays uniform.
          background: isActive
            ? `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.10)), ${color}`
            : SPINE_FILL,
          color: isActive ? "#000" : color,
          transitionProperty:
            "width, height, background-color, padding, transform, box-shadow",
          transitionDuration: ".6s",
          transitionTimingFunction: EASE_LINK,
          boxSizing: "border-box",
          // Active tile lift. Layered:
          //   • 1px inset top highlight — fake printed-sticker rim
          //     under a top light
          //   • 1px inset bottom shadow — bottom of the tile reads
          //     darker than the lit top
          //   • tight outer 1-2px shadow — crispness against spine
          //   • wide tinted cast — color-aware lift off the cream
          // Inactive: no shadow so the spine reads as a flat ribbon.
          boxShadow: isActive
            ? `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.10), 0 14px 28px -14px ${color}80`
            : "none",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 17 17"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={{ display: "block", overflow: "visible" }}
        >
          {isActive ? (
            <>
              <defs>
                <radialGradient
                  id={`dot-grad-${id}`}
                  cx="0.42"
                  cy="0.36"
                  r="0.85"
                >
                  {/* Slight top-left lift on the dot so it reads as
                     spherical, with the darkest point bottom-right. */}
                  <stop offset="0%" stopColor="#3a3a3a" />
                  <stop offset="55%" stopColor="#0a0a0a" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
                <radialGradient
                  id={`dot-spec-${id}`}
                  cx="0.32"
                  cy="0.28"
                  r="0.32"
                >
                  {/* Tight specular highlight, very subtle. */}
                  <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              {/* Soft contact shadow under the dot for a sticker-on-
                 a-sticker feel. */}
              <ellipse
                cx="8.5"
                cy="14.5"
                rx="6"
                ry="1.2"
                fill="rgba(0,0,0,0.18)"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="8.5"
                fill={`url(#dot-grad-${id})`}
              />
              {/* Faint inner rim light — just on the upper edge. */}
              <circle
                cx="8.5"
                cy="8.5"
                r="8"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.4"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="8.5"
                fill={`url(#dot-spec-${id})`}
              />
            </>
          ) : (
            <circle cx="8.5" cy="8.5" r="8.5" fill="currentColor" />
          )}
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
          color: isActive ? "#000" : BEIGE,
          fontWeight: isActive ? 700 : 400,
          fontSize: isActive ? "1.625rem" : "1rem",
          lineHeight: 1,
          whiteSpace: "nowrap",
          textDecoration: "none",
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
