import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeroLinkProps {
  href: string;
  title: string;
  message: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  badge: boolean;
  className?: string
}

const HeroLink = ({
  href,
  title,
  message,
  description,
  imageSrc,
  imageAlt = "",
  badge,
  className = ""    
}: HeroLinkProps) => {
  return (
    <Link
      href={href}
      className={`${className} w-full bg-opacity-20 hover:cursor-pointer p-5 rounded-lg focus:border focus:border-white`}
    >
      <h3 className="uppercase text-sm mb-2 font-medium">{message}</h3>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center relative">
          {imageSrc && (
            <Image
              alt={imageAlt}
              src={imageSrc}
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
          {badge && (
            <span className="absolute top-10 right-[140px] end-0 inline-flex items-center size-3 rounded-full border-2 border-white text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-green-500 text-white">
              <span className="sr-only">Badge value</span>
            </span>
          )}

          <div className="text-sm">
            <h4 className="font-semibold">{title}</h4>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HeroLink;
