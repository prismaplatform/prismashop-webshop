"use server";
import { NavItemType } from "@/components/ui/Navigation/NavigationItem";
import ncNanoId from "@/utils/ncNanoId";
import { getTranslations } from "next-intl/server";
import { getMenu } from "@/api/menu";
import { getLinks } from "@/api/useful-links";
import { Route } from "@/routers/types";

// Define the LinkItem interface for type safety from the API
interface LinkItem {
  id: number;
  name: string;
  link: string;
  content: string | null;
  priority: number;
  slug: string | null;
  availableInHeader: boolean;
}

// UPDATED: Added the optional 'shop' property
interface CustomMenuItem {
  name: string;
  href?: string;
  order: number;
  shop?: boolean; // New property to identify the shop menu
  targetBlank?: boolean;
  children?: Record<string, CustomMenuItem>;
}

/**
 * Recursively builds the navigation menu from a JSON object.
 * It now accepts pre-fetched shop category data to build the shop menu dynamically.
 */
function buildNavFromCustomMenu(
  menuObject: Record<string, CustomMenuItem>,
  shopChildrenData: any[] | null, // Pre-fetched shop categories
): NavItemType[] {
  const sortedItems = Object.values(menuObject).sort(
    (a, b) => a.order - b.order,
  );

  return sortedItems.map((item) => {
    // If item is the shop and we have categories, build the dynamic dropdown
    if (item.shop === true && shopChildrenData) {
      return {
        id: ncNanoId(),
        name: item.name,
        href: (item.href as Route) || "/products?page=1",
        type: "dropdown",
        children: shopChildrenData,
      };
    }

    // Default logic for regular items
    const navItem: NavItemType = {
      id: ncNanoId(),
      name: item.name,
      href: (item.href as Route) || "#",
      targetBlank: item.targetBlank || false,
    };

    // Handle nested children for regular dropdowns
    if (item.children) {
      navItem.type = "dropdown";
      // Pass shop data down in recursion, though unlikely to be used in sub-menus
      navItem.children = buildNavFromCustomMenu(
        item.children,
        shopChildrenData,
      );
    }

    return navItem;
  });
}

/**
 * Fetches the menu from the API with a 500ms timeout.
 * @returns A promise that resolves to the menu data or an empty array on failure/timeout.
 */
async function getMenuWithTimeout(): Promise<any[]> {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 500),
  );

  try {
    const menuData = await Promise.race([getMenu(), timeoutPromise]);
    return menuData as any[];
  } catch (error) {
    console.error("Menu fetch failed or timed out:", error);
    return [];
  }
}

/**
 * Fetches useful links from the API with a 500ms timeout.
 * @returns A promise that resolves to the link data or an empty array on failure/timeout.
 */
async function getUsefulLinksWithTimeout(): Promise<LinkItem[]> {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 500),
  );

  try {
    const usefulLinksData = await Promise.race([getLinks(), timeoutPromise]);
    return usefulLinksData as LinkItem[];
  } catch (error) {
    console.error("Useful link fetch failed or timed out:", error);
    return [];
  }
}

/**
 * Main function to generate navigation content.
 * It first tries to build the navigation from a JSON object in the translation file.
 * If that fails, it falls back to fetching data from multiple API endpoints.
 */
export async function getNavigationContent(): Promise<NavItemType[]> {
  const t = await getTranslations("Header");

  try {
    const customMenuData: Record<string, CustomMenuItem> = t.raw("CustomMenu");

    if (
      customMenuData &&
      typeof customMenuData === "object" &&
      Object.keys(customMenuData).length > 0
    ) {
      // --- PRE-FETCH SHOP DATA IF NEEDED ---
      let shopChildrenData: any[] | null = null;
      const hasShopItem = Object.values(customMenuData).some(
        (item) => item.shop === true,
      );

      if (hasShopItem) {
        const menuData = await getMenuWithTimeout();
        if (menuData.length > 0) {
          shopChildrenData = menuData;
        }
      }

      // Pass the fetched data (or null) to the builder function
      return buildNavFromCustomMenu(customMenuData, shopChildrenData);
    }
    // If CustomMenu is not a valid object, throw an error to trigger the fallback.
    throw new Error("CustomMenu key is not a valid object or is empty.");
  } catch (error) {
    // The fallback logic remains unchanged
    const navItems: NavItemType[] = [];

    const productsItem: NavItemType = {
      id: ncNanoId(),
      href: "/products/all",
      name: t("products"),
    };

    const menuData = await getMenuWithTimeout();
    if (menuData.length > 0) {
      productsItem.type = "dropdown";
      productsItem.children = menuData;
    }

    navItems.push(
      productsItem,
      { id: ncNanoId(), href: "/about", name: t("about") },
      { id: ncNanoId(), href: "/blog", name: t("blog") },
      { id: ncNanoId(), href: "/contact", name: t("contact") },
    );

    const usefulLinks = await getUsefulLinksWithTimeout();

    if (usefulLinks.length > 0) {
      const headerLinks = usefulLinks.filter(
        (link: LinkItem) => link.availableInHeader,
      );

      if (headerLinks.length > 0) {
        navItems.push({
          id: ncNanoId(),
          name: t("links"),
          type: "dropdown",
          href: "#",
          children: headerLinks.map(
            (link: LinkItem): NavItemType => ({
              id: ncNanoId(),
              name: link.name,
              href: link.slug
                ? (`/help/${link.slug}` as Route)
                : (link.link as Route),
              targetBlank: link.link.startsWith("http"),
            }),
          ),
        });
      }
    }
    return navItems;
  }
}
