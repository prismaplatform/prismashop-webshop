import Account from "./components/Account";
import { getTranslations } from "next-intl/server";

export default async function AccountPage() {
  const t = await getTranslations("Pages.Account");
  const tContact = await getTranslations("Pages.Contact");

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-3xl font-semibold text-menu-text-light">{t("accountInfo")}</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <Account />
    </div>
  );
}
