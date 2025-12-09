import React, { MouseEventHandler, useState } from "react";
import shopbadge from "/public/shopbadge.png";
import Image from "next/image";

export function ShinyBadge() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    const tiltIntensity = 25;

    setRotate({
      x: yPct * -1 * tiltIntensity,
      y: xPct * tiltIntensity,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      // 👇 Add a className for styling the transition
      className="inline-block tilt-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      <a
        className="block"
        href="https://prismashop.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={shopbadge}
          alt="prismashop"
          height={90}
          width={170}
          className="rounded-lg glow-effect"
        />
      </a>
    </div>
  );
}
