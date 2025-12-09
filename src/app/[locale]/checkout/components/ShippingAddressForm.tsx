// ShippingAddressForm.tsx

import React, { ChangeEvent, memo } from "react";
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import { useTranslations } from "next-intl";
import { ShippingAddressDto } from "@/models/order-detail.model";

interface ShippingAddressFormProps {
  orderShippingDetail: ShippingAddressDto;
  // FIX TS2322: Broaden the event type to accept both Input and Select elements.
  handleShippingChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  shippingCountry: string;
  handleShippingCountryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  shippingIsRomania: boolean;
  selectedShippingCounty: string;
  handleShippingCountyChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleShippingCountyChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  localCountryData: string[];
  localCountyData: string[];
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = memo(
  ({
    orderShippingDetail,
    handleShippingChange,
    shippingCountry,
    handleShippingCountryChange,
    shippingIsRomania,
    selectedShippingCounty,
    handleShippingCountyChangeSelect,
    handleShippingCountyChangeInput,
    localCountryData,
    localCountyData,
  }) => {
    const t = useTranslations("Pages.Checkout.Address");

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          {t("country") != "" && (
            <div>
              <Label className="text-sm text-menu-text-light">
                {t("country")}
              </Label>
              <Select
                className="mt-1.5"
                name="country"
                value={shippingCountry}
                onChange={handleShippingCountryChange}
              >
                <option value="">{t("country")}</option>
                {localCountryData.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {t("county") != "" && (
            <>
              {shippingIsRomania ? (
                <div>
                  <Label className="text-sm text-menu-text-light">
                    {t("county")}
                  </Label>
                  <Select
                    className="mt-1.5"
                    name="county"
                    value={selectedShippingCounty}
                    onChange={handleShippingCountyChangeSelect}
                  >
                    <option value="">{t("selectCounty")}</option>
                    {localCountyData.map((county, index) => (
                      <option key={index} value={county}>
                        {county}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : (
                <div>
                  <Label className="text-sm text-menu-text-light">
                    {t("county")}
                  </Label>
                  <Input
                    className="mt-1.5"
                    name="county"
                    value={selectedShippingCounty}
                    onChange={handleShippingCountyChangeInput}
                    placeholder={t("county")}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm text-menu-text-light">{t("city")}</Label>
            <Input
              className="mt-1.5"
              value={orderShippingDetail.city || ""}
              onChange={handleShippingChange}
              name="city"
              placeholder={t("city")}
            />
          </div>
          <div>
            <Label className="text-sm text-menu-text-light">
              {t("street")}
            </Label>
            <Input
              className="mt-1.5"
              value={orderShippingDetail.street || ""}
              onChange={handleShippingChange}
              name="street"
              placeholder={t("street")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm text-menu-text-light">
              {t("number")}
            </Label>
            <Input
              className="mt-1.5"
              value={orderShippingDetail.number || ""}
              onChange={handleShippingChange}
              name="number"
              placeholder={t("number")}
            />
          </div>
          <div>
            <Label className="text-sm text-menu-text-light">{t("block")}</Label>
            <Input
              className="mt-1.5"
              value={orderShippingDetail.block || ""}
              onChange={handleShippingChange}
              name="block"
              placeholder={t("block")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm text-menu-text-light">
              {t("apartment")}
            </Label>
            <Input
              className="mt-1.5"
              value={orderShippingDetail.apartment || ""}
              onChange={handleShippingChange}
              name="apartment"
              placeholder={t("apartment")}
            />
          </div>
          <div>
            <Label className="text-sm text-menu-text-light">
              {t("postalCode")}
            </Label>
            <Input
              className="mt-1.5"
              value={orderShippingDetail.zip || ""}
              onChange={handleShippingChange}
              name="zip"
              placeholder={t("postalCode")}
            />
          </div>
        </div>
      </div>
    );
  },
);

ShippingAddressForm.displayName = "ShippingAddressForm";
export default ShippingAddressForm;
