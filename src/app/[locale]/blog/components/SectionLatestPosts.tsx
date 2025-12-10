"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import Card3 from "./Card3";
import { BlogDto } from "@/models/blog.model";
import { getBlogs } from "@/api/blog";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "@/app/[locale]/blog/components/Pagination";
import { useSearchParams } from "next/navigation";

export interface SectionLatestPostsProps {
  className?: string;
  postCardName?: "card3";
}

// Function to extract page number from search params
const getPage = (searchParams: URLSearchParams): number =>
  Number(searchParams.get("page")) || 1;

const SectionLatestPosts: FC<SectionLatestPostsProps> = ({
  postCardName = "card3",
  className = "",
}) => {
  const searchParams = useSearchParams();
  const [blogPosts, setBlogPosts] = useState<BlogDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rootUrl, setRootUrl] = useState("");
  const [rootUrlLogo, setRootUrlLogo] = useState<string>("");
  const [totalPages, setTotalPages] = useState(0);

  const currentPage = useMemo(() => getPage(searchParams), [searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const domain = slugifyDomain(window.location.host);
      const finalDomain = domain.includes("localhost") ? "homesyncro" : domain;
      setRootUrl(`https://${finalDomain}.s3.eu-west-1.amazonaws.com/blogs/`);
      setRootUrlLogo(
        `https://s3stack-configuration21549683-egopugffrx7u.s3.eu-west-1.amazonaws.com/${finalDomain}/favicon.ico`,
      );
    }
  }, []);

  const slugifyDomain = (url: string) => {
    let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

    // Check if the URL contains '.prismasolutions.ro' and remove it
    host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");

    return host.replace(/[^a-zA-Z0-9]/g, "");
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const result = await getBlogs(currentPage);
        setTotalPages(result.totalPages);
        setBlogPosts(result.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  return (
    <div className="flex flex-col">
      <div className="grid gap-6 md:gap-8 grid-cols-1">
        {loading ? (
          <Skeleton count={2} height={300} />
        ) : (
          blogPosts.map((blogPost, index) => (
            <Card3
              key={index}
              rootUrl={rootUrl}
              authorImage={rootUrlLogo}
              blogPost={blogPost}
            />
          ))
        )}
      </div>
      <div className="flex flex-col mt-12 md:mt-20 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default SectionLatestPosts;
