"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserResponseDto } from "@/models/order-detail.model";
import ProductItem from "@/app/[locale]/(accounts)/account-order/components/ProductItem";
import { getAllReturnsByUser } from "@/api/returns";
import { useTranslations } from "next-intl";

const AccountReturn = () => {
  const [currentUser, setCurrentUser] = useState<UserResponseDto | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [rootUrl, setRootUrl] = useState("");
  const t = useTranslations("Pages.Account.Orders");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let domainC = slugifyDomain(window.location.host);
      if (domainC.includes("localhost")) {
        domainC = slugifyDomain("https://letrafutar.hu");
      }
      let root = "https://" + domainC + ".s3.eu-west-1.amazonaws.com/products/";
      setRootUrl(root);
    }
  }, []);

  const slugifyDomain = (url: string) => {
    let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");
    return host.replace(/[^a-zA-Z0-9]/g, "");
  };

  useEffect(() => {
    const currentUserCookie = Cookies.get("currentUser");
    if (currentUserCookie) {
      const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);
      setCurrentUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      const fetchOrders = async () => {
        try {
          const ordersData = await getAllReturnsByUser(
            currentUser.id as number,
          );
          setOrders(ordersData);
        } catch (err) {
          console.error("Error loading orders:", err);
        }
      };
      fetchOrders();
    }
  }, [currentUser]);

  const renderOrder = (order: any) => {
    const orderDate = new Date(order.createdDate).toLocaleDateString();
    const orderNumber = `#${order.transactionId?.substring(0, 8).toUpperCase() || order.id}`;

    return (
      <div
        key={order.id}
        className="border border-menu-text-light rounded-lg overflow-hidden z-0 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-menu-bg-dark">
          <div>
            <p className="text-lg font-semibold">{orderNumber}</p>
            <p className="text-accent-500 dark:text-accent-400 text-sm mt-1.5 sm:mt-2">
              <span>{orderDate}</span>
              <span className="mx-2">·</span>
              <span className="text-primary-500">
                {order.status || "Processing"}
              </span>
            </p>
          </div>
        </div>
        <div className="border-t border-accent-200 dark:border-accent-700 p-2 sm:p-8 divide-y divide-y-accent-200 dark:divide-accent-700">
          {order.returnOrderItems?.map((item: any, idx: number) => (
            <ProductItem key={idx} rootUrl={rootUrl} item={item.orderItem} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      <h2 className="text-2xl sm:text-3xl font-semibold">
        {t("orderHistory")}
      </h2>
      {orders.length > 0 ? orders.map(renderOrder) : <p>{t("noOrders")}</p>}
    </div>
  );
};

export default AccountReturn;
