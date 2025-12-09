"use client";

import React, { FC, useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

export interface NcInputNumberProps {
  className?: string;
  defaultValue: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  desc?: string;
}

const NcInputNumber: FC<NcInputNumberProps> = ({
  className = "w-full",
  defaultValue,
  min,
  max,
  onChange,
  label,
  desc,
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleClickDecrement = () => {
    if (min >= value) return;
    setValue((state) => {
      return state - 1;
    });
    onChange && onChange(value - 1);
  };
  const handleClickIncrement = () => {
    if (max <= value) {
      return;
    } else {
      setValue((state) => {
        return state + 1;
      });
      onChange && onChange(value + 1);
    }
  };

  const renderLabel = () => {
    return (
      <div className="flex flex-col">
        <span className="font-medium text-menu-text-light ">{label}</span>
        {desc && (
          <span className="text-xs text-menu-text-light font-normal">
            {desc}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`nc-NcInputNumber flex items-center justify-between space-x-5 ${className}`}
    >
      {label && renderLabel()}

      <div
        className={`nc-NcInputNumber__content flex items-center justify-between w-[104px] sm:w-28`}
      >
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 focus:outline-none disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickDecrement}
          disabled={min >= value}
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span className="select-none block flex-1 text-center leading-none text-menu-text-light">
          {value}
        </span>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 focus:outline-none disabled:hover:border-neutral-400  disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickIncrement}
          disabled={max >= 0 ? max <= value : false}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NcInputNumber;
