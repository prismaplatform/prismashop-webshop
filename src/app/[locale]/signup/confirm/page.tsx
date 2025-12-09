import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import React from "react";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("Pages.Account.Register.Confirm");
  return (
    <div className="nc-OrderConfirmationPage">
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto space-y-4">
          <div className="text-primary-500 mx-auto w-50">
            {" "}
            {/* Adjust w-32 (or max-w-*) for desired size */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              // Removed width and height attributes from SVG directly for Tailwind control
              viewBox="0 0 1125 749.999995" // KEEP this viewBox from your SVG file!
              preserveAspectRatio="xMidYMid meet"
              version="1.0"
              className="w-full" // SVG takes full width of its parent div
            >
              <defs>
                <clipPath id="7c68634c1b">
                  <path
                    d="M 375.203125 744.722656 C 432.878906 747.910156 498.449219 750 562.804688 750 C 627.160156 750 689.085938 748.207031 746.152344 745.019531 C 747.371094 744.921875 748.582031 744.921875 749.796875 744.820312 C 964.113281 732.070312 1121.964844 698.40625 1125 647.402344 L 1125 0 L 0 0 L 0 646.921875 C 3.035156 698.605469 158.460938 732.269531 375.203125 744.722656 Z M 375.203125 744.722656 "
                    clipRule="nonzero" // Changed clip-rule to clipRule for React
                  />
                </clipPath>
                <clipPath id="8b0e37d095">
                  <path
                    d="M 327.078125 134.738281 L 807.828125 134.738281 L 807.828125 615.488281 L 327.078125 615.488281 Z M 327.078125 134.738281 "
                    clipRule="nonzero" // Changed clip-rule to clipRule for React
                  />
                </clipPath>
              </defs>
              <g clipPath="url(#7c68634c1b)">
                <rect
                  x="-112.5"
                  width="1350"
                  fill="currentColor" // Set fill to currentColor
                  y="-74.999999"
                  height="899.999994"
                  fillOpacity="1" // Changed fill-opacity to fillOpacity for React
                />
              </g>
              <g clipPath="url(#8b0e37d095)">
                <path
                  fill="#ffffff" // Keep this white for the checkmark
                  d="M 798.441406 309.492188 L 745.179688 362.957031 C 745.328125 366.902344 745.53125 370.898438 745.53125 374.996094 C 745.53125 473.222656 665.5625 553.191406 567.335938 553.191406 C 469.109375 553.191406 389.140625 473.222656 389.140625 374.996094 C 389.140625 276.765625 469.109375 196.800781 567.335938 196.800781 C 600.265625 196.800781 631.269531 205.75 657.824219 221.632812 L 702.792969 176.667969 C 664.199219 150.265625 617.664062 134.738281 567.335938 134.738281 C 434.96875 134.738281 327.078125 242.472656 327.078125 374.996094 C 327.078125 507.363281 434.96875 615.253906 567.335938 615.253906 C 699.859375 615.253906 807.59375 507.363281 807.59375 374.996094 C 807.59375 352.234375 804.507812 330.382812 798.441406 309.492188 Z M 798.441406 309.492188 "
                  fillOpacity="1" // Changed fill-opacity to fillOpacity for React
                  fillRule="nonzero" // Changed fill-rule to fillRule for React
                />
              </g>
              <path
                fill="#ffffff" // Set fill to ffffff
                d="M 511.496094 342.117188 C 498.800781 329.421875 478.164062 329.421875 465.417969 342.117188 C 452.722656 354.863281 452.722656 375.449219 465.417969 388.195312 L 535.523438 458.300781 C 541.894531 464.671875 550.242188 467.808594 558.535156 467.808594 C 566.882812 467.808594 575.226562 464.625 581.601562 458.300781 L 787.160156 252.742188 C 799.90625 240.046875 799.90625 219.410156 787.160156 206.664062 C 774.464844 193.914062 753.828125 193.914062 741.082031 206.664062 L 558.535156 389.207031 Z M 511.496094 342.117188 "
                fillOpacity="1" // Changed fill-opacity to fillOpacity for React
                fillRule="nonzero" // Changed fill-rule to fillRule for React
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-menu-text-light">
            {t("title")}
          </h2>
          <p className="text-sm text-menu-text-light">{t("text")}</p>
          <div className="">
            <div className="pt-6 space-x-4">
              <ButtonPrimary href="/">{t("back")}</ButtonPrimary>
            </div>
            <div className="pt-6 space-x-4">
              <ButtonPrimary href="/login">{t("login")}</ButtonPrimary>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Page;
