import React, { FC } from "react";
import Heading from "@/components/ui/Heading/Heading";
import { AboutPageContentDto } from "@/models/about.model";
import Image from "next/image";

export interface SectionStatisticProps {
  className?: string;
  content: AboutPageContentDto[];
  title?: string;
  rootUrl: string;
}

const SectionGrid: FC<SectionStatisticProps> = ({ content, className = "", title, rootUrl }) => {
  return (
    <div className={`nc-SectionStatistic relative ${className}`}>
      <Heading>{title}</Heading>
      <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3 xl:gap-8">
        {content.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl dark:border-neutral-800"
          >
            {item.image && (
              <div className="flex-grow mb-3">
                <Image
                  className="rounded-xl"
                  src={rootUrl + item.image}
                  alt=""
                  width={30}
                  height={30}
                  priority
                  style={{
                    objectFit: "contain",
                    height: "unset",
                    width: "unset",
                  }}
                />
              </div>
            )}
            {item.lead && (
              <h3 className="text-2xl font-semibold leading-none text-neutral-900 md:text-3xl dark:text-neutral-200">
                {item.title}
              </h3>
            )}
            {item.lead && (
              <span
                className="block text-sm text-neutral-500 mt-3 sm:text-base dark:text-neutral-400"
                dangerouslySetInnerHTML={{ __html: item.lead }}
              ></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
