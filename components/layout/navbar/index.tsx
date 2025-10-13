"use client";

import CartModal from "components/cart/modal";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import MobileMenu from "./mobile-menu";
import logoSvg from "@/assets/logo.svg";

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className="flex bg-[linear-gradient(to_right,_hsl(77,33%,78%),_hsl(77,33%,76%),_hsl(77,33%,74%))] md:bg-[linear-gradient(to_right,_hsl(77,33%,80%),_hsl(77,33%,77%),_hsl(77,33%,74%))] border-b border-[hsl(77,33%,65%)]"
      >
        <div className="flex w-full max-w-[1440px] mx-auto px-6 xl:px-34 py-6 justify-between md:justify-between items-center">
        <div className="block flex-none md:hidden absolute left-6">
          <Suspense fallback={null}>
            <CartModal />
          </Suspense>
        </div>

        <Link href="/" prefetch={true} className="inline-block mx-auto md:mx-0">
          <div className="w-[80px] md:w-[100px]" style={{ filter: 'invert(20%) sepia(20%) saturate(1500%) hue-rotate(70deg) brightness(40%) contrast(95%)' }}>
            <Image
              src={logoSvg}
              alt="TURK'S"
              width={100}
              height={60}
              className="w-full h-auto"
              priority
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
          <CartModal />
        </div>
      </div>
    </header>

      {/* Free Shipping Badge - Fixed and Floating */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          isScrolled ? 'top-2' : 'top-[85px] md:top-[40px]'
        }`}
      >
        <span className="relative inline-block overflow-hidden bg-[hsl(77,33%,77%)] text-[#374151] text-[10px] md:text-xs font-medium px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-[#374151] shadow-md">
          {/* Shimmer overlay */}
          <motion.span
            {...shimmerAnimationProps}
            className="absolute inset-0 z-0 block rounded-[inherit] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(-75deg, rgba(255,255,255,0) calc(var(--x) + 10%), rgba(255,255,255,0.14) calc(var(--x) + 20%), rgba(255,255,255,0) calc(var(--x) + 90%))',
              mixBlendMode: 'screen',
              opacity: 0.9,
            }}
          />
          <span className="relative z-10">Free shipping on all orders!</span>
        </span>
      </div>
    </>
  );
}
