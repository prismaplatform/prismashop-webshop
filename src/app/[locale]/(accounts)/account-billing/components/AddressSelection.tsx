import { useTranslations } from "next-intl";
import React from "react";

interface AddressSelectionProps {
  addresses: any[];
  type: string;
  selectedAddress: number | undefined;
  handleAddressChange: (id: number | undefined) => void;
  addressDisplay: (address: any) => string;
  label: string;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  addresses,
  type,
  selectedAddress,
  handleAddressChange,
  addressDisplay,
  label,
}) => {
  const t = useTranslations("Pages.Checkout.Address");

  return (
    <div className="space-y-3">
      <div
        className={`p-4 border rounded-lg cursor-pointer ${
          selectedAddress === 0 ? "border-primary-500" : "border-gray-300"
        }`}
        onClick={() => handleAddressChange(0)}
      >
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            checked={selectedAddress === 0}
            onChange={() => handleAddressChange(0)}
            className="form-radio text-primary-500"
          />
          <span className="text-menu-text-light">{t("addNewAddress")}</span>
        </label>
      </div>

      {type === "BILLING" &&
        addresses.map((address) => {
          if (address.billingAddress?.edited) return null;

          return (
            <div
              key={address.billingAddress?.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedAddress === address.billingAddress?.id
                  ? "border-primary-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleAddressChange(address.billingAddress?.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={selectedAddress === address.billingAddress?.id}
                  onChange={() => handleAddressChange(address.billingAddress?.id)}
                  className="form-radio text-primary-500"
                />
                <span className="text-menu-text-light">{addressDisplay(address)}</span>
              </div>
            </div>
          );
        })}

      {type === "SHIPPING" &&
        addresses.map((address) => {
          if (address.shippingAddress?.edited) return null;

          return (
            <div
              key={address.shippingAddress?.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedAddress === address.shippingAddress?.id
                  ? "border-primary-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleAddressChange(address.shippingAddress?.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={selectedAddress === address.shippingAddress?.id}
                  onChange={() => handleAddressChange(address.shippingAddress?.id)}
                  className="form-radio text-primary-500"
                />
                <span className="text-menu-text-light">{addressDisplay(address)}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default AddressSelection;
