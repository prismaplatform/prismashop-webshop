import { NextResponse } from "next/server";
import { useDomain } from "@/components/app/DomainProvider";

export function GET() {
  const domain = useDomain();

  const body = `User-agent: *
Disallow:
Sitemap: https://${domain}/sitemap.xml`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
