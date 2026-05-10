"use client";

import { useState } from "react";
import { CaseStudyNav as CaseStudyNavV1 } from "@/experiments/ditto-sidebar/CaseStudyNav";
import { CaseStudyNav as CaseStudyNavV2 } from "@/experiments/ditto-sidebar/v2/CaseStudyNav";
import { ExampleBlockV2 } from "@/experiments/ditto-sidebar/v2/Block";
import type { CaseSection } from "@/lib/works";

// Step colors mirror the sidebar's STEP_COLORS array. Each block uses
// its color as the band background so you can tell at a glance which
// step the active tile should be on as you scroll.
const STEP_COLORS = [
  "#B8882A",
  "#9B5FC0",
  "#4A7C2C",
  "#1AABDC",
  "#E5412A",
  "#9BBF2A",
  "#E891B8",
];

type Block = {
  label: string;
  caption: string;
  /** Bold lead-in shown before the caption, like Ditto's "X — and ..." pattern. */
  lead: string;
  /** Faux UI shown inside the white inset card. */
  body: "doc" | "review" | "translate" | "personalize" | "ship" | "iterate" | "draft";
};

const BLOCKS: Block[] = [
  {
    label: "Draft",
    lead: "Draft copy in one place",
    caption: "and skip the spreadsheets, the Slack threads, the duplicated docs.",
    body: "draft",
  },
  {
    label: "Design",
    lead: "Design with real strings",
    caption: "so the layout you ship matches the layout you reviewed.",
    body: "doc",
  },
  {
    label: "Review",
    lead: "Review copy in context",
    caption: "and track every edit, comment, and approval.",
    body: "review",
  },
  {
    label: "Translate",
    lead: "Translate without losing nuance",
    caption: "human and machine translations side by side, ready for QA.",
    body: "translate",
  },
  {
    label: "Personalize",
    lead: "Personalize per audience",
    caption: "different copy for different markets, no rebuilds.",
    body: "personalize",
  },
  {
    label: "Ship",
    lead: "Ship copy without a release",
    caption: "push updates straight to production from the editor.",
    body: "ship",
  },
  {
    label: "Iterate",
    lead: "Iterate on what's live",
    caption: "watch impact, then refine. Copy is never done.",
    body: "iterate",
  },
];

const sections: CaseSection[] = BLOCKS.map((b) => ({
  label: b.label,
  title: b.label,
  body: [],
}));

