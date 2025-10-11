import React from "react";
import { Icon } from "../Icons";
import Link from "next/link";

export function CompanyPage({ title, path, children }: { title: string; path: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18 flex flex-col gap-10 md:gap-30">
      <div className="relative justify-center items-center gap-3 md:gap-8 flex flex-col">
        <h1 className="text-[26px] md:text-5xl font-black leading-[120%] text-[#101010] uppercase text-center font-playfair-display-sc">
          {title}
        </h1>
        <div className="flex gap-3">
          <Link
            href={"/"}
            className="text-base font-medium leading-[150%] text-[#101010]"
          >
            Home
          </Link>
          <span className="text-base font-medium leading-[150%] text-[#101010]">
            /
          </span>
          <p className="text-base font-bold leading-[150%] text-[#101010]">
            {path}
          </p>
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 -bottom-28 md:-bottom-60 md:text-[220px] text-[100px] font-normal leading-[120%] text-[#101010] uppercase text-center opacity-2">
          turk&apos;s
        </p>
        <Icon.leafIcon className="absolute top-3.5 left-2 lg:top-[24px] sm:left-5 size-12 md:size-18" />
        <Icon.smokeIcon className="absolute top-2 -right-3 lg:-top-5 sm:right-5 w-14 h-18 md:w-30 md:h-37" />
      </div>

      {children}
    </div>
  );
}
