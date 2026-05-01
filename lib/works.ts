export type MediaItem = {
  src?: string;
  alt?: string;
  /** e.g. '16/10', '4/5', '9/16', '3/4'. Defaults per layout. */
  aspect?: string;
};

export type DeviceScrollTab = {
  /** Tab label shown in the pill selector above the frame. */
  label: string;
  /** Short line of copy shown below the tabs for this tab. */
  caption?: string;
  /** Path to the tall full-page capture (taller than the frame). */
  src?: string;
  alt?: string;
};

export type Media =
  | {
      kind: "single";
      item: MediaItem;
      caption?: string;
      fullBleed?: boolean;
    }
  | {
      kind: "pair";
      items: [MediaItem, MediaItem];
      caption?: string;
    }
  | {
      /**
       * Draggable before/after reveal. Both images stack inside one frame;
       * a vertical handle clips the top one to compare against the bottom.
       */
      kind: "slider";
      before: MediaItem & { src: string };
      after: MediaItem & { src: string };
      /** Frame aspect ratio. Defaults to '16/10'. */
      aspect?: string;
      caption?: string;
    }
  | {
      kind: "triptych";
      items: [MediaItem, MediaItem, MediaItem];
      caption?: string;
    }
  | {
      kind: "row";
      items: MediaItem[];
      caption?: string;
    }
  | {
      /**
       * Scrollable device frame: a clipped window holding a tall screenshot.
       * As the section scrolls, the inner image translates upward so the full
       * page plays through the frame. Tabs switch between different captures.
       */
      kind: "deviceScroll";
      tabs: DeviceScrollTab[];
      /** Optional small thumbnail docked below the frame. */
      thumbnail?: { src: string; alt?: string };
      /** Aspect ratio of the frame viewport. Defaults to a mobile phone shape. */
      frameAspect?: string;
      caption?: string;
    };

