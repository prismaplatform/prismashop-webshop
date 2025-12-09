"use client";
import React, { FC, useState } from "react";
import NcImage from "@/components/ui/NcImage/NcImage";
import Input from "@/components/ui/Input/Input";
import ButtonCircle from "@/components/ui/Button/ButtonCircle";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import { createNewsletter } from "@/api/about-us";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import TermsCheckbox from "@/components/ui/TermsCheckbox/TermsCheckbox";

export interface SectionPromo3Props {
  className?: string;
}

const SectionPromo3: FC<SectionPromo3Props> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const t = useTranslations("Components.Subscribe");

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

    if (!email) return;

    setLoading(true);
    try {
      await createNewsletter(email);
      setEmail("");
      Swal.fire({
        title: t("popup"),
        icon: "success",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`nc-SectionPromo3`}>
      <div
        className={`relative overflow-hidden bg-menu-bg-dark ${className} rounded-3xl lg:rounded-[4rem] p-6 sm:px-8 lg:px-10 mb-8`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Content Section */}
          <div className="lg:w-[60%] space-y-6 lg:space-y-8">
            <div
              className="h2 text-3xl lg:text-4xl font-bold text-menu-text-light leading-tight"
              dangerouslySetInnerHTML={{ __html: t.raw("title") }}
            />

            <div
              className="text-lg lg:text-xl text-menu-text-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t.raw("text") }}
            />

            <form className="space-y-6 w-full max-w-xl" onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  required
                  aria-required
                  placeholder={t("form")}
                  type="email"
                  rounded="rounded-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-20 text-lg h-16 px-8 shadow-lg hover:shadow-xl transition-shadow"
                />

                <ButtonCircle
                  type="submit"
                  className="bg-primary-500 absolute top-2 right-2 transform transition-transform hover:scale-105"
                  size="w-12 h-12"
                  disabled={loading || !acceptTerms}
                >
                  <ArrowSmallRightIcon className="w-6 h-6" />
                </ButtonCircle>
              </div>

              <TermsCheckbox
                id="SectionPromo3Terms"
                checked={acceptTerms}
                onChange={setAcceptTerms}
                className="mt-2 text-sm"
                name="newsletterTerms"
              />
            </form>
          </div>

          {/* Image Section */}
          <div className="lg:w-[40%] relative self-end">
            <NcImage
              alt="Newsletter illustration"
              containerClassName="relative aspect-square lg:aspect-[5/4]"
              src={t("image")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPromo3;
