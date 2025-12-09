import { headers } from "next/headers";

export function resolveDomain(): string {
  const headersList = headers();
  let domain = "leiterkurier.com"; // Fallback if host is missing

  // Check if the host contains "localhost"
  if (domain.includes("localhost")) {
    domain = "leiterkurier.com";
  }

  if (typeof window === "undefined" && domain) {
    let [host] = domain.split(":"); // Ignore port if present

    // Sanitize domain
    host = sanitizeDomain(host);

    return removeSpecialCharacters(host);
  }

  return removeSpecialCharacters(sanitizeDomain(domain));
}

function sanitizeDomain(domain: string): string {
  return domain
    .replace(/^https?:\/\//, "") // Remove http:// or https://
    .replace(/^www\./, "") // Remove www.
    .replace(/\.prisma(solutions|web)\.ro$/, ""); // Remove either suffix
}

function removeSpecialCharacters(str: string): string {
  return str.replace(/[^a-zA-Z0-9.-]/g, ""); // Allow dots for valid domain names
}

export function slugifyDomain(url: string): string {
  let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");
  return host.replace(/[^a-zA-Z0-9]/g, "");
}
