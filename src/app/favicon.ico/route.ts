import { NextRequest, NextResponse } from "next/server";
import {getServerDomain, getServerDomainSlugified} from "@/utils/host-resolver.server";
export const dynamic = "force-dynamic";

async function getDynamicIconUrl(): Promise<string> {
  const iconUrl = `https://daxxgn860i5ze.cloudfront.net/${getServerDomainSlugified()}/favicon.ico`;
  console.log("Resolved favicon URL:", iconUrl);
  return iconUrl;
}

export async function GET(request: NextRequest) {
  try {
    const iconUrl = await getDynamicIconUrl();
    const imageResponse = await fetch(iconUrl, {
      next: { revalidate: 3600 },
    });
    if (!imageResponse.ok) {
      console.error(
        `Failed to fetch favicon from ${iconUrl}, status: ${imageResponse.status}`,
      );
      return new NextResponse("Icon not found", { status: 404 });
    }
    const imageBlob = await imageResponse.blob();
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "image/x-icon");
    responseHeaders.set("Cache-Control", "public, max-age=86400, immutable");
    return new NextResponse(imageBlob, { headers: responseHeaders });
  } catch (error) {
    console.error(`[FAVICON_HANDLER_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
