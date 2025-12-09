import React, { FC } from "react";
import ButtonSecondary from "@/components/ui/Button/ButtonSecondary";
import { Link } from "@/i18n/routing";
import Image, { StaticImageData } from "next/image";

export interface CardCategory3Props {
  className?: string;
  featuredImage?: StaticImageData | string;
  name?: string;
  desc?: string;
  color?: string;
}

const CardCategory3: FC<CardCategory3Props> = ({
  className = "",
  featuredImage = "",
  name = "",
  desc = "",
  color = "",
}) => {
  return (
    <Link
      href={"/collection"}
      className={`nc-CardCategory3 block ${className}`}
    >
      <div
        className={`relative w-full aspect-w-16 aspect-h-11 sm:aspect-h-9 h-0 rounded-2xl overflow-hidden group ${color}`}
      >
        <div>
          <div className="absolute inset-5 sm:inset-8">
            <Image
              alt=""
              src={featuredImage || ""}
              className="absolute end-0 w-1/2 max-w-[260px] h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
        <span className="opacity-0 group-hover:opacity-40 absolute inset-0 bg-black/10 transition-opacity"></span>

        <div>
          <div className="absolute inset-5 sm:inset-8 flex flex-col">
            <div className="max-w-xs">
              <span className={`block mb-2 text-sm text-accent-700`}>
                {name}
              </span>
              {desc && (
                <h2
                  className={`text-xl md:text-2xl text-accent-900 font-semibold`}
                  dangerouslySetInnerHTML={{ __html: desc }}
                ></h2>
              )}
            </div>
            <div className="mt-auto">
              <ButtonSecondary
                sizeClass="py-3 px-4 sm:py-3.5 sm:px-6"
                fontSize="text-sm font-medium"
                className="nc-shadow-lg"
              >
                Show me all
              </ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardCategory3;
