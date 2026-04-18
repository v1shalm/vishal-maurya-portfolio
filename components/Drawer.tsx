"use client";

import { useState, type ReactNode } from "react";

type Props = {
  /** Visible summary / trigger label when collapsed */
  label: string;
  /** Optional meta shown on the right of the trigger */
  hint?: string;
  children: ReactNode;
  /** Starts open if true */
  defaultOpen?: boolean;
};

/**
 * Smoothly animated collapsible block. Uses grid-template-rows 0fr → 1fr
 * transition (GPU-friendly, no layout thrash). The trigger is a plain button.
 */
export function Drawer({ label, hint, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-baseline justify-between gap-4 border-y border-line py-4 text-left"
      >
        <span className="flex items-baseline gap-3">
          <span
            aria-hidden
            className="text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              color: "var(--color-accent)",
              display: "inline-block",
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            +
          </span>
          <span className="text-[14px] text-ink transition-colors group-hover:text-ink-soft md:text-[15px]">
            {label}
          </span>
        </span>
        {hint && (
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
            {hint}
          </span>
        )}
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div
          className="overflow-hidden"
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 400ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
