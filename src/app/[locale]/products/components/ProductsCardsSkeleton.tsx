"use client";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductsCardsSkeleton = () => {
  return (
    <div className="flex-1 grid sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-10">
      <Skeleton count={2} height={400} width={300} />
      <Skeleton count={2} height={400} width={300} />
      <Skeleton count={2} height={400} width={300} />
    </div>
  );
};
export default ProductsCardsSkeleton;
