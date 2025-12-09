"use client";
import React, { FC, useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export interface FiveStarIconForRateProps {
  className?: string;
  iconClass?: string;
  defaultPoint?: number;
  onChange?: (value: number) => void;
}

const FiveStarIconForRate: FC<FiveStarIconForRateProps> = ({
  className = "",
  iconClass = "w-5 h-5",
  defaultPoint = 5,
  onChange,
}) => {
  const [point, setPoint] = useState(defaultPoint);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  useEffect(() => {
    setPoint(defaultPoint);
  }, [defaultPoint]);

  const handleClick = (value: number) => {
    setPoint(value);
    onChange?.(value);
  };

  const displayedValue = hoverValue ?? point;

  return (
    <div
      className={`flex items-center space-x-2 ${className}`}
      data-nc-id="FiveStarIconForRate"
    >
      <div className="flex">
        {[1, 2, 3, 4, 5].map((item) => {
          const isFilled = displayedValue >= item;

          return (
            <span
              key={item}
              onMouseEnter={() => setHoverValue(item)}
              onMouseLeave={() => setHoverValue(null)}
              onClick={() => handleClick(item)}
              className="cursor-pointer"
            >
              {isFilled ? (
                <StarIcon
                  className={`${iconClass} text-amber-400 drop-shadow-[0_0_1px_rgba(0,0,0,0.4)]`}
                />
              ) : (
                <StarOutline className={`${iconClass} text-gray-300`} />
              )}
            </span>
          );
        })}
      </div>
      <span className="text-sm text-menu-text-light">
        {displayedValue.toFixed(1)}
      </span>
    </div>
  );
};

export default FiveStarIconForRate;
