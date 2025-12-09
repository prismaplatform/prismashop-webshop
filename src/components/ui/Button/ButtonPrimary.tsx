import Button, { ButtonProps } from "@/components/ui/Button/Button";
import React from "react";

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = "",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary disabled:bg-opacity-90 bg-primary-500 hover:bg-primary-700 text-accent-50 shadow-xl  ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
