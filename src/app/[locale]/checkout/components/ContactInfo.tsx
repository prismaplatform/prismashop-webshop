// ContactInfo.tsx

"use client";

import Label from "@/components/ui/Label/Label";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import ButtonSecondary from "@/components/ui/Button/ButtonSecondary";
import Input from "@/components/ui/Input/Input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { LoginDto, Role, UserResponseDto } from "@/models/order-detail.model";
import {
  addOrUpdateCustomer,
  removeCustomer,
} from "@/lib/slices/orderDetailSlice";
import { Link } from "@/i18n/routing";
import { createCustomer, loginCustomer, updateCustomer } from "@/api/customers";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { Route } from "next";

interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
}

const UserIcon = () => (
  <svg
    className="w-6 h-6 text-menu-text-light mt-0.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ContactInfo: FC<Props> = ({ isActive, onCloseActive, onOpenActive }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations("Pages.Checkout");
  const tAccount = useTranslations("Pages.Account");

  // --- STATE MANAGEMENT ---
  const orderDetailsState = useSelector(
    (state: RootState) => state.orderDetails,
  );

  const [viewMode, setViewMode] = useState<"display" | "edit" | "login">(
    "display",
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [orderCustomerDetail, setOrderCustomerDetail] =
    useState<UserResponseDto>({
      id: undefined,
      email: "",
      name: "",
      phone: "",
      role: Role.CUSTOMER,
      active: true,
    });

  const [password, setPassword] = useState("");
  const [wantsToCreateAccount, setWantsToCreateAccount] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    // Sync state with cookie or Redux store on initial load
    const currentUserCookie = Cookies.get("currentUser");
    const auth = Cookies.get("auth");
    if (currentUserCookie && auth) {
      const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);
      setOrderCustomerDetail(parsedUser);
      dispatch(addOrUpdateCustomer(parsedUser));
      setIsLoggedIn(true);
    } else if (orderDetailsState.customer) {
      const parsedUser: UserResponseDto = orderDetailsState.customer;
      setOrderCustomerDetail(parsedUser);
    }
  }, []); // Run only once on mount

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderCustomerDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleApiError = (error: any) => {
    if (error.response?.data?.code === 12) {
      // Email in use
      Swal.fire({
        title: tAccount("emailInUse"),
        confirmButtonText: t("ContactInfo.login"),
        icon: "warning",
      }).then(() => {
        setViewMode("login"); // Switch to login view
      });
    } else {
      Swal.fire({
        title: t("Summary.errors.genericTitle"),
        text:
          error.response?.data?.message || t("Summary.errors.genericMessage"),
        icon: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      // Destructure for easier access
      const { email, phone, name } = orderCustomerDetail;

      if (!email || !phone || !name) {
        Swal.fire({
          icon: "error",
          title: t("Summary.errors.genericTitle"),
          text: t("Summary.errors.customer"),
        });
        return;
      }

      if (!isValidEmail(email)) {
        Swal.fire({
          icon: "error",
          title: t("Summary.errors.genericTitle"),
          text: t("Summary.errors.customer"),
        });
        return;
      }

      if (!isValidPhone(phone)) {
        Swal.fire({
          icon: "error",
          title: t("Summary.errors.genericTitle"),
          text: t("Summary.errors.customer"),
        });
        return;
      }

      const customerToSave = {
        ...orderCustomerDetail,
        password: wantsToCreateAccount && !isLoggedIn ? password : undefined,
      };

      const savedCustomer = isLoggedIn
        ? await updateCustomer(customerToSave)
        : await createCustomer(customerToSave);

      dispatch(addOrUpdateCustomer(savedCustomer));

      if (isLoggedIn || wantsToCreateAccount) {
        Cookies.set("currentUser", JSON.stringify(savedCustomer), {
          expires: 7,
        });
        setIsLoggedIn(true);
      }

      onCloseActive();
      setViewMode("display");
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const isValidEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    if (!phone) return false;
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleLogin = async () => {
    const userLoginDto: LoginDto = {
      email: orderCustomerDetail.email,
      password: password,
    };
    try {
      const loggedInUser = await loginCustomer(userLoginDto);
      Cookies.set("currentUser", JSON.stringify(loggedInUser), { expires: 7 });
      dispatch(addOrUpdateCustomer(loggedInUser));
      setOrderCustomerDetail(loggedInUser); // Update local state with full user details
      setIsLoggedIn(true);
      onCloseActive();
      setViewMode("display");
    } catch (error: any) {
      Swal.fire({
        title: t("Summary.errors.loginFailed"),
        text: t("Summary.errors.invalidCredentials"),
        icon: "error",
      });
    }
  };

  const handleLogout = () => {
    Cookies.remove("currentUser");
    Cookies.remove("auth");
    dispatch(removeCustomer());
    // Reset to a clean slate
    setOrderCustomerDetail({
      id: undefined,
      email: "",
      name: "",
      phone: "",
      role: Role.CUSTOMER,
      active: true,
    });
    setIsLoggedIn(false);
    setViewMode("display");
  };

  const handleOpenForm = () => {
    onOpenActive();
    setViewMode("edit");
  };

  // --- RENDER LOGIC ---

  const renderActiveForm = () => {
    if (viewMode === "login") {
      return (
        // Login Form
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-menu-text-light">
            {t("ContactInfo.login")}
          </h3>
          <div>
            <Label className="text-sm">{t("ContactInfo.email")}</Label>
            <Input
              className="mt-1.5"
              name="email"
              placeholder={t("ContactInfo.email")}
              value={orderCustomerDetail.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label className="text-sm">{t("ContactInfo.password")}</Label>
            <Input
              type="password"
              placeholder={t("ContactInfo.password")}
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex pt-2">
            <ButtonPrimary
              className="sm:!px-7 shadow-none"
              onClick={handleLogin}
            >
              {t("ContactInfo.login")}
            </ButtonPrimary>
            <ButtonSecondary
              className="ml-3"
              onClick={() => setViewMode("edit")}
            >
              {t("ContactInfo.cancel")}
            </ButtonSecondary>
          </div>
        </div>
      );
    }

    return (
      // Edit/Create Form
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-start  lg:items-center justify-between">
          <h3 className="text-lg font-semibold text-menu-text-light">
            {t("ContactInfo.text")}
          </h3>
          {!isLoggedIn && t("ContactInfo.noAccount") != "" && (
            <div className="text-sm lg:mt-0 text-menu-text-light">
              {t("ContactInfo.noAccount")}{" "}
              <button
                className="text-primary-500 font-medium"
                onClick={() => setViewMode("login")}
              >
                {t("ContactInfo.login")}
              </button>
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm">{t("ContactInfo.fullName")}</Label>
          <Input
            className="mt-1.5"
            name="name"
            placeholder={t("ContactInfo.fullName")}
            value={orderCustomerDetail.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label className="text-sm">{t("ContactInfo.phone")}</Label>
          <Input
            className="mt-1.5"
            name="phone"
            type="tel"
            placeholder={t("ContactInfo.phone")}
            value={orderCustomerDetail.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label className="text-sm">{t("ContactInfo.email")}</Label>
          <Input
            className="mt-1.5"
            name="email"
            type="email"
            placeholder={t("ContactInfo.email")}
            value={orderCustomerDetail.email}
            onChange={handleInputChange}
            disabled={isLoggedIn}
          />
        </div>

        {!isLoggedIn && t("ContactInfo.saveAddress") != "" && (
          <div className="flex items-center space-x-2">
            <input
              id="create-account"
              type="checkbox"
              checked={wantsToCreateAccount}
              onChange={(e) => setWantsToCreateAccount(e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-accent-500 border-accent-300 rounded"
            />
            <Label htmlFor="create-account" className="text-sm">
              {t("ContactInfo.saveAddress")}
            </Label>
          </div>
        )}

        {wantsToCreateAccount && !isLoggedIn && (
          <div>
            <Label className="text-sm">{t("ContactInfo.setPassword")}</Label>
            <Input
              type="password"
              placeholder={t("ContactInfo.password")}
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <div className="flex pt-2">
          <ButtonPrimary className="sm:!px-7 shadow-none" onClick={handleSave}>
            {t("saveNext")}
          </ButtonPrimary>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden z-0">
      <div className="flex flex-col sm:flex-row items-start p-6">
        <span className="hidden sm:block">
          <UserIcon />
        </span>
        <div className="sm:ml-8">
          <h3 className="text-menu-text-light  uppercase tracking-tight">
            {t("ContactInfo.title")}
          </h3>
          <div className="font-semibold mt-1 text-sm flex flex-col">
            <span className="text-menu-text-light">
              {orderCustomerDetail.name}
            </span>
            <span className="text-primary-500">
              <Link href={`mailto:${orderCustomerDetail.email}` as Route}>
                {orderCustomerDetail.email}
              </Link>
            </span>
            <span className="text-menu-text-light">
              <Link href={`tel:${orderCustomerDetail.phone}` as Route}>
                {orderCustomerDetail.phone}
              </Link>
            </span>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-red-500 text-xs font-medium mt-2 text-left w-max"
              >
                {t("ContactInfo.logout")}
              </button>
            )}
          </div>
        </div>

        <button
          aria-label="open active"
          className="py-2 px-4 text-menu-text-dark bg-menu-bg-dark hover:bg-menu-bg-light mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
          onClick={handleOpenForm}
        >
          {t("modifyButton")}
        </button>
      </div>
      {isActive && (
        <div className="border-t border-accent-200 dark:border-accent-700 px-6 py-7">
          {renderActiveForm()}
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
