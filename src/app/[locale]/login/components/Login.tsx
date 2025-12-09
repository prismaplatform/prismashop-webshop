"use client";
import React, { useState } from "react";
import { LoginDto, UserResponseDto } from "@/models/order-detail.model";
import { loginCustomer } from "@/api/customers";
import Cookies from "js-cookie";
import Input from "@/components/ui/Input/Input";
import { Link } from "@/i18n/routing";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import { useTranslations } from "next-intl";

const Login = () => {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const t = useTranslations("Pages.Account.Login");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form submission to avoid page reload

    if (!email || !password) {
      setError(t("bothCredentials") || " ");
      return;
    }

    const userLoginDto: LoginDto = {} as LoginDto;
    userLoginDto.email = email;
    userLoginDto.password = password;

    setLoading(true);
    setError(""); // Reset error message

    try {
      const loggedInUser: UserResponseDto = await loginCustomer(userLoginDto);
      Cookies.set("currentUser", JSON.stringify(loggedInUser), { expires: 7 });
      window.location.href = "/";
    } catch (error: any) {
      setError(t("invalidCredentials") || " ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-menu-text-light dark:text-neutral-100 justify-center">
          {t("title")}
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <form onSubmit={handleLogin} className="grid grid-cols-1 gap-6">
            {error && (
              <div className="text-sm text-red-500 text-center mb-4">
                {error}
              </div>
            )}
            <label className="block">
              <span className="text-menu-text-light dark:text-neutral-200">
                {t("email")}
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-menu-text-light dark:text-neutral-200">
                {t("password")}
                <Link href="/forgot-pass" className="text-sm text-primary-500">
                  {t("forgotPassword")}
                </Link>
              </span>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1"
              />
            </label>
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? t("loggingIn") : t("continue")}
            </ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-menu-text-light dark:text-neutral-300">
            {t("newUser")} {` `}
            <Link className="text-primary-500" href="/signup">
              {t("createAccount")}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
