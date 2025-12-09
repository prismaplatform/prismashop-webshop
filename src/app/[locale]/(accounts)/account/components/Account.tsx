"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Input from "@/components/ui/Input/Input";
import Label from "@/components/ui/Label/Label";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import { useTranslations } from "next-intl";
import { UserResponseDto } from "@/models/order-detail.model";
import { updateCustomer } from "@/api/customers";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const Account = () => {
  const router = useRouter();
  const t = useTranslations("Pages.Account");
  const tContact = useTranslations("Pages.Contact");

  const [currentUser, setCurrentUser] = useState<UserResponseDto | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUserCookie = Cookies.get("currentUser");
    if (currentUserCookie) {
      const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);
      setCurrentUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const updatedCustomer = await updateCustomer({
        ...currentUser,
        ...formData,
      });

      setCurrentUser(updatedCustomer);
      Cookies.set("currentUser", JSON.stringify(updatedCustomer), { expires: 7 });

      Swal.fire({
        title: t("success"),
        text: t("successText"),
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error: any) {
      if (error.response?.data.code === 12) {
        Cookies.remove("currentUser");
        Swal.fire({
          title: t("emailInUse"),
          text: t("emailInUseText"),
          icon: "warning",
          confirmButtonText: "Login",
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: error.response?.data.message || "Failed to update information",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>{tContact("emailAddress")}</Label>
        <Input
          className="mt-1.5"
          name="email"
          type="email"
          disabled
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label>{tContact("fullName")}</Label>
        <Input className="mt-1.5" name="name" value={formData.name} onChange={handleInputChange} />
      </div>

      <div>
        <Label>{tContact("phone")}</Label>
        <Input
          className="mt-1.5"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>

      <div className="pt-2">
        <ButtonPrimary onClick={handleSave} disabled={isLoading}>
          {isLoading ? t("saving") : t("save")}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Account;
