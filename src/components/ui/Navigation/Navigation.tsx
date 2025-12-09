"use client";
import { useEffect, useState } from "react";
import NavigationItem, { NavItemType } from "./NavigationItem";
import { getNavigationContent } from "@/data/navigation";
import { useTranslations } from "next-intl";

function Navigation() {
  const [menu, setMenu] = useState<NavItemType[]>([]);
  const t = useTranslations("Header");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNavigationContent();

      let updatedMenu = data;

      // Check if the "discounts" translation key exists and is not the fallback
      const discountLabel = t("discounts");
      // Avoid adding the item if the translation is missing or equals the fallback key
      if (discountLabel && discountLabel !== "Header.discounts") {
        const discountItem: NavItemType = {
          id: "discounts",
          name: discountLabel,
          href: {
            pathname: "/products/all",
            query: { inAction: "true" },
          },
          className: "bg-primary-500 text-white transition-colors duration-500",
        };
        updatedMenu = [discountItem, ...data];
      }

      setMenu(updatedMenu);
    };

    fetchData();
  }, []);

  return (
    <ul className="nc-Navigation flex items-center">
      {menu.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
