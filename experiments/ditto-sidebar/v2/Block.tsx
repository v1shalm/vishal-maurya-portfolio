"use client";

import type React from "react";

/**
 * v2 example block — portfolio-styled version of the Ditto blocks.
 *
 * Shape and content are unchanged from v1; only the visual treatment
 * differs:
 * - Sharp corners everywhere (no rounded-* anywhere) to match the
 *   portfolio's hero block / button edge language.
 * - Coloured band uses `var(--color-bg-elevated)` cream instead of
 *   per-step Ditto colors, so v2 reads as one coherent surface
 *   regardless of section.
 * - Caption uses the section-header rule: 28px Geist bold,
 *   tracking-tight, magenta `y-hl` halo on the lead phrase.
 * - Inner card sits flush bottom-right of the band (same Ditto-style
 *   corner crop) but with a thicker top + left band for breathing
 *   room, matching the chunkier portfolio aesthetic.
 */

export type BlockKind =
  | "draft"
  | "doc"
  | "review"
  | "translate"
  | "personalize"
  | "ship"
  | "iterate";

export type Block = {
  label: string;
  caption: string;
  lead: string;
  body: BlockKind;
};

export function ExampleBlockV2({
  id,
  block,
}: {
  id: string;
  /** Only used to highlight the matching dot in the v2 sidebar. */
  color?: string;
  block: Block;
}) {
  return (
    <section id={id} className="scroll-mt-16">
      {/* Cream band, sharp corners. The white card hugs the
         top-left, leaving a thicker band of cream visible on the top
         and left edges so v2 feels chunkier than v1. */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "var(--color-bg-elevated)",
          height: "min(72vh, 620px)",
        }}
      >
        <div
          className="absolute bg-white"
          style={{
            top: 72,
            left: 72,
            right: 0,
            bottom: 0,
            padding: 32,
            overflow: "hidden",
            // Layered shadows over a hard top + left edge so the card
            // reads as cleanly stacked on the cream — no soft glow.
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.06), 0 12px 32px -16px rgba(0,0,0,0.18)",
          }}
        >
          <BlockBodyV2 kind={block.body} />
        </div>
      </div>

      {/* Caption: portfolio section-header treatment. Lead phrase gets
         the magenta halo so it reads as a hot pull-quote on white. */}
      <p className="mt-6 text-[20px] leading-[1.4] tracking-tight text-ink [text-wrap:pretty] md:text-[24px]">
        <span className="font-bold">
          <span className="y-hl y-hl--magenta">{block.lead}</span>
        </span>
        <span className="text-ink-soft">, {block.caption}</span>
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Block bodies                                                        */
/* ------------------------------------------------------------------ */

function BlockBodyV2({ kind }: { kind: BlockKind }) {
  if (kind === "review") return <ReviewMock />;
  if (kind === "doc") return <DocMock />;
  if (kind === "translate") return <TranslateMock />;
  if (kind === "personalize") return <PersonalizeMock />;
  if (kind === "ship") return <ShipMock />;
  if (kind === "iterate") return <IterateMock />;
  return <DraftMock />;
}

const ACCENT = "#f91ca9"; // portfolio magenta
const ACCENT_INK = "#d11589";
const YELLOW = "#fdf004";
const INK = "#0a0a0a";

function MockChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-cols-[1.4fr_1fr] gap-5 text-[12px] text-ink">
      {children}
    </div>
  );
}

function Crumb({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </p>
  );
}

function PaneHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-[16px] font-bold tracking-tight text-ink [text-wrap:balance]">
      {children}
    </p>
  );
}

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-3 p-4"
      style={{ background: "var(--color-bg-elevated)" }}
    >
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="px-2 py-0.5 text-[10.5px] font-mono"
      style={{ background: "var(--color-bg-elevated)", color: INK }}
    >
      {children}
    </span>
  );
}

function DraftMock() {
  return (
    <MockChrome>
      <div>
        <Crumb>Onboarding flow</Crumb>
        <PaneHeading># Welcome screen</PaneHeading>
        <PreviewFrame>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
            Heading
          </p>
          <p
            className="mt-2 inline-block bg-white px-2 py-1 text-[15px] font-bold leading-tight text-ink"
            style={{ outline: `2px solid ${ACCENT}` }}
          >
            Welcome aboard.
          </p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-muted">
            Subhead
          </p>
          <p className="mt-2 text-[13px] text-ink-soft">
            Let's get you set up in just a few minutes.
          </p>
        </PreviewFrame>
      </div>
      <SidePanel title="Drafts" tab="Activity">
        <ul className="mt-3 space-y-2">
          <DraftRow status="open" label="Welcome screen v3" meta="2m ago" />
          <DraftRow status="review" label="Empty inbox" meta="1h ago" />
          <DraftRow status="approved" label="Plan upgrade modal" meta="Yesterday" />
        </ul>
      </SidePanel>
    </MockChrome>
  );
}

