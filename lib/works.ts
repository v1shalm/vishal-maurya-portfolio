export type MediaItem = {
  src?: string;
  alt?: string;
  /** e.g. '16/10', '4/5', '9/16', '3/4'. Defaults per layout. */
  aspect?: string;
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
    };

export type CaseSection = {
  kicker: string;
  label: string;
  title: string;
  body: string[];
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
      "Balancing mall-style discovery with quick-commerce speed — a unified UI system across multiple brands.",
    status: "Live",
    year: "2025",
    role: "UI Designer, Pineapple Design Studio",
    timeline: "2025",
    team: "Studio team",
    thumbnail: "/works/nexus-247.mp4",
    thumbnailPoster: "/works/nexus-247.png",
    heroMedia: {
      kind: "single",
      fullBleed: true,
      item: {
        src: "/works/nexus-247.png",
        alt: "Nexus 247 — cover",
      },
      caption: "Cover — the retail entry point, re-imagined for daily habit.",
    },
    sections: [
      {
        kicker: "01",
        label: "Context",
        title:
          "Design a digital commerce experience that balances the speed of quick-commerce with the exploratory nature of mall shopping.",
        body: [
          "The client needed to stay relevant beyond physical visits — growing engagement frequency, avoiding an occasion-based relationship, and becoming something closer to a daily habit.",
          "Quick-commerce apps are built for transactions. Malls are built for browsing. The brief lived in the tension between the two.",
        ],
      },
      {
        kicker: "02",
        label: "Principles",
        title:
          "Three guiding principles: Familiarity, Discovery, Speed.",
        body: [
          "Familiarity — make the experience easy to use daily.",
          "Discovery — bring back the feeling of browsing a mall.",
          "Speed — enable quick-commerce without friction.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/nexus-247/homescreens.png",
            alt: "Home screen variations — three takes on Familiarity, Discovery, Speed",
            aspect: "16/10",
          },
          caption: "Three home variations — three moments of the principle in practice.",
        },
      },
      {
        kicker: "03",
        label: "Approach",
        title:
          "A modular, content-driven system — quick-commerce efficiency with in-mall discovery richness.",
        body: [
          "Built a unified visual system that scales across multiple retailers — shared patterns for browsing, merchandising, and checkout without flattening brand identity.",
          "Introduced phygital touchpoints that connect in-mall experiences with digital interactions — letting brand discovery and campaign engagement continue beyond the physical space.",
        ],
        media: {
          kind: "triptych",
          items: [
            {
              src: "/works/nexus-247/categories-plp-pdp.png",
              alt: "Browsing system — categories, product list, product detail",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/onboarding.png",
              alt: "Onboarding — the system's entry moment",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/profile.png",
              alt: "Profile — the personal surface",
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
          "A unified UI system lets the retailer's identity carry across brands and categories in the digital surface — rather than fragmenting into separate apps, inconsistent flows, and separate campaigns.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/nexus-247/bag-coupon-tracking.png",
            alt: "Bag, coupon, tracking — the phygital handoff in the cart and post-purchase",
            aspect: "16/9",
          },
          caption: "Bag · coupon · tracking — the phygital handoff.",
        },
      },
      {
        kicker: "05",
        label: "Craft details",
        title: "The small surfaces do a lot of the work.",
        body: [
          "The loyalty card, the coupon, the order confirmation — short moments that reward a return visit and make the product feel considered.",
        ],
        media: {
          kind: "row",
          items: [
            {
              src: "/works/nexus-247/shots.png",
              alt: "Bag, order tracking, and Nexus Cash — the handoff, in detail",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/success-rewards-profile.png",
              alt: "Exclusive stores, rewards, and loyalty history",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/profilecard-closeup.png",
              alt: "Nexus Cash card — closeup of the loyalty object",
              aspect: "4/3",
            },
            {
              src: "/works/nexus-247/coupon-closeup.png",
              alt: "Coupon applied — the reward moment, closeup",
              aspect: "4/3",
            },
          ],
          caption: "Loyalty and rewards — up close.",
        },
      },
      {
        kicker: "06",
        label: "Reflection",
        title:
          "Digital can extend the physical world without replacing it.",
        body: [
          "The project showed how to balance speed, discovery, and brand consistency in a single product — and that designing for continuity between physical and digital is often more valuable than designing either in isolation.",
        ],
      },
      {
        kicker: "07",
        label: "Throwaways",
        title: "Explorations that didn't ship.",
        collapsible: true,
        drawerHint: "Iterations",
        body: [
          "Not every idea landed. The throwaways below are loyalty and rewards explorations that didn't ship — kept as a record of what the surface wanted to be, and what it shouldn't.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/nexus-247/throwaways.png",
            alt: "Throwaways — rewards and loyalty iterations that didn't ship",
            aspect: "16/10",
          },
          caption: "Throwaways — iterations that didn't ship.",
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
    thumbnail: "/works/outcomes/outcomes-thumbnail.mp4",
    heroMedia: {
      kind: "single",
      fullBleed: true,
      item: {
        src: "/works/outcomes/c.jpg",
        alt: "OutcomesAI — homepage above the fold",
        aspect: "16/10",
      },
      caption: "Home — motion-driven product explainer.",
    },
    sections: [
      {
        kicker: "01",
        label: "Context",
        title:
          "The existing site struggled with clarity on a genuinely complex product.",
        body: [
          "OutcomesAI combines AI agents, clinical protocols, and nurse workflows — a category most visitors don't have a mental model for. The product was technically dense, and the site leaned on long paragraphs to explain it.",
          "For healthcare buyers, a product also has to feel reliable, clinically credible, and enterprise-ready — not just interesting.",
        ],
        media: {
          kind: "pair",
          items: [
            {
              src: "/works/outcomes/f.png",
              alt: "Before — text-dense layout of the old outcomes.ai homepage",
              aspect: "16/10",
            },
            {
              src: "/works/outcomes/a.png",
              alt: "After — the re-imagined surface, visual and credible",
              aspect: "16/10",
            },
          ],
          caption: "Before / after — the same story, told differently.",
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
          "I used motion to make the AI-driven workflows easier to understand — turning complex system behavior into simple, visual explanations rather than paragraphs of copy.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/b.png",
            alt: "Glia reliability — large multimodal model, reasoning engine, medical knowledge graph, visualised as a stacked isometric system",
            aspect: "16/9",
          },
          caption: "The AI-driven care model, shown instead of described.",
        },
      },
      {
        kicker: "04",
        label: "Outcome",
        title: "Faster comprehension, stronger trust — and a $10M seed round.",
        body: [
          "Faster comprehension of the AI-driven care model — motion-based explanations instead of dense paragraphs.",
          "A stronger perception of trust, reliability, and clinical readiness from prospective healthcare buyers.",
          "The redesign contributed to OutcomesAI's positioning during its $10M seed funding round.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/outcomes/d.jpg",
            alt: "Healthtech Innovation Summit 2025 — OutcomesAI keynote, 'Can intelligence care for humans?'",
            aspect: "16/9",
          },
          caption: "Healthtech Innovation Summit 2025 — the brand, at scale.",
        },
      },
      {
        kicker: "05",
        label: "Reflection",
        title:
          "The job wasn't the interface — it was the translation.",
        body: [
          "The challenge wasn't just designing screens. It was translating a technically dense system into something intuitive and trustworthy for people making slow, serious decisions.",
        ],
      },
    ],
  },
  {
    slug: "zilo",
    title: "Zilo",
    kind: "Quick-commerce product",
    tagline: "A curated 0→1 fashion quick-commerce product.",
    summary:
      "A 0→1 fashion quick-commerce product — curated to reduce choice overload, structured for confident decisions.",
    status: "Shipped",
    year: "2025",
    role: "UI Designer",
    timeline: "2025",
    team: "TBD",
    thumbnail: "/works/zilo.mp4",
    thumbnailPoster: "/works/zilo.png",
    heroMedia: {
      kind: "single",
      fullBleed: true,
      item: {
        src: "/works/zilo.png",
        alt: "Zilo — cover",
        aspect: "16/10",
      },
      caption: "Cover — the shopping surface on Android.",
    },
    sections: [
      {
        kicker: "01",
        label: "Context",
        title: "A 0→1 curated fashion quick-commerce product.",
        body: [
          "Zilo takes fashion quick-commerce and curates it. Instead of overwhelming users with endless inventory, the product structures the browse experience around confident decision-making — reducing choice overload and shortening the path from intent to order.",
          "My role covered the core flows: onboarding, homepage, category, product detail, and the post-buy journey.",
        ],
      },
      {
        kicker: "02",
        label: "Screens",
        title: "Core flows — browsing, buying, returning.",
        body: [
          "Homepage, category, product detail, and cart — the shopping backbone.",
        ],
        media: {
          kind: "single",
          item: {
            src: "/works/zilo/homepage-pdp-plp.png",
            alt: "Homepage, product list, and product detail — the core browsing flow",
            aspect: "16/10",
          },
          caption: "Homepage · product list · product detail.",
        },
      },
      {
        kicker: "03",
        label: "Supporting moments",
        title: "Onboarding, empty states, fashion.",
        body: [
          "The smaller, quieter moments that decide whether a user stays.",
        ],
        media: {
          kind: "triptych",
          items: [
            {
              src: "/works/zilo/onboarding.png",
              alt: "Zilo onboarding — first impressions",
              aspect: "9/16",
            },
            {
              src: "/works/zilo/empty-states.png",
              alt: "Zilo empty states — the quiet surfaces",
              aspect: "9/16",
            },
            {
              src: "/works/zilo/fashion.png",
              alt: "Zilo fashion vertical — editorial-leaning product surface",
              aspect: "9/16",
            },
          ],
          caption: "Onboarding · empty states · fashion vertical.",
        },
      },
      {
        kicker: "04",
        label: "Post-purchase",
        title: "The long tail.",
        body: [
          "Tracking, return, reorder — the surfaces that decide whether a first order becomes a second.",
        ],
        media: {
          kind: "single",
          fullBleed: true,
          item: {
            src: "/works/zilo/post-buy.png",
            alt: "Post-buy journey — tracking, return, reorder",
            aspect: "16/9",
          },
          caption: "Post-buy — the long tail of the purchase.",
        },
      },
    ],
  },
];

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}
