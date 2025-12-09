"use client";

import Logo from "@/components/ui/Logo/Logo";
import { CustomLink } from "@/data/types";
import React, { FC, useEffect, useState } from "react";
import Input from "@/components/ui/Input/Input";
import ButtonCircle from "@/components/ui/Button/ButtonCircle";
import { createNewsletter } from "@/api/about-us";
import anpc from "/public/anpc.svg";
import solutia from "/public/soal.svg";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import SocialsList from "../SocialsList/SocialsList";
import { ContactDto } from "@/models/contact.model";
import { getContactInfo } from "@/api/contact";
import Swal from "sweetalert2";
import { getLinks, getPaymentService } from "@/api/useful-links";
import { Route } from "@/routers/types";
import { CategoryItem, getTopCategories } from "@/api/category";
import { Link } from "@/i18n/routing";
import { LinkItem, PaymentServiceDto } from "@/models/useful.model";
import { useTranslations } from "next-intl";
import TermsCheckbox from "../TermsCheckbox/TermsCheckbox";
import PaymentServiceDisplay from "@/components/ui/Footer/PaymentServiceDisplay";
import { ShinyBadge } from "@/components/ui/ShinyBadge/ShinyBadge";
import PaymentServiceDisplay2 from "./PaymentServiceDisplay2";
import Image from "next/image";

export interface SiteFooterProps {
  domain: string;
}

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const Footer: FC<SiteFooterProps> = ({ domain }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<ContactDto | null>(null);

  const [usefulLinks, setUsefulLinks] = useState<LinkItem[]>([]);
  const [paymentService, setPaymentService] =
    useState<PaymentServiceDto | null>(null);
  const [categoryLinks, setCategoryLinks] = useState<CategoryItem[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const t = useTranslations("Footer");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const results = await Promise.allSettled([
          getLinks(),
          getContactInfo(),
          getTopCategories(),
          getPaymentService(),
        ]);

        if (results[0].status === "fulfilled") {
          setUsefulLinks(results[0].value);
        }
        if (results[1].status === "fulfilled") {
          setContact(results[1].value);
        }
        if (results[2].status === "fulfilled") {
          setCategoryLinks(results[2].value);
        }
        if (results[3].status === "fulfilled") {
          setPaymentService(results[3].value);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await createNewsletter(email);
    setEmail("");
    Swal.fire({
      title: t("Offers.popup"),
      icon: "success",
    });
  };

  const sortedLinks = usefulLinks
    .sort((a, b) => a.priority - b.priority)
    .map((link) => ({
      ...link,
      href: link.slug ? `${domain}/help/${link.slug}` : link.link,
    }));

  const menuLinks: CustomLink[] = sortedLinks.map((link) => ({
    label: link.name,
    href: link.slug ? (`/help/${link.slug}` as Route) : (link.link as Route),
    targetBlank: link.link ? false : false,
  }));

  const widgetMenus: WidgetFooterMenu[] = [
    {
      id: "1",
      title: t("Links.title") || "Useful Links",
      menus: [...menuLinks],
    },
  ];

  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm text-menu-text-light">
        <h2 className="font-semibold">{menu.title}</h2>
        <ul className="mt-2 space-y-2">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                target={item.targetBlank ? "_blank" : "_self"}
                className=""
                rel="noopener noreferrer"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="nc-Footer relative py-8 lg:pt-16 border-t border-menu-text-light bg-menu-bg-light text-menu-text-light">
      <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-8">
        <div className="text-center lg:text-left flex flex-col lg:md:col-span-2 lg:flex lg:flex-col gap-5 col-span-2 md:col-span-4 lg:md:col-span-2">
          <div className="col-span-2 md:col-span-1">
            <Logo domain={domain} />
          </div>
          <div className="col-span-2 flex items-center md:col-span-3 text-sm">
            {t("bio")}
          </div>
          <div className="w-full flex justify-center items-center lg:items-start lg:justify-start col-span-full">
            {contact && <SocialsList className="mt-2" />}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:md:col-span-2 lg:flex lg:flex-col">
          <h2 className="font-semibold">{t("Offers.title")}</h2>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: t.raw("Offers.text") }}
          />

          <form className="relative space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                required
                aria-required
                placeholder={t("Offers.form")}
                type="email"
                rounded="rounded-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <ButtonCircle
                type="submit"
                className="absolute transform top-1/2 -translate-y-1/2 right-1"
                disabled={loading || !acceptTerms}
              >
                <ArrowSmallRightIcon className="w-6 h-6" />
              </ButtonCircle>
            </div>

            <TermsCheckbox
              id="FooterTerms"
              checked={acceptTerms}
              onChange={setAcceptTerms}
              name="newsletterTerms"
            />
          </form>
        </div>
        {menuLinks.length > 0 && widgetMenus.map(renderWidgetMenuItem)}
        <div className="grid lg:grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
          <div className="flex lg:flex-col items-center justify-center">
            <PaymentServiceDisplay paymentService={paymentService} />
            {(paymentService?.serviceName == "NETOPIA" ||
              paymentService?.serviceName == "STRIPE" ||
              paymentService?.serviceName == "") && (
              <>
                <Link
                  className="lg:me-2 lg:mb-0 me-2 mb-2"
                  href="https://anpc.ro/ce-este-sal/"
                >
                  <Image src={anpc} alt="anpc" height={80} />
                </Link>
                <Link
                  className="lg:me-2 lg:mb-0 me-2 mb-2"
                  href="https://ec.europa.eu/consumers/odr"
                >
                  <Image src={solutia} alt="sol" height={80} />
                </Link>
              </>
            )}
            <ShinyBadge />
          </div>
        </div>
      </div>
      <PaymentServiceDisplay2 paymentService={paymentService} />
      <Link
        href="https://prismasolutions.ro"
        className="text-sm mt-12 text-center"
        dangerouslySetInnerHTML={{ __html: t.raw("Development.text") }}
      />
    </div>
  );
};

export default Footer;
