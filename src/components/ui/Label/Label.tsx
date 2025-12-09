import React, { FC, LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children?: React.ReactNode;
}

const Label: FC<LabelProps> = ({ className = "", children, ...rest }) => {
  return (
    <label
      className={`nc-Label text-base font-medium text-menu-text-light dark:text-neutral-200 ${className}`}
      data-nc-id="Label"
      {...rest}
    >
      {children}
    </label>
  );
};

export default Label;
