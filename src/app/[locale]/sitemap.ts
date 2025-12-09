import { getSitemap } from "@/api/sitemap-xml-links";
import { headers } from "next/headers";

function sanitizeUrl(url: string): string {
  return url.replace(/&/g, "&amp;");
}

export default async function sitemap() {
  headers();

  const [sitemapLinks] = await Promise.all([getSitemap()]);

  return [
    ...sitemapLinks.map((sitemapLink: string) => ({
      url: sanitizeUrl(sitemapLink),
      lastModified: new Date(),
    })),
  ];
}
