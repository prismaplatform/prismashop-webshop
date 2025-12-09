import React, { FC } from "react";
import { AboutPageContentDto } from "@/models/about.model";
import Image from "next/image";

export interface SectionStatisticProps {
  className?: string;
  content: AboutPageContentDto[];
  title?: string;
  rootUrl: string;
}

const SectionSingle: FC<SectionStatisticProps> = ({
  content,
  className = "",
  title,
  rootUrl,
}) => {
  return (
    <div className={`nc-SectionStatistic relative ${className}`}>
      {content.map((item) => (
        <div key={item.id}>
          {item.image && (
            <Image
              
              className="rounded-xl h-full"
              src={rootUrl + item.image}
              alt=""
              width={2000}
              height={500}
              priority
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionSingle;
