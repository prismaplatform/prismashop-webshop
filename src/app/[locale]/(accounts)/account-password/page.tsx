"use client";
import Label from "@/components/ui/Label/Label";
import React, { useState } from "react";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import Input from "@/components/ui/Input/Input";
import { updatePassword } from "@/api/customers";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";

const AccountPass = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    general: "",
  });
  const t = useTranslations("Pages.Account");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
      general: "",
    };

    if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("UpdatePassword.Validations.passwordMinLength");
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("UpdatePassword.Validations.notMatching");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      Swal.fire({
        title: t("UpdatePassword.success"),
        text: t("UpdatePassword.successText"),
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Clear form after successful update
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      });
    } catch (error: any) {
      let errorMessage = t("UpdatePassword.failed");
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: t("UpdatePassword.error"),
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      <h2 className="text-2xl sm:text-3xl font-semibold text-menu-text-light">
        {t("UpdatePassword.title")}
      </h2>
      <div className="max-w-xl space-y-6">
        <div>
          <Label>{t("UpdatePassword.currentPassword")}</Label>
          <Input
            type="password"
            className="mt-1.5"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label>{t("UpdatePassword.newPassword")}</Label>
          <Input
            type="password"
            className="mt-1.5"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
          {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
        </div>
        <div>
          <Label>{t("UpdatePassword.confirmPassword")}</Label>
          <Input
            type="password"
            className="mt-1.5"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="pt-2">
          <ButtonPrimary onClick={handleSave} disabled={isLoading}>
            {isLoading ? t("saving") : t("changePassword")}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default AccountPass;
