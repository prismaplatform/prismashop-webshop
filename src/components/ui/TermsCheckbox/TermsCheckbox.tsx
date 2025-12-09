import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Route } from "next";

interface TermsCheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  id,
  name = "acceptTerms",
  checked,
  onChange,
  required = true,
  className = "",
}) => {
  const t = useTranslations("Components.TermsAndConditions");

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="border-black text-primary-800 focus:ring-black h-6 w-6 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
          required={required}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-menu-text-light flex">
          {t("accept")}{" "}
          <Link
            href={t("route") as Route}
            className="text-menu-text-light dark:text-primary-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className="ms-1 text-menu-text-light"
              dangerouslySetInnerHTML={{ __html: t.raw("text") }}
            ></div>
          </Link>
          {required && " *"}
        </label>
      </div>
    </div>
  );
};

export default TermsCheckbox;
