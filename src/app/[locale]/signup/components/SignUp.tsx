"use client";

import React, { useState } from "react";
// import facebookSvg from "@/images/Facebook.svg";
// import twitterSvg from "@/images/Twitter.svg";
// import googleSvg from "@/images/Google.svg";
import Input from "@/components/ui/Input/Input";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import { useTranslations } from "next-intl";
import { createCustomer } from "@/api/customers";
import { UserResponseDto } from "@/models/order-detail.model";
import { useRouter } from "next/navigation";
import TermsCheckbox from "@/components/ui/TermsCheckbox/TermsCheckbox";

const SignUp = () => {
  const t = useTranslations("Pages.Account.Register");
  const router = useRouter();

  // const loginSocials = [
  //   {
  //     name: t("withFacebook"),
  //     href: "#",
  //     icon: facebookSvg,
  //   },
  //   {
  //     name: t("withTwitter"),
  //     href: "#",
  //     icon: twitterSvg,
  //   },
  //   {
  //     name: t("withGoogle"),
  //     href: "#",
  //     icon: googleSvg,
  //   },
  // ];

  const [formData, setFormData] = useState<UserResponseDto>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer(formData);
      router.push(`/signup/confirm` as any);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    /* <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <Image sizes="40px" className="flex-shrink-0" src={item.icon} alt={item.name} />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div> */

    /* <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              {t("or")}
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div> */

    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
      <label className="block">
        <span className="text-menu-text-light dark:text-neutral-200">{t("fullName")}</span>
        <Input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="mt-1"
          required
        />
      </label>
      <label className="block">
        <span className="text-menu-text-light dark:text-neutral-200">{t("phone")}</span>
        <Input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1"
          required
        />
      </label>
      <label className="block">
        <span className="text-menu-text-light dark:text-neutral-200">{t("email")}</span>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1"
          required
        />
      </label>
      <label className="block">
        <span className="text-menu-text-light dark:text-neutral-200">{t("password")}</span>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1"
          required
        />
      </label>
      <TermsCheckbox
        id="B2bTerms"
        checked={acceptTerms}
        onChange={setAcceptTerms}
        className="mt-4"
        name="B2BTerms"
      />
      <ButtonPrimary type="submit" disabled={!acceptTerms}>
        {t("continue")}
      </ButtonPrimary>
    </form>
  );
};

export default SignUp;
