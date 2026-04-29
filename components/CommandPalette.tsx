"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { play } from "@/lib/sounds";
import { links } from "@/lib/links";

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
  { label: "Playground", group: "page", href: "/playground", hint: "Experiments" },
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
    href: links.email,
    hint: "Open a message",
  },
  {
    label: "Copy email",
    group: "action",
    action: async () => {
      try {
        await navigator.clipboard.writeText(links.emailDisplay);
      } catch {
        /* silent */
      }
    },
    hint: links.emailDisplay,
  },
  {
    label: "Download resume",
    group: "action",
    href: links.resume,
    hint: "PDF · Google Drive",
  },
  {
    label: "LinkedIn",
    group: "external",
    href: links.linkedin,
    hint: "Profile",
  },
  {
    label: "Dribbble",
    group: "external",
    href: links.dribbble,
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
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [modKey, setModKey] = useState("⌘");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const isMac = /mac|iphone|ipad|ipod/i.test(
      navigator.platform || navigator.userAgent
    );
    setModKey(isMac ? "⌘" : "Ctrl");
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = items.filter((item) => {
      if (!q) return true;
      return (item.label + " " + (item.hint ?? "")).toLowerCase().includes(q);
    });
    
    const groupOrder = { page: 1, project: 2, action: 3, external: 4 };
    return matches.sort((a, b) => groupOrder[a.group] - groupOrder[b.group]);
  }, [query]);

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

  // Track first render so we don't fire the close sound on initial mount
  // (when `open` is already false but no real close happened).
  const mountedRef = useRef(false);
  useEffect(() => {
    if (open) {
      play("paletteOpen");
      setTimeout(() => inputRef.current?.focus(), 30);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    if (mountedRef.current) play("paletteClose");
    mountedRef.current = true;
    setQuery("");
    setIndex(0);
    setCopied(null);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Account for group headers in the DOM tree if needed, 
    // but since we render headers alongside items, indexing childNodes is tricky.
    // Instead we use querySelectorAll to find the active option.
    const options = list.querySelectorAll('[role="option"]');
    const el = options[index] as HTMLElement | undefined;
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [index]);

  const run = async (item: Item) => {
    if (item.action) {
      await item.action();
      if (item.label === "Copy email") {
        play("copy");
        setCopied("Copied!");
        setTimeout(() => setCopied(null), 1600);
        return;
      }
      play("paletteRun");
      setOpen(false);
      return;
    }
    if (!item.href) return;
    play("paletteRun");
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
    }
  };

  // Easing matches the rest of the site (ease-out-expo equivalent).
  const enterEase = [0.16, 1, 0.3, 1] as const;
  const exitEase = [0.4, 0, 1, 1] as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk-root"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.22,
            ease: enterEase,
          }}
          className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[14vh]"
        >
          <motion.button
            aria-label="Close"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{
              opacity: 1,
              backdropFilter: reduceMotion ? "blur(0px)" : "blur(10px)",
            }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: enterEase }}
            className="absolute inset-0 cursor-default bg-black/40"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: reduceMotion ? 1 : 0.96,
              y: reduceMotion ? 0 : -8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                duration: reduceMotion ? 0 : 0.36,
                ease: enterEase,
              },
            }}
            exit={{
              opacity: 0,
              scale: reduceMotion ? 1 : 0.97,
              y: reduceMotion ? 0 : -4,
              transition: {
                duration: reduceMotion ? 0 : 0.18,
                ease: exitEase,
              },
            }}
            className="relative w-full max-w-[640px] overflow-hidden rounded-[16px] border border-line-soft bg-bg shadow-[0_30px_60px_-15px_rgba(12,12,16,0.28),0_8px_20px_-8px_rgba(249,28,169,0.12)]"
          >
        <div className="flex items-center gap-3 border-b border-line-soft px-4 py-4">
          <svg className="h-5 w-5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
          <input
            id="cmdk-input"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search pages, projects, actions…"
            className="flex-1 border-0 bg-transparent text-[15.5px] leading-none text-ink placeholder:text-muted outline-none ring-0 focus:border-transparent focus:outline-none focus:ring-0"
            style={{ outline: "none", boxShadow: "none" }}
          />
        </div>

        <ul
          ref={listRef}
          data-lenis-prevent
          className="max-h-[50vh] overflow-y-auto p-2"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="px-5 py-10 text-center text-[14px] text-muted">
              No results found.
            </li>
          ) : (
            filtered.map((item, i) => {
              const active = i === index;
              const prev = filtered[i - 1];
              const showGroup = !prev || prev.group !== item.group;
              const groupLabels: Record<string, string> = {
                page: "Pages",
                project: "Projects",
                action: "Actions",
                external: "External",
              };

              return (
                <div key={item.label}>
                  {showGroup && (
                    <div className="px-3 py-2 text-[12px] font-medium text-muted mt-1 first:mt-0">
                      {groupLabels[item.group]}
                    </div>
                  )}
                  <li
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => run(item)}
                    className="group relative flex cursor-pointer items-center justify-between gap-3 rounded-[8px] px-3 py-2.5"
                  >
                    <span
                      aria-hidden
                      className="cmdk-row-highlight pointer-events-none absolute inset-0 rounded-[8px]"
                      data-active={active}
                      style={{
                        background: "var(--color-yellow)",
                        boxShadow:
                          "inset 0 -2px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.45)",
                      }}
                    />

                    <div className="relative z-10 flex items-center gap-3 min-w-0">
                      <div className={`transition-colors duration-150 ${active ? "text-ink" : "text-muted"}`}>
                        {item.group === "page" && <PageIcon />}
                        {item.group === "project" && <ProjectIcon />}
                        {item.group === "action" && <ActionIcon />}
                        {item.group === "external" && <ExternalIcon />}
                      </div>

                      <span className={`truncate text-[14px] font-medium transition-colors duration-150 ${active ? "text-ink font-semibold" : "text-ink"}`}>
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className={`truncate text-[14px] transition-colors duration-150 ${active ? "text-ink/70" : "text-muted"}`}>
                          {item.hint}
                        </span>
                      )}
                    </div>

                    <span className={`relative z-10 shrink-0 text-[13px] capitalize hidden sm:block transition-colors duration-150 ${active ? "text-ink font-semibold" : "text-muted font-medium"}`}>
                      {item.group}
                    </span>
                  </li>
                </div>
              );
            })
          )}
        </ul>

        <div className="flex items-center justify-end border-t border-line-soft px-4 py-3 text-[12px] text-muted bg-bg">
          <div className="flex items-center gap-4">
            {copied && <span className="text-accent">{copied}</span>}
            <span className="flex items-center gap-1.5">
              Open Command
              <kbd className="rounded-[4px] bg-bg-elevated border border-line-soft px-1.5 py-0.5 text-[10px] tabular-nums leading-none">
                ↵
              </kbd>
            </span>
            <span className="flex items-center gap-1.5 hidden sm:flex">
              Toggle
              <kbd className="rounded-[4px] bg-bg-elevated border border-line-soft px-1.5 py-0.5 text-[10px] tabular-nums leading-none">
                {modKey} K
              </kbd>
            </span>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  );
}

function ActionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}
