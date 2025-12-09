// src/app/[locale]/blog-single/[s]/page.tsx

import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import React from "react";
import BlogSingle from "@/app/[locale]/blog-single/components/BlogSingle";
import { getBlogBySlug } from "@/api/blog";

// Define a single Props type for both generateMetadata and the page component.
// It correctly reflects the shape Next.js passes for dynamic routes.
type Props = {
  params: {
    locale: string;
    s: string;
  };
};

function slugifyDomain(url: string): string {
  let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");
  return host.replace(/[^a-zA-Z0-9]/g, "");
}

// Correctly type the function props and destructure `params`.
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // The rest of your logic remains the same, as it correctly uses `params.s`.
  const slug = params.s;
  const headersList = headers();
  const hostname = headersList.get("host") || "";
  let domain = slugifyDomain(hostname);
  domain = domain.includes("localhost") ? "letrafutarhu" : domain;

  let blogPost = null;
  if (slug) {
    try {
      blogPost = await getBlogBySlug(slug);
    } catch (error) {
      console.error("Error fetching blog for metadata:", error);
    }
  }

  const canonicalUrl =
    hostname && slug ? `https://${hostname}/blog-single/${slug}` : undefined;

  const previousMetadata = await parent;

  return {
    title: blogPost?.title || previousMetadata.title,
    description:
      blogPost?.lead.replace(/<[^>]*>?/gm, "").substring(0, 160) ||
      previousMetadata.description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: blogPost?.title || previousMetadata.title?.toString(),
      description:
        blogPost?.lead.replace(/<[^>]*>?/gm, "").substring(0, 160) ||
        previousMetadata.description?.toString(),
      images: blogPost?.image
        ? [
          `https://${domain}.s3.eu-west-1.amazonaws.com/blogs/${blogPost.image}`,
        ]
        : previousMetadata.openGraph?.images,
      url: canonicalUrl,
    },
  };
}

// Apply the same corrected Props type to the page component.
export default async function BlogSinglePage({ params }: Props) {
  return <BlogSingle s={params.s} />;
}