import type { MetadataRoute } from "next";

// No real domain yet; swap this for the deployed origin when there is one.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/booking"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
  }));
}
