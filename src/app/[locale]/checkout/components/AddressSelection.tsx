// AddressSelection.tsx

import React, { memo } from "react";
import { useTranslations } from "next-intl";
import { CustomerAddressDto } from "@/models/order-detail.model";
import { TrashIcon } from "@heroicons/react/24/outline";

const ADD_NEW_ADDRESS_ID = 0;

interface AddressSelectionProps {
  addresses: CustomerAddressDto[];
  type: "BILLING" | "SHIPPING";
  selectedAddress: number | undefined;
  handleAddressChange: (id: number | undefined) => void;
  onEdit: (address: CustomerAddressDto) => void;
  onDelete: (address: CustomerAddressDto) => void;
  addressDisplay: (address: CustomerAddressDto) => string;
  label: string;
}

const AddressSelection: React.FC<AddressSelectionProps> = memo(
  ({ addresses, type, selectedAddress, handleAddressChange, onEdit, onDelete, addressDisplay }) => {
    const t = useTranslations("Pages.Checkout.Address");

    const renderAddress = (address: CustomerAddressDto) => {
      const addressData = type === "BILLING" ? address.billingAddress : address.shippingAddress;

      // Only check if addressData exists and has an id
      if (!addressData?.id) return null;

      return (
        <div
          key={`${type}-${addressData.id}`}
          className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between ${selectedAddress === addressData.id ? "border-primary-500" : "border-gray-300 dark:border-gray-600"}`}
          onClick={() => handleAddressChange(addressData.id)}
        >
          <label className="flex items-center space-x-3 cursor-pointer w-full">
            <input
              type="radio"
              name={`${type}-address-selection`}
              checked={selectedAddress === addressData.id}
              onChange={() => handleAddressChange(addressData.id)}
              className="form-radio text-primary-500 focus:ring-primary-500"
            />
            <span className="truncate text-menu-text-light">{addressDisplay(address)}</span>
          </label>
          <div className="flex items-center flex-shrink-0 ml-4 space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="py-2 px-4 text-menu-text-dark bg-menu-bg-dark hover:bg-menu-bg-light mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
            >
              {t("edit")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address);
              }}
              className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 border-red-500 border rounded p-1"
              title={t("deleteAddress")}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-3">
        <div
          className={`p-4 border rounded-lg cursor-pointer ${selectedAddress === ADD_NEW_ADDRESS_ID ? "border-primary-500" : "border-gray-300 dark:border-gray-600"}`}
          onClick={() => handleAddressChange(ADD_NEW_ADDRESS_ID)}
        >
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name={`${type}-address-selection`}
              checked={selectedAddress === ADD_NEW_ADDRESS_ID}
              onChange={() => handleAddressChange(ADD_NEW_ADDRESS_ID)}
              className="form-radio text-primary-500 focus:ring-primary-500"
            />
            <span className="text-menu-text-light">{t("addNewAddress")}</span>
          </label>
        </div>
        {addresses.map(renderAddress)}
      </div>
    );
  }
);

AddressSelection.displayName = "AddressSelection";
export default AddressSelection;
