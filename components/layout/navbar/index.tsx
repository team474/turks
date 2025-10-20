"use client";

import CartModal from "components/cart/modal";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { motion } from "framer-motion";
import MobileMenu from "./mobile-menu";
import wordmarkSvg from "@/assets/turks-wordmark.svg";
import logomarkSvg from "@/assets/logomark.svg";

const menu = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Contact",
    path: "/contact-us",
  },
  // {
  //   title: "Blog",
  //   path: "/blog",
  // },
];
export function Navbar() {
  const shimmerAnimationProps = {
    initial: { ['--x' as string]: '100%' },
    animate: { ['--x' as string]: '-100%' },
    transition: {
      repeat: Infinity,
      repeatType: 'loop' as const,
      repeatDelay: 1,
      type: 'spring' as const,
      stiffness: 20,
      damping: 15,
      mass: 2,
    },
  };

  return (
    <>
      {/* Free Shipping Banner */}
      <div className="relative w-full bg-[#101010] overflow-hidden">
        {/* Shimmer overlay */}
        <motion.span
          {...shimmerAnimationProps}
          className="absolute inset-0 z-0 block pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(-75deg, rgba(255,255,255,0) calc(var(--x) + 10%), rgba(255,255,255,0.14) calc(var(--x) + 20%), rgba(255,255,255,0) calc(var(--x) + 90%))',
            mixBlendMode: 'screen',
            opacity: 0.9,
          }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-2 text-center">
          <p className="text-white text-xs md:text-sm font-medium">Free shipping on all orders! 🚚</p>
          <p className="text-white text-[10px] md:text-xs font-normal mt-0.5">We will not ship to the following States: Idaho, Nebraska, South Dakota, Kansas, West Virginia, Wyoming</p>
        </div>
      </div>

      <header
        className="flex bg-[linear-gradient(to_right,_hsl(77,33%,78%),_hsl(77,33%,76%),_hsl(77,33%,74%))] md:bg-[linear-gradient(to_right,_hsl(77,33%,80%),_hsl(77,33%,77%),_hsl(77,33%,74%))] border-b border-[hsl(77,33%,65%)]"
      >
        <div className="flex w-full max-w-[1440px] mx-auto px-6 xl:px-34 py-6 justify-between md:justify-between items-center">
        <div className="block flex-none md:hidden absolute left-6">
          <Suspense fallback={null}>
            <CartModal />
          </Suspense>
        </div>

        <Link href="/" prefetch={true} className="mx-auto md:mx-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src={logomarkSvg.src}
              alt="Turks logo mark"
              width={28}
              height={28}
              className="h-12 w-12 sm:h-12 sm:w-18"
              priority
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
          </div>
        </Link>

        <div className="block flex-none md:hidden absolute right-6">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {menu.length ? (
            <nav className="flex items-center gap-8 lg:gap-10">
              {menu.map((item: Menu) => (
                <div key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-[#1D431D] text-xl md:text-2xl font-medium leading-[150%]"
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </nav>
          ) : null}
          <Suspense fallback={null}>
            <CartModal />
          </Suspense>
        </div>
      </div>
    </header>
    </>
  );
}
