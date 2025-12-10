type DomainConfig = {
    defaultLocale: string;
};
export const domainConfigs: Record<string, DomainConfig> = {
    "homesyncro": { defaultLocale: "ro" },
    "leiterkuriercom": { defaultLocale: "de" },
    "letrafutarhu": { defaultLocale: "hu" },
    "oncoexpressro": { defaultLocale: "ro" },
    "rubioromaniaro": { defaultLocale: "ro" },
    "naturapaperro": { defaultLocale: "ro" }
};

export const GLOBAL_DEFAULT_LOCALE = "ro";