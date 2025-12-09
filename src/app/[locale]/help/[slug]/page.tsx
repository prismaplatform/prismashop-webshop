import { notFound } from "next/navigation";
import { getSlugLink } from "@/api/useful-links";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";

interface Props {
  params: {
    locale: string;
    slug: string;
  };
}

// Cached data fetching function to ensure single fetch
const getHelpPageData = cache(async (slug: string) => {
  return await getSlugLink(slug);
});

// Function to extract text from HTML string (server-safe)
function extractTextFromHtml(html: string): string {
  // Simple regex to remove HTML tags
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
    .trim();

  return text.length > 160 ? text.substring(0, 157) + "..." : text;
}

// Generate dynamic metadata based on the help page content
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    // Use the cached function to fetch data
    const data = await getHelpPageData(params.slug);

    // Extract a description from the content
    const description = extractTextFromHtml(data.content);

    // Return dynamic metadata
    return {
      title: `${data.name}`,
      description: description,
      openGraph: {
        title: `${data.name}`,
        description: description,
        type: "article",
      },
    };
  } catch (error) {
    // In case of error, return default metadata
    console.error("Failed to fetch metadata for help page:", error);
    return {
      title: "Help Center",
      description: "Find help and support resources",
    };
  }
}

export default async function HelpSlugPage({ params }: Props) {
  try {
    // Use the same cached function to fetch data
    const data = await getHelpPageData(params.slug);

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-menu-text-light dark:text-neutral-100 justify-center">
          {data.name}
        </h2>
        <div
          id="custom-page"
          className="prose mx-auto [&>*]:mx-auto [&>*]:text-menu-text-light"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch help content:", error);
    return notFound();
  }
}
