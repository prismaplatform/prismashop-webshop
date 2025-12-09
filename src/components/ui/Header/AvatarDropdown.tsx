"use client";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@/app/ui/headlessui";
import { Fragment, useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { UserResponseDto } from "@/models/order-detail.model";
import Cookies from "js-cookie";
import { useLocale, useTranslations } from "next-intl";

export default function AvatarDropdown() {
  const [currentUser, setCurrentUser] = useState<UserResponseDto>();
  const t = useTranslations("Header.HeaderDropdowns.User");
  const locale = useLocale();

  useEffect(() => {
    // Check if there's a current user in the cookies
    const currentUserCookie = Cookies.get("currentUser");
    if (currentUserCookie) {
      const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);
      setCurrentUser(parsedUser);
    }
  }, []);

  return (
    <div className="AvatarDropdown">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <PopoverButton
              aria-label="popover button to open current user"
              className={`text-menu-text-light hover:bg-menu-bg-light focus:outline-none flex items-center justify-center p-2 rounded`}
            >
              <span className="hidden sm:inline">{currentUser?.name}</span>
              <svg
                className=" w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 bg-menu-bg-light dark:bg-neutral-800 py-7 px-6">
                    {currentUser && (
                      <div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-grow">
                            <h4 className="font-semibold">
                              {currentUser?.name}
                            </h4>
                            <p className="text-xs mt-0.5">
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>
                        <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                      </div>
                    )}

                    <Link
                      href={currentUser ? "/account" : "/login"}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg text-menu-text-light hover:bg-menu-bg-dark hover:text-menu-text-dark focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-menu-text-light hover:bg-menu-bg-dark hover:text-menu-text-dark">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">
                          {currentUser && currentUser.name
                            ? t("myAccount")
                            : t("login")}
                        </p>
                      </div>
                    </Link>

                    {currentUser && currentUser?.name && (
                      <Link
                        href={`/`}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        onClick={() => {
                          Cookies.remove("currentUser");
                          Cookies.remove("auth");
                          setCurrentUser(undefined);
                          close();
                          window.location.reload();
                        }}
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-menu-text-light dark:text-neutral-300">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 12H3.62"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div className="ml-4">
                          <p className="text-sm font-medium text-menu-text-light  hover:text-menu-text-dark hover:bg-menu-bg-dark">
                            {t("logout")}
                          </p>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
