import React, { FC } from "react";
import Avatar from "@/components/ui/Avatar/Avatar";
import { Link } from "@/i18n/routing";

export interface PostCardMetaProps {
  className?: string;
  hiddenAvatar?: boolean;
  authorName?: string;
  authorImage?: string;
  date?: Date;
}

const PostCardMeta: FC<PostCardMetaProps> = ({
  className = "leading-none",
  hiddenAvatar = false,
  authorName,
  authorImage,
  date,
}) => {
  return (
    <div
      className={`nc-PostCardMeta inline-flex items-center fledx-wrap text-menu-text-light dark:text-neutral-200 text-sm ${className}`}
      data-nc-id="PostCardMeta"
    >
      <Link
        href={"/blog"}
        className="flex-shrink-0 relative flex items-center space-x-2"
      >
        {!hiddenAvatar && (
          <Avatar
            imgUrl={authorImage}
            userName={authorName}
            radius="rounded-full"
            sizeClass={"h-7 w-7 text-sm"}
          />
        )}
        <span className="block text-menu-text-light hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
          {authorName}
        </span>
      </Link>
      <>
        <span className="text-menu-text-light dark:text-neutral-400 mx-[6px] font-medium">
          ·
        </span>
        <span className="text-menu-text-light dark:text-neutral-400 font-normal line-clamp-1">
          {new Date(date ?? new Date()).toLocaleDateString("ro-RO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </>
    </div>
  );
};

export default PostCardMeta;
