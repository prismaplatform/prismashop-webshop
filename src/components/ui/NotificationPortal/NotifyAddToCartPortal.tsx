// components/ui/NotifyAddToCart/NotifyAddToCartPortal.tsx
"use client";
import { FC } from "react";
import ReactDOM from "react-dom";
import NotifyAddToCart from "../NotifyAddToCart/NotifyAddToCart";

interface Props {
  show: boolean;
  onClose: () => void;
  name: string;
  productImage: string;
}

const NotifyAddToCartPortal: FC<Props> = ({ show, onClose, name, productImage }) => {
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="fixed top-5 left-0 right-0 px-4 sm:left-auto sm:right-5 sm:w-auto sm:px-0 z-50 flex justify-center sm:justify-end">
      <NotifyAddToCart show={show} onClose={onClose} name={name} productImage={productImage} />
    </div>,
    document.body
  );
};

export default NotifyAddToCartPortal;
