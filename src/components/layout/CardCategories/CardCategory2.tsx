import React, { FC } from "react";
import NcImage from "@/components/ui/NcImage/NcImage";
import { Link } from "@/i18n/routing";

export interface CardCategory2Props {
  className?: string;
  ratioClass?: string;
  bgClass?: string;
  featuredImage: string | null;
  name: string;
  slug: string;
  desc: string;
}

const CardCategory2: FC<CardCategory2Props> = ({
  className = "",
  ratioClass = "aspect-w-1 aspect-h-1",
  bgClass = "bg-neutral-50 dark:bg-neutral-800",
  featuredImage,
  name,
  slug,
  desc,
}) => {
  return (
    <Link
      href={{ pathname: "/products/"+slug }}
      className={`nc-CardCategory2 ${className}`}
      data-nc-id="CardCategory2"
    >
      <div
        className={`flex-1 relative w-full h-0 rounded-2xl overflow-hidden group ${ratioClass} ${bgClass}`}
      >
        <div>
          {featuredImage ? (
            <NcImage
              priority
              alt={`cover-image-of ${name} category`}
              containerClassName="w-full h-full flex justify-center"
              src={featuredImage}
              className="object-contain rounded-2xl"
              width={400}
              height={400}
            />
          ) : (
            <div className="w-full h-full flex justify-center align-middle items-center custom-category-card rounded-2xl">
              <span className="text-3xl text-white text-center">{name}</span>
            </div>
          )}
        </div>

        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity rounded-2xl"></span>
      </div>
      <div className="mt-5 flex-1 text-center">
        <h2 className="sm:text-lg text-menu-text-light dark:text-neutral-100 font-semibold">
          {name}
        </h2>
        <span className="block mt-0.5 sm:mt-1.5 text-sm text-menu-text-light dark:text-neutral-400">
          {desc}
        </span>
      </div>
    </Link>
  );
};

export default CardCategory2;
