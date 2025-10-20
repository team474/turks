import Link from "next/link";
import Image from "next/image";
import logomarkSvg from "@/assets/logomark.svg";
import wordmarkSvg from "@/assets/turks-wordmark.svg";

import FooterMenu from "components/layout/footer-menu";
// import LogoSquare from "components/logo-square";
import { getMenu } from "lib/shopify";
import type { Menu as MenuType } from "lib/shopify/types";
import { Suspense } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = currentYear;
  const skeleton =
    "w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700";
  let menu: MenuType[] = [];
  try {
    menu = await getMenu("next-js-frontend-footer-menu");
  } catch {
    menu = [];
  }
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto justify-between items-center flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div className="flex items-center gap-6 md:flex-row md:gap-12">
        <div>
          <Link
            className="flex items-center gap-2 text-black md:pt-1 dark:text-white"
            href="/"
          >
            <Image
              src={logomarkSvg.src}
              alt="Turks logo mark"
              width={28}
              height={28}
              className="inline-block h-7 w-7"
            />
            <div 
              className="w-[120px] sm:w-[140px]" 
              style={{ 
                backgroundColor: '#1D431D',
                WebkitMaskImage: `url(${wordmarkSvg.src})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: `url(${wordmarkSvg.src})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                aspectRatio: '3/1'
              }}
            />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-row gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
        </div>
        {/* <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700"> */}
        <div className="">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".")
              ? "."
              : ""}{" "}
            All rights reserved.
          </p>
        </div>
      </div>
      {/* </div> */}
    </footer>
  );
}
