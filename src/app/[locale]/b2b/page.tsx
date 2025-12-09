import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import B2BForm from "./components/B2BForm";
import MuseumForm from "./components/MuseumForm"; // Assuming this is the contact form for the museum
import SectionHero from "../about/components/SectionHero";

// Note: For fully dynamic SEO, you would also need to fetch the 'formType' here
// and adjust the translation namespace (e.g., `SEO.pages.${formType}`) accordingly.
export const generateMetadata = async () => {
  const t = await getTranslations("SEO.pages.B2B"); // Kept as is, but can be made dynamic
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
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
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [t("ogImage")],
    },
  };
};

const B2BPage = async () => {
  const t = await getTranslations("Pages.B2B");
  const formType = t("formType");

  if (formType !== "MUSEUM" && formType !== "B2B") {
    redirect("/");
  }

  return (
    <div className="container py-16 space-y-4 lg:space-y-4">
      <SectionHero
        key={t.raw("HeroSection.title")}
        rightImg={t("HeroSection.image") || ""}
        heading={t.raw("HeroSection.title") || ""}
        btnText=""
        subHeading={t.raw("HeroSection.text") || ""}
        className="lg:py-20"
        alt={formType}
      />

      <div className="container max-w-4xl mx-auto py-16">
        <div
          className="h1 text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-neutral-100"
          dangerouslySetInnerHTML={{ __html: t.raw("title") }}
        />

        {formType === "B2B" && <B2BForm />}
        {formType === "MUSEUM" && <MuseumForm />}
      </div>
    </div>
  );
};

export default B2BPage;
