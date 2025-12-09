// BillingAddress.tsx

"use client";

import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import ButtonSecondary from "@/components/ui/Button/ButtonSecondary";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  BillingAddressDto,
  BillingType,
  CustomerAddressDto,
  ShippingAddressDto,
} from "@/models/order-detail.model";
import {
  deleteBillingAddress,
  deleteShippingAddress,
  getAllAddressesOfCurrentUser,
  getAllTempAddressesOfUser,
  postNewAddress,
  updateBillingAddress,
  updateShippingAddress,
} from "@/api/customers";
import {
  addOrUpdateAddress,
  removeAddress,
} from "@/lib/slices/orderDetailSlice";
import { countyData } from "@/app/[locale]/checkout/data/county.data";
import { countryData } from "@/app/[locale]/checkout/data/country.data";
import BillingAddressForm from "./BillingAddressForm";
import ShippingAddressForm from "./ShippingAddressForm";
import AddressSelection from "./AddressSelection";
import Label from "@/components/ui/Label/Label";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const AddressSkeleton = () => (
  <div className="border border-accent-200 dark:border-accent-700 rounded-xl p-6 animate-pulse">
    <div className="flex items-start">
      <div className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-600"></div>
      <div className="sm:ml-8 flex-grow space-y-2">
        <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="h-8 w-20 rounded-lg bg-gray-300 dark:bg-gray-600 ml-auto"></div>
    </div>
  </div>
);

const localCountryData = countryData;
const localCountyData = countyData;
const ADD_NEW_ADDRESS_ID = 0;

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
}

