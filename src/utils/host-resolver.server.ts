import { headers } from "next/headers";

export function getServerDomain(): string {
  const headersList = headers();
  const host =
    headersList.get("x-forwarded-host") || headersList.get("host") || "";
  let domain = host
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(":")[0];
  domain = domain
    .replace(".prismasolutions.ro", "")
    .replace(".prismaweb.ro", "");

  domain = domain.replace(/[^a-zA-Z0-9.-]/g, "");
  if (domain == "localhost") {
    domain = "homesyncro";
  }
  return domain;
}