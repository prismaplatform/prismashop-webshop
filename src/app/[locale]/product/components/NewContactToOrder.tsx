"use client";
import React, { FC, useState } from "react";
import Swal from "sweetalert2";
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import Textarea from "@/components/ui/Textarea/Textarea";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import { TransitionChild } from "@/app/ui/headlessui";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@/components/ui/ButtonClose/ButtonClose";
import { useTranslations } from "next-intl";
import { ContactToOrderDto } from "@/models/contact-to-order.model";
import { createNewContactToOrder } from "@/api/contact-to-order";

export interface NewReviewsProps {
  show: boolean;
  onCloseModal: () => void;
  productOption: number;
}

const NewContactToOrder: FC<NewReviewsProps> = ({
  show,
  productOption,
  onCloseModal,
}) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const t = useTranslations("Pages.Products.ContactToOrder");
  const tContact = useTranslations("Pages.Contact");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newContactToOrder: ContactToOrderDto = {
      productOption: { id: productOption },
      name: name,
      email: email,
      quantity: quantity,
      phone: phone,
      message: message,
    };

    try {
      await createNewContactToOrder(newContactToOrder);
      setName("");
      setEmail("");
      setMessage("");
      setQuantity("");
      Swal.fire({
        title: t("thanks"),
        text: t("thanksText"),
        confirmButtonText: "OK",
        icon: "warning",
      }).then(() => {
        onCloseModal();
      });
    } catch (error) {
      Swal.fire({
        title: t("failed"),
        confirmButtonText: "OK",
        icon: "warning",
      }).then(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition appear show={show}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onCloseModal}
      >
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </TransitionChild>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block my-8 w-full max-w-2xl align-middle">
              <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-menu-bg-light border-primary-500 border shadow-xl h-full">
                <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h3
                    className="text-lg font-medium leading-6 text-menu-text-light"
                    id="headlessui-dialog-title-70"
                  >
                    {t("contactToOrder")}
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={onCloseModal} />
                  </span>
                </div>
                <div className="px-8 my-5">
                  <form
                    className="grid grid-cols-1 gap-6"
                    onSubmit={handleSubmit}
                  >
                    <label className="block">
                      <Label>{tContact("fullName")}</Label>
                      <Input
                        placeholder={tContact("fullNamePlaceholder")}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                        required={true}
                      />
                    </label>
                    <label className="block">
                      <Label>{tContact("emailAddress")}</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@example.com"
                        className="mt-1"
                        required={true}
                      />
                    </label>
                    <label className="block">
                      <Label>{tContact("phone")}</Label>
                      <Input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07xxxxxxxx"
                        className="mt-1"
                        required={true}
                      />
                    </label>
                    <label className="block">
                      <Label>{tContact("quantity")}</Label>
                      <Input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="1"
                        className="mt-1"
                        required={true}
                      />
                    </label>
                    <label className="block">
                      <Label>{tContact("message")}</Label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1"
                        rows={6}
                        required={true}
                      />
                    </label>
                    <div>
                      <ButtonPrimary type="submit" disabled={submitting}>
                        {submitting
                          ? tContact("SendButton.sending")
                          : tContact("SendButton.label")}
                      </ButtonPrimary>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NewContactToOrder;
