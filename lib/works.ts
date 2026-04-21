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
  kicker: string;
  label: string;
  title: string;
  body: string[];
  /** Horizontal row of big-value stat cells. Renders after body. */
  stats?: StatItem[];
  /** Centered block quote with attribution. Renders after stats. */
  pullQuote?: PullQuote;
  /** 2×2 grid of numbered problem/label/body cells. Renders after pullQuote. */
  problems?: ProblemItem[];
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
    tagline: "Quick-commerce that browses like a mall.",
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
        kicker: "01",
        label: "Context",
        title:
          "Design a digital commerce experience that balances the speed of quick-commerce with the exploratory nature of mall shopping.",
        body: [
          "The client needed to stay relevant beyond physical visits: growing engagement frequency, avoiding an occasion-based relationship, and becoming something closer to a daily habit.",
          "Quick-commerce apps are built for transactions. Malls are built for browsing. The brief lived in the tension between the two.",
        ],
      },
      {
        kicker: "02",
        label: "Principles",
        title:
          "Three guiding principles: Familiarity, Discovery, Speed.",
        body: [
          "Familiarity: make the experience easy to use daily.",
          "Discovery: bring back the feeling of browsing a mall.",
          "Speed: enable quick-commerce without friction.",
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
        kicker: "03",
        label: "Approach",
        title:
          "A modular, content-driven system: quick-commerce efficiency with in-mall discovery richness.",
        body: [
          "Built a unified visual system that scales across multiple retailers, with shared patterns for browsing, merchandising, and checkout without flattening brand identity.",
          "Introduced phygital touchpoints that connect in-mall experiences with digital interactions, letting brand discovery and campaign engagement continue beyond the physical space.",
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
        kicker: "04",
        label: "Outcome",
        title: "A scalable digital product, now across 17+ malls.",
        body: [
          "Translated a physical retail experience into a scalable digital product, extended across a network of 17+ malls.",
          "A unified UI system lets the retailer's identity carry across brands and categories in the digital surface, rather than fragmenting into separate apps, inconsistent flows, and separate campaigns.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/nexus-247/bag-coupon-tracking.png",
            alt: "Bag, coupon, tracking: the phygital handoff in the cart and post-purchase",
            aspect: "16/9",
          },
          caption: "Bag · coupon · tracking: the phygital handoff.",
        },
      },
      {
        kicker: "05",
        label: "Full screens",
        title: "The full flow, end to end.",
        body: [
          "A walk through the shipped surfaces. Scroll to follow each page in full, and switch between home, browse, and the phygital checkout.",
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
        kicker: "06",
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
        kicker: "07",
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
        kicker: "08",
        label: "Reflection",
        title:
          "Digital can extend the physical world without replacing it.",
        body: [
          "The project showed how to balance speed, discovery, and brand consistency in a single product, and that designing for continuity between physical and digital is often more valuable than designing either in isolation.",
        ],
      },
      {
        kicker: "09",
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
    tagline: "A dense clinical-AI platform, made legible.",
    summary:
      "Translating a dense clinical-AI platform into something a healthcare buyer understands in seconds.",
    status: "Live",
    year: "2025",
    role: "UI Designer, Pineapple Design Studio",
    timeline: "2025",
    team: "Studio team",
    liveUrl: "https://outcomes.ai/",
    thumbnail: "/works/outcomes/outcomes-thumbnail.mp4",
    heroMedia: {
      kind: "single",
      fullBleed: true,
      item: {
        src: "/works/outcomes/c.jpg",
        alt: "OutcomesAI homepage above the fold",
        aspect: "16/10",
      },
      caption: "Home. Motion-driven product explainer.",
    },
    sections: [
      {
        kicker: "01",
        label: "Context",
        title:
          "The existing site struggled with clarity on a genuinely complex product.",
        body: [
          "OutcomesAI combines AI agents, clinical protocols, and nurse workflows, a category most visitors don't have a mental model for. The product was technically dense, and the site leaned on long paragraphs to explain it.",
          "For healthcare buyers, a product also has to feel reliable, clinically credible, and enterprise-ready, not just interesting.",
        ],
        media: {
          kind: "pair",
          items: [
            {
              src: "/works/outcomes/f.png",
              alt: "Before: text-dense layout of the old outcomes.ai homepage",
              aspect: "16/10",
            },
            {
              src: "/works/outcomes/a.png",
              alt: "After: the re-imagined surface, visual and credible",
              aspect: "16/10",
            },
          ],
          caption: "Before / after. The same story, told differently.",
        },
      },
      {
        kicker: "02",
        label: "Why it mattered",
        title: "Healthcare decisions are slow and high-stakes.",
        body: [
          "If the product isn't understood quickly, visitors leave early, demos don't get booked, and trust decreases before anyone from the team has had a chance to talk.",
          "The site had to do a first round of selling on its own.",
        ],
      },
      {
        kicker: "03",
        label: "Approach",
        title:
          "Three guiding principles: Clarity, Trust, and Visual Storytelling.",
        body: [
          "Simplify how the product is understood while making it feel credible and enterprise-ready.",
          "I used motion to make the AI-driven workflows easier to understand, turning complex system behavior into simple, visual explanations rather than paragraphs of copy.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/b.png",
            alt: "Glia reliability: large multimodal model, reasoning engine, medical knowledge graph, visualised as a stacked isometric system",
            aspect: "16/9",
          },
          caption: "The AI-driven care model, shown instead of described.",
        },
      },
      {
        kicker: "04",
        label: "Outcome",
        title: "Faster comprehension, stronger trust, and a $10M seed round.",
        body: [
          "Faster comprehension of the AI-driven care model: motion-based explanations instead of dense paragraphs.",
          "A stronger perception of trust, reliability, and clinical readiness from prospective healthcare buyers.",
          "The redesign contributed to OutcomesAI's positioning during its $10M seed funding round.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/d.jpg",
            alt: "Healthtech Innovation Summit 2025: OutcomesAI keynote, 'Can intelligence care for humans?'",
            aspect: "16/9",
          },
          caption: "Healthtech Innovation Summit 2025. The brand, at scale.",
        },
      },
      {
        kicker: "05",
        label: "Reflection",
        title:
          "The job wasn't the interface. It was the translation.",
        body: [
          "The challenge wasn't just designing screens. It was translating a technically dense system into something intuitive and trustworthy for people making slow, serious decisions.",
        ],
      },
    ],
  },
  {
    slug: "zilo",
    title: "Zilo",
    kind: "Fashion quick-commerce · 0→1",
    tagline: "Quick-commerce that doesn't shop like quick-commerce.",
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
        kicker: "01",
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
        kicker: "02",
        label: "Brief & approach",
        title: "Four problems, not a 1:1 response grid.",
        body: [
          "At Pineapple, I worked across the full 0→1 build: branding exploration, UX, UI, and dev-ready files. Agency work moves in phases: brand first, UX in parallel, then UI. I contributed across all three alongside a brand lead and a senior UX designer, and owned UI end-to-end. No prior system. Everything from scratch in 4–8 weeks, Android and iOS.",
          "The four category problems don't map 1:1 to four features. Home Trials answers returns and try-before-buy in a single move. Scheduled delivery is absorbed into the 60-minute slot every order runs on. That left two bets the brief didn't ask for but the product needed: Ask Zilo, and a post-purchase surface that shipped with the MVP.",
        ],
      },
      {
        kicker: "03",
        label: "Design response · Returns",
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
        kicker: "04",
        label: "Design response · Discovery",
        title: "Curated looks and trends, not a catalogue with better filters.",
        body: [
          "Every major fashion app treats discovery as a filtering problem. But the way people shop (\u201cI need something for a rooftop dinner\u201d or \u201cwhat's everyone wearing this season\u201d) doesn't map to any filter combination.",
          "We rebuilt discovery around editorial structures. The home has a Daily Planner that organises by occasion (Wellness & Yoga, Office Elegance, Party Ready, Luxury Loungewear), not by category. A Lookbook does the mix-and-match work. Trend Radar gives seasonal context to what's in stock. Discover became its own destination, not an alternative to search.",
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
        kicker: "05",
        label: "Design response · Confidence",
        title: "Ask Zilo: conversational discovery in the core nav.",
        body: [
          "Even with curated surfaces, there are moments when a shopper knows what they want but can't describe it in filter terms. Ask Zilo lives in the tab bar, with equal weight to Home and Shop, not buried in a help menu.",
          "The design decision was placement and framing. A tab-bar slot with its own 60-min badge signals that AI-assisted discovery is a product pillar, not a chatbot. It doubles as an escape hatch from the PLP: \u201cDon't want to scroll 475 items? Ask Zilo.\u201d An honest acknowledgement of catalogue size, turned into a feature moment.",
        ],
      },
      {
        kicker: "06",
        label: "Design response · Retention",
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
        kicker: "07",
        label: "Full screens",
        title: "Four flows, one editorial voice.",
        body: [
          "The four design responses, shipped. Scroll each page in full, and switch between home, discover, home trials, and the post-buy surface.",
        ],
        media: {
          kind: "deviceScroll",
          tabs: [
            {
              label: "Home",
              caption: "Daily Planner by occasion, not category.",
              alt: "Zilo home, full-page walkthrough",
            },
            {
              label: "Discover",
              caption: "Lookbook and Trend Radar, an editorial destination.",
              alt: "Zilo discover, full-page walkthrough",
            },
            {
              label: "Home Trials",
              caption: "Try at home, return the rest, all inside the 60-minute window.",
              alt: "Zilo home trials flow, full-page walkthrough",
            },
            {
              label: "Post-buy",
              caption: "Bag, live tracking, and order history, shipped at launch.",
              alt: "Zilo post-purchase surfaces, full-page walkthrough",
            },
          ],
        },
      },
      {
        kicker: "08",
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
        kicker: "09",
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
        kicker: "10",
        label: "Reflection",
        title: "If I started Zilo tomorrow, I'd push the UI further.",
        body: [
          "The ideas are there. The category thesis, the four design responses, the identity built around a single mark: those carry. But the UI, in places, falls a little flat. I'd push the craft further: more depth in the surfaces, more places where the interface does the work instead of just presenting it. The difference between a product that reads well in a portfolio and one that feels inevitable in your hand.",
        ],
      },
      {
        kicker: "11",
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
