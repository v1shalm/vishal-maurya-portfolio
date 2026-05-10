import type { MetadataRoute } from "next";
import { works } from "@/lib/works";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/pixels`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Locked case studies (NDA) are excluded from the public sitemap.
    // They remain reachable via direct URL but shouldn't be indexed.
    ...works
      .filter((w) => !w.locked)
      .map((w) => ({
        url: `${siteUrl}/work/${w.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      })),
  ];
}
