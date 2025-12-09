import React, { FC, ReactNode } from "react";
import twFocusClass from "@/utils/twFocusClass";

export interface NavItemProps {
  className?: string;
  radius?: string;
  onClick?: () => void;
  isActive?: boolean;
  renderX?: ReactNode;
  children?: React.ReactNode;
}

const NavItem: FC<NavItemProps> = ({
  className = "px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize",
  radius = "rounded-full",
  children,
  onClick = () => {},
  isActive = false,
  renderX,
}) => {
  return (
    <li className="nc-NavItem relative" data-nc-id="NavItem">
      {renderX && renderX}
      <button
        className={`block !leading-none font-medium whitespace-nowrap ${className} ${radius} ${
          isActive
            ? "bg-accent-900 dark:bg-accent-100 text-accent-100 dark:text-accent-900 "
            : "text-accent-500 dark:text-accent-400 dark:hover:text-accent-100 hover:text-accent-800 hover:bg-accent-100/75 dark:hover:bg-accent-800"
        } ${twFocusClass()}`}
        onClick={() => {
          onClick && onClick();
        }}
      >
        {children}
      </button>
    </li>
  );
};

export default NavItem;
