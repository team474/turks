import React from "react";
import { Icon } from "../Icons";

export function CompanyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18 flex flex-col gap-10 md:gap-15">
      <div className="relative justify-center items-center gap-3 md:gap-8 flex flex-col">
        <h1 className="text-3xl md:text-7xl leading-[120%] text-[#101010] uppercase text-center font-vast-shadow">
          {title}
        </h1>
        <p className="absolute left-1/2 -translate-x-1/2 -bottom-28 md:-bottom-60 md:text-[220px] text-[100px] font-normal leading-[120%] text-[#101010] uppercase text-center opacity-2 oi-regular">
          turk&apos;s
        </p>
        <Icon.leafIcon className="absolute top-3.5 left-2 lg:top-[24px] sm:left-5 size-12 md:size-18" />
        <Icon.smokeIcon className="absolute top-2 -right-3 lg:top-5 sm:right-5 w-14 h-18 md:w-30 md:h-37" />
      </div>

      {children}
    </div>
  );
}
