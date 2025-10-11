"use client";
import React from "react";
import { Icon } from "../Icons";
import { cn } from "@/lib/utils";

export function Button({
  title,
  link,
  className,
}: {
  title: string;
  link: string;
  className?: string;
}) {
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined") {
          window.location.href = link;
        }
      }}
      className={cn(
        "cursor-pointer z-10 flex px-4 py-3 sm:px-8 sm:py-4 justify-center items-center gap-4 rounded-full border border-white bg-[#1D431D] shadow-[0_1px_0_1px_#1D431D] text-white text-sm sm:text-base font-bold leading-[150%] uppercase",
        className
      )}
    >
      {title}
      <Icon.arrowRightIcon />
    </button>
  );
}
