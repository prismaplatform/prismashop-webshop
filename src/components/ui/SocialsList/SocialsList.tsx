import React, { FC, useEffect, useState } from "react";
import facebook from "@/images/socials/facebook.svg";
import youtube from "@/images/socials/youtube.svg";
import instagram from "@/images/socials/instagram.svg";
import tiktok from "@/images/socials/tiktok.svg";
import linkedin from "@/images/socials/linkedin.svg";
import tripadvisor from "@/images/socials/tripadvisor.svg";
import x from "@/images/socials/x.svg";
import Image from "next/image";
import { ContactDto } from "@/models/contact.model";
import { getContactInfo } from "@/api/contact";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
}

const SocialsList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block w-6 h-6",
}) => {
  const [contactDto, setContact] = useState<ContactDto>();
  const [socialLinks, setSocialLinks] = useState<
    { key: string; url: string; icon: string; title: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactInfo: ContactDto = await getContactInfo();
        setContact(contactInfo);
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  useEffect(() => {
    if (contactDto) {
      const socialLinks = [
        {
          key: "facebook",
          url: contactDto.facebook,
          icon: facebook,
          title: "Facebook",
        },
        {
          key: "instagram",
          url: contactDto.instagram,
          icon: instagram,
          title: "Instagram",
        },
        {
          key: "linkedin",
          url: contactDto.linkedin,
          icon: linkedin,
          title: "LinkedIn",
        },
        { key: "x", url: contactDto.twitter, icon: x, title: "X (Twitter)" },
        {
          key: "tiktok",
          url: contactDto.tiktok,
          icon: tiktok,
          title: "TikTok",
        },
        {
          key: "youtube",
          url: contactDto.youtube,
          icon: youtube,
          title: "YouTube",
        },
        {
          key: "tripadvisor",
          url: contactDto.tripadvisor,
          icon: tripadvisor,
          title: "Tripadvisor",
        },
      ];
      setSocialLinks(socialLinks);
    }
  }, [contactDto]);

  return (
    <nav
      className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
    >
      {socialLinks.map(
        ({ key, url, icon, title }) =>
          url && (
            <a
              key={key}
              className={itemClass}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={title}
            >
              <Image sizes="40px" src={icon} alt={title} />
            </a>
          ),
      )}
    </nav>
  );
};

export default SocialsList;
