import { Link } from "@/i18n/routing";
import Image from "next/image";
import barion from "/public/payment/barion.svg";
import React, { FC, ReactNode } from "react";

import { PaymentServiceDto } from "@/models/useful.model";

export interface PaymentServiceDisplayProps {
  paymentService: PaymentServiceDto | null;
}

const PaymentServiceDisplay2: FC<PaymentServiceDisplayProps> = ({
  paymentService,
}) => {
  if (!paymentService) {
    return null;
  }

  // This function returns the appropriate logo element based on the service name.
  const getLogo = (): ReactNode => {
    switch (paymentService.serviceName) {
      case "BARION":
        return <Image src={barion} alt="Barion" height={45} />;
      default:
        return null;
    }
  };

  const logo = getLogo();

  // Don't render anything if the service name is not recognized.
  if (!logo) {
    return null;
  }

  return (
    <Link
      href={{ pathname: paymentService.link }}
      className="flex justify-center my-4"
    >
      {logo}
    </Link>
  );
};

export default PaymentServiceDisplay2;
