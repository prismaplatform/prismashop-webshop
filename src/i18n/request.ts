import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getTranslations } from "@/lib/translations";
import {getServerDomainSlugified} from "@/utils/host-resolver.server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await getTranslations(getServerDomainSlugified(), locale),
    onMissingTranslation: () => "",
  };
});
