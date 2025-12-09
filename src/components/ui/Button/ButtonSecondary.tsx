import Button, { ButtonProps } from "@/components/ui/Button/Button";
import React from "react";

export interface ButtonSecondaryProps extends ButtonProps {}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  className = " border border-accent-300 dark:border-accent-700 ",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonSecondary bg-white text-accent-700 dark:bg-accent-900 dark:text-accent-300 hover:bg-gray-100 dark:hover:bg-accent-800 ${className}`}
      {...args}
    />
  );
};

export default ButtonSecondary;
