import { NextRequest, NextResponse } from "next/server";
import { resolveDomain, slugifyDomain } from "@/utils/hostResolver";

// Add this export
export const dynamic = "force-dynamic";

/**
 * Dynamically determines the URL of the favicon based on the request's domain.
 *
 * This function now uses your provided logic to construct a URL pointing
 * to a favicon hosted on CloudFront, based on the resolved domain.
 *
 * @returns A promise that resolves to the absolute URL of the .ico file.
 */
async function getDynamicIconUrl(): Promise<string> {
  // --- Your Dynamic Logic is Integrated Here ---
  // It resolves the domain from the request and creates a slug for the URL.
  const domain = slugifyDomain(resolveDomain());
  const iconUrl = `https://daxxgn860i5ze.cloudfront.net/${domain}/favicon.ico`;

  return iconUrl;
}

/**
 * GET handler for the /favicon.ico route.
 * Fetches a dynamic icon from an external source (like S3/CloudFront) and serves it.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Determine the correct icon URL using your dynamic logic.
    const iconUrl = await getDynamicIconUrl();

    // 2. Fetch the icon file from the external URL.
    const imageResponse = await fetch(iconUrl, {
      // Use Next.js's caching mechanism for better performance.
      // This will cache the fetched icon for 1 hour. Adjust as needed.
      next: { revalidate: 3600 },
    });

    // 3. Check if the fetch was successful.
    if (!imageResponse.ok) {
      // If the icon can't be fetched, return a 404 Not Found response.
      console.error(
        `Failed to fetch favicon from ${iconUrl}, status: ${imageResponse.status}`,
      );
      return new NextResponse("Icon not found", { status: 404 });
    }

    // 4. Get the image data as a Blob.
    const imageBlob = await imageResponse.blob();

    // 5. Create response headers.
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "image/x-icon");
    // Instruct browsers and CDNs to cache the favicon for 1 day.
    // Favicons don't change often, so a long cache duration is good.
    responseHeaders.set("Cache-Control", "public, max-age=86400, immutable");

    // 6. Return the image data in a NextResponse.
    return new NextResponse(imageBlob, { headers: responseHeaders });
  } catch (error) {
    // Log the error for debugging purposes.
    console.error(`[FAVICON_HANDLER_ERROR]: ${error}`);

    // Return a generic 500 Internal Server Error response.
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