function DraftRow({
  status,
  label,
  meta,
}: {
  status: "open" | "review" | "approved";
  label: string;
  meta: string;
}) {
  const dotColor =
    status === "open" ? ACCENT : status === "review" ? YELLOW : INK;
  return (
    <li
      className="flex items-center justify-between gap-2 px-2.5 py-2"
      style={{ background: "var(--color-bg-elevated)" }}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-2 w-2"
          style={{ background: dotColor }}
        />
        <span className="text-[12px] text-ink">{label}</span>
      </span>
      <span className="text-[10.5px] tabular-nums text-muted">{meta}</span>
    </li>
  );
}

function DocMock() {
  return (
    <MockChrome>
      <div>
        <Crumb>Components / Banner</Crumb>
        <PaneHeading># Promo banner</PaneHeading>
        <PreviewFrame>
          <div
            className="px-4 py-3"
            style={{ background: ACCENT, color: "#fff" }}
          >
            <p className="text-[14px] font-bold">Save 20% on annual plans</p>
            <p className="mt-1 text-[11.5px] opacity-90">
              Switch from monthly to annual and pay less.
            </p>
          </div>
        </PreviewFrame>
        <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-muted">
          Variables
        </p>
        <div className="mt-1 flex gap-1.5">
          <Pill>{"{{discount}}"}</Pill>
          <Pill>{"{{plan}}"}</Pill>
        </div>
      </div>
      <SidePanel title="Linked components" tab="Project">
        <ul className="mt-3 space-y-1.5 text-[12px] text-ink-soft">
          <li
            className="px-2 py-1.5"
            style={{ background: "var(--color-bg-elevated)" }}
          >
            BillingPage.tsx
          </li>
          <li
            className="px-2 py-1.5"
            style={{ background: "var(--color-bg-elevated)" }}
          >
            UpgradeBanner.tsx
          </li>
          <li
            className="px-2 py-1.5"
            style={{ background: "var(--color-bg-elevated)" }}
          >
            EmailFooter.tsx
          </li>
        </ul>
        <p className="mt-3 text-[10.5px] tabular-nums text-muted">
          3 instances in design
        </p>
      </SidePanel>
    </MockChrome>
  );
}

