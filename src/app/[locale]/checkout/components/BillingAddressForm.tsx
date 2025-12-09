// BillingAddressForm.tsx

import React, { ChangeEvent, memo } from "react";
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import Radio from "@/components/ui/Radio/Radio";
import Select from "@/components/ui/Select/Select";
import { useTranslations } from "next-intl";
import { BillingAddressDto } from "@/models/order-detail.model";

interface BillingAddressFormProps {
  billingType: "Independent" | "Company";
  orderBillingDetail: BillingAddressDto;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBillingTypeChange: (type: "Independent" | "Company") => void;
  country: string;
  handleCountryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isRomania: boolean;
  selectedCounty: string;
  handleCountyChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleCountyChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  localCountryData: string[];
  localCountyData: string[];
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = memo(
  ({
    billingType,
    orderBillingDetail,
    handleChange,
    handleBillingTypeChange,
    country,
    handleCountryChange,
    isRomania,
    selectedCounty,
    handleCountyChangeSelect,
    handleCountyChangeInput,
    localCountryData,
    localCountyData,
  }) => {
    const t = useTranslations("Pages.Checkout.Address");

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:space-x-4 ">
          <div className="sm:flex-1">
            <Label className="text-sm">{t("billingType")}</Label>
            <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {/* FIX: Add a dynamic key to force re-mounting the uncontrolled component */}
              <Radio
                key={`independent-radio-${billingType}`}
                label={t("independent")}
                id="billing-type-independent"
                name="billing-type"
                defaultChecked={billingType === "Independent"}
                onChange={() => handleBillingTypeChange("Independent")}
              />
              {/* FIX: Add a dynamic key to force re-mounting the uncontrolled component */}
              <Radio
                key={`company-radio-${billingType}`}
                label={t("company")}
                id="billing-type-company"
                name="billing-type"
                defaultChecked={billingType === "Company"}
                onChange={() => handleBillingTypeChange("Company")}
              />
            </div>
          </div>
        </div>
        {billingType === "Company" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
            <div>
              <Label className="text-sm">{t("company")}</Label>
              <Input
                className="mt-1.5"
                value={orderBillingDetail.companyName || ""}
                onChange={handleChange}
                placeholder={t("company")}
                name="companyName"
              />
            </div>
            <div>
              <Label className="text-sm">{t("taxID")}</Label>
              <Input
                className="mt-1.5"
                value={orderBillingDetail.companyTaxId || ""}
                onChange={handleChange}
                name="companyTaxId"
                placeholder={t("taxID")}
              />
            </div>
            {t("registryCode") != "" && (
              <div>
                <Label className="text-sm">{t("registryCode")}</Label>
                <Input
                  className="mt-1.5"
                  value={orderBillingDetail.registryCode || ""}
                  onChange={handleChange}
                  placeholder={t("registryCode")}
                  name="registryCode"
                />
              </div>
            )}
          </div>
        )}
        {billingType === "Independent" && t("cnp") != "" && (
          <div>
            <Label className="text-sm">{t("cnp")}</Label>
            <Input
              className="mt-1.5"
              value={orderBillingDetail.cnp || ""}
              onChange={handleChange}
              name="cnp"
              placeholder={t("cnp")}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          {t("country") != "" && (
            <div>
              <Label className="text-sm">{t("country")}</Label>
              <Select
                className="mt-1.5"
                name="country"
                value={country}
                onChange={handleCountryChange}
              >
                {localCountryData.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {t("county") != "" && (
            <>
              {isRomania ? (
                <div>
                  <Label className="text-sm">{t("county")}</Label>
                  <Select
                    className="mt-1.5"
                    value={selectedCounty}
                    name="county"
                    onChange={handleCountyChangeSelect}
                  >
                    <option value="">{t("selectCounty")}</option>
                    {localCountyData.map((c, index) => (
                      <option key={index} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : (
                <div>
                  <Label className="text-sm">{t("county")}</Label>
                  <Input
                    className="mt-1.5"
                    value={selectedCounty}
                    name="county"
                    onChange={handleCountyChangeInput}
                    placeholder={t("selectCounty")}
                  />
                </div>
              )}{" "}
            </>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm">{t("city")}</Label>
            <Input
              className="mt-1.5"
              value={orderBillingDetail.city || ""}
              onChange={handleChange}
              name="city"
              placeholder={t("city")}
            />
          </div>
          <div>
            <Label className="text-sm">{t("street")}</Label>
            <Input
              className="mt-1.5"
              value={orderBillingDetail.street || ""}
              onChange={handleChange}
              name="street"
              placeholder={t("street")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm">{t("number")}</Label>
            <Input
              className="mt-1.5"
              value={orderBillingDetail.number || ""}
              onChange={handleChange}
              name="number"
              placeholder={t("number")}
            />
          </div>
          <div>
            <Label className="text-sm">{t("block")}</Label>
            <Input
              className="mt-1.5"
              value={orderBillingDetail.block || ""}
              onChange={handleChange}
              name="block"
              placeholder={t("block")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm">{t("apartment")}</Label>
            <Input
              className="mt-1.5"
              value={orderBillingDetail.apartment || ""}
              onChange={handleChange}
              name="apartment"
              placeholder={t("apartment")}
            />
          </div>
          <div>
            <Label className="text-sm">{t("postalCode")}</Label>
            <Input
              className="mt-1.5"
              value={orderBillingDetail.zip || ""}
              onChange={handleChange}
              name="zip"
              placeholder={t("postalCode")}
            />
          </div>
        </div>
      </div>
    );
  },
);

BillingAddressForm.displayName = "BillingAddressForm";
export default BillingAddressForm;
