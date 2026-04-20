"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Chapter = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

const chapters: Chapter[] = [
  {
    eyebrow: "01 · The tension",
    title: "Malls browse. Apps transact.",
    body: "A mall is built for wandering. A quick-commerce app is built for getting in and out. The brief lived in the gap between the two: a daily habit that still felt like an afternoon out.",
    image: "/works/nexus-247/homescreens.png",
    alt: "Three home variations: familiarity, discovery, speed",
  },
  {
    eyebrow: "02 · Principle one",
    title: "Make it feel known.",
    body: "Familiarity carries the return visit. The surface has to earn trust on day one and still feel effortless on day thirty. Onboarding was the first place to prove it.",
    image: "/works/nexus-247/onboarding.png",
    alt: "Onboarding, the system's entry moment",
  },
  {
    eyebrow: "03 · Principle two",
    title: "Bring back wandering.",
    body: "A catalogue can list everything. A mall shows you what you didn't know you wanted. Categories, lists, and product pages had to feel like turning corners, not filtering rows.",
    image: "/works/nexus-247/categories-plp-pdp.png",
    alt: "Categories, product list, product detail",
  },
  {
    eyebrow: "04 · Principle three",
    title: "Pay for discovery with speed.",
    body: "Whatever discovery asked for at the top, checkout couldn't repeat at the bottom. The bag, coupon, and tracking collapsed into the shortest path. Every tap removed was a return visit earned.",
    image: "/works/nexus-247/bag-coupon-tracking.png",
    alt: "Bag, coupon, tracking: the phygital handoff",
  },
  {
    eyebrow: "05 · The detail",
    title: "Small surfaces do the work.",
    body: "The loyalty card, the coupon, the order confirmation. Short moments that reward a return visit and make the product feel considered. The mall's gift here, not the app's default.",
    image: "/works/nexus-247/profilecard-closeup.png",
    alt: "Nexus Cash loyalty card, close-up",
  },
  {
    eyebrow: "06 · The system",
    title: "One shell, many retailers.",
    body: "A shared visual system scales across brands without flattening them. Skin the chrome, keep the bones. What launched as one product now runs across 17+ malls.",
    image: "/works/nexus-247/profile.png",
    alt: "Profile surface, the personal layer",
  },
];

export function NexusScrolly() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <main ref={rootRef} className="flex flex-col">
      {/* Hero */}
      <section className="pt-20 md:pt-28">
        <div className="page-container">
          <div className="flex items-baseline gap-3 text-[11px] uppercase tracking-[0.16em] text-muted">
            <span>Draft</span>
            <span aria-hidden className="text-line">
              ·
            </span>
            <span>Scroll experiment</span>
          </div>
          <h1 className="mt-6 max-w-[22ch] text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
            Nexus 247, told in scroll.
          </h1>
          <p className="mt-6 max-w-[56ch] text-pretty text-[17px] leading-[1.6] text-ink-soft md:text-[18px]">
            A retelling of the Nexus 247 case study, re-shaped for the scroll
            bar. Same work, different pacing: one idea per chapter, one screen
            at a time.
          </p>
          <div className="mt-16 flex items-center gap-3 text-[12px] text-muted">
            <span aria-hidden className="h-px w-8 bg-line" />
            Scroll to enter
          </div>
        </div>
      </section>

      {/* Scrolly section */}
      <section className="mt-24 md:mt-36">
        <div className="page-container md:grid md:grid-cols-[45fr_55fr] md:gap-10 lg:gap-16">
          {/* Sticky graphic. On mobile this sticks at top-[64px] with h-[52vh];
              on desktop it becomes a full-height pinned panel beside the chapters. */}
          <div className="sticky top-[56px] z-10 h-[52vh] bg-bg md:top-0 md:h-screen">
            <div className="relative flex h-full items-center justify-center py-4 md:py-10">
              {chapters.map((c, i) => (
                <div
                  key={c.image}
                  aria-hidden={active !== i}
                  className="pointer-events-none absolute inset-4 flex items-center justify-center transition-opacity duration-700 ease-out motion-reduce:duration-0 md:inset-8"
                  style={{ opacity: active === i ? 1 : 0 }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      className="object-contain"
                      sizes="(min-width: 768px) 45vw, 100vw"
                      priority={i === 0}
                    />
                  </div>
                </div>
              ))}

              {/* Chapter indicator */}
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.14em] text-muted tabular-nums md:bottom-6">
                <span className="text-ink-soft">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="mx-1.5 text-line">
                  /
                </span>
                <span>{String(chapters.length).padStart(2, "0")}</span>
              </div>
            </div>
          </div>

          {/* Chapter text column */}
          <div className="pt-6 md:pt-0">
            {chapters.map((c) => (
              <section
                key={c.title}
                data-chapter
                className="flex min-h-[90vh] flex-col justify-center py-[14vh] md:min-h-screen md:py-[22vh]"
              >
                <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
                  {c.eyebrow}
                </span>
                <h2 className="mt-5 max-w-[22ch] text-balance text-[clamp(1.75rem,3.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.015em] text-ink">
                  {c.title}
                </h2>
                <p className="mt-5 max-w-[42ch] text-pretty text-[16.5px] leading-[1.65] text-ink-soft md:text-[17.5px]">
                  {c.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Outcome */}
      <section className="mt-20 border-t border-line pt-24 md:mt-28 md:pt-36">
        <div className="page-container">
          <div className="max-w-[800px]">
            <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
              Outcome
            </span>
            <h2 className="mt-5 max-w-[20ch] text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
              Live across 17+ malls.
            </h2>
            <p className="mt-6 max-w-[54ch] text-pretty text-[17px] leading-[1.65] text-ink-soft md:text-[18px]">
              A physical retail experience translated into a scalable digital
              product, without fragmenting into separate apps, inconsistent
              flows, or parallel campaigns.
            </p>
            <a
              href="https://shopnexusone.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent mt-8 inline-flex items-center gap-2 text-[15px]"
              data-cursor="external"
              data-cursor-label="Live site"
            >
              Visit the live site
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="relative mt-14 aspect-[16/9] w-full overflow-hidden bg-bg-elevated md:mt-20">
            <Image
              src="/works/nexus-247/bag-coupon-tracking.png"
              alt="Bag, coupon, tracking: the phygital handoff"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      <div className="h-28 md:h-40" />
    </main>
  );
}
