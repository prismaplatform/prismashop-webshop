// app/sitemap.xml/route.ts

// ✅ ADD THIS LINE TO FIX THE BUILD ERROR
export const dynamic = 'force-dynamic';

import { getProductSitemap, getSitemap } from "@/api/sitemap-xml-links";

// Helper function to escape special characters in URLs for XML
function escapeXml(url: string): string {
    return url.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export async function GET() {
    try {
        // This call is now safe because 'force-dynamic' ensures
        // it only runs when a real user requests the URL.
        const [sitemapLinks, productLinks] = await Promise.all([
            getSitemap(),
            getProductSitemap(),
        ]);

        const allLinks = [...sitemapLinks, ...productLinks];
        const currentDate = new Date().toISOString();

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allLinks
            .map((link: string) => `
    <url>
      <loc>${escapeXml(link)}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
    `)
            .join('')}
</urlset>`;

        return new Response(sitemapContent, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
            },
        });

    } catch (error) {
        console.error("Failed to generate dynamic sitemap:", error);
        return new Response("Error generating sitemap.", { status: 500 });
    }
}