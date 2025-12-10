"use client";

import React, { useEffect } from "react";
import Image from "next/image";

type HeroCard = {
  title: string;
  text: string;
  image: string;
};

type Props = {
  cards: HeroCard[];
  valuesImage: string | null;
  sectionTitle: string;
  content: string | null;
};

export default function ClientValuesGrid({
  cards,
  valuesImage,
  sectionTitle,
  content,
}: Props) {
  // This useEffect is not used for rendering, so it's left as is.
  useEffect(() => {
    const slugifyDomain = (url: string) => {
      let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
      host = host
        .replace(".prismasolutions.ro", "")
        .replace(".prismaweb.ro", "");
      return host.replace(/[^a-zA-Z0-9]/g, "");
    };

    let domain = slugifyDomain(window.location.host);
    if (domain.includes("localhost")) {
      domain = slugifyDomain("https://homesync.ro");
    }
    // const root = `https://${domain}.s3.eu-west-1.amazonaws.com/about/`;
  }, []);

  // A simple boolean to check if we have cards to display.
  const hasCards = cards && cards.length > 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/*
        If there are cards, display the title and the card grid.
      */}
      {hasCards ? (
        <>
          <h2
            className="text-menu-text-light mb-16 text-center text-3xl font-bold"
            dangerouslySetInnerHTML={{ __html: sectionTitle }}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {cards.map((item, index) => (
              <div
                key={index}
                className="group p-8 bg-menu-bg-dark dark:bg-neutral-900 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-20 h-20 mb-6 flex items-center justify-center bg-accent-50 rounded-2xl">
                  {item.image && (
                    <Image
                      src={item.image}
                      width={40}
                      height={40}
                      alt={item.title}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
                <h3
                  className="text-2xl font-bold mb-4 text-menu-text-light dark:text-white"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <div
                  className="text-menu-text-light dark:text-neutral-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        content && (
          <div
            className="prose dark:prose-invert max-w-none text-menu-text-light dark:text-neutral-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )
      )}

      {/* The image below the grid/content will always display if it exists */}
      {valuesImage && (
        <div className="mt-16 rounded-[40px] overflow-hidden shadow-2xl">
          <Image
            src={valuesImage}
            width={2000}
            height={800}
            alt="Our values"
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </div>
  );
}
