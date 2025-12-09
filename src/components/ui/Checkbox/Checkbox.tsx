import React, { FC } from "react";

export interface CheckboxProps {
  label?: string | React.ReactNode;
  subLabel?: string;
  className?: string;
  sizeClassName?: string;
  labelClassName?: string;
  name: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox: FC<CheckboxProps> = ({
  subLabel = "",
  label = "",
  name,
  className = "",
  sizeClassName = "w-6 h-6",
  labelClassName = "",
  defaultChecked,
  onChange,
}) => {
  return (
    <div className={`flex text-sm sm:text-base ${className}`}>
      <input
        id={name}
        name={name}
        type="checkbox"
        className={`focus:ring-action-primary text-primary-500 rounded border-accent-400 hover:border-accent-700 bg-transparent dark:border-accent-700 dark:hover:border-accent-500 dark:checked:bg-primary-500 focus:ring-primary-500 ${sizeClassName}`}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      {label && (
        <label
          htmlFor={name}
          className="pl-2.5 sm:pl-3.5 flex flex-col flex-1 justify-center select-none"
        >
          <span
            className={`text-sm ${labelClassName} ${
              !!subLabel ? "-mt-0.5" : ""
            }`}
          >
            {label}
          </span>
          {subLabel && (
            <p className="mt-0.5 text-sm font-light text-xs text-gray-400">
              {subLabel}
            </p>
          )}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
