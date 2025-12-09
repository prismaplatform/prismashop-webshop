import React from "react";
import BillingAddress from "@/app/[locale]/(accounts)/account-billing/components/BillingAddress";

const AccountBilling = () => {
  return (
    <div className="space-y-10 sm:space-y-12">
      <div id="BillingAddress" className="scroll-mt-24">
        <BillingAddress />
      </div>
    </div>
  );
};

export default AccountBilling;
