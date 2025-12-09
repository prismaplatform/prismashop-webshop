"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Swal from "sweetalert2";

import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";

import { NewMuseumDto } from "@/models/contact.model";
import { createMuseumInquiry } from "@/api/contact";

const MuseumForm = () => {
  // Assuming your translations for this page are under "Pages.Contact"
  const t = useTranslations("Pages.B2B");
  const router = useRouter();
  const locale = useLocale();

  const [formData, setFormData] = useState<NewMuseumDto>({
    ContactPerson: "",
    Email: "",
    PhoneNumber: "",
    PreferredDateTime: "",
    NumberOfPeople: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Use the new API function for contact inquiries
      await createMuseumInquiry(formData);

      // Reset form to initial state
      setFormData({
        ContactPerson: "",
        Email: "",
        PhoneNumber: "",
        PreferredDateTime: "",
        NumberOfPeople: "",
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
      {/* Persoana de contact * */}
      <label className="block">
        <Label>{t("contactPerson")}</Label>
        <Input
          name="ContactPerson"
          value={formData.ContactPerson}
          onChange={handleChange}
          className="mt-1"
          required
        />
      </label>

      {/* Email * */}
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

      {/* Numar de telefon */}
      <label className="block">
        <Label>{t("phone")}</Label>
        <Input
          type="tel"
          name="PhoneNumber"
          value={formData.PhoneNumber}
          onChange={handleChange}
          className="mt-1"
        />
      </label>

      <label className="block">
        <Label>{t("preferredDateTime")}</Label>
        <Input
          type="text"
          name="PreferredDateTime"
          value={formData.PreferredDateTime}
          onChange={handleChange}
          className="mt-1"
        />
      </label>

      {/* Număr de persoane */}
      <label className="block">
        <Label>{t("numberOfPeople")}</Label>
        <Input
          type="number"
          name="NumberOfPeople"
          value={formData.NumberOfPeople}
          onChange={handleChange}
          className="mt-1"
          min="1"
        />
      </label>

      <div className="mt-4">
        <ButtonPrimary type="submit" disabled={submitting} className="w-full md:w-auto">
          {submitting ? t("SendButton.sending") : t("SendButton.label")}
        </ButtonPrimary>
      </div>
    </form>
  );
};

export default MuseumForm;
