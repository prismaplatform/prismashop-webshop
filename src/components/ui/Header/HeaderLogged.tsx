import React, { FC } from "react";
import MainNav2Logged from "./MainNav2Logged";

export interface HeaderLoggedProps {
  domain: string;
}

const HeaderLogged: FC<HeaderLoggedProps> = ({ domain }) => {
  return (
    <div className="nc-HeaderLogged sticky top-0 w-full z-50">
      <MainNav2Logged domain={domain} />
    </div>
  );
};

export default HeaderLogged;
