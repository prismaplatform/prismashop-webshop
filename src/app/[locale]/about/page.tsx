import { getTranslations } from "next-intl/server";
import BgGlassmorphism from "@/components/layout/BgGlassmorphism/BgGlassmorphism";
import SectionHero from "@/app/[locale]/about/components/SectionHero";
import BackgroundSection from "@/components/layout/BackgroundSection/BackgroundSection";
import SectionClientSay from "@/components/layout/SectionClientSay/SectionClientSay";
import SectionPromo3 from "@/components/layout/SectionPromo3/SectionPromo3";
import ClientValuesGrid from "./components/ClientValuesGrid";

export const generateMetadata = async () => {
  const t = await getTranslations("SEO.pages.About");
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

interface HeroCard {
  title: string;
  text: string;
  image: string;
}

export default async function AboutPage() {
  const t = await getTranslations("Pages.About");

  const cardsData = t.raw("OurValues.Cards");

  const heroCards: HeroCard[] =
    cardsData && typeof cardsData === "object" ? Object.values(cardsData) : [];
  const sectionTitle = t.raw("OurValues.title") || "";
  const valuesImage = t("OurValues.image") || null;
  const content = t.raw("Content") || null;

  return (
    <div className="nc-PageAbout overflow-hidden relative">
      <BgGlassmorphism />

      <div className="container py-16 space-y-16 ">
        <SectionHero
          key={t.raw("title")}
          rightImg={t("image") || ""}
          heading={t.raw("title") || ""}
          btnText=""
          subHeading={t.raw("text") || ""}
          alt={"about"}
        />

        <ClientValuesGrid
          cards={heroCards}
          sectionTitle={sectionTitle}
          valuesImage={valuesImage}
          content={content}
        />

        <div className="relative">
          <BackgroundSection className="bg-gradient-to-b from-accent-50/30 to-white dark:from-neutral-900/30 dark:to-neutral-900" />
          <SectionClientSay className="py-16 lg:py-24" />
        </div>

        <SectionPromo3 className="!mt-0" />
      </div>
    </div>
  );
}
