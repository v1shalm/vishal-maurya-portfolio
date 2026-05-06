"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Shape, SHAPE_LABEL, type ShapeKind } from "./Shapes";
import { play } from "@/lib/sounds";
import { useMediaQuery } from "@/lib/useMediaQuery";

const SHAPES: ShapeKind[] = [
  "diamond",
  "star",
  "circle",
  "heart",
  "flower",
  "square",
  "hexagon",
];

// Radial layout. The wheel is a vertical drum with its pivot on the
// LEFT (off-screen). Each row sits at an angular offset from the
// center axis; rows above center curve up-and-out-to-the-left, rows
// below curve down-and-out-to-the-left. Active row sits closest to
// the ruler/knob on the left.
const ROW_ANGLE_DEG = 16; // angular gap between adjacent rows
const ARC_RADIUS = 340; // smaller = more pronounced rightward bulge per row
const VISIBLE_RADIUS = 5;
const FRICTION = 0.94;
const SNAP_STIFFNESS = 220;
const SNAP_DAMPING = 30;
const SNAP_VELOCITY_THRESHOLD = 0.4;
const TICK_THROTTLE_MS = 28;
const DRAG_PX_PER_TICK = 96; // bigger drag distance per tick = more breathing room

type Phase = "idle" | "drag" | "inertia" | "snap";

