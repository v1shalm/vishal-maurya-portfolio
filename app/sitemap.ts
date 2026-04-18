import type { MetadataRoute } from "next";
import { works } from "@/lib/works";

const base = "https://vishalmaurya.design";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/pixels`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...works.map((w) => ({
      url: `${base}/work/${w.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