export type ProblemItem = {
  kicker: string;
  label: string;
  body: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type PullQuote = {
  text: string;
  attribution: string;
};

export type CaseSection = {
  label: string;
  title: string;
  body: string[];
  /** Horizontal row of big-value stat cells. Renders after body. */
  stats?: StatItem[];
  /** Centered block quote with attribution. Renders after stats. */
  pullQuote?: PullQuote;
  /** 2×2 grid of numbered problem/label/body cells. Renders after pullQuote. */
  problems?: ProblemItem[];
  /** Closing prose paragraphs that render after the problem grid and before media. */
  bodyAfter?: string[];
  media?: Media;
  /** When true, section renders collapsed behind a drawer trigger. */
  collapsible?: boolean;
  /** Optional meta shown on the drawer trigger when collapsible. */
  drawerHint?: string;
};

export type Work = {
  slug: string;
  title: string;
  kind: string;
  /** Short evocative line shown under the thumbnail on the homepage card (e.g., "The future of X and Y"). */
  tagline: string;
  summary: string;
  status: "Live" | "Shipped" | "Concept" | "Archived";
  year: string;
  role: string;
  timeline: string;
  team: string;
  /**
   * Public URL for the live site or app (https://... or store link).
   * When present, the case study hero renders a "Live site" / "App" CTA.
   */
  liveUrl?: string;
  /** Optional short label for the liveUrl CTA (e.g. "App Store"). Defaults to hostname. */
  liveLabel?: string;
  /** Path under /public, e.g. "/works/nexus-247.jpg" or .mp4. Video formats play on hover. */
  thumbnail?: string;
  /** Optional still image shown before a video thumbnail begins playing. */
  thumbnailPoster?: string;
  heroMedia?: Media;
  sections: CaseSection[];
};

export const works: Work[] = [
  {
    slug: "nexus-247",
    title: "Nexus 247",
    kind: "Quick-commerce product",
    tagline: "Mall-style browsing, quick-commerce speed. Shipped across 17+ malls.",
    summary:
      "Balancing mall-style discovery with quick-commerce speed: a unified UI system across multiple brands.",
    status: "Live",
    year: "2025",
    role: "UI Designer, Pineapple Design Studio",
    timeline: "2025",
    team: "Studio team",
    liveUrl: "https://shopnexusone.com/",
    thumbnail: "/works/nexus-247.mp4",
    thumbnailPoster: "/works/nexus-247.png",
    heroMedia: {
      kind: "single",
      fullBleed: true,
      item: {
        src: "/works/nexus-247.png",
        alt: "Nexus 247 cover",
      },
      caption: "Cover. The retail entry point, re-imagined for daily habit.",
    },
    sections: [
      {
        label: "Context",
        title:
          "Design a digital commerce experience that balances the speed of quick-commerce with the exploratory nature of mall shopping.",
        body: [
          "The client needed to stay relevant beyond physical visits: growing engagement frequency, avoiding an occasion-based relationship, and becoming something closer to a daily habit.",
          "Quick-commerce apps are built for transactions. Malls are built for browsing. The brief lived in the tension between the two.",
        ],
      },
      {
        label: "Principles",
        title:
          "I worked from three principles: familiarity, discovery, speed.",
        body: [
          "Familiarity: make the experience easy enough to use every day.",
          "Discovery: keep the feeling of browsing a mall, even on a small screen.",
          "Speed: never slow the user down once they know what they want.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/nexus-247/homescreens.png",
            alt: "Home screen variations: three takes on Familiarity, Discovery, Speed",
            aspect: "16/10",
          },
          caption: "Three home variations, three moments of the principle in practice.",
        },
      },
      {
        label: "Approach",
        title:
          "A modular, content-driven system: quick-commerce efficiency with in-mall discovery richness.",
        body: [
          "I built a unified visual system that could scale across multiple retailers, with shared patterns for browsing, merchandising, and checkout. The skin per brand stayed flexible, but the bones of every flow were the same. That kept the experience consistent for the user and the build sane for the team.",
          "Then I added physical-to-digital touchpoints. The mall doesn't end when the user leaves the parking lot, so the campaigns and the loyalty surfaces shouldn't either. Tracking, coupons, and rewards became a thread back into the next visit.",
        ],
        media: {
          kind: "triptych",
          items: [
            {
              src: "/works/nexus-247/categories-plp-pdp.png",
              alt: "Browsing system: categories, product list, product detail",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/onboarding.png",
              alt: "Onboarding, the system's entry moment",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/profile.png",
              alt: "Profile, the personal surface",
              aspect: "4/3",
            },
          ],
          caption: "Shared system · brand-specific skin.",
        },
      },
      {
        label: "Process",
        title: "What I considered before opening Figma.",
        body: [
          "I started by mapping the two patterns I was trying to fuse. Quick-commerce apps, like Blinkit and Instamart, optimise for the transaction: a search bar, a category strip, and a fast checkout. Mall apps optimise for the visit: wayfinding, curated displays, loyalty cards. Neither tries to do both.",
          "The unlock for me was treating the home surface as a wayfinding moment, not a search bar with a horizontal scroll of categories. Each retailer needed space to surface what's new, the same way a window display does in a mall. From there the rest of the flow could stay quick, so the daily-habit feeling held: a scenic home paired with a fast checkout.",
          "I also pulled references outside the category. Editorial homepages from fashion publications, museum wayfinding, even mall directories. The look I was after was closer to a magazine cover than a category grid.",
        ],
      },
      {
        label: "Outcome",
        title: "A scalable digital product, now across 17+ malls.",
        body: [
          "The result extended across a network of 17+ physical locations.",
          "The unified UI system lets the retailer's identity carry across brands and categories in the digital surface, rather than fragmenting into separate apps, inconsistent flows, and separate campaigns.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/nexus-247/bag-coupon-tracking.png",
            alt: "Bag, coupon, tracking: the physical-to-digital handoff in the cart and post-purchase",
            aspect: "16/9",
          },
          caption: "Bag · coupon · tracking: the physical-to-digital handoff.",
        },
      },
      {
        label: "Full screens",
        title: "The full flow, end to end.",
        body: [
          "A walk through the shipped surfaces. Scroll to follow each page in full, and switch between home, browse, and the physical-to-digital checkout.",
        ],
        media: {
          kind: "deviceScroll",
          tabs: [
            {
              label: "Homepage",
              caption: "The daily entry point, built for return visits.",
              src: "/works/nexus-247/homepage_light_tall.png",
              alt: "Nexus 247 homepage, full-page walkthrough",
            },
            {
              label: "PLP",
              caption: "Product list, paced like turning corners in a mall.",
              src: "/works/nexus-247/plp_tall.png",
              alt: "Nexus 247 product list page, full-page walkthrough",
            },
            {
              label: "PDP",
              caption: "Product detail, the moment of consideration.",
              src: "/works/nexus-247/pdp_tall.png",
              alt: "Nexus 247 product detail page, full-page walkthrough",
            },
          ],
        },
      },
      {
        label: "Checkout flow",
        title: "The phygital handoff, in full.",
        body: [
          "Bag, coupon, and order tracking. The short path back to the next visit, scrollable in full across each surface.",
        ],
        media: {
          kind: "deviceScroll",
          tabs: [
            {
              label: "Bag",
              caption: "Bag. Every tap removed is a return visit earned.",
              src: "/works/nexus-247/bag_tall.png",
              alt: "Nexus 247 bag, full-page walkthrough",
            },
            {
              label: "Coupons",
              caption: "Coupons. The reward moment, made tangible.",
              src: "/works/nexus-247/coupons_tall.png",
              alt: "Nexus 247 coupons, full-page walkthrough",
            },
            {
              label: "Tracking",
              caption: "Tracking. The post-buy surface that earns the next visit.",
              src: "/works/nexus-247/tracking_tall.png",
              alt: "Nexus 247 order tracking, full-page walkthrough",
            },
          ],
        },
      },
      {
        label: "Craft details",
        title: "The small surfaces do a lot of the work.",
        body: [
          "The loyalty card, the coupon, the order confirmation. Short moments that reward a return visit and make the product feel considered.",
        ],
        media: {
          kind: "row",
          items: [
            {
              src: "/works/nexus-247/shots.png",
              alt: "Bag, order tracking, and Nexus Cash: the handoff, in detail",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/success-rewards-profile.png",
              alt: "Exclusive stores, rewards, and loyalty history",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/profilecard-closeup.png",
              alt: "Nexus Cash card, closeup of the loyalty object",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/coupon-closeup.png",
              alt: "Coupon applied, the reward moment, closeup",
              aspect: "4/3",
            },
          ],
          caption: "Loyalty and rewards, up close.",
        },
      },
      {
        label: "Reflection",
        title:
          "Digital can extend the physical world without replacing it.",
        body: [
          "The takeaway for me was that designing for the seam between physical and digital is often more valuable than perfecting either side in isolation. Speed, discovery, and brand consistency aren't opposites; they just need a system holding them together.",
        ],
      },
      {
        label: "Throwaways",
        title: "Explorations that didn't ship.",
        collapsible: true,
        drawerHint: "Iterations",
        body: [
          "Not every idea landed. The throwaways below are loyalty and rewards explorations that didn't ship, kept as a record of what the surface wanted to be, and what it shouldn't.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/nexus-247/throwaways.png",
            alt: "Throwaways: rewards and loyalty iterations that didn't ship",
            aspect: "16/10",
          },
          caption: "Throwaways. Iterations that didn't ship.",
        },
      },
    ],
  },
  {
    slug: "outcomes-ai",
    title: "OutcomesAI",
    kind: "Healthtech site",
    tagline: "A redesign that contributed to OutcomesAI's $10M seed round, by making a technically complex product legible to the people writing the cheques.",
    summary:
      "A dense clinical-AI platform, translated into something a healthcare buyer understands in 30 seconds.",
    status: "Live",
    year: "2025",
    role: "UI Designer, Pineapple Design Studio",
    timeline: "3 months, 2025",
    team: "Studio team",
    liveUrl: "https://outcomes.ai/",
    thumbnail: "/works/outcomes/outcomes-thumbnail.mp4",
    heroMedia: {
      kind: "single",
      fullBleed: true,
      item: {
        src: "/works/outcomes/Homepage walkthrough.mp4",
        alt: "OutcomesAI cover: the redesigned homepage, scrolled in a browser",
        aspect: "16/10",
      },
      caption: "Cover. The redesigned homepage, in motion.",
    },
    sections: [
      {
        label: "Context",
        title: "What OutcomesAI actually is.",
        body: [
          "OutcomesAI is a US-based healthcare platform founded by Kuldeep Singh Rajput, the former CEO of Biofourmis. The core product is Glia, an AI engine that combines voice agents with licensed nurses to deliver patient care at scale. Glia handles routine interactions autonomously: triage calls, scheduling, discharge follow-ups, medication adherence. When clinical judgment is needed, it escalates to a licensed nurse, powered by AI-assisted scribing and decision support that makes each nurse 3–5× more productive.",
          "The business case is clear: healthcare systems face a nursing shortage, sky-high triage costs, and 24/7 patient demand that no human team can sustainably meet. Glia is the answer. The problem when we came on board was that nobody could tell that from the website.",
        ],
      },
      {
        label: "Problem",
        title: "The brand was hiding the product.",
        body: [
          "The existing OutcomesAI digital presence had a fundamental mismatch: the product was sophisticated, clinically rigorous, and genuinely differentiated. The brand told none of that. It read like every other AI health-tech company: abstract claims, dense jargon, no clear explanation of what Glia actually did or why a healthcare system should trust it with patient calls.",
        ],
        problems: [
          {
            kicker: "01",
            label: "Glia was buried",
            body: "The core product had no clear narrative. Visitors couldn't quickly understand what it did, who it was for, or why it was safer than alternatives.",
          },
          {
            kicker: "02",
            label: "Jargon over clarity",
            body: "The site relied on text-heavy explanations of multi-agent AI systems. Healthcare buyers don't want to decode technology. They want to see outcomes.",
          },
          {
            kicker: "03",
            label: "Trust deficit",
            body: "Clinical credibility signals (certifications, protocols, nurse testimony) were either absent or deprioritised.",
          },
          {
            kicker: "04",
            label: "Brand felt temporary",
            body: "The visual identity was inconsistent and couldn't scale. No messaging system, no pattern language.",
          },
        ],
        bodyAfter: [
          "The site needed to function as a sales tool for enterprise healthcare buyers, CMOs and COOs who typically take 6–18 months to evaluate a vendor. If they couldn't understand the product in 30 seconds, they wouldn't schedule a demo.",
        ],
        media: {
          kind: "slider",
          before: {
            src: "/works/outcomes/before-homepage.png",
            alt: "Before: the original outcomes.ai homepage with the headline 'Artificial Medical Intelligence'",
          },
          after: {
            src: "/works/outcomes/after.avif",
            alt: "After: the redesigned homepage shown in a browser mockup, headline 'AI-enabled Nursing. Human Care at Scale.'",
          },
          aspect: "16/9",
          caption: "Drag to compare. Same story, told differently.",
        },
      },
      {
        label: "Research",
        title: "What the category was already doing.",
        body: [
          "Before reframing anything, we audited how other clinical-AI companies were positioning themselves. The pattern was identical across the category: hero metrics, AI-first language, abstract multi-agent diagrams, generic nurse stock photos. None of them led with the people actually doing the work.",
          "That gap was the opening. If every competitor was selling “AI for healthcare,” OutcomesAI could win the buyer in 30 seconds by selling “nurses with their time back.” Same product, opposite shelf.",
        ],
      },
      {
        label: "Narrative",
        title: "Nurses first, AI second.",
        body: [
          "We reframed the entire narrative. OutcomesAI isn't an AI company selling to healthcare; it's a nursing company using AI to give nurses their time back. The tagline that shipped, “AI-enabled Nursing. Human Care at Scale,” puts nurses first deliberately, and that word order changed every headline downstream.",
        ],
      },
      {
        label: "Glia",
        title: "Glia needed its own story.",
        body: [
          "Glia was the differentiator and it was invisible on the old site. We gave it its own section, a before-and-after workflow narrative, and a scalable pattern system, textured and pixelated, that could represent its presence across surfaces without falling back on generic AI visuals.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/Fold 5 - Glia.mp4",
            alt: "Glia's anatomy: voice agents, clinical scribing, escalation protocols",
            aspect: "16/9",
          },
          caption: "Glia's anatomy. AI as architecture, not a black box.",
        },
      },
      {
        label: "Motion",
        title: "Motion as explanation, not decoration.",
        body: [
          "Complex AI workflows don't survive being written as paragraphs. I used motion to show the Glia sequence: a call comes in, the AI triages, a nurse receives a clinical summary, the interaction closes, all in under ten seconds. The constraint: healthcare buyers read slow animation as precision. Every movement was deliberate.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/ai-agents-motion.mp4",
            alt: "AI agents in motion: triage, scheduling, documentation, escalation, sequenced as workflow",
            aspect: "16/9",
          },
          caption: "Agents at work, sequenced as workflow.",
        },
      },
      {
        label: "Solutions",
        title: "Reframed for the buyer, not the technology.",
        body: [
          "Each solution leads with the use case (virtual care teams, in-clinic nurses, hospital systems), not the underlying capability. Buyers stopped having to translate technical features into deployment scenarios; the page does the translation for them.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/solutions.mp4",
            alt: "Solutions section organised by who's deploying the product",
            aspect: "16/9",
          },
          caption: "Solutions, sorted by who's using them.",
        },
      },
      {
        label: "Brand system",
        title: "A system that scales from screen to stage.",
        body: [
          "Built as a system, not a logo lockup. The OutcomesAI team could carry it into investor decks, recruiting decks, and conference rigs without touching me again. The same identity holds up on a phone, in a deck, and on a keynote backdrop.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/Brand System.mp4",
            alt: "Brand system: typography, motion, color, applied across surfaces",
            aspect: "16/9",
          },
          caption: "Brand, end to end.",
        },
      },
      {
        label: "Mobile",
        title: "Same story, on the phone.",
        body: [
          "Healthcare procurement still happens in email and browser tabs, and every link a CMO forwards has a 50/50 chance of opening on mobile first. The mobile surface had to land the same model in a smaller frame, with no sacrifice to clarity or trust.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/mobile-mockup.mp4",
            alt: "OutcomesAI mobile experience, scrolled in a phone frame",
            aspect: "16/9",
          },
          caption: "Mobile. Same trust signals, same story, smaller frame.",
        },
      },
      {
        label: "Outcome",
        title: "Faster comprehension, stronger trust, $10M seed.",
        body: [
          "The redesign contributed to OutcomesAI's positioning when they raised a $10M seed round led by Sant Ventures in October 2025. The numbers the site needed to make credible: 50% cost reduction in triage operations, 70% of interactions resolved without human escalation, 3–5× nurse productivity with Glia.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/d.jpg",
            alt: "Healthtech Innovation Summit 2025: OutcomesAI keynote",
            aspect: "16/9",
          },
          caption: "Healthtech Innovation Summit 2025. The brand, at scale.",
        },
      },
      {
        label: "Reflection",
        title: "The job wasn't the interface. It was the translation.",
        body: [
          "The challenge wasn't designing screens. It was making a technically dense system legible to people making slow, high-stakes decisions. Motion became the main tool, not for delight but because sequence is easier to follow than paragraphs. The bigger lesson: reframing the brand narrative from AI to nursing empowerment changed every visual hierarchy decision downstream. Strategy and design were the same thing on this project.",
        ],
      },
    ],
  },
  {
    slug: "zilo",
    title: "Zilo",
    kind: "Fashion quick-commerce · 0→1",
    tagline: "Fashion quick-commerce, rebuilt from the return up. 0→1 in 8 weeks.",
    summary:
      "Not a catalogue with faster delivery. A different way to shop. Four category failures, four design responses, shipped in under 8 weeks.",
    status: "Live",
    year: "2025",
    role: "Product designer, Pineapple Design Studio",
    timeline: "4–8 weeks, 2025",
    team: "Project lead, brand lead, senior UX, 2 product designers (incl. me)",
    liveUrl: "https://zilo.one/",
    thumbnail: "/works/zilo.mp4",
    thumbnailPoster: "/works/zilo.png",
    heroMedia: {
      kind: "single",
      fullBleed: true,
      item: {
        src: "/works/zilo.png",
        alt: "Zilo cover",
        aspect: "16/10",
      },
      caption: "Cover. Fashion quick-commerce, re-imagined end-to-end.",
    },
    sections: [
      {
        label: "Context",
        title: "The category hadn't kept up with its own promise.",
        body: [
          "Zilo's founders, ex-Flipkart and Myntra, had a clear thesis: quick-commerce applied to fashion. Curated styles from top brands, delivered in under 60 minutes. The opportunity wasn't logistics. Faster delivery had arrived; the shopping experience hadn't.",
          "Myntra, Ajio, and their peers share the same assumptions: surface everything, let filters do the work, accept high returns as the cost of doing business. Four structural failures, and no major player had solved any.",
        ],
        problems: [
          {
            kicker: "01",
            label: "High return rates",
            body: "Size mismatches, unmet expectations.",
          },
          {
            kicker: "02",
            label: "No try-before-you-buy",
            body: "Confidence stays low without physical trial.",
          },
          {
            kicker: "03",
            label: "No scheduled delivery",
            body: "Intent is gone by the time the package arrives.",
          },
          {
            kicker: "04",
            label: "No curated discovery",
            body: "Catalogue browsing, not looks or trend-led shopping.",
          },
        ],
      },
      {
        label: "Research",
        title: "What the category was assuming.",
        body: [
          "Before designing anything, the team audited Myntra, Ajio, Nykaa Fashion, and Tata CLiQ. The assumption baked into every one of them was the same: more SKUs, better filters, returns are an unavoidable cost. The way Indian shoppers actually browse, by occasion, by mood, by trend, wasn't reflected anywhere in the tab bar.",
          "We also pulled references from outside the category: editorial magazines (Vogue, GQ India), Nordstrom's curated lookbooks, the way Pinterest treats outfits. The pattern across all of them was the same: people browse fashion like inspiration, not inventory.",
        ],
      },
      {
        label: "Brief & approach",
        title: "Four problems, not a 1:1 response grid.",
        body: [
          "At Pineapple, I worked across the full 0→1 build: branding exploration, UX, UI, and dev-ready files. Agency work moves in phases: brand first, UX in parallel, then UI. I contributed across all three alongside a brand lead and a senior UX designer, and owned UI end-to-end. No prior system. Everything from scratch in 4–8 weeks, Android and iOS.",
          "The four category problems don't map 1:1 to four features. Home Trials answers returns and try-before-buy in a single move. The anxiety that drives scheduled delivery is resolved by a reliable, guaranteed 60-minute window. That left two bets the brief didn't ask for but the product needed: Ask Zilo, and a post-purchase surface that shipped with the MVP.",
        ],
      },
      {
        label: "Returns",
        title: "Home Trials: design for the return before it happens.",
        body: [
          "High return rates in fashion aren't a logistics problem. They're a confidence problem. The standard response is better size guides or peer reviews. Home Trials goes further: shoppers order multiple sizes, try them at home, return the rest, all in the same 60-minute window. A style runner waits up to 30 minutes; the delivery only completes once the user confirms.",
          "This required a new decision layer on the product page. The size selector surfaces a Home Trial affordance with its own framing (\u201cIntroducing home trials\u201d) that attacks the anxiety at exactly the moment it exists, before the user abandons. The cart distinguishes trial and standard shipments. The post-purchase surface handles the return without friction.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/zilo/homepage-pdp-plp.png",
            alt: "PDP with Home Trial affordance: order multiple sizes, try at home, return the rest",
            aspect: "16/10",
          },
          caption: "PDP. Home Trials surfaced at the decision layer, before the user abandons.",
        },
      },
      {
        label: "Discovery",
        title: "Curated looks and trends, not a catalogue with better filters.",
        body: [
          "Every major fashion app treats discovery as a filtering problem, but the way people shop (\u201cI need something for a rooftop dinner\u201d) doesn't map to any filter combination. We rebuilt discovery around editorial structures.",
          "The home has a Daily Planner that organises by occasion (Wellness & Yoga, Party Ready), not by category. A Lookbook does the mix-and-match work. Trend Radar gives seasonal context to what's in stock. Discover became its own destination, not an alternative to search.",
          "The bet: if the editorial layer is good enough, users will browse Zilo the way they browse a magazine, not the way they mine a catalogue.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/zilo/fashion.png",
            alt: "Discover Looks and Trend Radar: editorial structures for curated browsing",
            aspect: "16/10",
          },
          caption: "Discover. Lookbook and Trend Radar, not search-by-filter.",
        },
      },
      {
        label: "Confidence",
        title: "Ask Zilo: conversational discovery in the core nav.",
        body: [
          "Even with curated surfaces, there are moments when a shopper knows what they want but can't describe it in filter terms. Ask Zilo lives in the tab bar, with equal weight to Home and Shop, not buried in a help menu.",
          "The design decision was placement and framing. A tab-bar slot with its own 60-min badge signals that AI-assisted discovery is a product pillar, not a chatbot. It doubles as an escape hatch from the PLP: \u201cDon't want to scroll 475 items? Ask Zilo.\u201d An honest acknowledgement of catalogue size, turned into a feature moment.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/zilo/ask-zilo.mp4",
            alt: "Ask Zilo conversational UI tab bar with 60 minute badge",
            aspect: "4/3",
          },
          caption: "Ask Zilo. Conversational discovery elevated to a core tab.",
        },
      },
      {
        label: "Retention",
        title: "Post-purchase at launch, not deferred to v2.",
        body: [
          "Building a 0→1 product means constant pressure to cut scope. Post-purchase flows don't drive acquisition; they're the first thing to defer. But in quick-commerce, the first order is rarely profitable. The business only works on the second purchase and the third.",
          "We treated the post-buy surface as a retention product. The bag distinguishes Home Trial and standard shipments. Live tracking surfaces ETA in minutes, not date ranges. Order history is searchable by status. It shipped at launch because the quick-commerce argument depended on it.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/zilo/post-buy.png",
            alt: "Post-buy surfaces: bag with dual shipments, live tracking, searchable order history",
            aspect: "16/9",
          },
          caption: "Bag · tracking · order history. Retention, shipped with the MVP.",
        },
      },
      {
        label: "Full screens",
        title: "The editorial surface, end to end.",
        body: [
          "Homepage, brands, looks, trends, product detail. Scroll each page in full to see how the editorial voice carries from entry surface to checkout.",
        ],
        media: {
          kind: "deviceScroll",
          tabs: [
            {
              label: "Homepage",
              caption: "Daily Planner by occasion, not category.",
              src: "/works/zilo/homepage%20tall.png",
              alt: "Zilo homepage, full-page walkthrough",
            },
            {
              label: "Brands",
              caption: "Brand stories, shelf by shelf.",
              src: "/works/zilo/brands%20tall.png",
              alt: "Zilo brands surface, full-page walkthrough",
            },
            {
              label: "Looks",
              caption: "Lookbook: mix-and-match, not filter-and-scroll.",
              src: "/works/zilo/looks%20tall.png",
              alt: "Zilo looks surface, full-page walkthrough",
            },
            {
              label: "Trends",
              caption: "Trend Radar: seasonal context for what's in stock.",
              src: "/works/zilo/trends%20tall.png",
              alt: "Zilo trends surface, full-page walkthrough",
            },
            {
              label: "PDP",
              caption: "Home Trials surfaced at the decision layer.",
              src: "/works/zilo/pdp%20tall.jpg",
              alt: "Zilo product detail page, full-page walkthrough",
            },
          ],
        },
      },
      {
        label: "Craft",
        title: "The hardest problem was making it feel different. The answer was one mark.",
        body: [
          "Four design responses will only carry a product so far. The challenge was making a fashion-commerce app feel different from everything else in the category, and that answer wasn't one breakthrough. It came from one consistent mark.",
          "The slash starts in the wordmark (Z/LO) and carries through as a typographic voice (/Ask Zilo, /store, /door), and as a separator in feature strips. A two-accent palette (deep plum, acid lime, with hot pink reserved for urgency) reads as editorial rather than transactional. Photography is campaign-quality, not catalogue grids. Illustration is warmer, flat-with-shadow, used only on soft moments (empty states, confirmations) to keep the editorial register undiluted.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/zilo/onboarding.png",
            alt: "Onboarding sequence: the slash as voice, carried from wordmark into type",
            aspect: "16/10",
          },
          caption: "Onboarding. The slash as brand voice, applied to product pillars.",
        },
      },
      {
        label: "Outcome",
        title: "Shipped fast. Found product-market fit. Raised $19.9M.",
        body: [
          "The MVP shipped in under 8 weeks on Android and iOS: branding, all core flows, dev-ready files, from a blank canvas. Zilo launched and found product-market fit. A $4.5M seed co-led by Info Edge Ventures and Chiratae Ventures closed shortly after; a $15.3M Series A led by Peak XV Partners followed in 2026.",
          "The design wasn't the reason investors backed Zilo, but it was the product they saw. We built the case that Zilo could fix what Chiratae themselves had named as broken.",
        ],
        stats: [
          { value: "0\u21921", label: "Full product: brand to dev-ready files" },
          { value: "<8 wks", label: "Brief to shipped, Android + iOS" },
          { value: "$4.5M", label: "Seed round, post-launch" },
          { value: "$19.9M", label: "Total raised across two rounds" },
        ],
        pullQuote: {
          text: "Premium fashion shopping experience is still broken.",
          attribution: "Anoop Menon, Chiratae Ventures",
        },
      },
      {
        label: "Reflection",
        title: "What carries forward.",
        body: [
          "Eight weeks teaches you to commit. Define a new category by what to leave out, anchor it with four design responses that frame the experience, then bind it under one identity. That isn't just a Zilo recipe. It's a way of working under pressure, and it's the part I take to every ambiguous brief now: the next fog feels less like fog and more like a sequence.",
        ],
      },
      {
        label: "Throwaways",
        title: "Explorations that didn't ship.",
        collapsible: true,
        drawerHint: "Explorations",
        body: [
          "We explored AI-based clothes try-on during 0→1 and parked it for Q2. Home Trials answered the confidence problem more cleanly for launch, and the try-on would have added complexity the MVP didn't need.",
        ],
      },
    ],
  },
];

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}
