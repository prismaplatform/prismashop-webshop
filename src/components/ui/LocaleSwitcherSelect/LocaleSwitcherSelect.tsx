"use client";

import clsx from "clsx";
import { Link, Locale, usePathname } from "@/i18n/routing";
import React, { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

// The unused `label` prop has been removed.
type Props = {
  options: { label: string; value: Locale; icon: string }[];
  defaultValue: string;
};

export default function LocaleSwitcherDropdown({
  options,
  defaultValue,
}: Props) {
  const pathname = usePathname();

  const currentOption = options.find((option) => option.value === defaultValue);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-xs ring-inset ring-gray-300">
          {currentOption ? (
            <>
              <Image
                width={20}
                height={20}
                className="rounded-full"
                src={currentOption.icon}
                alt={`${currentOption.label} flag icon`}
              />
              {currentOption.label}
            </>
          ) : (
            "Select Language"
          )}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none lg:right-0">
          <div className="py-1">
            {options.map((option) => (
              <MenuItem key={option.value}>
                {({ focus }) => (
                  <Link
                    href={pathname}
                    locale={option.value}
                    className={clsx(
                      "flex w-full items-center px-4 py-2 text-left text-sm",
                      focus ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    )}
                  >
                    <Image
                      className="me-2 rounded-full"
                      width={20}
                      height={20}
                      src={option.icon}
                      alt={`${option.label} flag icon`}
                    />
                    {option.label}
                  </Link>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
