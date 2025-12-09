import { Link } from "@/i18n/routing";
import Image from "next/image";
import stripeDark from "/public/payment/stripe-dark.png";
import stripeLight from "/public/payment/stripe-light.png";
import React, { FC, ReactNode } from "react";
import NTPLogo from "ntp-logo-react";

import { PaymentServiceDto } from "@/models/useful.model";

export interface PaymentServiceDisplayProps {
  paymentService: PaymentServiceDto | null;
}

const PaymentServiceDisplay: FC<PaymentServiceDisplayProps> = ({
  paymentService,
}) => {
  if (!paymentService) {
    return null;
  }

  // This function returns the appropriate logo element based on the service name.
  const getLogo = (): ReactNode => {
    switch (paymentService.serviceName) {
      case "NETOPIA":
        return (
          <NTPLogo
            color="#ffffff"
            version="vertical"
            secret={paymentService.link} // NTPLogo uses the 'link' as a 'secret' prop
          />
        );
      case "STRIPE":
        return (
          <>
            <Image
              src={stripeDark}
              alt="Stripe"
              className="block dark:hidden"
              height={45}
            />
            <Image
              src={stripeLight}
              alt="Stripe"
              className="hidden dark:block"
              height={45}
            />
          </>
        );
      default:
        return null;
    }
  };

  const logo = getLogo();

  // Don't render anything if the service name is not recognized.
  if (!logo) {
    return null;
  }

  // For STRIPE and BARION, wrap the logo in a link if a URL is provided.
  if (paymentService.link && paymentService.serviceName !== "NETOPIA") {
    return (
      <Link href={{ pathname: paymentService.link }} className="inline-block">
        {logo}
      </Link>
    );
  }

  // For NETOPIA, or for other services without a link, display the logo in a simple div.
  return <div className="inline-block">{logo}</div>;
};

export default PaymentServiceDisplay;
