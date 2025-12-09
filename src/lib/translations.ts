export async function getTranslations(domain: string, locale: string) {
  const response = await fetch(
    `https://daxxgn860i5ze.cloudfront.net/${domain}/${locale}.json`,
  );
  if (!response.ok) throw new Error("Failed to fetch translations");
  return response.json();
}