function ReviewMock() {
  return (
    <MockChrome>
      <div>
        <Crumb>Onboarding flow</Crumb>
        <PaneHeading># Notification frequency step</PaneHeading>
        <PreviewFrame>
          <div className="relative">
            <span
              aria-hidden
              className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center text-[10px] font-bold text-white"
              style={{ background: ACCENT }}
            >
              ✎
            </span>
            <p className="text-[11px] text-ink-soft">Notification frequency</p>
            <p
              className="mt-2 bg-white px-3 py-2 text-[14px] font-bold leading-tight text-ink"
              style={{ outline: `2px solid ${ACCENT}` }}
            >
              Choose which notifications<br />you'd like to receive
            </p>
            <ul className="mt-3 space-y-2 text-[13px] font-bold text-ink-soft">
              {[
                "Email updates",
                "Product notifications",
                "Comment responses",
                "None of the above",
              ].map((opt) => (
                <li key={opt} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3"
                    style={{ outline: `1.5px solid currentColor` }}
                  />
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        </PreviewFrame>
      </div>
      <SidePanel title="Selected text" tab="Comments">
        <div className="mt-3 space-y-3 text-[11.5px]">
          <Comment
            initial="L"
            initialBg={INK}
            name="Logan Smith"
            time="20 mins ago"
          >
            <p className="font-semibold" style={{ color: ACCENT_INK }}>
              Suggested edit
            </p>
            <p className="mt-1 text-ink-soft">
              <span className="line-through" style={{ color: ACCENT_INK }}>
                Choose w
              </span>
              <span>Which notifications would you'd like to receive?</span>
            </p>
            <p className="mt-2 text-[10.5px] tabular-nums text-muted">
              Hide 2 replies
            </p>
          </Comment>
          <Comment
            initial="L"
            initialBg={INK}
            name="Logan Smith"
            time="20 mins ago"
          >
            <p className="text-ink-soft">Looks great 👍</p>
          </Comment>
          <Comment
            initial="B"
            initialBg={ACCENT}
            name="Billie Johnson"
            time="5 mins ago"
          >
            <p className="text-ink-soft">
              Yes, this is better aligned to our style guide. Could we also include a subheading to clarify they can change this any time?
            </p>
          </Comment>
        </div>
      </SidePanel>
    </MockChrome>
  );
}

function SidePanel({
  title,
  tab,
  children,
}: {
  title: string;
  tab: "Edit" | "Activity" | "Comments" | "Project" | "Variants";
  children: React.ReactNode;
}) {
  const tabs = ["Edit", "Activity", "Comments", "Variants"] as const;
  return (
    <div
      className="flex h-full flex-col p-3"
      style={{ background: "var(--color-bg-elevated)" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-ink">{title}</p>
        <span aria-hidden className="text-[14px] text-muted">
          ×
        </span>
      </div>
      <div className="mt-2 flex gap-3 pb-2 text-[11.5px]">
        {tabs.map((t) => (
          <span
            key={t}
            className={t === tab ? "font-bold text-ink" : "text-muted"}
            style={
              t === tab
                ? { boxShadow: `inset 0 -2px 0 ${INK}`, paddingBottom: 4 }
                : undefined
            }
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10.5px] tabular-nums text-muted">
        <span>Most recent</span>
        <span>See all activity</span>
      </div>
      {children}
    </div>
  );
}

function Comment({
  initial,
  initialBg,
  name,
  time,
  children,
}: {
  initial: string;
  initialBg: string;
  name: string;
  time: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-bold text-white"
        style={{ background: initialBg }}
      >
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-1.5">
          <span className="font-semibold text-ink">{name}</span>
          <span className="text-[10px] tabular-nums text-muted">· {time}</span>
        </p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function TranslateMock() {
  const rows = [
    {
      lang: "EN",
      text: "Welcome back. Pick up where you left off.",
      status: "Source",
    },
    {
      lang: "ES",
      text: "Bienvenido de nuevo. Continúa donde lo dejaste.",
      status: "Approved",
    },
    {
      lang: "JA",
      text: "おかえりなさい。続きからどうぞ。",
      status: "In review",
    },
    {
      lang: "FR",
      text: "Bon retour. Reprenez là où vous vous êtes arrêté.",
      status: "Approved",
    },
  ];
  return (
    <div>
      <Crumb>String / Onboarding · welcome.return</Crumb>
      <PaneHeading>Translation memory</PaneHeading>
      <div className="mt-3 overflow-hidden">
        <div
          className="grid grid-cols-[64px_1fr_104px] gap-3 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"
          style={{ background: "var(--color-bg-elevated)" }}
        >
          <span>Locale</span>
          <span>String</span>
          <span>Status</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.lang}
            className="grid grid-cols-[64px_1fr_104px] items-center gap-3 px-3 py-2.5 text-[12px]"
            style={{
              background: i % 2 === 0 ? "#ffffff" : "var(--color-bg-elevated)",
            }}
          >
            <span>
              <span
                className="px-1.5 py-0.5 text-[10px] font-bold text-white"
                style={{ background: i === 0 ? INK : ACCENT }}
              >
                {r.lang}
              </span>
            </span>
            <span className="truncate text-ink">{r.text}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-ink-soft">
              <span
                aria-hidden
                className="h-1.5 w-1.5"
                style={{
                  background:
                    r.status === "Approved"
                      ? ACCENT
                      : r.status === "In review"
                        ? YELLOW
                        : INK,
                }}
              />
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalizeMock() {
  const variants = [
    {
      name: "Default",
      audience: "All visitors",
      copy: "Welcome to Acme.",
      live: false,
    },
    {
      name: "New visitor",
      audience: "first_visit = true",
      copy: "Try us free for 14 days.",
      live: true,
    },
    {
      name: "Trial expiring",
      audience: "trial_days_left ≤ 2",
      copy: "Two days left. Upgrade to keep your work.",
      live: true,
    },
    {
      name: "Returning · EU",
      audience: "region = EU & last_seen > 7d",
      copy: "Welcome back. Resume your last project?",
      live: false,
    },
  ];
  return (
    <div>
      <Crumb>String / Homepage · hero.title</Crumb>
      <PaneHeading>Variants</PaneHeading>
      <div className="mt-3 space-y-2">
        {variants.map((v) => (
          <div
            key={v.name}
            className="flex items-center gap-3 px-3 py-2.5"
            style={{ background: "var(--color-bg-elevated)" }}
          >
            <span
              aria-hidden
              className="h-7 w-1"
              style={{ background: v.live ? ACCENT : "#cccccc" }}
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2">
                <span className="text-[12.5px] font-bold text-ink">
                  {v.name}
                </span>
                <span className="font-mono text-[10.5px] text-muted">
                  {v.audience}
                </span>
              </p>
              <p className="mt-0.5 truncate text-[12px] text-ink-soft">
                {v.copy}
              </p>
            </div>
            <span
              className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]"
              style={{
                background: v.live ? ACCENT : "#ffffff",
                color: v.live ? "#fff" : "var(--color-muted)",
              }}
            >
              {v.live ? "Live" : "Draft"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShipMock() {
  const changes = [
    {
      file: "pricing.tsx",
      kind: "Update CTA",
      before: "Get started",
      after: "Try it free",
    },
    {
      file: "signup.tsx",
      kind: "Trim subhead",
      before: "It only takes a couple of minutes",
      after: "Takes a minute",
    },
    {
      file: "email/confirm.tsx",
      kind: "Fix typo",
      before: "Recieve",
      after: "Receive",
    },
  ];
  return (
    <div>
      <Crumb>Branch · main</Crumb>
      <PaneHeading>3 strings ready to publish</PaneHeading>
      <div className="mt-3 space-y-2">
        {changes.map((c) => (
          <div
            key={c.file}
            className="px-3 py-2.5"
            style={{ background: "var(--color-bg-elevated)" }}
          >
            <p className="flex items-center justify-between">
              <span className="text-[12.5px] font-bold text-ink">
                {c.kind}
              </span>
              <span className="font-mono text-[10.5px] text-muted">
                {c.file}
              </span>
            </p>
            <p
              className="mt-1.5 text-[11.5px] line-through"
              style={{ color: ACCENT_INK }}
            >
              {c.before}
            </p>
            <p className="text-[11.5px] font-semibold" style={{ color: INK }}>
              {c.after}
            </p>
          </div>
        ))}
      </div>
      <div
        className="mt-3 flex items-center justify-between px-3 py-2.5 text-[11.5px]"
        style={{ background: INK, color: "#ffffff" }}
      >
        <span className="opacity-80">
          Will sync to <span className="font-mono">api.acme.com</span>
        </span>
        <button
          type="button"
          className="px-3 py-1.5 text-[12px] font-bold transition-transform duration-100 ease-out active:scale-[0.96]"
          style={{ background: ACCENT, color: "#ffffff" }}
        >
          Publish 3 changes
        </button>
      </div>
    </div>
  );
}

function IterateMock() {
  const variants = [
    {
      label: "v1 · control",
      copy: "Get started",
      ctr: 3.2,
      delta: null,
      winning: false,
    },
    {
      label: "v2",
      copy: "Try it free",
      ctr: 5.7,
      delta: "+78%",
      winning: true,
    },
  ];
  return (
    <div>
      <Crumb>Experiment · pricing.cta</Crumb>
      <PaneHeading>Click-through over 14 days</PaneHeading>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {variants.map((v) => (
          <div
            key={v.label}
            className="p-3"
            style={{
              background: v.winning ? "#ffffff" : "var(--color-bg-elevated)",
              outline: v.winning ? `2px solid ${ACCENT}` : "none",
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {v.label}
            </p>
            <p className="mt-1.5 text-[15px] font-bold text-ink">
              "{v.copy}"
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span
                className="text-[24px] font-bold leading-none tabular-nums"
                style={{ color: v.winning ? ACCENT : INK }}
              >
                {v.ctr}%
              </span>
              {v.delta ? (
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{ color: ACCENT }}
                >
                  {v.delta}
                </span>
              ) : null}
            </div>
            <div className="mt-2">
              <Sparkline color={v.winning ? ACCENT : "#cccccc"} flat={!v.winning} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Winner promoted automatically. Past variants kept in history.
      </p>
    </div>
  );
}

function Sparkline({ color, flat }: { color: string; flat?: boolean }) {
  const d = flat
    ? "M0 14 L10 14 L20 13 L30 14 L40 14 L50 13.5 L60 14 L70 13 L80 14 L90 13.5 L100 14"
    : "M0 14 L10 12 L20 13 L30 9 L40 10 L50 6 L60 7 L70 4 L80 5 L90 2 L100 3";
  return (
    <svg
      width="100%"
      height="20"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      fill="none"
    >
      <path d={d} stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