export function Wheel() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startY: number;
    startOffset: number;
    samples: { t: number; y: number }[];
  } | null>(null);
  // offset is measured in "ticks * DRAG_PX_PER_TICK" — keeps math uniform.
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const lastTickIndexRef = useRef(0);
  const lastTickSoundAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const labelId = useId();

  const [activeIndex, setActiveIndex] = useState(0);

  // Apply transforms to all rendered rows + the active ruler tick.
  const applyTransforms = useCallback(() => {
    const wrapper = containerRef.current;
    if (!wrapper) return;
    const offset = offsetRef.current;

    // Sub-tick remainder in [-0.5, 0.5] — how far between two ticks we are.
    const remainderTicks =
      ((offset / DRAG_PX_PER_TICK) % 1 + 1) % 1;
    const subTick =
      remainderTicks > 0.5 ? remainderTicks - 1 : remainderTicks;

    // Position the ruler ticks (they share the same arc) and shape rows.
    const rows = wrapper.querySelectorAll<HTMLElement>("[data-wheel-row]");
    rows.forEach((row) => {
      const slot = Number(row.dataset.slot ?? 0);
      const d = slot - subTick; // distance-from-center in tick units
      transformRow(row, d, reducedMotion);
    });

    const ticks = wrapper.querySelectorAll<HTMLElement>("[data-ruler-tick]");
    ticks.forEach((el) => {
      const slot = Number(el.dataset.slot ?? 0);
      const d = slot - subTick;
      transformRulerTick(el, d, reducedMotion);
    });

    // Compass behavior: tilt the knob's minus mark to follow the
    // sub-tick offset. subTick is in [-0.5, 0.5]; map to a small visual
    // tilt range (-12deg..+12deg) so the mark rotates as the wheel
    // moves between rows and centers when a row is locked in.
    const knobMark = wrapper.querySelector<HTMLElement>("[data-knob-mark]");
    if (knobMark) {
      const tilt = reducedMotion ? 0 : subTick * 24; // 24 = 12deg per half-tick
      knobMark.style.transform = `rotate(${tilt}deg)`;
    }
  }, [reducedMotion]);

  const tickIndexFromOffset = (offset: number) =>
    Math.round(offset / DRAG_PX_PER_TICK);

  const fireTick = useCallback((velPxPerFrame: number, phase: Phase) => {
    const now = performance.now();
    if (
      phase === "inertia" &&
      now - lastTickSoundAtRef.current < TICK_THROTTLE_MS
    ) {
      return;
    }
    lastTickSoundAtRef.current = now;
    const speed = Math.abs(velPxPerFrame);
    if (speed < 1.2) play("wheelTickSlow");
    else if (speed < 4) play("wheelTickMid");
    else play("wheelTickFast");
  }, []);

  const syncTickAndActive = useCallback(
    (velPxPerFrame: number, phase: Phase) => {
      const tick = tickIndexFromOffset(offsetRef.current);
      if (tick !== lastTickIndexRef.current) {
        fireTick(velPxPerFrame, phase);
        lastTickIndexRef.current = tick;
        const len = SHAPES.length;
        const idx = ((tick % len) + len) % len;
        setActiveIndex(idx);
      }
    },
    [fireTick],
  );

  const tickFrame = useCallback(() => {
    const phase = phaseRef.current;
    if (phase === "inertia") {
      offsetRef.current += velocityRef.current;
      velocityRef.current *= FRICTION;
      syncTickAndActive(velocityRef.current, phase);
      applyTransforms();
      if (Math.abs(velocityRef.current) < SNAP_VELOCITY_THRESHOLD) {
        phaseRef.current = "snap";
      }
      rafRef.current = requestAnimationFrame(tickFrame);
      return;
    }

    if (phase === "snap") {
      const target =
        Math.round(offsetRef.current / DRAG_PX_PER_TICK) * DRAG_PX_PER_TICK;
      const dx = target - offsetRef.current;
      const acc = SNAP_STIFFNESS * dx - SNAP_DAMPING * velocityRef.current;
      velocityRef.current += acc * (1 / 60);
      offsetRef.current += velocityRef.current * (1 / 60);
      syncTickAndActive(velocityRef.current, phase);
      applyTransforms();
      if (Math.abs(dx) < 0.4 && Math.abs(velocityRef.current) < 0.4) {
        offsetRef.current = target;
        velocityRef.current = 0;
        applyTransforms();
        phaseRef.current = "idle";
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tickFrame);
      return;
    }

    rafRef.current = null;
  }, [applyTransforms, syncTickAndActive]);

  const startInertia = useCallback(
    (initialVelocity: number) => {
      velocityRef.current = initialVelocity;
      if (Math.abs(initialVelocity) < SNAP_VELOCITY_THRESHOLD * 2) {
        phaseRef.current = "snap";
      } else {
        phaseRef.current = "inertia";
      }
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tickFrame);
      }
    },
    [tickFrame],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    velocityRef.current = 0;
    phaseRef.current = "drag";
    dragStateRef.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      startOffset: offsetRef.current,
      samples: [{ t: performance.now(), y: e.clientY }],
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || e.pointerId !== state.pointerId) return;
    const dy = e.clientY - state.startY;
    offsetRef.current = state.startOffset - dy;

    const now = performance.now();
    state.samples.push({ t: now, y: e.clientY });
    while (state.samples.length > 5 || now - state.samples[0].t > 80) {
      state.samples.shift();
    }

    syncTickAndActive(8, "drag");
    applyTransforms();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || e.pointerId !== state.pointerId) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    dragStateRef.current = null;

    let velPxPerFrame = 0;
    if (state.samples.length >= 2) {
      const a = state.samples[0];
      const b = state.samples[state.samples.length - 1];
      const dt = b.t - a.t;
      if (dt > 0) {
        const vPxPerMs = (a.y - b.y) / dt;
        velPxPerFrame = vPxPerMs * (1000 / 60);
        velPxPerFrame = Math.max(-90, Math.min(90, velPxPerFrame));
      }
    }
    startInertia(velPxPerFrame);
  };

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    velocityRef.current = 0;
    phaseRef.current = "snap";
    offsetRef.current += e.deltaY * 0.5;
    syncTickAndActive(Math.abs(e.deltaY * 0.05), "inertia");
    applyTransforms();
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tickFrame);
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    velocityRef.current = 0;
    const direction = e.key === "ArrowDown" ? 1 : -1;
    offsetRef.current += direction * DRAG_PX_PER_TICK;
    phaseRef.current = "snap";
    syncTickAndActive(2, "drag");
    applyTransforms();
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tickFrame);
    }
  };

  useEffect(() => {
    applyTransforms();
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [applyTransforms]);

  const slots = Array.from(
    { length: VISIBLE_RADIUS * 2 + 1 },
    (_, i) => i - VISIBLE_RADIUS,
  );

  // Ruler is independently rendered with more ticks for a denser comb.
  const RULER_RADIUS = 9;
  const rulerSlots = Array.from(
    { length: RULER_RADIUS * 2 + 1 },
    (_, i) => i - RULER_RADIUS,
  );

  const tickIndex = tickIndexFromOffset(offsetRef.current);
  const shapeAtSlot = (slot: number): { kind: ShapeKind; key: string } => {
    const len = SHAPES.length;
    const idx = (((tickIndex + slot) % len) + len) % len;
    return { kind: SHAPES[idx], key: `${slot}-${idx}` };
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-6"
    >
      <span id={labelId} className="sr-only">
        Drag, scroll, or use arrow keys to spin the wheel.
      </span>

      <div className="relative flex items-stretch select-none">
        {/* Ruler block: holds the active line that crosses through the
            knob, the comb of short ticks above and below, and the knob
            itself. Width is just enough to fit the longest tick (knob
            ends at 58, gap, comb 78-100, then ~40px of breathing room
            before the wheel column). */}
        <div className="relative h-[560px] w-[120px] md:h-[640px] md:w-[130px]">
          {/* Active tick — short dark line, sits to the right of the
              knob with a small gap. Stays put at vertical center. */}
          <span
            aria-hidden
            className="absolute left-[78px] top-1/2 z-10 h-[2px] w-[34px] -translate-y-1/2 rounded-full bg-ink/85"
          />

          {/* Comb of short ticks (above + below the active line). */}
          {rulerSlots
            .filter((slot) => slot !== 0)
            .map((slot) => (
              <span
                key={slot}
                data-ruler-tick
                data-slot={slot}
                aria-hidden
                className="absolute left-[78px] top-1/2 h-[2px] w-[22px] origin-left rounded-full bg-ink/25 will-change-transform"
              />
            ))}

          {/* Knob: chunky yellow capsule with rim, top highlight, and
              soft drop shadow. Sits ABOVE the active tick at left:0 so
              the line visually crosses through its center. */}
          <span
            aria-hidden
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2"
          >
            <span
              className="relative inline-flex h-[34px] w-[58px] items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, #fff486 0%, #fdf004 38%, #ddc806 100%)",
                boxShadow:
                  "0 2px 0 rgba(0,0,0,0.15) inset, 0 -1px 0 rgba(255,255,255,0.55) inset, 0 6px 14px -2px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.10)",
              }}
            >
              {/* Top specular highlight */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-2 right-2 top-[3px] h-[6px] rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0))",
                }}
              />
              {/* Cut-in minus mark — acts like a compass needle. Stays
                  horizontal when a row is centered; tilts as the wheel
                  passes between rows. Rotation is updated per-frame in
                  applyTransforms based on the sub-tick offset. */}
              <span
                aria-hidden
                data-knob-mark
                className="block h-[3px] w-[18px] rounded-full will-change-transform"
                style={{
                  background: "#1a1810",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.25) inset",
                }}
              />
            </span>
          </span>

        </div>

        {/* Shape + label rows on the same arc */}
        <div
          role="listbox"
          aria-labelledby={labelId}
          aria-activedescendant={`wheel-item-${activeIndex}`}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          onKeyDown={onKeyDown}
          className="relative h-[560px] w-[320px] cursor-grab touch-none focus:outline-none focus-visible:outline-none active:cursor-grabbing md:h-[640px] md:w-[380px]"
          style={{
            outline: "none",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          }}
        >
          {slots.map((slot) => {
            const { kind, key } = shapeAtSlot(slot);
            const isActive = slot === 0;
            const len = SHAPES.length;
            const idx = ((tickIndex + slot) % len + len) % len;
            return (
              <div
                key={key}
                data-wheel-row
                data-slot={slot}
                id={isActive ? `wheel-item-${idx}` : undefined}
                role="option"
                aria-selected={isActive}
                aria-label={SHAPE_LABEL[kind]}
                className="absolute left-[200px] top-1/2 flex items-center gap-4 will-change-transform md:left-[200px] md:gap-5"
                style={{ transformOrigin: "32px 50%" }}
              >
                <div
                  className="h-[56px] w-[56px] shrink-0 md:h-[68px] md:w-[68px]"
                  style={{
                    filter:
                      "drop-shadow(0 14px 22px rgba(0,0,0,0.16)) drop-shadow(0 4px 8px rgba(0,0,0,0.10))",
                  }}
                >
                  <Shape kind={kind} />
                </div>
                <span className="whitespace-nowrap text-[20px] font-medium tracking-[-0.012em] text-ink md:text-[24px]">
                  {SHAPE_LABEL[kind]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Shape row arc: pivot is OFF-SCREEN TO THE LEFT. Active row sits at
// the rightmost point of the arc (closest to the viewer); rows above
// and below shift left and tilt up-left / down-left.
function transformRow(
  el: HTMLElement,
  d: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) {
    el.style.transform = `translate3d(0, ${d * DRAG_PX_PER_TICK}px, 0) translate(0, -50%)`;
    el.style.opacity = "1";
    return;
  }
  const angle = d * ROW_ANGLE_DEG;
  const rad = (angle * Math.PI) / 180;
  // Pivot off-screen LEFT: as |angle| grows, x grows NEGATIVE (leftward).
  const y = ARC_RADIUS * Math.sin(rad);
  const x = -ARC_RADIUS * (1 - Math.cos(rad));
  const rotate = angle;

  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(0, -50%) rotate(${rotate}deg)`;
  el.style.opacity = "1";
  el.style.zIndex = `${100 - Math.round(Math.abs(d) * 10)}`;
}

// Ruler tick comb: very subtle arc. Ticks near center are nearly
// horizontal; only the far ticks tilt a few degrees. Tighter pitch.
const RULER_TICK_PITCH_PX = 22;
const RULER_TICK_MAX_TILT = 14; // degrees at the far edges
function transformRulerTick(
  el: HTMLElement,
  d: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) {
    el.style.transform = `translate3d(0, ${d * RULER_TICK_PITCH_PX}px, 0) translate(0, -50%)`;
    el.style.opacity = `${Math.max(0, 1 - Math.abs(d) / 9)}`;
    return;
  }
  // Linear vertical pitch mapped to a leftward arc.
  const y = d * RULER_TICK_PITCH_PX;
  // Compute the angle for this y based on the same radius as rows.
  // We clamp y / ARC_RADIUS to [-1, 1] to avoid NaN if y exceeds radius.
  const rad = Math.asin(Math.max(-1, Math.min(1, y / ARC_RADIUS)));
  const x = -ARC_RADIUS * (1 - Math.cos(rad));
  
  const tiltFactor = Math.min(Math.abs(d) / 8, 1);
  const rotate = Math.sign(d) * tiltFactor * RULER_TICK_MAX_TILT;
  const opacity = Math.max(0, 1 - Math.abs(d) / 9);
  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(0, -50%) rotate(${rotate}deg)`;
  el.style.opacity = `${opacity}`;
}
