"use client";

import React, { FC } from "react";
import Logo from "@/components/ui/Logo/Logo";
import MenuBar from "@/components/ui/MenuBar/MenuBar";
import AvatarDropdown from "./AvatarDropdown";
import Navigation from "@/components/ui/Navigation/Navigation";
import CartDropdown from "./CartDropdown";
import LocaleSwitcher from "@/components/ui/LocalSwitcher/LocalSwitcher";

export interface MainNav2LoggedProps {
  domain: string;
}

const MainNav2Logged: FC<MainNav2LoggedProps> = ({ domain }) => {
  const renderContent = () => {
    return (
      <div className="h-20 flex justify-between">
        <div className="flex items-center lg:hidden flex-1">
          <MenuBar domain={domain} />
        </div>

        <div className="lg:flex-1 flex items-center">
          <Logo className="flex-shrink-0" domain={domain} />
        </div>

        <div className="flex-[2] hidden lg:flex justify-center mx-4">
          {<Navigation />}
        </div>

        <div className="flex-1 flex items-center justify-end text-menu-text-light dark:text-menu-text-dark">
          <AvatarDropdown />
          <CartDropdown />
          <div className="hidden lg:flex">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-MainNav2Logged relative z-10 bg-menu-bg-dark border-b border-menu-border-dark dark:border-menu-border-dark">
      <div className="container ">{renderContent()}</div>
    </div>
  );
};

export default MainNav2Logged;
