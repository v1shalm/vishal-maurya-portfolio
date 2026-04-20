"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Group = "page" | "project" | "external" | "action";

type Item = {
  label: string;
  group: Group;
  href?: string;
  action?: () => void | Promise<void>;
  hint?: string;
};

const items: Item[] = [
  { label: "Home", group: "page", href: "/", hint: "Index" },
  { label: "Work", group: "page", href: "/#work", hint: "Selected work" },
  { label: "Pixels", group: "page", href: "/pixels", hint: "Personal UI" },
  { label: "About", group: "page", href: "/about", hint: "Short bio" },
  {
    label: "Nexus 247",
    group: "project",
    href: "/work/nexus-247",
    hint: "Quick-commerce · 2025",
  },
  {
    label: "OutcomesAI",
    group: "project",
    href: "/work/outcomes-ai",
    hint: "Healthtech · 2025",
  },
  {
    label: "Zilo",
    group: "project",
    href: "/work/zilo",
    hint: "Quick-commerce · 2025",
  },
  {
    label: "Email",
    group: "action",
    href: "mailto:vishalm.designs@gmail.com",
    hint: "Open a message",
  },
  {
    label: "Copy email",
    group: "action",
    action: async () => {
      try {
        await navigator.clipboard.writeText("vishalm.designs@gmail.com");
      } catch {
        /* silent */
      }
    },
    hint: "vishalm.designs@gmail.com",
  },
  {
    label: "Download resume",
    group: "action",
    href: "https://drive.google.com/file/d/1H9CUwS7UnFzxy1oD_wa5A7KJ4P_i45ch/view?usp=drive_link",
    hint: "PDF · Google Drive",
  },
  {
    label: "LinkedIn",
    group: "external",
    href: "https://www.linkedin.com/in/v1shalm/",
    hint: "Profile",
  },
  {
    label: "Dribbble",
    group: "external",
    href: "https://dribbble.com/V1shal",
    hint: "Shots",
  },
];

