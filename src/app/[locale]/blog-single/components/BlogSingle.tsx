"use client";
import Avatar from "@/components/ui/Avatar/Avatar";
import NcImage from "@/components/ui/NcImage/NcImage";
import React, { useEffect, useState } from "react";
import { getBlogBySlug } from "@/api/blog";
import { BlogDto } from "@/models/blog.model";
import Skeleton from "react-loading-skeleton";
import SocialsList from "@/components/ui/SocialsList/SocialsList";

const BlogSingle = ({ s }: { s: string }) => {
  // State Management
  const [loading, setLoading] = useState<boolean>(true);
  const [rootUrl, setRootUrl] = useState<string>("");
  const [rootUrlLogo, setRootUrlLogo] = useState<string>("");
  const [blogPost, setBlogPost] = useState<BlogDto | null>(null);

  const slug = s;
  // Fetch blog post when slug changes
  useEffect(() => {
    if (!slug) return;

    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const result = await getBlogBySlug(slug);
        setBlogPost(result);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [slug]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const domain = slugifyDomain(window.location.host);
      const finalDomain = domain.includes("localhost") ? "homesyncro" : domain;
      setRootUrl(`https://${finalDomain}.s3.eu-west-1.amazonaws.com/blogs/`);
      setRootUrlLogo(
        `https://s3stack-configuration21549683-egopugffrx7u.s3.eu-west-1.amazonaws.com/${finalDomain}/logo.webp`,
      );
    }
  }, []);

  const slugifyDomain = (url: string) => {
    let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

    // Check if the URL contains '.prismasolutions.ro' and remove it
    host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");

    return host.replace(/[^a-zA-Z0-9]/g, "");
  };

  const renderHeader = () => {
    return (
      <header className="container rounded-xl">
        <div className="max-w-screen-md mx-auto space-y-5">
          <h1
            className="text-menu-text-light font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-4xl dark:text-neutral-100 max-w-4xl "
            title="Quiet ingenuity: 120,000 lunches and counting"
          >
            {blogPost?.title}
          </h1>
          <span
            className="block text-base text-menu-text-light md:text-lg dark:text-neutral-400 pb-1"
            dangerouslySetInnerHTML={{ __html: blogPost?.lead || "" }}
          />

          <div className="w-full border-b border-neutral-100 dark:border-neutral-800"></div>
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <div className="nc-PostMeta2 flex items-center flex-wrap text-menu-text-light text-left dark:text-neutral-200 text-sm leading-none flex-shrink-0">
              <Avatar
                imgUrl={rootUrlLogo}
                containerClassName="flex-shrink-0"
                sizeClass="w-8 h-8 sm:h-11 sm:w-11 "
              />
              <div className="ml-3">
                <div className="flex items-center">
                  <a className="block font-semibold">{blogPost?.author}</a>
                </div>
                <div className="text-xs mt-[6px]">
                  <span className="text-menu-text-light dark:text-neutral-300">
                    {new Date(
                      blogPost?.createDate ?? new Date(),
                    ).toLocaleDateString("ro-RO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-1.5 sm:ml-3">
              <SocialsList />
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    return (
      <div
        id="single-entry-content"
        className="prose prose-sm !max-w-screen-md sm:prose lg:prose-lg mx-auto dark:prose-invert [&_*]:text-menu-text-light"
      >
        <p dangerouslySetInnerHTML={{ __html: blogPost?.content ?? "" }} />
      </div>
    );
  };

  return loading ? (
    <Skeleton count={2} height={300} />
  ) : (
    <div className="nc-PageSingle pt-8 lg:pt-16">
      {renderHeader()}
      <NcImage
        alt=""
        width={1260}
        height={750}
        className="w-full rounded-xl"
        containerClassName="container my-10 sm:my-12"
        src={rootUrl + blogPost?.image}
      />

      <div className="nc-SingleContent container space-y-10">
        {renderContent()}
        <div className="max-w-screen-md mx-auto"></div>
        {/*{renderAuthor()}*/}
      </div>
    </div>
  );
};

export default BlogSingle;
