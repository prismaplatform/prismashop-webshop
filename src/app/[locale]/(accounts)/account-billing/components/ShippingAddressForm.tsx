import React from "react";
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import { ShippingAddressDto, FormValidations } from "@/models/order-detail.model";
import { useTranslations } from "next-intl";

interface ShippingAddressFormProps {
  shippingDetail: ShippingAddressDto;
  handleShippingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  shippingCountry: string;
  handleShippingCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  shippingIsRomania: boolean;
  selectedShippingCounty: string;
  handleShippingCountyChangeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleShippingCountyChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  localCountryData: string[];
  localCountyData: string[];
  validations?: FormValidations;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  shippingDetail,
  handleShippingChange,
  shippingCountry,
  handleShippingCountryChange,
  shippingIsRomania,
  selectedShippingCounty,
  handleShippingCountyChangeSelect,
  handleShippingCountyChangeInput,
  localCountryData,
  localCountyData,
  validations = {},
}) => {
  const getFieldValidation = (fieldName: string): { isValid: boolean; message?: string } => {
    return validations[fieldName] || { isValid: true };
  };
  const t = useTranslations("Pages.Checkout.Address");

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
        <div>
          <Label className="text-sm">{t("country")}</Label>
          <Select
            className={`mt-1.5 ${!getFieldValidation("country").isValid ? "border-red-500" : ""}`}
            value={shippingCountry}
            onChange={handleShippingCountryChange}
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
        {shippingIsRomania ? (
          <div>
            <Label className="text-sm">{t("county")}</Label>
            <Select
              className={`mt-1.5 ${!getFieldValidation("county").isValid ? "border-red-500" : ""}`}
              value={selectedShippingCounty}
              onChange={handleShippingCountyChangeSelect}
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
              value={selectedShippingCounty}
              onChange={handleShippingCountyChangeInput}
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
            value={shippingDetail.city}
            onChange={handleShippingChange}
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
            value={shippingDetail.street}
            onChange={handleShippingChange}
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
            value={shippingDetail.number}
            onChange={handleShippingChange}
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
            value={shippingDetail.block}
            onChange={handleShippingChange}
            name="block"
            placeholder={t("block")}
          />
        </div>
        <div>
          <Label className="text-sm">{t("apartment")}</Label>
          <Input
            className="mt-1.5"
            value={shippingDetail.apartment}
            onChange={handleShippingChange}
            name="apartment"
            placeholder={t("apartment")}
          />
        </div>
        <div>
          <Label className="text-sm">{t("postalCode")}</Label>
          <Input
            className={`mt-1.5 ${!getFieldValidation("zip").isValid ? "border-red-500" : ""}`}
            value={shippingDetail.zip}
            onChange={handleShippingChange}
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

export default ShippingAddressForm;
