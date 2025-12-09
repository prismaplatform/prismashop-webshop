import React, { FC } from "react";
import ReactStars from "react-stars";

interface ReviewItemDataType {
  name: string;
  avatar?: string;
  date: string;
  comment: string;
  starPoint: number;
}

export interface ReviewItemProps {
  className?: string;
  data: ReviewItemDataType;
}

const ReviewItem: FC<ReviewItemProps> = ({ className = "", data }) => {
  return (
    <div
      className={`nc-ReviewItem flex flex-col ${className}`}
      data-nc-id="ReviewItem"
    >
      <div className=" flex space-x-4 ">
        <div className="flex-1 flex justify-between">
          <div className="text-sm sm:text-base">
            <span className="block font-semibold">{data.name}</span>
            <span className="block mt-0.5 text-menu-text-light text-sm">
              {data.date}
            </span>
          </div>
          <ReactStars
            count={5}
            value={data.starPoint}
            color1={"#dcdcdc"}
            edit={false}
          />
        </div>
      </div>
      <div className="mt-4 prose prose-sm sm:prose  sm:max-w-2xl">
        <p className="text-menu-text-light">{data.comment}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