const filters: Array<{ label: string; group: Group | "all" }> = [
  { label: "All", group: "all" },
  { label: "Pages", group: "page" },
  { label: "Projects", group: "project" },
  { label: "Actions", group: "action" },
  { label: "External", group: "external" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Group | "all">("all");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [modKey, setModKey] = useState("⌘");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const isMac = /mac|iphone|ipad|ipod/i.test(
      navigator.platform || navigator.userAgent
    );
    setModKey(isMac ? "⌘" : "Ctrl");
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "all" && item.group !== filter) return false;
      if (!q) return true;
      return (item.label + " " + (item.hint ?? "")).toLowerCase().includes(q);
    });
  }, [query, filter]);

  useEffect(() => {
    if (index >= filtered.length) setIndex(Math.max(0, filtered.length - 1));
  }, [filtered.length, index]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const openHandler = () => setOpen(true);
    const toggleHandler = () => setOpen((v) => !v);
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("command-palette:open", openHandler);
    window.addEventListener("command-palette:toggle", toggleHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("command-palette:open", openHandler);
      window.removeEventListener("command-palette:toggle", toggleHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    setQuery("");
    setFilter("all");
    setIndex(0);
    setCopied(null);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [index]);

  // Focus trap: keep Tab/Shift+Tab cycling focus inside the palette
  useEffect(() => {
    if (!open) return;

    const lastActive = document.activeElement as HTMLElement | null;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = document.querySelector<HTMLElement>(
        '[aria-label="Command palette"]'
      );
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => {
      document.removeEventListener("keydown", handleTab);
      // Return focus to the element that opened the palette
      lastActive?.focus?.();
    };
  }, [open]);

  const run = async (item: Item) => {
    if (item.action) {
      await item.action();
      if (item.label === "Copy email") {
        setCopied("Copied · vishalm.designs@gmail.com");
        setTimeout(() => setCopied(null), 1600);
        return;
      }
      setOpen(false);
      return;
    }
    if (!item.href) return;
    if (item.href.startsWith("http") || item.href.startsWith("mailto:")) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[index]) run(filtered[index]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const order = filters.map((f) => f.group);
      const currentIdx = order.indexOf(filter);
      const nextIdx = e.shiftKey
        ? (currentIdx - 1 + order.length) % order.length
        : (currentIdx + 1) % order.length;
      setFilter(order[nextIdx]);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[14vh]"
    >
      {/* Backdrop: dark tint + blur */}
      <button
        aria-label="Close"
        onClick={() => setOpen(false)}
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-md"
      />

      {/* Panel: softened shadow, single subtle lift */}
      <div className="relative w-full max-w-[620px] overflow-hidden rounded-[24px] border border-line-soft bg-bg shadow-[0_20px_60px_-24px_rgba(20,15,10,0.18)]">
        {/* Input: minimal 1px stroke, whisper-soft inner lift on focus */}
        <div className="px-7 pt-7 pb-6">
          <label
            htmlFor="cmdk-input"
            className="group flex items-center gap-3 rounded-xl border border-line-soft bg-bg px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.015)] transition-[border,box-shadow] duration-200 focus-within:border-line focus-within:shadow-[0_1px_0_rgba(0,0,0,0.02),0_2px_8px_-4px_rgba(20,15,10,0.06)]"
          >
            <input
              id="cmdk-input"
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              placeholder="Search pages, projects, actions…"
              className="flex-1 bg-transparent text-[15.5px] leading-none text-ink placeholder:text-muted"
              style={{ outline: "none", boxShadow: "none" }}
            />
            <kbd className="shrink-0 rounded-md border border-line-soft bg-bg-elevated px-2 py-0.5 text-[10.5px] font-medium text-muted">
              Esc
            </kbd>
          </label>
        </div>

        {/* Filter chips */}
        <div className="px-7 pb-7">
          <div className="-mx-1 flex items-center gap-2.5 overflow-x-auto px-1">
            {filters.map((f) => {
              const active = filter === f.group;
              return (
                <button
                  key={f.label}
                  onClick={() => {
                    setFilter(f.group);
                    setIndex(0);
                  }}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] transition-[background,border,color,scale] duration-200 ease-out active:scale-[0.96] ${
                    active
                      ? "border-transparent text-white"
                      : "border-line-soft bg-bg-elevated text-muted hover:border-line hover:text-ink-soft"
                  }`}
                  style={
                    active ? { backgroundColor: "var(--color-accent)" } : undefined
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hairline divider */}
        <div className="mx-7 h-px bg-line-soft" />

        {/* List */}
        <ul
          ref={listRef}
          className="max-h-[54vh] overflow-y-auto px-4 py-4"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="px-5 py-10 text-center text-[13px] text-muted">
              No matches.
            </li>
          ) : (
            filtered.map((item, i) => {
              const active = i === index;
              return (
                <li
                  key={item.label}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => run(item)}
                  className={`group mb-0.5 flex cursor-pointer items-center justify-between gap-5 rounded-xl px-4 py-3 transition-colors ${
                    active ? "bg-bg-elevated" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-5">
                    <span
                      className="w-16 shrink-0 text-[11px] transition-colors"
                      style={{
                        color: active
                          ? "var(--color-accent)"
                          : "var(--color-muted)",
                      }}
                    >
                      {item.group}
                    </span>
                    <span className="truncate text-[14.5px] text-ink">
                      {item.label}
                    </span>
                  </div>
                  {item.hint && (
                    <span className="truncate text-[12px] text-muted">
                      {item.hint}
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-line-soft bg-bg-elevated px-7 py-4 text-[11.5px] text-muted">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <kbd className="rounded-md border border-line-soft bg-bg px-1.5 py-0.5 text-[10px] tabular-nums lowercase tracking-normal text-muted">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-2">
              <kbd
                className="rounded-md border bg-bg px-1.5 py-0.5 text-[10px] tabular-nums lowercase tracking-normal"
                style={{
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                }}
              >
                ↵
              </kbd>
              Open
            </span>
            <span className="hidden items-center gap-2 md:flex">
              <kbd className="rounded-md border border-line-soft bg-bg px-1.5 py-0.5 text-[10px] tabular-nums lowercase tracking-normal text-muted">
                Tab
              </kbd>
              Move focus
            </span>
          </div>
          {copied ? (
            <span style={{ color: "var(--color-accent)" }}>{copied}</span>
          ) : (
            <span className="flex items-center gap-2">
              <kbd className="rounded-md border border-line-soft bg-bg px-1.5 py-0.5 text-[10px] tabular-nums text-muted">
                {modKey} K
              </kbd>
              Toggle
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
