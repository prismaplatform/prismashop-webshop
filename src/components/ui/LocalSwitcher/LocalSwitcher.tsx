"use client";

import { useEffect, useState } from "react";
import LocaleSwitcherDropdown from "@/components/ui/LocaleSwitcherSelect/LocaleSwitcherSelect";
import { useLocale, useTranslations } from "use-intl";
import { getLanguages } from "@/api/languages";
import { Locale, routing } from "@/i18n/routing";

type Language = {
  id: number;
  language: string;
  slug: string;
};

export default function LocaleSwitcher() {
  const t = useTranslations("Header.LocaleSwitcher");
  const locale = useLocale();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const langs = await getLanguages();
        setLanguages(langs);
      } catch (error) {
        console.error("Failed to load locales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocales();
  }, []);

  if (loading) return null;

  // Filter only defined locales
  const validLocales = languages.filter(
    (lang): lang is Language & { slug: Locale } =>
      routing.locales.includes(lang.slug as Locale),
  );

  const options = validLocales.map((lang) => ({
    icon: `/flags/${lang.slug}.svg`,
    label: t("locale", { locale: lang.slug }),
    value: lang.slug as Locale,
  }));

  return <LocaleSwitcherDropdown options={options} defaultValue={locale} />;
}
