"use client";
import React, { useEffect, useState } from "react";
import { ContactDto, NewContactDto } from "@/models/contact.model";
import { createNewContact, getContactInfo } from "@/api/contact";
import SocialsList from "@/components/ui/SocialsList/SocialsList";
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import Textarea from "@/components/ui/Textarea/Textarea";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import Swal from "sweetalert2";
import {
  BanknotesIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import TermsCheckbox from "@/components/ui/TermsCheckbox/TermsCheckbox";

const Contact = () => {
  const [contact, setContact] = useState<ContactDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const t = useTranslations("Pages.Contact");
  const tAccount = useTranslations("Pages.Account");

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactInfo: ContactDto = await getContactInfo();
        setContact(contactInfo);
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      Swal.fire({
        title: t("termsError"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setSubmitting(true);

    const newContact: NewContactDto = {
      name: name,
      email: email,
      message: message,
    };

    try {
      await createNewContact(newContact);
      setName("");
      setEmail("");
      setMessage("");
      window.location.href = "/confirmation/contact";
    } catch (error) {
      Swal.fire({
        title: t("error"),
        confirmButtonText: "Ok",
        icon: "warning",
      }).then(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !contact) {
    return <div className="text-center py-10">{tAccount("loading")}</div>;
  }

  const info = [
    {
      icon: MapPinIcon,
      title: t("address"),
      desc: contact.address,
      link: `/contact`,
    },
    {
      icon: EnvelopeIcon,
      title: t("contactEmail"),
      desc: contact.email,
      link: `mailto:${contact.email}`,
    },
    {
      icon: PhoneIcon,
      title: t("phone"),
      desc: contact.phone,
      link: `tel:${contact.phone}`,
    },
    {
      icon: DocumentTextIcon,
      title: t("taxCode"),
      desc: contact.taxCode,
      link: ``,
    },
    ...(contact.bankAccount
      ? [
          {
            icon: BanknotesIcon,
            title: t("bankAccount"),
            desc: contact.bankAccount,
            link: ``,
          },
        ]
      : []),
  ];

  return (
    <div className="bg-menu-bg-dark dark:bg-neutral-900">
      <div className="container max-w-7xl mx-auto px-4 py-20">
        <h2
          className="text-4xl md:text-5xl font-bold text-center text-menu-text-light dark:text-white mb-16 md:mb-24"
          dangerouslySetInnerHTML={{ __html: t.raw("title") }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 bg-menu-bg-light rounded-2xl px-4 py-8 md:p-12 shadow-xl">
          {/* Contact Info Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="px-4 text-3xl font-semibold text-menu-text-light ">
                {t("companyName")}
              </h3>
              {info.map(
                (item, index) =>
                  item.desc && (
                    <Link
                      key={index}
                      href={{ pathname: item.link }}
                      className="flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-menu-bg-dark group"
                    >
                      <div className="bg-accent-100/80 dark:bg-accent-900/20 p-3 rounded-lg flex-shrink-0 mr-4">
                        <item.icon className="w-6 h-6 text-menu-text-light" />
                      </div>
                      <div>
                        <div
                          className="h3 text-sm font-semibold uppercase tracking-wide text-menu-text-light  mb-1"
                          dangerouslySetInnerHTML={{ __html: item.title }}
                        />

                        <div
                          className="text-menu-text-light dark:text-gray-100 font-medium leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item.desc }}
                        />
                      </div>
                    </Link>
                  ),
              )}
            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-neutral-600">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-menu-text-light dark:text-gray-300 mb-4">
                {t("followUs")}
              </h3>
              <SocialsList className="flex space-x-4" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-menu-bg-dark dark:bg-neutral-700/20 rounded-xl p-6 md:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label className="mb-2 text-menu-text-light dark:text-gray-200">
                  {t("fullName")}
                </Label>
                <Input
                  placeholder={t("fullNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 focus:ring-2 focus:ring-accent-500"
                  required
                />
              </div>

              <div>
                <Label className="mb-2 text-menu-text-light dark:text-gray-200">
                  {t("emailAddress")}
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 focus:ring-2 focus:ring-accent-500"
                  required
                />
              </div>

              <div>
                <Label className="mb-2 text-menu-text-light dark:text-gray-200">
                  {t("message")}
                </Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 focus:ring-2 focus:ring-accent-500 h-32"
                  required
                />
              </div>

              <TermsCheckbox
                id="ContactTerms"
                name="terms"
                checked={acceptTerms}
                onChange={setAcceptTerms}
                className="mt-4"
              />

              <ButtonPrimary
                type="submit"
                disabled={submitting || !acceptTerms}
                className="w-full py-3 font-medium transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t("SendButton.sending") : t("SendButton.label")}
              </ButtonPrimary>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
