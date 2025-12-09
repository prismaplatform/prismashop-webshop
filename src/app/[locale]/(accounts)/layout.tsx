"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { Url, UrlObject } from "node:url";
import { UserResponseDto } from "@/models/order-detail.model";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

type NavigationItem = {
  name: string;
  link: string | UrlObject;
};

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<UserResponseDto>();
  const t = useTranslations("Pages.Account");

  const pages: NavigationItem[] = [
    {
      name: t("account"),
      link: "/account",
    },
    {
      name: t("changeAddress"),
      link: "/account-billing",
    },
    {
      name: t("changePassword"),
      link: "/account-password",
    },
    // {
    //   name: "Save lists",
    //   link: "/account-savelists",
    // },
    {
      name: t("myOrders"),
      link: "/account-order",
    },
    {
      name: t("myReturns"),
      link: "/account-returns",
    },
  ];

  useEffect(() => {
    // Check if there's a current user in the cookies
    const currentUserCookie = Cookies.get("currentUser");
    if (currentUserCookie) {
      const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);
      setCurrentUser(parsedUser);
    } else {
      window.location.replace("/login");
    }
  }, []);

  return (
    <div className="nc-AccountCommonLayout container">
      <div className="mt-14 sm:mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl xl:text-4xl font-semibold text-menu-text-light">
              {t("title")}
            </h2>
            <span className="block mt-4 text-menu-text-light dark:text-neutral-400 text-base sm:text-lg">
              <span className="text-menu-text-light dark:text-accent-200 font-semibold">
                {currentUser?.name}
              </span>{" "}
              {currentUser?.email}
            </span>
          </div>
          <hr className="mt-10 border-accent-200 dark:border-accent-700" />

          <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
            {pages.map((item) => (
              <Link
                key={item.name} // using link as the unique key
                href={item.link as Url}
                className={`block py-5 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${
                  pathname === item.link
                    ? "border-primary-500 font-medium text-menu-text-light dark:text-accent-200"
                    : "border-transparent text-menu-text-light dark:text-accent-400 hover:text-accent-800 dark:hover:text-accent-200"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <hr className="border-accent-200 dark:border-accent-700" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        {children}
      </div>
    </div>
  );
};

export default CommonLayout;
