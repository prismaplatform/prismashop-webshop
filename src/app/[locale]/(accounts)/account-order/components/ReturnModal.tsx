"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import ButtonSecondary from "@/components/ui/Button/ButtonSecondary";
import { OrderDto, ShippingAddressDto } from "@/models/order-detail.model";
import { ReturnOrderDto, ReturnOrderItemDto } from "@/models/return.model";
import { createReturn } from "@/api/returns";
import Image from "next/image";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { countryData } from "@/app/[locale]/checkout/data/country.data";
import { countyData } from "@/app/[locale]/checkout/data/county.data";
import ShippingAddressForm from "@/app/[locale]/checkout/components/ShippingAddressForm";

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDto;
  orderItems: any[]; // Assuming items have a unique 'id' property
  rootUrl: string;
}

interface SelectedItem {
  item: any;
  quantity: number;
}

const ReturnModal = ({ isOpen, onClose, order, orderItems, rootUrl }: ReturnModalProps) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressDto>({
    country: "",
    city: "",
    zip: "",
    county: "",
    street: "",
    number: "",
    block: "",
    apartment: "",
    edited: false,
  });
  const [returnReason, setReturnReason] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const t = useTranslations("Pages.Account.Orders");

  useEffect(() => {
    if (isOpen) {
      setSelectedItems({});
      setReturnReason("");
      setShippingAddress({
        country: "",
        city: "",
        zip: "",
        county: "",
        street: "",
        number: "",
        block: "",
        apartment: "",
        edited: false,
      });
    }
  }, [isOpen]);

  const handleQuantityChange = (item: any, quantity: number) => {
    const validQuantity = Math.max(0, Math.min(quantity, item.returnableQuantity));
    setSelectedItems((prev) => {
      const newSelectedItems = { ...prev };
      if (validQuantity > 0) {
        newSelectedItems[item.id] = { item, quantity: validQuantity };
      } else {
        delete newSelectedItems[item.id];
      }
      return newSelectedItems;
    });
  };

  // ========== CHANGE: Broadened event type to fix TS2322 ==========
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShippingCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShippingAddress((prev) => ({
      ...prev,
      country: e.target.value,
      county: "",
    }));
  };

  const handleShippingCountyChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShippingAddress((prev) => ({ ...prev, county: e.target.value }));
  };

  const handleShippingCountyChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress((prev) => ({ ...prev, county: e.target.value }));
  };

  const handleCreateReturn = async () => {
    const returnOrderItems: ReturnOrderItemDto[] = Object.values(selectedItems).map(
      ({ item, quantity }) => ({
        orderItem: item,
        quantity: quantity,
        reason: returnReason,
      })
    );

    if (returnOrderItems.length === 0) {
      toast.error(t("selectOneItem"));
      return;
    }

    // --- Form field validation ---
    if (!shippingAddress.country) {
      toast.error(t("countryIsRequired"));
      return;
    }
    if (shippingAddress.country === "Romania" && !shippingAddress.county) {
      toast.error(t("countyIsRequired"));
      return;
    }
    if (!shippingAddress.city) {
      toast.error(t("cityIsRequired"));
      return;
    }
    if (!shippingAddress.street) {
      toast.error(t("streetIsRequired"));
      return;
    }
    if (!shippingAddress.number && !shippingAddress.block) {
      toast.error(t("numberOrBlockIsRequired"));
      return;
    }
    if (!shippingAddress.zip) {
      toast.error(t("zipIsRequired"));
      return;
    }
    if (!returnReason.trim()) {
      toast.error(t("reasonIsRequired"));
      return;
    }

    if (!bankAccount.trim()) {
      toast.error(t("bankAccountIsRequired"));
      return;
    }

    try {
      const returnOrderDto: ReturnOrderDto = {
        order,
        shippingAddress,
        returnOrderItems,
        bankAccount,
      };

      await createReturn(returnOrderDto);

      toast.success(t("createdSuccessfully"));

      onClose();
    } catch (error) {
      toast.error(t("failed"));
      console.error("Failed to create return:", error);
    }
  };

  const isReturnDisabled = Object.keys(selectedItems).length === 0;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-accent-900">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Select Items and Quantities to Return
                </Dialog.Title>
                <div className="mt-4 max-h-[300px] space-y-4 overflow-y-auto">
                  {orderItems.map((item, index) => {
                    const isSelected = selectedItems.hasOwnProperty(item.id);
                    const imageUrl = rootUrl + item.productOption.images[0].image;
                    return (
                      <div
                        key={item.id || index}
                        className={`rounded-lg border p-4 transition-colors duration-200 ${
                          isSelected
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-grow items-center space-x-4">
                            <div className="relative h-16 w-16 flex-shrink-0 rounded-md">
                              <Image
                                fill
                                src={imageUrl}
                                alt={item.productOption.product.name || "Product image"}
                                sizes="(max-width: 768px) 100vw, 64px"
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.productOption.product.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("purchasedQuantity")}: {item.quantity}, Price:{" "}
                                {item.price + item.tax}
                              </p>
                            </div>
                          </div>
                          {item.returnableQuantity > 0 ? (
                            <div className="mt-3 flex items-center space-x-2 sm:mt-0">
                              <label
                                htmlFor={`return-qty-${item.id}`}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                {t("quantity")}:
                              </label>
                              <input
                                type="number"
                                id={`return-qty-${item.id}`}
                                name={`return-qty-${item.id}`}
                                min="0"
                                max={item.returnableQuantity}
                                className="w-20 rounded-md border border-gray-300 p-2 text-center dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                value={selectedItems[item.id]?.quantity || 0}
                                onChange={(e) =>
                                  handleQuantityChange(item, parseInt(e.target.value, 10) || 0)
                                }
                              />
                            </div>
                          ) : (
                            <div className="mt-3 sm:mt-0">
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                {t("allItemsReturned")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <ShippingAddressForm
                    orderShippingDetail={shippingAddress}
                    handleShippingChange={handleShippingChange}
                    shippingCountry={shippingAddress.country}
                    handleShippingCountryChange={handleShippingCountryChange}
                    shippingIsRomania={shippingAddress.country === "Romania"}
                    selectedShippingCounty={shippingAddress.county}
                    handleShippingCountyChangeSelect={handleShippingCountyChangeSelect}
                    handleShippingCountyChangeInput={handleShippingCountyChangeInput}
                    localCountryData={countryData}
                    localCountyData={countyData}
                  />
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="return-reason"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("reasonForReturn")}
                  </label>
                  <textarea
                    id="return-reason"
                    name="returnReason"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder={t("reasonForReturnPlaceholder")}
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="bank-account"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("bankAccount")}
                  </label>
                  <input
                    id="bank-account"
                    name="bankAccount"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="RO66BACX0000001234567890"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <ButtonSecondary onClick={onClose}>{t("cancel")}</ButtonSecondary>
                  <ButtonSecondary onClick={handleCreateReturn} disabled={isReturnDisabled}>
                    {t("save")}
                  </ButtonSecondary>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReturnModal;