const BillingAddress: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
}) => {
  const dispatch = useDispatch();
  const t = useTranslations("Pages.Checkout");
  const tAddress = useTranslations("Pages.Checkout.Address");

  const BLANK_BILLING_ADDRESS: BillingAddressDto = useMemo(
    () => ({
      id: undefined,
      companyName: "",
      companyTaxId: "",
      cnp: "",
      registryCode: "",
      address: "",
      country: tAddress("defaultCountry") || "Romania",
      city: "",
      zip: "",
      county: "",
      street: "",
      number: "",
      block: "",
      apartment: "",
      edited: false,
    }),
    [tAddress],
  );

  const BLANK_SHIPPING_ADDRESS: ShippingAddressDto = useMemo(
    () => ({
      id: undefined,
      country: tAddress("defaultCountry") || "Romania",
      city: "",
      zip: "",
      county: "",
      street: "",
      number: "",
      block: "",
      apartment: "",
      edited: false,
    }),
    [tAddress],
  );

  const { customer, customerAddress: reduxCustomerAddress } = useSelector(
    (state: RootState) => state.orderDetails,
  );

  const convertBillingToShipping = (
    billing: BillingAddressDto,
  ): ShippingAddressDto => ({
    id: undefined,
    country: billing.country,
    city: billing.city,
    zip: billing.zip,
    county: billing.county ?? "",
    street: billing.street,
    number: billing.number,
    block: billing.block,
    apartment: billing.apartment,
    edited: false,
  });

  const [loading, setLoading] = useState(true);
  const [customersAddresses, setCustomersAddresses] = useState<
    CustomerAddressDto[]
  >([]);
  const [orderBillingDetail, setOrderBillingDetail] =
    useState<BillingAddressDto>(BLANK_BILLING_ADDRESS);
  const [orderShippingDetail, setOrderShippingDetail] =
    useState<ShippingAddressDto>(BLANK_SHIPPING_ADDRESS);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<
    number | undefined
  >();
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<
    number | undefined
  >();
  const [billingType, setBillingType] = useState<"Independent" | "Company">(
    "Independent",
  );
  const [shippingIsSameAsBilling, setShippingIsSameAsBilling] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (customer?.id) {
      setLoading(true);
      const auth = Cookies.get("auth");
      if (auth) {
        getAllAddressesOfCurrentUser()
          .then((addresses) => {
            const activeAddresses = addresses.filter(
              (addr) =>
                !addr.billingAddress?.edited && !addr.shippingAddress?.edited,
            );
            setCustomersAddresses(activeAddresses);
          })
          .catch((err) => console.error("Failed to fetch addresses", err))
          .finally(() => setLoading(false));
      } else {
        getAllTempAddressesOfUser()
          .then((addresses) => {
            const activeAddresses = addresses.filter(
              (addr) =>
                !addr.billingAddress?.edited && !addr.shippingAddress?.edited,
            );
            setCustomersAddresses(activeAddresses);
          })
          .catch((err) => console.error("Failed to fetch addresses", err))
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [customer?.id]);

  useEffect(() => {
    if (!isActive) {
      setIsEditing(false);
      setEditingAddressId(undefined);
    }
  }, [isActive]);

  // --- ⬇️ MODIFICATION START ⬇️ ---
  const isFormValid = useMemo(() => {
    const {
      city,
      street,
      number,
      zip,
      county,
      country,
      companyName,
      companyTaxId,
      registryCode,
    } = orderBillingDetail;

    // This check now only requires county/country if their translations exist.
    const hasCommon =
      city &&
      street &&
      number &&
      zip &&
      (tAddress("county") === "" || county) &&
      (tAddress("country") === "" || country);

    if (billingType === "Company")
      return hasCommon && companyName && companyTaxId && registryCode;
    return hasCommon;
  }, [orderBillingDetail, billingType, tAddress]);

  const isShippingFormValid = useMemo(() => {
    if (shippingIsSameAsBilling) return true;
    const { city, street, number, zip, county, country } = orderShippingDetail;

    // This check is also updated to be conditional.
    return !!(
      city &&
      street &&
      number &&
      zip &&
      (tAddress("county") === "" || county) &&
      (tAddress("country") === "" || country)
    );
  }, [orderShippingDetail, shippingIsSameAsBilling, tAddress]);
  // --- ⬆️ MODIFICATION END ⬆️ ---

  const handleBillingInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setOrderBillingDetail((prev) => {
        const newState = { ...prev, [name]: value };
        if (name === "country" && value !== "Romania") {
          newState.county = "";
        }
        return newState;
      });

      if (shippingIsSameAsBilling) {
        setOrderShippingDetail((prev) => {
          if (name in prev) {
            const newState = { ...prev, [name]: value };
            if (name === "country" && value !== "Romania") {
              newState.county = "";
            }
            return newState;
          }
          return prev;
        });
      }
    },
    [shippingIsSameAsBilling],
  );

  const handleShippingInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setOrderShippingDetail((prev) => {
        const newState = { ...prev, [name]: value };
        if (name === "country" && value !== "Romania") {
          newState.county = "";
        }
        return newState;
      });
    },
    [],
  );

  useEffect(() => {
    if (customersAddresses.length > 0) {
      if (
        reduxCustomerAddress &&
        reduxCustomerAddress.billingAddress &&
        reduxCustomerAddress.billingAddress.id
      ) {
        setSelectedBillingAddressId(reduxCustomerAddress.billingAddress.id);
      }
      if (
        reduxCustomerAddress &&
        reduxCustomerAddress.shippingAddress &&
        reduxCustomerAddress.shippingAddress.id
      ) {
        setSelectedBillingAddressId(reduxCustomerAddress.billingAddress.id);
      }
    } else {
      setOrderBillingDetail(BLANK_BILLING_ADDRESS);
      setSelectedBillingAddressId(ADD_NEW_ADDRESS_ID);
    }
  }, [customersAddresses, reduxCustomerAddress, BLANK_BILLING_ADDRESS]);

  const handleShippingSameAsBillingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = e.target.checked;
    setShippingIsSameAsBilling(isChecked);

    if (isChecked) {
      setOrderShippingDetail(convertBillingToShipping(orderBillingDetail));
    } else {
      setOrderShippingDetail(BLANK_SHIPPING_ADDRESS);
      setSelectedShippingAddressId(ADD_NEW_ADDRESS_ID);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingAddressId(undefined);
    handleSelectAddress(reduxCustomerAddress?.billingAddress?.id);
  };

  const handleSelectAddress = useCallback(
    (id: number | undefined) => {
      if (isEditing) {
        setIsEditing(false);
        setEditingAddressId(undefined);
      }

      setSelectedBillingAddressId(id);

      if (id === ADD_NEW_ADDRESS_ID) {
        dispatch(removeAddress());
        setOrderBillingDetail(BLANK_BILLING_ADDRESS);
        if (shippingIsSameAsBilling) {
          setOrderShippingDetail(BLANK_SHIPPING_ADDRESS);
        }
      } else {
        const foundAddress = customersAddresses.find(
          (addr) => addr.billingAddress.id === id,
        );
        if (foundAddress) {
          dispatch(addOrUpdateAddress(foundAddress));
          const newBillingDetail = foundAddress.billingAddress;
          setOrderBillingDetail(newBillingDetail);
          setBillingType(
            foundAddress.billingType === BillingType.COMPANY
              ? "Company"
              : "Independent",
          );

          if (shippingIsSameAsBilling) {
            setOrderShippingDetail({
              id: undefined,
              country: newBillingDetail.country,
              city: newBillingDetail.city,
              zip: newBillingDetail.zip,
              county: newBillingDetail.county ?? "",
              street: newBillingDetail.street,
              number: newBillingDetail.number,
              block: newBillingDetail.block,
              apartment: newBillingDetail.apartment,
              edited: false,
            });
          }
        }
      }
    },
    [
      isEditing,
      dispatch,
      shippingIsSameAsBilling,
      customersAddresses,
      BLANK_BILLING_ADDRESS,
      BLANK_SHIPPING_ADDRESS,
    ],
  );

  const handleStartEdit = (addressToEdit: CustomerAddressDto) => {
    setIsEditing(true);
    setEditingAddressId(addressToEdit.id);
    setSelectedBillingAddressId(addressToEdit.billingAddress.id);
    setOrderBillingDetail(addressToEdit.billingAddress);
    setBillingType(
      addressToEdit.billingType === BillingType.COMPANY
        ? "Company"
        : "Independent",
    );

    if (shippingIsSameAsBilling) {
      setOrderShippingDetail(
        convertBillingToShipping(addressToEdit.billingAddress),
      );
    }
  };

  const handleModifyClick = () => {
    const addressId = reduxCustomerAddress?.billingAddress?.id;
    const addressToModify = customersAddresses.find(
      (addr) => addr.billingAddress.id === addressId,
    );

    if (addressToModify) {
      handleStartEdit(addressToModify);
    } else {
      handleSelectAddress(ADD_NEW_ADDRESS_ID);
    }
    onOpenActive();
  };

  const handleSave = useCallback(async () => {
    if (!isFormValid || !isShippingFormValid) {
      Swal.fire({
        icon: "error",
        title: t("Summary.errors.genericTitle"),
        text: t("Summary.errors.address"),
      });
      return;
    }
    if (!customer?.id) {
      Swal.fire({
        icon: "error",
        title: t("Summary.errors.genericTitle"),
        text: t("Summary.errors.customer"),
      });
      return;
    }

    try {
      let savedCustomerAddress: CustomerAddressDto | null = null;

      if (isEditing && editingAddressId) {
        const originalAddress = customersAddresses.find(
          (addr) => addr.id === editingAddressId,
        );

        if (!originalAddress) {
          throw new Error("Original address not found");
        }

        const billingHasChanged =
          JSON.stringify(originalAddress.billingAddress) !==
          JSON.stringify(orderBillingDetail);
        let shippingHasChanged = false;
        if (shippingIsSameAsBilling) {
          shippingHasChanged = billingHasChanged;
        } else {
          const originalShipping =
            originalAddress.shippingAddress ?? originalAddress.billingAddress;
          shippingHasChanged =
            JSON.stringify(originalShipping) !==
            JSON.stringify(orderShippingDetail);
        }

        if (!billingHasChanged && !shippingHasChanged) {
          onCloseActive();
          return;
        }

        if (shippingIsSameAsBilling) {
          if (billingHasChanged) {
            savedCustomerAddress = await updateBillingAddress(
              customer.id,
              orderBillingDetail,
            );
          } else {
            onCloseActive();
            return;
          }
        } else {
          if (billingHasChanged && !shippingHasChanged) {
            savedCustomerAddress = await updateBillingAddress(
              customer.id,
              orderBillingDetail,
            );
          } else if (!billingHasChanged && shippingHasChanged) {
            await updateShippingAddress(customer.id, orderShippingDetail);
          } else if (billingHasChanged && shippingHasChanged) {
            const billingResult = await updateBillingAddress(
              customer.id,
              orderBillingDetail,
            );
            const shippingResult = await updateShippingAddress(
              customer.id,
              orderShippingDetail,
            );
            savedCustomerAddress = {
              ...shippingResult,
              billingAddress: billingResult.billingAddress,
              billingType: billingResult.billingType,
            };
          }
        }
      } else {
        const customerAddressDto: CustomerAddressDto = {
          billingType:
            billingType === "Company"
              ? BillingType.COMPANY
              : BillingType.INDIVIDUAL,
          billingAddress: orderBillingDetail,
          shippingAddress: shippingIsSameAsBilling
            ? {
                ...convertBillingToShipping(orderBillingDetail),
                id: undefined,
              }
            : orderShippingDetail,
          main: customersAddresses.length === 0,
        };
        savedCustomerAddress = await postNewAddress(
          customerAddressDto,
          customer.id,
        );
      }

      if (savedCustomerAddress) {
        const auth = Cookies.get("auth");
        let updatedAddresses = [];
        if (auth) {
          updatedAddresses = await getAllAddressesOfCurrentUser();
        } else {
          updatedAddresses = await getAllTempAddressesOfUser();
        }

        const activeAddresses = updatedAddresses.filter(
          (addr) =>
            !addr.billingAddress?.edited && !addr.shippingAddress?.edited,
        );
        setCustomersAddresses(activeAddresses);

        dispatch(addOrUpdateAddress(savedCustomerAddress));
        setSelectedBillingAddressId(savedCustomerAddress.billingAddress.id);
        setIsEditing(false);
        setEditingAddressId(undefined);
      }

      onCloseActive();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("Address.Validations.error"),
        text: t("Address.Validations.failedSave"),
      });
    }
  }, [
    isFormValid,
    isShippingFormValid,
    customer,
    billingType,
    orderBillingDetail,
    orderShippingDetail,
    shippingIsSameAsBilling,
    isEditing,
    editingAddressId,
    customersAddresses,
    dispatch,
    onCloseActive,
    t,
  ]);

  const handleDeleteAddress = useCallback(
    async (addressToDelete: CustomerAddressDto) => {
      if (!customer?.id || !addressToDelete.id) {
        toast.error("User or Address ID not found.");
        return;
      }

      const result = await Swal.fire({
        title: tAddress("deleteConfirmTitle"),
        text: tAddress("deleteConfirmText"),
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton:
            "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 font-medium rounded px-4 py-2",
          cancelButton:
            "bg-primary-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded px-4 py-2 ml-2",
        },
        confirmButtonText: tAddress("deleteConfirmButton"),
        cancelButtonText: tAddress("cancel"),
      });

      if (result.isConfirmed) {
        try {
          await Promise.all([
            deleteBillingAddress(
              customer.id,
              addressToDelete.billingAddress.id!,
            ),
            addressToDelete.shippingAddress?.id &&
            addressToDelete.shippingAddress.id !==
              addressToDelete.billingAddress.id
              ? deleteShippingAddress(
                  customer.id,
                  addressToDelete.shippingAddress.id,
                )
              : Promise.resolve(),
          ]);

          const auth = Cookies.get("auth");
          let updatedAddresses = [];
          if (auth) {
            updatedAddresses = await getAllAddressesOfCurrentUser();
          } else {
            updatedAddresses = await getAllTempAddressesOfUser();
          }
          const activeAddresses = updatedAddresses.filter(
            (addr) =>
              !addr.billingAddress?.edited && !addr.shippingAddress?.edited,
          );
          setCustomersAddresses(activeAddresses);

          toast.success(tAddress("deleteSuccess"));

          if (reduxCustomerAddress?.id === addressToDelete.id) {
            dispatch(removeAddress());
            const nextAddress = activeAddresses[0];
            handleSelectAddress(
              nextAddress?.billingAddress?.id ?? ADD_NEW_ADDRESS_ID,
            );
          }
        } catch (error) {
          toast.error(tAddress("deleteFailed"));
          console.error("Failed to delete address:", error);
        }
      }
    },
    [customer, reduxCustomerAddress, dispatch, tAddress, handleSelectAddress],
  );

  const customerBillingAddressDisplay = useCallback(
    (address: CustomerAddressDto): string => {
      if (!address?.billingAddress) return "";
      const { companyName, street, number, city } = address.billingAddress;
      const type =
        address.billingType === BillingType.COMPANY
          ? companyName
          : "Individual";
      return `${type} - ${street} ${number}, ${city}`;
    },
    [],
  );

  const customerShippingAddressDisplay = useCallback(
    (address: CustomerAddressDto): string => {
      if (!address?.shippingAddress) return "";
      const { street, number, city } = address.shippingAddress;
      return `${street} ${number}, ${city}`;
    },
    [],
  );

  const billingDisplay = useMemo(() => {
    const addressToDisplay =
      reduxCustomerAddress?.billingAddress || orderBillingDetail;
    const { street, number, city } = addressToDisplay;
    return street && number && city
      ? `${street}, ${number}, ${city}`
      : tAddress("noAddressSelected");
  }, [reduxCustomerAddress, orderBillingDetail, tAddress]);

  const shippingDisplay = useMemo(() => {
    if (!shippingIsSameAsBilling) {
      const { street, number, city } = orderShippingDetail;
      return street && number && city
        ? `${street}, ${number}, ${city}`
        : tAddress("noAddressSelected");
    }
    return billingDisplay;
  }, [shippingIsSameAsBilling, orderShippingDetail, billingDisplay, tAddress]);

  const uniqueBillingAddresses = useMemo(() => {
    const uniqueMap = new Map<number, CustomerAddressDto>();
    customersAddresses.forEach((addr) => {
      if (addr.billingAddress?.id) {
        uniqueMap.set(addr.billingAddress.id, addr);
      }
    });
    return Array.from(uniqueMap.values());
  }, [customersAddresses]);

  const uniqueShippingAddresses = useMemo(() => {
    const uniqueMap = new Map<number, CustomerAddressDto>();
    customersAddresses.forEach((addr) => {
      if (addr.shippingAddress?.id) {
        uniqueMap.set(addr.shippingAddress.id, addr);
      }
    });
    return Array.from(uniqueMap.values());
  }, [customersAddresses]);

  if (loading) {
    return <AddressSkeleton />;
  }

  // The rest of your JSX remains the same...
  return (
    <div className="border border-gray-200 rounded-xl ">
      <div className="p-6 flex flex-col sm:flex-row items-start">
        <span className="hidden sm:block">
          <svg
            className="w-6 h-6 text-menu-text-light mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="sm:ml-8 flex-grow">
          <h3 className="text-menu-text-light flex ">
            <span className="uppercase">{t("Address.title")}</span>
          </h3>
          <div className="font-semibold mt-1 text-sm space-y-1">
            <p className="truncate text-menu-text-light">
              <span className="font-normal text-menu-text-light">
                {t("Address.billingSelected")}{" "}
              </span>
              {billingDisplay}
            </p>
            <p className="truncate text-menu-text-light">
              <span className="font-normal text-menu-text-light">
                {t("Address.shippingSelected")}{" "}
              </span>
              {shippingDisplay}
            </p>
          </div>
        </div>
        {customer && customer.id && (
          <button
            className="py-2 px-4 text-menu-text-dark bg-menu-bg-dark hover:bg-menu-bg-light mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
            onClick={handleModifyClick}
          >
            {t("changeButton")}
          </button>
        )}
      </div>
      {isActive && (
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-7 space-y-4 sm:space-y-6">
            <h3 className="text-menu-text-light flex ">
              <span className="uppercase text-primary-500">
                {t("Address.billing")}
              </span>
            </h3>
            <AddressSelection
              addresses={uniqueBillingAddresses}
              type={"BILLING"}
              selectedAddress={selectedBillingAddressId}
              handleAddressChange={handleSelectAddress}
              onEdit={handleStartEdit}
              onDelete={handleDeleteAddress}
              addressDisplay={customerBillingAddressDisplay}
              label="billing"
            />

            {isEditing && (
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <h4 className="text-md font-semibold mb-4 text-menu-text-light">
                  {tAddress("editingAddress")}
                </h4>
                <BillingAddressForm
                  billingType={billingType}
                  orderBillingDetail={orderBillingDetail}
                  handleChange={handleBillingInputChange}
                  handleBillingTypeChange={setBillingType}
                  country={orderBillingDetail.country}
                  handleCountryChange={(e) => handleBillingInputChange(e)}
                  isRomania={orderBillingDetail.country === "Romania"}
                  selectedCounty={orderBillingDetail.county ?? ""}
                  handleCountyChangeSelect={(e) => handleBillingInputChange(e)}
                  handleCountyChangeInput={(e) => handleBillingInputChange(e)}
                  localCountryData={localCountryData}
                  localCountyData={localCountyData}
                />
              </div>
            )}
            {selectedBillingAddressId === ADD_NEW_ADDRESS_ID && !isEditing && (
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <h4 className="text-md text-menu-text-light font-semibold mb-4">
                  {tAddress("addNewAddress")}
                </h4>
                <BillingAddressForm
                  billingType={billingType}
                  orderBillingDetail={orderBillingDetail}
                  handleChange={handleBillingInputChange}
                  handleBillingTypeChange={setBillingType}
                  country={orderBillingDetail.country}
                  handleCountryChange={(e) => handleBillingInputChange(e)}
                  isRomania={orderBillingDetail.country === "Romania"}
                  selectedCounty={orderBillingDetail.county ?? ""}
                  handleCountyChangeSelect={(e) => handleBillingInputChange(e)}
                  handleCountyChangeInput={(e) => handleBillingInputChange(e)}
                  localCountryData={localCountryData}
                  localCountyData={localCountyData}
                />
              </div>
            )}
          </div>

          <div className="px-6 py-7 space-y-4 sm:space-y-6">
            <div className="flex items-center">
              <input
                id="shipping-is-same"
                type="checkbox"
                checked={shippingIsSameAsBilling}
                onChange={handleShippingSameAsBillingChange}
                className="h-4 w-4 text-primary-500 focus:ring-accent-500 border-accent-300 rounded"
              />
              <Label htmlFor="shipping-is-same" className="ml-2 text-sm">
                {tAddress("shippingIsSameAsBilling")}
              </Label>
            </div>
            {!shippingIsSameAsBilling && (
              <>
                <h3 className="text-menu-text-light flex">
                  <span className="uppercase text-primary-500">
                    {t("Address.shipping")}
                  </span>
                </h3>
                <AddressSelection
                  addresses={uniqueShippingAddresses}
                  type={"SHIPPING"}
                  selectedAddress={selectedShippingAddressId}
                  handleAddressChange={(id) => {
                    setSelectedShippingAddressId(id);
                    if (id !== ADD_NEW_ADDRESS_ID) {
                      const foundAddress = customersAddresses.find(
                        (addr) => addr.shippingAddress?.id === id,
                      );
                      if (foundAddress?.shippingAddress) {
                        setOrderShippingDetail(foundAddress.shippingAddress);
                      }
                    } else {
                      setOrderShippingDetail(BLANK_SHIPPING_ADDRESS);
                    }
                  }}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteAddress}
                  addressDisplay={customerShippingAddressDisplay}
                  label="shipping"
                />
                {(selectedShippingAddressId === ADD_NEW_ADDRESS_ID ||
                  (isEditing && !shippingIsSameAsBilling)) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <h4 className="text-md text-menu-text-light font-semibold mb-4">
                      {isEditing
                        ? tAddress("editingAddress")
                        : tAddress("addNewAddress")}
                    </h4>
                    <ShippingAddressForm
                      orderShippingDetail={orderShippingDetail}
                      handleShippingChange={handleShippingInputChange}
                      shippingCountry={orderShippingDetail.country}
                      handleShippingCountryChange={(e) =>
                        handleShippingInputChange(e)
                      }
                      shippingIsRomania={
                        orderShippingDetail.country === "Romania"
                      }
                      selectedShippingCounty={orderShippingDetail.county}
                      handleShippingCountyChangeSelect={(e) =>
                        handleShippingInputChange(e)
                      }
                      handleShippingCountyChangeInput={(e) =>
                        handleShippingInputChange(e)
                      }
                      localCountryData={localCountryData}
                      localCountyData={localCountyData}
                    />
                  </div>
                )}
              </>
            )}
            <div className="flex flex-col sm:flex-row pt-6">
              <ButtonPrimary
                className="sm:!px-7 shadow-none"
                onClick={handleSave}
                disabled={!isFormValid || !isShippingFormValid}
              >
                {t("saveNext")}
              </ButtonPrimary>
              {isEditing && (
                <ButtonSecondary
                  className="mt-3 sm:mt-0 sm:ml-3"
                  onClick={handleCancelEdit}
                >
                  {tAddress("cancelEdit")}
                </ButtonSecondary>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingAddress;
