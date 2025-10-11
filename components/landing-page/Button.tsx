"use client";
import React from "react";
import { Icon } from "../Icons";
import { cn } from "@/lib/utils";

export function Button({
  title,
  link,
  className,
  onClick,
}: {
  title: string;
  link?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
        if (link && typeof window !== "undefined") {
          try {
            // Handle in-page hash links smoothly without reload
            if (link.startsWith('#')) {
              const id = link.slice(1);
              const el = document.getElementById(id) || document.querySelector(`[id='${id}']`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', link);
                return;
              }
            }
            if (link.startsWith('/#')) {
              const hash = link.split('#')[1];
              const path = link.split('#')[0];
              if (window.location.pathname === path && hash) {
                const el = document.getElementById(hash) || document.querySelector(`[id='${hash}']`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  history.replaceState(null, '', `#${hash}`);
                  return;
                }
              }
            }
          } catch {
            // fall through to default nav
          }
          window.location.href = link;
        }
      }}
      className={cn(
        "group cursor-pointer z-10 flex px-[1.25rem] py-[1rem] sm:px-[2.5rem] sm:py-[1.25rem] justify-center items-center gap-5 rounded-full text-white text-lg sm:text-xl font-bold leading-[150%] uppercase",
        "bg-[radial-gradient(circle_at_center,_#1C401C_0%,_#1D431D_50%,_#1E461E_100%)] shadow-[0_6px_14px_rgba(0,0,0,0.15)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:brightness-120 hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)] active:brightness-95",
        className
      )}
    >
      {title}
      <Icon.arrowRightIcon className="w-8 h-8 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
    </button>
  );
}
