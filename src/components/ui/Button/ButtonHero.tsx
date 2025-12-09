import Button, { ButtonProps } from "@/components/ui/Button/Button";
import React from "react";

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ className = "", ...args }) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary disabled:bg-opacity-90  shadow-xl bg-hero-button text-hero-buttonText ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
