// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getTranslations } from "@/lib/translations";
import { getServerDomainSlugified } from "@/utils/host-resolver.server";
import {domainConfigs, GLOBAL_DEFAULT_LOCALE} from "@/data/domain-config";
export default getRequestConfig(async ({ requestLocale }) => {
    const domain = getServerDomainSlugified();
    const domainDefault = domainConfigs[domain]?.defaultLocale || GLOBAL_DEFAULT_LOCALE;

    let locale = await requestLocale;
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = domainDefault;
    }

    return {
        locale,
        messages: await getTranslations(domain, locale),
        onMissingTranslation: () => "",
    };
});