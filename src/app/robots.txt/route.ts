import { NextResponse } from "next/server";
import { resolveDomain } from "@/utils/hostResolver";

export function GET() {
  const domain = resolveDomain();

  const body = `User-agent: *
Disallow:
Sitemap: https://${domain}/sitemap.xml`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
