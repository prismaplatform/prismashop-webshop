import React from "react";
import type { Route } from "next";
import logoImg from "@/images/logo-dark.webp";
import logoLightImg from "@/images/logo-light.webp";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getConfigurationUrlWithDomain } from "@/utils/configurationHelper";

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
  domain?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = logoLightImg,
  className = "flex-shrink-0",
  domain,
}) => {
  if (domain) {
    img = getConfigurationUrlWithDomain(domain) + "logo.webp";
    imgLight = getConfigurationUrlWithDomain(domain) + "logo.webp";
  }
  return (
    <Link
      href={"/" as Route}
      className={`ttnc-logo inline-block text-accent-600 ${className}`}
    >
      {img ? (
        <Image
          className={`block h-8 sm:h-10 w-auto ${imgLight ? "dark:hidden" : ""}`}
          src={img}
          alt="Logo"
          sizes="200px"
          width={200}
          height={100}
          priority
        />
      ) : (
        "Logo Here"
      )}
      {imgLight && (
        <Image
          className="hidden h-8 sm:h-10 w-auto dark:block"
          src={imgLight}
          alt="Logo-Light"
          sizes="200px"
          width={200}
          height={100}
          priority
        />
      )}
    </Link>
  );
};

export default Logo;
