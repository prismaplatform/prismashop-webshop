import React, { FC } from "react";
import { Transition } from "@/app/ui/headlessui";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface Props {
  show: boolean;
  name: string;
  productImage: string;
  onClose: () => void; // Added onClose handler
}

const NotifyAddToCart: FC<Props> = ({ show, name, productImage, onClose }) => {
  const t = useTranslations("Header.HeaderDropdowns.Cart");
  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 relative flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={productImage}
            alt={name}
            fill
            priority={true}
            sizes="100px"
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{name}</h3>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <div className="flex">
              <Link
                href={"/cart"}
                type="button"
                className="font-bold text-xl text-primary-500 "
              >
                {t("viewCart")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tHeader = useTranslations("Header");

  return (
    <Transition
      appear
      as={"div"}
      show={show}
      className="p-4 max-w-md w-full bg-white dark:bg-accent-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-accent-900 dark:text-accent-200 relative" // Added relative positioning
      enter="transition-all duration-150"
      enterFrom="opacity-0 translate-x-20"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-20"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full text-accent-500 hover:text-accent-900 dark:hover:text-accent-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <span className="sr-only">Close</span>
        {/* Heroicon name: x */}
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <p className="block text-base font-semibold leading-none">
        {tHeader("addedToCart")}
      </p>
      <hr className=" border-accent-200 dark:border-accent-700 my-4" />
      {renderProductCartOnNotify()}
    </Transition>
  );
};

export default NotifyAddToCart;
