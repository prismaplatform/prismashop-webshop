"use client";
import React, { useState } from "react";
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import Textarea from "@/components/ui/Textarea/Textarea";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import Select from "@/components/ui/Select/Select";
import { useLocale, useTranslations } from "next-intl";
import Swal from "sweetalert2";
import { createB2BInquiry } from "@/api/contact";
import { NewB2BDto } from "@/models/contact.model";
import TermsCheckbox from "@/components/ui/TermsCheckbox/TermsCheckbox";
import { useRouter } from "next/navigation";

const B2BForm = () => {
  const t = useTranslations("Pages.B2B");
  const router = useRouter();
  const locale = useLocale();

  const [formData, setFormData] = useState<NewB2BDto>({
    CompanyName: "",
    CompanyId: "",
    ContactName: "",
    Email: "",
    Phone: "",
    Country: "Romania",
    OrderVolume: "",
    Message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createB2BInquiry(formData);
      setFormData({
        CompanyName: "",
        CompanyId: "",
        ContactName: "",
        Email: "",
        Phone: "",
        Country: "Romania",
        OrderVolume: "",
        Message: "",
      });
      Swal.fire({
        title: t("successTitle"),
        text: t("successMessage"),
        icon: "success",
        confirmButtonText: t("successButton"),
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/${locale}`);
        }
      });
    } catch (error) {
      Swal.fire({
        title: t("submitError"),
        text: t("submitErrorMessage"),
        icon: "error",
        confirmButtonText: t("tryAgain"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <Label>{t("companyName")}</Label>
          <Input
            name="CompanyName"
            value={formData.CompanyName}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </label>
        <label className="block">
          <Label>{t("companyID")}</Label>
          <Input
            name="CompanyId"
            value={formData.CompanyId}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <Label>{t("contactName")}</Label>
          <Input
            name="ContactName"
            value={formData.ContactName}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </label>
        <label className="block">
          <Label>{t("country")}</Label>
          <Select name="Country" value={formData.Country} onChange={handleChange} className="mt-1">
            <option value="Romania">Romania</option>
            <option value="Other">Other</option>
          </Select>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <Label>{t("email")}</Label>
          <Input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </label>
        <label className="block">
          <Label>{t("phone")}</Label>
          <Input
            type="tel"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </label>
      </div>

      <label className="block">
        <Label>{t("orderVolume")}</Label>
        <Select
          name="OrderVolume"
          value={formData.OrderVolume}
          onChange={handleChange}
          className="mt-1"
        >
          <option value="">{t("selectVolume")}</option>
          <option value="50-100">50-100</option>
          <option value="100-500">100-500</option>
          <option value="500+">500+</option>
        </Select>
      </label>

      <label className="block">
        <Label>{t("message")}</Label>
        <Textarea
          name="Message"
          value={formData.Message}
          onChange={handleChange}
          className="mt-1"
          rows={6}
        />
      </label>
      <TermsCheckbox
        id="B2bTerms"
        checked={acceptTerms}
        onChange={setAcceptTerms}
        className="mt-4"
        name="B2BTerms"
      />

      <div className="mt-4">
        <ButtonPrimary
          type="submit"
          disabled={submitting || !acceptTerms}
          className="w-full md:w-auto"
        >
          {submitting ? t("SendButton.sending") : t("SendButton.label")}
        </ButtonPrimary>
      </div>
    </form>
  );
};

export default B2BForm;
