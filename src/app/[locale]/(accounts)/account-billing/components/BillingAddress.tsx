"use client";

import React, { useEffect, useState } from "react";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import {
  BillingAddressDto,
  BillingType,
  CustomerAddressDto,
  FormValidations,
  ShippingAddressDto,
  UserResponseDto,
} from "@/models/order-detail.model";
import { getAllAddressesOfCurrentUser, postNewAddress } from "@/api/customers";
import { countyData } from "@/app/[locale]/checkout/data/county.data";
import { countryData } from "@/app/[locale]/checkout/data/country.data";
import BillingAddressForm from "./BillingAddressForm";
import ShippingAddressForm from "./ShippingAddressForm";
import AddressSelection from "./AddressSelection";
import Label from "@/components/ui/Label/Label";
import Cookies from "js-cookie";
import { useTranslations } from "use-intl";

const localCountryData = countryData;
const localCountyData = countyData;

const BillingAddress = () => {
  // State for billing details
  const [billingDetail, setBillingDetail] = useState<BillingAddressDto>({
    id: undefined,
    companyName: "",
    companyTaxId: "",
    cnp: "",
    registryCode: "",
    address: "",
    country: "Romania",
    city: "",
    zip: "",
    county: "",
    street: "",
    number: "",
    block: "",
    apartment: "",
    edited: false,
  });

  // State for shipping details
  const [shippingDetail, setShippingDetail] = useState<ShippingAddressDto>({
    id: undefined,
    country: "Romania",
    city: "",
    zip: "",
    county: "",
    street: "",
    number: "",
    block: "",
    apartment: "",
    edited: false,
  });

  // Component state
  const [billingType, setBillingType] = useState<"Independent" | "Company">(
    "Independent",
  );
  const [customersAddresses, setCustomersAddresses] = useState<
    CustomerAddressDto[]
  >([]);
  const [selectedCustomerBillingAddress, setSelectedCustomerBillingAddress] =
    useState<number>();
  const [selectedCustomerShippingAddress, setSelectedCustomerShippingAddress] =
    useState<number>();
  const [country, setCountry] = useState<string>("Romania");
  const [isRomania, setIsRomania] = useState<boolean>(true);
  const [shippingCountry, setShippingCountry] = useState<string>("Romania");
  const [shippingIsRomania, setShippingIsRomania] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<number>(0);
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedShippingCounty, setSelectedShippingCounty] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saveError, setSaveError] = useState<string>("");

  // Validation states
  const [billingValidations, setBillingValidations] = useState<FormValidations>(
    {},
  );
  const [shippingValidations, setShippingValidations] =
    useState<FormValidations>({});
  const t = useTranslations("Pages.Checkout.Address");

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addresses: CustomerAddressDto[] =
          await getAllAddressesOfCurrentUser();
        setCustomersAddresses(addresses);

        const currentUserCookie = Cookies.get("currentUser");
        if (currentUserCookie) {
          const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);

          if (parsedUser?.id) {
            setCustomerId(parsedUser.id);
          }
          if (addresses.length > 0) {
            const mainAddress = addresses[0];
            if (mainAddress) {
              setSelectedCustomerBillingAddress(mainAddress.billingAddress.id);
              setSelectedCustomerShippingAddress(
                mainAddress.shippingAddress.id,
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Validate billing form - returns true if existing address selected
  const validateBillingForm = (): boolean => {
    if (
      selectedCustomerBillingAddress &&
      selectedCustomerBillingAddress !== 0
    ) {
      return true;
    }

    const validations: FormValidations = {
      city: {
        isValid: !!billingDetail.city,
        message: t("Validations.cityRequired"),
      },
      street: {
        isValid: !!billingDetail.street,
        message: t("Validations.streetRequired"),
      },
      number: {
        isValid: !!billingDetail.number,
        message: t("Validations.numberRequired"),
      },
      zip: {
        isValid: !!billingDetail.zip,
        message: t("Validations.postalRequired"),
      },
      county: {
        isValid: !!billingDetail.county,
        message: t("Validations.countyRequired"),
      },
      country: {
        isValid: !!billingDetail.country,
        message: t("Validations.countryRequired"),
      },
    };

    if (billingType === "Company") {
      validations.companyName = {
        isValid: !!billingDetail.companyName,
        message: t("Validations.companyRequired"),
      };
      validations.companyTaxId = {
        isValid: !!billingDetail.companyTaxId,
        message: t("Validations.taxIDRequired"),
      };
      validations.registryCode = {
        isValid: !!billingDetail.registryCode,
        message: t("Validations.registryRequired"),
      };
    } else {
      validations.cnp = {
        isValid: !!billingDetail.cnp && /^\d{13}$/.test(billingDetail.cnp),
        message: t("Validations.CNPFormatRequired"),
      };
    }

    setBillingValidations(validations);
    return Object.values(validations).every((v) => v.isValid);
  };

  // Validate shipping form - returns true if existing address selected
  const validateShippingForm = (): boolean => {
    if (
      selectedCustomerShippingAddress &&
      selectedCustomerShippingAddress !== 0
    ) {
      return true;
    }

    const validations: FormValidations = {
      city: {
        isValid: !!shippingDetail.city,
        message: t("Validations.cityRequired"),
      },
      street: {
        isValid: !!shippingDetail.street,
        message: t("Validations.streetRequired"),
      },
      number: {
        isValid: !!shippingDetail.number,
        message: t("Validations.numberRequired"),
      },
      zip: {
        isValid: !!shippingDetail.zip,
        message: t("Validations.postalRequired"),
      },
      county: {
        isValid: !!shippingDetail.county,
        message: t("Validations.countyRequired"),
      },
      country: {
        isValid: !!shippingDetail.country,
        message: t("Validations.countryRequired"),
      },
    };

    setShippingValidations(validations);
    return Object.values(validations).every((v) => v.isValid);
  };

  // Form change handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cnp" && !/^\d*$/.test(value)) return;
    setBillingDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    setIsRomania(newCountry === "Romania");
    setBillingDetail((prev) => ({ ...prev, country: newCountry }));
  };

  const handleShippingCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newCountry = e.target.value;
    setShippingCountry(newCountry);
    setShippingIsRomania(newCountry === "Romania");
    setShippingDetail((prev) => ({ ...prev, country: newCountry }));
  };

  // Address selection handlers
  const handleBillingAddressChangeFromSelect = (id: number | undefined) => {
    setSelectedCustomerBillingAddress(id);
  };

  const handleShippingAddressChangeFromSelect = (id: number | undefined) => {
    setSelectedCustomerShippingAddress(id);
  };

  // County handlers
  const handleCountyChangeSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const county = e.target.value;
    setSelectedCounty(county);
    setBillingDetail((prev) => ({ ...prev, county }));
  };

  const handleCountyChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const county = e.target.value;
    setSelectedCounty(county);
    setBillingDetail((prev) => ({ ...prev, county }));
  };

  const handleShippingCountyChangeSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const county = e.target.value;
    setSelectedShippingCounty(county);
    setShippingDetail((prev) => ({ ...prev, county }));
  };

  const handleShippingCountyChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const county = e.target.value;
    setSelectedShippingCounty(county);
    setShippingDetail((prev) => ({ ...prev, county }));
  };

  // Billing type handler
  const handleBillingTypeChange = (type: "Independent" | "Company") => {
    setBillingType(type);
  };

  // Save handler
  const handleSave = async () => {
    if (!customerId) {
      setSaveError(t("Validations.customerIDMissing"));
      return;
    }

    const isBillingValid = validateBillingForm();
    const isShippingValid = validateShippingForm();

    if (!isBillingValid || !isShippingValid) {
      setSaveError(t("Validations.fieldsRequired"));
      return;
    }

    try {
      // Get the selected billing and shipping addresses
      const selectedBillingAddress = customersAddresses.find(
        (addr) => addr.billingAddress.id === selectedCustomerBillingAddress,
      )?.billingAddress;

      const selectedShippingAddress = customersAddresses.find(
        (addr) => addr.shippingAddress.id === selectedCustomerShippingAddress,
      )?.shippingAddress;

      // Prepare the DTO with either existing or new addresses
      const customerAddressDto: CustomerAddressDto = {
        billingType:
          billingType === "Company"
            ? BillingType.COMPANY
            : BillingType.INDIVIDUAL,
        billingAddress:
          selectedCustomerBillingAddress === 0
            ? billingDetail
            : selectedBillingAddress || billingDetail,
        shippingAddress:
          selectedCustomerShippingAddress === 0
            ? shippingDetail
            : selectedShippingAddress || shippingDetail,
        main: false,
      };

      const savedAddressDto = await postNewAddress(
        customerAddressDto,
        customerId,
      );

      // Update state with the new address
      setCustomersAddresses((prev) => [...prev, savedAddressDto]);

      // Select the newly saved address
      handleBillingAddressChangeFromSelect(savedAddressDto.billingAddress.id);
      handleShippingAddressChangeFromSelect(savedAddressDto.shippingAddress.id);

      setSaveError("");
    } catch (error) {
      console.error(t("Validations.error"), error);
      setSaveError(t("Validations.failedSave"));
    }
  };

  // Address display functions
  const customerBillingAddressDisplay = (
    billingAddress: BillingAddressDto,
    type: BillingType,
  ): string => {
    if (!billingAddress) return "";

    let result =
      type === BillingType.COMPANY
        ? `${billingAddress.companyName || ""}, ${billingAddress.companyTaxId || ""}, ${billingAddress.registryCode || ""}, `
        : `CNP: ${billingAddress.cnp || "0000000000000"}, `;

    result += `${billingAddress.street} ${billingAddress.number}`;
    if (billingAddress.block) result += `, Block: ${billingAddress.block}`;
    if (billingAddress.apartment)
      result += `, Apt: ${billingAddress.apartment}`;
    result += `, ${billingAddress.city}, ${billingAddress.county ? billingAddress.county + ", " : ""}${billingAddress.zip}, ${billingAddress.country}`;

    return result;
  };

  const customerShippingAddressDisplay = (
    shippingAddress: ShippingAddressDto,
  ): string => {
    if (!shippingAddress) return "";

    let result = `${shippingAddress.street} ${shippingAddress.number}`;
    if (shippingAddress.block) result += `, Block: ${shippingAddress.block}`;
    if (shippingAddress.apartment)
      result += `, Apt: ${shippingAddress.apartment}`;
    result += `, ${shippingAddress.city}, ${shippingAddress.county ? shippingAddress.county + ", " : ""}${shippingAddress.zip}, ${shippingAddress.country}`;

    return result;
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 text-center text-menu-text-light">
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="border border-accent-200 dark:border-accent-700 rounded-xl">
      {/* Billing Address Section */}
      <div className="border-t border-accent-200 dark:border-accent-700 px-6 py-7 space-y-4 sm:space-y-6">
        <h3 className="text-menu-text-light dark:text-accent-300 flex">
          <span className="uppercase">{t("billing")}</span>
        </h3>
        <Label className="text-sm">{t("knownAddress")}</Label>
        <AddressSelection
          addresses={customersAddresses.reduce<CustomerAddressDto[]>(
            (acc, address) => {
              if (
                !acc.some(
                  (a) => a.billingAddress.id === address.billingAddress.id,
                )
              ) {
                acc.push(address);
              }
              return acc;
            },
            [],
          )}
          type="BILLING"
          selectedAddress={selectedCustomerBillingAddress}
          handleAddressChange={handleBillingAddressChangeFromSelect}
          addressDisplay={(address) =>
            customerBillingAddressDisplay(
              address.billingAddress,
              address.billingType,
            )
          }
          label="billing"
        />
        {selectedCustomerBillingAddress === 0 && (
          <BillingAddressForm
            billingType={billingType}
            billingDetail={billingDetail}
            handleChange={handleChange}
            handleBillingTypeChange={handleBillingTypeChange}
            country={country}
            handleCountryChange={handleCountryChange}
            isRomania={isRomania}
            selectedCounty={selectedCounty}
            handleCountyChangeSelect={handleCountyChangeSelect}
            handleCountyChangeInput={handleCountyChangeInput}
            localCountryData={localCountryData}
            localCountyData={localCountyData}
            validations={billingValidations}
          />
        )}
      </div>

      {/* Shipping Address Section */}
      <div className="border-t border-accent-200 dark:border-accent-700 px-6 py-7 space-y-4 sm:space-y-6">
        <h3 className="text-menu-text-light dark:text-accent-300 flex">
          <span className="uppercase">{t("shipping")}</span>
        </h3>
        <Label className="text-sm">{t("knownAddress")}</Label>
        <AddressSelection
          addresses={customersAddresses.reduce<CustomerAddressDto[]>(
            (acc, address) => {
              if (
                !acc.some(
                  (a) => a.shippingAddress.id === address.shippingAddress.id,
                )
              ) {
                acc.push(address);
              }
              return acc;
            },
            [],
          )}
          type="SHIPPING"
          selectedAddress={selectedCustomerShippingAddress}
          handleAddressChange={handleShippingAddressChangeFromSelect}
          addressDisplay={(address) =>
            customerShippingAddressDisplay(address.shippingAddress)
          }
          label="shipping"
        />
        {selectedCustomerShippingAddress === 0 && (
          <ShippingAddressForm
            shippingDetail={shippingDetail}
            handleShippingChange={handleShippingChange}
            shippingCountry={shippingCountry}
            handleShippingCountryChange={handleShippingCountryChange}
            shippingIsRomania={shippingIsRomania}
            selectedShippingCounty={selectedShippingCounty}
            handleShippingCountyChangeSelect={handleShippingCountyChangeSelect}
            handleShippingCountyChangeInput={handleShippingCountyChangeInput}
            localCountryData={localCountryData}
            localCountyData={localCountyData}
            validations={shippingValidations}
          />
        )}
        {saveError && (
          <div className="text-red-500 text-sm mt-2">{saveError}</div>
        )}
        <div className="flex flex-col sm:flex-row pt-6">
          <ButtonPrimary className="sm:!px-7 shadow-none" onClick={handleSave}>
            {t("save")}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;
