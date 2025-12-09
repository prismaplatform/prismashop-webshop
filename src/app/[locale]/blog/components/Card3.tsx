import React, { FC } from "react";
import NcImage from "@/components/ui/NcImage/NcImage";
import PostCardMeta from "@/components/layout/PostCardMeta/PostCardMeta";
import { Link } from "@/i18n/routing";
import { BlogDto } from "@/models/blog.model";

export interface Card3Props {
  className?: string;
  blogPost: BlogDto;
  rootUrl: string;
  authorImage: string;
}

const Card3: FC<Card3Props> = ({
  blogPost,
  rootUrl,
  authorImage,
  className = "h-full",
}) => {
  return (
    <div
      className={`nc-Card3 relative flex flex-col-reverse sm:flex-row sm:items-center rounded-[40px] group ${className}`}
      data-nc-id="Card3"
    >
      <div
        className={`block flex-shrink-0 sm:w-56 sm:mr-6 rounded-3xl overflow-hidden mb-5 sm:mb-0`}
      >
        <Link
          href={{
            pathname: `/blog-single/${blogPost?.slug}`,
          }}
          className={`block w-full h-0 aspect-h-9 sm:aspect-h-16 aspect-w-16 `}
        >
          <NcImage
            alt=""
            fill
            src={rootUrl + blogPost?.image}
            containerClassName="absolute inset-0"
            sizes="(max-width: 768px) 100vw, 30vw"
          />
        </Link>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="space-y-5 mb-4">
          <div>
            <h2
              className={`nc-card-title block font-semibold text-menu-text-light dark:text-neutral-100 text-xl`}
            >
              <Link
                href={{
                  pathname: `/blog-single/${blogPost?.slug}`,
                }}
                className="line-clamp-2 capitalize"
                title={"title"}
              >
                {blogPost.title}
              </Link>
            </h2>
            <div className="hidden sm:block sm:mt-2">
              <span
                className="text-menu-text-light dark:text-neutral-400 text-base line-clamp-1"
                dangerouslySetInnerHTML={{ __html: blogPost.lead }}
              />
            </div>
          </div>
          <PostCardMeta
            authorImage={authorImage}
            authorName={blogPost.author}
            date={blogPost.createDate}
          />
        </div>
      </div>
    </div>
  );
};

export default Card3;