export default function DittoSidebarExperiment() {
  // v1 = Ditto-faithful replica. v2 = same geometry, portfolio styling.
  const [version, setVersion] = useState<"v1" | "v2">("v1");

  const Sidebar = version === "v1" ? CaseStudyNavV1 : CaseStudyNavV2;
  const Block = version === "v1" ? ExampleBlock : ExampleBlockV2;

  return (
    <main
      className="min-h-screen bg-bg px-8 py-16"
      style={{ WebkitFontSmoothing: "antialiased" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[1240px]">
        <header className="mb-16 flex items-start justify-between gap-8">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-ink [text-wrap:balance]">
              Ditto sidebar experiment
            </h1>
            <p className="mt-2 max-w-[60ch] text-[14px] text-ink-soft [text-wrap:pretty]">
              Sticky case-study TOC inspired by Ditto. Scroll the column on the
              right; the active tile in the sidebar should track which block is
              in view and pick up its color.
            </p>
          </div>

          {/* v1 / v2 toggle */}
          <div
            role="tablist"
            aria-label="Style version"
            className="inline-flex shrink-0 overflow-hidden"
            style={{ background: "var(--color-bg-elevated)" }}
          >
            {(["v1", "v2"] as const).map((v) => {
              const isActive = version === v;
              return (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setVersion(v)}
                  className="px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-transform duration-100 ease-out active:scale-[0.96]"
                  style={{
                    background: isActive ? "#0a0a0a" : "transparent",
                    color: isActive ? "#ffffff" : "var(--color-ink-soft)",
                  }}
                >
                  {v === "v1" ? "v1 · Ditto" : "v2 · Ours"}
                </button>
              );
            })}
          </div>
        </header>

        <div className="flex gap-12">
          <aside className="w-[260px] shrink-0">
            <div className="sticky top-16">
              <Sidebar sections={sections} />
            </div>
          </aside>

          <div className="flex-1 min-w-0 flex flex-col gap-32">
            {BLOCKS.map((b, i) => (
              <Block
                key={`${version}-${b.label}`}
                id={`section-${i}`}
                color={STEP_COLORS[i]}
                block={b}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function ExampleBlock({
  id,
  color,
  block,
}: {
  id: string;
  color: string;
  block: Block;
}) {
  return (
    <section id={id} className="scroll-mt-16">
      {/* Colored band, full-bleed within its column. The white card
         hugs the top-left, leaving a thin band of color visible on the
         top and left edges (Ditto-style corner crop). The card extends
         flush to the band's right and bottom edges. */}
      <div
        className="relative overflow-hidden"
        style={{ background: color, height: "min(72vh, 620px)" }}
      >
        <div
          className="absolute bg-white"
          style={{
            top: 56,
            left: 56,
            right: 0,
            bottom: 0,
            padding: 28,
            overflow: "hidden",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -16px rgba(0,0,0,0.18)",
          }}
        >
          <BlockBody kind={block.body} accent={color} />
        </div>
      </div>

      {/* Caption directly under the colored band, Ditto-style. */}
      <p className="mt-5 text-[18px] leading-[1.5] text-ink [text-wrap:pretty] md:text-[20px]">
        <span className="font-bold">{block.lead}</span>
        <span className="text-ink-soft">, {block.caption}</span>
      </p>
    </section>
  );
}

function BlockBody({
  kind,
  accent,
}: {
  kind: Block["body"];
  accent: string;
}) {
  if (kind === "review") return <ReviewMock accent={accent} />;
  if (kind === "doc") return <DocMock accent={accent} />;
  if (kind === "translate") return <TranslateMock accent={accent} />;
  if (kind === "personalize") return <PersonalizeMock accent={accent} />;
  if (kind === "ship") return <ShipMock accent={accent} />;
  if (kind === "iterate") return <IterateMock accent={accent} />;
  return <DraftMock accent={accent} />;
}

function MockChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-cols-[1.4fr_1fr] gap-5 text-[12px] text-[#1a1a1a]">
      {children}
    </div>
  );
}

function Crumb({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-[#8a8a8a]">{children}</p>;
}

function PaneHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[15px] font-bold tracking-[-0.005em] text-[#0d0d0d]">
      {children}
    </p>
  );
}

function PreviewFrame({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mt-3 rounded p-4"
      style={{ background: `${accent}14` }}
    >
      {children}
    </div>
  );
}

function DraftMock({ accent }: { accent: string }) {
  return (
    <MockChrome>
      <div>
        <Crumb>Onboarding flow</Crumb>
        <PaneHeading># Welcome screen</PaneHeading>
        <PreviewFrame accent={accent}>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a8a8a]">
            Heading
          </p>
          <p
            className="mt-2 inline-block rounded bg-white px-2 py-1 text-[15px] font-bold leading-tight text-[#0d0d0d]"
            style={{ outline: `2px solid ${accent}` }}
          >
            Welcome aboard.
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#8a8a8a]">
            Subhead
          </p>
          <p className="mt-2 text-[13px] text-[#3a3a3a]">
            Let's get you set up in just a few minutes.
          </p>
        </PreviewFrame>
      </div>
      <SidePanel title="Drafts" tab="Activity">
        <ul className="mt-3 space-y-2.5">
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
    status === "open" ? "#aa7e2e" : status === "review" ? "#0097e6" : "#3e6b15";
  return (
    <li className="flex items-center justify-between gap-2 rounded border border-[#ececec] bg-white px-2.5 py-2">
      <span className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: dotColor }}
        />
        <span className="text-[12px] text-[#1a1a1a]">{label}</span>
      </span>
      <span className="text-[10.5px] text-[#8a8a8a]">{meta}</span>
    </li>
  );
}

function DocMock({ accent }: { accent: string }) {
  return (
    <MockChrome>
      <div>
        <Crumb>Components / Banner</Crumb>
        <PaneHeading># Promo banner</PaneHeading>
        <PreviewFrame accent={accent}>
          <div
            className="rounded-md px-4 py-3"
            style={{ background: accent, color: "#fff" }}
          >
            <p className="text-[14px] font-bold">Save 20% on annual plans</p>
            <p className="mt-1 text-[11.5px] opacity-90">
              Switch from monthly to annual and pay less.
            </p>
          </div>
        </PreviewFrame>
        <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-[#8a8a8a]">
          Variables
        </p>
        <div className="mt-1 flex gap-1.5">
          <Pill>{"{{discount}}"}</Pill>
          <Pill>{"{{plan}}"}</Pill>
        </div>
      </div>
      <SidePanel title="Linked components" tab="Project">
        <ul className="mt-3 space-y-1.5 text-[12px] text-[#3a3a3a]">
          <li className="rounded bg-[#f6f5f3] px-2 py-1.5">BillingPage.tsx</li>
          <li className="rounded bg-[#f6f5f3] px-2 py-1.5">UpgradeBanner.tsx</li>
          <li className="rounded bg-[#f6f5f3] px-2 py-1.5">EmailFooter.tsx</li>
        </ul>
        <p className="mt-3 text-[10.5px] text-[#8a8a8a]">3 instances in design</p>
      </SidePanel>
    </MockChrome>
  );
}

function ReviewMock({ accent }: { accent: string }) {
  return (
    <MockChrome>
      <div>
        <Crumb>Onboarding flow</Crumb>
        <PaneHeading># Notification frequency step</PaneHeading>
        <PreviewFrame accent={accent}>
          <div className="relative">
            <span
              className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: "#1a4ed8" }}
            >
              ✎
            </span>
            <p className="text-[11px] text-[#5a5a5a]">Notification frequency</p>
            <p
              className="mt-2 rounded-md bg-white px-3 py-2 text-[14px] font-bold leading-tight text-[#0d0d0d]"
              style={{ outline: `2px solid #1a4ed8` }}
            >
              Choose which notifications<br />you'd like to receive
            </p>
            <ul className="mt-3 space-y-2 text-[13px] font-bold text-[#7a7a7a]">
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm border border-[#7a7a7a]" />
                Email updates
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm border border-[#7a7a7a]" />
                Product notifications
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm border border-[#7a7a7a]" />
                Comment responses
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm border border-[#7a7a7a]" />
                None of the above
              </li>
            </ul>
          </div>
        </PreviewFrame>
      </div>
      <SidePanel title="Selected text" tab="Comments">
        <div className="mt-3 space-y-3 text-[11.5px]">
          <Comment
            initial="L"
            initialBg="#3e6b15"
            name="Logan Smith"
            time="20 mins ago"
            edit
          >
            <p className="font-semibold text-[#1a4ed8]">Suggested edit</p>
            <p className="mt-1 text-[#3a3a3a]">
              <span className="text-[#c0392b] line-through">Choose w</span>
              <span>Which notifications would you'd like to receive?</span>
            </p>
            <p className="mt-2 text-[10.5px] text-[#8a8a8a]">Hide 2 replies</p>
          </Comment>
          <Comment
            initial="L"
            initialBg="#3e6b15"
            name="Logan Smith"
            time="20 mins ago"
          >
            <p className="text-[#3a3a3a]">Looks great 👍</p>
          </Comment>
          <Comment
            initial="B"
            initialBg="#7b3fa9"
            name="Billie Johnson"
            time="5 mins ago"
          >
            <p className="text-[#3a3a3a]">
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
    <div className="flex h-full flex-col rounded-lg border border-[#ececec] bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#0d0d0d]">{title}</p>
        <span className="text-[14px] text-[#bababa]">×</span>
      </div>
      <div className="mt-2 flex gap-3 border-b border-[#ececec] pb-2 text-[11.5px]">
        {tabs.map((t) => (
          <span
            key={t}
            className={
              t === tab
                ? "font-bold text-[#0d0d0d]"
                : "text-[#9a9a9a]"
            }
            style={
              t === tab
                ? { borderBottom: "2px solid #0d0d0d", paddingBottom: 4 }
                : undefined
            }
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10.5px] text-[#8a8a8a]">
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
  edit,
  children,
}: {
  initial: string;
  initialBg: string;
  name: string;
  time: string;
  edit?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ background: initialBg }}
      >
        {initial}
      </span>
      <div className="flex-1 min-w-0">
        <p className="flex items-baseline gap-1.5">
          <span className="font-semibold text-[#0d0d0d]">{name}</span>
          <span className="text-[10px] text-[#8a8a8a]">· {time}</span>
        </p>
        <div className="mt-0.5">{children}</div>
        {edit ? null : null}
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#f1efeb] px-2 py-0.5 text-[10.5px] font-mono text-[#5a5a5a]">
      {children}
    </span>
  );
}

function TranslateMock({ accent }: { accent: string }) {
  const rows = [
    {
      lang: "EN",
      country: "United States",
      text: "Welcome back. Pick up where you left off.",
      status: "Source",
    },
    {
      lang: "ES",
      country: "Spain",
      text: "Bienvenido de nuevo. Continúa donde lo dejaste.",
      status: "Approved",
    },
    {
      lang: "JA",
      country: "Japan",
      text: "おかえりなさい。続きからどうぞ。",
      status: "In review",
    },
    {
      lang: "FR",
      country: "France",
      text: "Bon retour. Reprenez là où vous vous êtes arrêté.",
      status: "Approved",
    },
  ];
  return (
    <div>
      <Crumb>String / Onboarding · welcome.return</Crumb>
      <PaneHeading>Translation memory</PaneHeading>
      <div className="mt-3 overflow-hidden rounded border border-[#ececec]">
        <div className="grid grid-cols-[64px_1fr_104px] gap-3 bg-[#f6f5f3] px-3 py-2 text-[10.5px] uppercase tracking-[0.12em] text-[#8a8a8a]">
          <span>Locale</span>
          <span>String</span>
          <span>Status</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.lang}
            className="grid grid-cols-[64px_1fr_104px] items-center gap-3 border-t border-[#ececec] bg-white px-3 py-2.5 text-[12px]"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                style={{ background: i === 0 ? "#0d0d0d" : accent }}
              >
                {r.lang}
              </span>
            </span>
            <span className="truncate text-[#1a1a1a]">{r.text}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#5a5a5a]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background:
                    r.status === "Approved"
                      ? "#3e6b15"
                      : r.status === "In review"
                        ? "#aa7e2e"
                        : "#9a9a9a",
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

function PersonalizeMock({ accent }: { accent: string }) {
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
            className="flex items-center gap-3 rounded-md border border-[#ececec] bg-white px-3 py-2.5"
          >
            <span
              className="h-7 w-1 rounded-full"
              style={{ background: v.live ? accent : "#dcd8cf" }}
            />
            <div className="flex-1 min-w-0">
              <p className="flex items-center gap-2">
                <span className="text-[12.5px] font-bold text-[#0d0d0d]">
                  {v.name}
                </span>
                <span className="font-mono text-[10.5px] text-[#8a8a8a]">
                  {v.audience}
                </span>
              </p>
              <p className="mt-0.5 truncate text-[12px] text-[#3a3a3a]">
                {v.copy}
              </p>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]"
              style={{
                background: v.live ? accent : "#f1efeb",
                color: v.live ? "#fff" : "#8a8a8a",
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

function ShipMock({ accent }: { accent: string }) {
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
            className="rounded-md border border-[#ececec] bg-white px-3 py-2.5"
          >
            <p className="flex items-center justify-between">
              <span className="text-[12.5px] font-bold text-[#0d0d0d]">
                {c.kind}
              </span>
              <span className="font-mono text-[10.5px] text-[#8a8a8a]">
                {c.file}
              </span>
            </p>
            <p className="mt-1.5 text-[11.5px] text-[#c0392b] line-through">
              {c.before}
            </p>
            <p
              className="text-[11.5px] font-semibold"
              style={{ color: accent }}
            >
              {c.after}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-md bg-[#f6f5f3] px-3 py-2.5 text-[11.5px]">
        <span className="text-[#5a5a5a]">
          Will sync to <span className="font-mono">api.acme.com</span>
        </span>
        <button
          type="button"
          className="rounded-md px-3 py-1.5 text-[12px] font-bold text-white transition-transform duration-100 ease-out active:scale-[0.96]"
          style={{ background: accent }}
        >
          Publish 3 changes
        </button>
      </div>
    </div>
  );
}

function IterateMock({ accent }: { accent: string }) {
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
            className="rounded-md border bg-white p-3"
            style={{
              borderColor: v.winning ? accent : "#ececec",
              boxShadow: v.winning ? `0 0 0 2px ${accent}33` : undefined,
            }}
          >
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-[#8a8a8a]">
              {v.label}
            </p>
            <p className="mt-1.5 text-[15px] font-bold text-[#0d0d0d]">
              "{v.copy}"
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span
                className="text-[24px] font-bold leading-none tabular-nums"
                style={{ color: v.winning ? accent : "#3a3a3a" }}
              >
                {v.ctr}%
              </span>
              {v.delta ? (
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{ color: accent }}
                >
                  {v.delta}
                </span>
              ) : null}
            </div>
            {v.winning ? (
              <div className="mt-2">
                <Sparkline color={accent} />
              </div>
            ) : (
              <div className="mt-2">
                <Sparkline color="#bcbcbc" flat />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[#8a8a8a]">
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
