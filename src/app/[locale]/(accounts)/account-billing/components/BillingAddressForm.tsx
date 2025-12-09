import React from "react";
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import Radio from "@/components/ui/Radio/Radio";
import Select from "@/components/ui/Select/Select";
import { BillingAddressDto, FormValidations } from "@/models/order-detail.model";
import { useTranslations } from "next-intl";

interface BillingAddressFormProps {
  billingType: "Independent" | "Company";
  billingDetail: BillingAddressDto;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingTypeChange: (type: "Independent" | "Company") => void;
  country: string;
  handleCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isRomania: boolean;
  selectedCounty: string;
  handleCountyChangeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCountyChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  localCountryData: string[];
  localCountyData: string[];
  validations?: FormValidations;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  billingType,
  billingDetail,
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
  validations = {},
}) => {
  const getFieldValidation = (fieldName: string): { isValid: boolean; message?: string } => {
    return validations[fieldName] || { isValid: true };
  };
  const t = useTranslations("Pages.Checkout.Address");

  return (
    <div className="mt-1.5">
      <div className="flex flex-col sm:flex-row items-start sm:space-x-4">
        <div className="sm:flex-1 mb-5">
          <Label className="text-sm">{t("billingType")}</Label>
          <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Radio
              label={t("independent")}
              id="billing-type-independent"
              name="billing-type"
              defaultChecked={billingType === "Independent"}
              onChange={() => handleBillingTypeChange("Independent")}
            />
            <Radio
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
            <Label className="text-sm">{t("companyName")}</Label>
            <Input
              className={`mt-1.5 ${!getFieldValidation("companyName").isValid ? "border-red-500" : ""}`}
              value={billingDetail.companyName}
              onChange={handleChange}
              placeholder={t("companyName")}
              name="companyName"
              required
            />
            {!getFieldValidation("companyName").isValid && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldValidation("companyName").message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-sm">{t("taxID")}</Label>
            <Input
              className={`mt-1.5 ${!getFieldValidation("companyTaxId").isValid ? "border-red-500" : ""}`}
              value={billingDetail.companyTaxId}
              onChange={handleChange}
              name="companyTaxId"
              placeholder={t("taxID")}
              required
            />
            {!getFieldValidation("companyTaxId").isValid && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldValidation("companyTaxId").message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-sm">{t("registryCode")}</Label>
            <Input
              className={`mt-1.5 ${!getFieldValidation("registryCode").isValid ? "border-red-500" : ""}`}
              value={billingDetail.registryCode}
              onChange={handleChange}
              placeholder={t("registryCode")}
              name="registryCode"
              required
            />
            {!getFieldValidation("registryCode").isValid && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldValidation("registryCode").message}
              </p>
            )}
          </div>
        </div>
      )}

      {billingType === "Independent" && (
        <div>
          <Label className="text-sm">{t("cnp")}</Label>
          <Input
            className={`mt-1.5 ${!getFieldValidation("cnp").isValid ? "border-red-500" : ""}`}
            value={billingDetail.cnp}
            onChange={handleChange}
            name="cnp"
            placeholder={t("cnp")}
            maxLength={13}
            required
          />
          {!getFieldValidation("cnp").isValid && (
            <p className="text-red-500 text-xs mt-1">{getFieldValidation("cnp").message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 mt-4">
        <div>
          <Label className="text-sm">{t("country")}</Label>
          <Select
            className={`mt-1.5 ${!getFieldValidation("country").isValid ? "border-red-500" : ""}`}
            value={country}
            onChange={handleCountryChange}
            required
          >
            {localCountryData.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </Select>
          {!getFieldValidation("country").isValid && (
            <p className="text-red-500 text-xs mt-1">{getFieldValidation("country").message}</p>
          )}
        </div>
        {isRomania ? (
          <div>
            <Label className="text-sm">{t("county")}</Label>
            <Select
              className={`mt-1.5 ${!getFieldValidation("county").isValid ? "border-red-500" : ""}`}
              value={selectedCounty}
              onChange={handleCountyChangeSelect}
              required
            >
              <option value="">{t("selectCounty")}</option>
              {localCountyData.map((county, index) => (
                <option key={index} value={county}>
                  {county}
                </option>
              ))}
            </Select>
            {!getFieldValidation("county").isValid && (
              <p className="text-red-500 text-xs mt-1">{getFieldValidation("county").message}</p>
            )}
          </div>
        ) : (
          <div>
            <Label className="text-sm">{t("county")}</Label>
            <Input
              className={`mt-1.5 ${!getFieldValidation("county").isValid ? "border-red-500" : ""}`}
              value={selectedCounty}
              onChange={handleCountyChangeInput}
              placeholder={t("selectCounty")}
              required
            />
            {!getFieldValidation("county").isValid && (
              <p className="text-red-500 text-xs mt-1">{getFieldValidation("county").message}</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 mt-4">
        <div>
          <Label className="text-sm">{t("city")}</Label>
          <Input
            className={`mt-1.5 ${!getFieldValidation("city").isValid ? "border-red-500" : ""}`}
            value={billingDetail.city}
            onChange={handleChange}
            name="city"
            placeholder={t("city")}
            required
          />
          {!getFieldValidation("city").isValid && (
            <p className="text-red-500 text-xs mt-1">{getFieldValidation("city").message}</p>
          )}
        </div>
        <div>
          <Label className="text-sm">{t("street")}</Label>
          <Input
            className={`mt-1.5 ${!getFieldValidation("street").isValid ? "border-red-500" : ""}`}
            value={billingDetail.street}
            onChange={handleChange}
            name="street"
            placeholder={t("street")}
            required
          />
          {!getFieldValidation("street").isValid && (
            <p className="text-red-500 text-xs mt-1">{getFieldValidation("street").message}</p>
          )}
        </div>
        <div>
          <Label className="text-sm">{t("number")}</Label>
          <Input
            className={`mt-1.5 ${!getFieldValidation("number").isValid ? "border-red-500" : ""}`}
            value={billingDetail.number}
            onChange={handleChange}
            name="number"
            placeholder={t("number")}
            required
          />
          {!getFieldValidation("number").isValid && (
            <p className="text-red-500 text-xs mt-1">{getFieldValidation("number").message}</p>
          )}
        </div>
        <div>
          <Label className="text-sm">{t("block")}</Label>
          <Input
            className="mt-1.5"
            value={billingDetail.block}
            onChange={handleChange}
            name="block"
            placeholder={t("block")}
          />
        </div>
        <div>
          <Label className="text-sm">{t("apartment")}</Label>
          <Input
            className="mt-1.5"
            value={billingDetail.apartment}
            onChange={handleChange}
            name="apartment"
            placeholder={t("apartment")}
          />
        </div>
        <div>
          <Label className="text-sm">{t("postalCode")}</Label>
          <Input
            className={`mt-1.5 ${!getFieldValidation("zip").isValid ? "border-red-500" : ""}`}
            value={billingDetail.zip}
            onChange={handleChange}
            name="zip"
            placeholder={t("postalCode")}
            required
          />
          {!getFieldValidation("zip").isValid && (
            <p className="text-red-500 text-xs mt-1">{getFieldValidation("zip").message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingAddressForm;
