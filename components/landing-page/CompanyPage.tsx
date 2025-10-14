import React from "react";
import Image from "next/image";
import { Icon } from "../Icons";
import wordmarkSvg from "@/assets/turks-wordmark.svg";

export function CompanyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18 flex flex-col gap-10 md:gap-15">
      <div className="relative justify-center items-center gap-3 md:gap-8 flex flex-col">
        <h1 className="text-5xl md:text-7xl leading-[120%] text-[#101010] uppercase text-center font-vast-shadow">
          {title}
        </h1>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 md:-bottom-20 w-[300px] md:w-[760px] opacity-25 pointer-events-none select-none">
          <Image
            src={wordmarkSvg}
            alt="TURK'S"
            width={760}
            height={230}
            className="w-full h-auto"
            style={{ filter: 'invert(88%) sepia(12%) saturate(682%) hue-rotate(25deg) brightness(96%) contrast(88%) drop-shadow(0 2px 4px rgba(29,67,29,0.1))' }}
          />
        </div>
        <Icon.leafIcon className="absolute top-10 left-2 lg:top-[24px] sm:left-5 size-12 md:size-18" />
        <Icon.smokeIcon className="absolute top-10  -right-3 lg:top-5 sm:right-5 w-14 h-18 md:w-30 md:h-37" />
      </div>

      {children}
    </div>
  );
}
