"use client";

import React, { useEffect, useState } from "react";
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import TermsCheckbox from "@/components/ui/TermsCheckbox/TermsCheckbox";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ReturnPage = () => {
  const t = useTranslations("Pages.Account.Return");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const currentUserCookie = Cookies.get("currentUser");
    const parsedUser = currentUserCookie ? JSON.parse(currentUserCookie) : null;

    if (parsedUser?.id) {
      router.replace("/account-order");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle guest return lookup
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-neutral-100">
        {t("title")}
      </h1>
      <h2 className="text-center mb-12">{t("text")}</h2>

      <form onSubmit={handleGuestSubmit} className="grid gap-6">
        <label className="block">
          <Label>{t("transactionID")}</Label>
          <Input
            name="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
            className="mt-1"
          />
        </label>

        <label className="block">
          <Label>{t("email")}</Label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </label>

        <TermsCheckbox
          id="ReturnTerms"
          name="terms"
          checked={acceptTerms}
          onChange={setAcceptTerms}
          className="mt-4"
        />

        <div className="mt-4">
          <ButtonPrimary type="submit" disabled={!acceptTerms} className="w-full md:w-auto">
            {t("submit")}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
};

export default ReturnPage;
