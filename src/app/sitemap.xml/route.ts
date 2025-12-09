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
  // Since this is a dynamic Route Handler, your original axiosInstance
  // will now work perfectly. It can safely access the request headers
  // to set the correct Tenant-Id for the API call.
  try {
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

    // Return the XML content with the correct header
    return new Response(sitemapContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });

  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    return new Response("Error generating sitemap.", { status: 500 });
  }
}