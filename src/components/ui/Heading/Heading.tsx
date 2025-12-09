import React, { HTMLAttributes, ReactNode } from "react";
import NextPrev from "@/components/ui/NextPrev/NextPrev";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  rightDescText?: ReactNode;
  rightPopoverOptions?: string[];
  desc?: ReactNode;
  hasNextPrev?: boolean;
  isCenter?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  desc = "",
  className = "mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50",
  isCenter = false,
  hasNextPrev = false,
  fontClass = "text-3xl md:text-4xl font-semibold",
  rightDescText,
  rightPopoverOptions = [],
  ...args
}) => {
  return (
    <div
      className={`nc-Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between ${className}`}
    >
      <div className={isCenter ? "flex flex-col items-center text-center w-full mx-auto" : ""}>
        <h2 className={`${isCenter ? "justify-center" : ""} ${fontClass}`} {...args}>
          {children || `Section Heading`}
          {rightDescText && (
            <>
              <span className="">{`. `}</span>
              <span className="text-neutral-500 dark:text-neutral-400">{rightDescText}</span>
            </>
          )}
        </h2>
        {!!desc && (
          <span
            className="mt-2 md:mt-3 font-normal block text-base sm:text-xl text-menu-text-light dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        )}
      </div>
      {hasNextPrev && !isCenter && (
        <div className="mt-4 flex justify-end sm:ms-2 sm:mt-0 flex-shrink-0">
          <NextPrev onClickNext={() => {}} onClickPrev={() => {}} />
        </div>
      )}
    </div>
  );
};

export default Heading;
