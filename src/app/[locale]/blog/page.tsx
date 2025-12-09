import React from "react";
import SectionLatestPosts from "./components/SectionLatestPosts";
import BgGlassmorphism from "@/components/layout/BgGlassmorphism/BgGlassmorphism";
import SectionPromo3 from "@/components/layout/SectionPromo3/SectionPromo3";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> => {
  const t = await getTranslations("SEO.pages.Blog");
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const canonicalUrl = `${protocol}://${host}/${params.locale}/blog`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      siteName: t("title"),
      images: [
        {
          url: t("ogImage"),
          alt: t("ogTitle"),
        },
      ],
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [t("ogImage")],
    },
  };
};

const BlogPage: React.FC = async () => {
  const t = await getTranslations("Pages.Blogs");
  return (
    <div className="nc-BlogPage overflow-hidden relative">
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />
      {/* ======== ALL SECTIONS ======== */}
      <div className="container relative">
        <div className={`nc-SectionLatestPosts relative py-8 lg:py-16`}>
          <div className="lg:space">
            {/* HEADING */}
            <div>
              <div
                className="h3 text-menu-text-light block text-2xl sm:text-3xl lg:text-4xl font-semibold"
                dangerouslySetInnerHTML={{ __html: t.raw("title") }}
              />
              <span
                className="block mt-4 text-menu-text-light dark:text-neutral-100 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: t.raw("text") }}
              />
            </div>

            <hr className="my-10 border-accent-200 dark:border-accent-700" />
          </div>
          <SectionLatestPosts className="py-8 lg:py-16" />
        </div>

        <SectionPromo3 className="pb-16 lg:pb-28" />
      </div>
    </div>
  );
};

export default BlogPage;
