"use client";

import React from "react";
import ButtonClose from "@/components/ui/ButtonClose/ButtonClose";
import Logo from "@/components/ui/Logo/Logo";
import { Disclosure } from "@/app/ui/headlessui";
import { NavItemType } from "./NavigationItem";
import SocialsList from "@/components/ui/SocialsList/SocialsList";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Link } from "@/i18n/routing";
import { Url } from "node:url";
import LocaleSwitcher from "@/components/ui/LocalSwitcher/LocalSwitcher";
import { useTranslations } from "next-intl";

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
  domain?: string;
}

const NavMobile: React.FC<NavMobileProps> = ({
  data,
  onClickClose,
  domain,
}) => {
  const _renderMenuChild = (
    item: NavItemType,
    itemClass = "pl-3 text-menu-text-light hover:bg-menu-bg-dark hover:text-menu-text-dark font-medium ",
  ) => {
    return (
      <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={index} as="li">
            <Link
              href={i.href as Url}
              className={`flex text-sm rounded-lg hover:bg-menu-bg-light mt-0.5 pr-4 ${itemClass} ${i.className ?? ""}`}
            >
              <span
                className={`py-2.5 ${!i.children ? "block w-full" : ""}`}
                onClick={onClickClose}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="flex items-center flex-grow"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex justify-end flex-grow"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-accent-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </Link>
            {i.children && (
              <Disclosure.Panel>
                {_renderMenuChild(
                  i,
                  "pl-3 text-accent-600 dark:text-accent-400 ",
                )}
              </Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const _renderItem = (item: NavItemType, index: number) => {
    return (
      <Disclosure
        key={index}
        as="li"
        className="text-menu-text-light hover:bg-menu-bg-dark hover:text-menu-text-dark"
      >
        <Link
          className={`flex w-full items-center py-2.5 px-4 font-medium uppercase tracking-wide text-sm text-menu-text-light hover:bg-menu-bg-dark hover:text-menu-text-dark rounded-lg ${item.className ?? ""}`}
          href={item.href as Url}
        >
          <span
            className={!item.children ? "block w-full" : ""}
            onClick={onClickClose}
          >
            {item.name}
          </span>
          {item.children && (
            <span
              className="block flex-grow"
              onClick={(e) => e.preventDefault()}
            >
              <Disclosure.Button
                as="span"
                className="flex justify-end flex-grow"
              >
                <ChevronDownIcon
                  className="ml-2 h-4 w-4 text-menu-text-light"
                  aria-hidden="true"
                />
              </Disclosure.Button>
            </span>
          )}
        </Link>
        {item.children && (
          <Disclosure.Panel>{_renderMenuChild(item)}</Disclosure.Panel>
        )}
      </Disclosure>
    );
  };

  const t = useTranslations("Header.MobileNav");

  return (
    <div className="overflow-y-auto w-full h-screen py-2 transition transform shadow-lg ring-1 dark:ring-neutral-700 text-menu-text-dark bg-menu-bg-dark hover:text-menu-text-light divide-y-2 divide-neutral-100">
      <div className="py-6 px-5">
        <Logo domain={domain} />
        <ul className="flex flex-col py-6 px-2 space-y-1">
          {data?.map(_renderItem)}
        </ul>

        <div className="flex flex-col mt-5 text-menu-text-light text-sm">
          <span>{t("text")}</span>

          <div className="flex justify-start items-center mt-4">
            <span className="block">
              <LocaleSwitcher />
            </span>
          </div>
          <div className="flex justify-between items-center mt-4">
            <SocialsList itemClass="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xl" />
          </div>
        </div>
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
    </div>
  );
};

export default NavMobile;
