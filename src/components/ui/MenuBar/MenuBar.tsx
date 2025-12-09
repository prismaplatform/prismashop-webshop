"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, TransitionChild } from "@/app/ui/headlessui";
import NavMobile from "@/components/ui/Navigation/NavMobile";
import { NavItemType } from "@/components/ui/Navigation/NavigationItem";
import { getNavigationContent } from "@/data/navigation";
import { useTranslations } from "next-intl";

export interface MenuBarProps {
  domain?: string;
}

const MenuBar: React.FC<MenuBarProps> = ({ domain }) => {
  const [isVisable, setIsVisable] = useState(false);
  const [menu, setMenu] = useState<NavItemType[]>([]);
  const t = useTranslations("Header");

  const handleOpenMenu = () => setIsVisable(true);
  const handleCloseMenu = () => setIsVisable(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNavigationContent();

      let updatedMenu = data;

      // Add discounts item if translation exists and is not fallback
      const discountLabel = t("discounts");
      if (discountLabel && discountLabel !== "Header.discounts") {
        const discountItem: NavItemType = {
          id: "discounts",
          name: discountLabel,
          href: {
            pathname: "/products/all",
            query: { inAction: "true" },
          },
          className: "bg-primary-500 text-white",
        };
        updatedMenu = [discountItem, ...data];
      }

      setMenu(updatedMenu);
    };

    fetchData();
  }, [t]); // adding t to deps for safety, though it's stable

  const renderContent = () => {
    return (
      <Transition appear show={isVisable} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleCloseMenu}
        >
          <div className="fixed left-0 top-0 bottom-0 w-full max-w-md md:w-auto z-max outline-none focus:outline-none">
            <React.Fragment>
              <TransitionChild
                enter="transition duration-100 transform"
                enterFrom="opacity-0 -translate-x-14"
                enterTo="opacity-100 translate-x-0"
                leave="transition duration-150 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-14"
              >
                <div className="z-20 relative">
                  <NavMobile
                    domain={domain}
                    data={menu}
                    onClickClose={handleCloseMenu}
                  />
                </div>
              </TransitionChild>

              <TransitionChild
                enter="duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave=" duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-neutral-900/60" />
              </TransitionChild>
            </React.Fragment>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <>
      <button
        aria-label="open menu"
        onClick={handleOpenMenu}
        className="p-2.5 rounded-lg text-menu-text-light focus:outline-none flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {renderContent()}
    </>
  );
};

export default MenuBar;
