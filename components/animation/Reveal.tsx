"use client";

import * as React from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { crossfadeScale } from "@/lib/animation";

type RevealProps = {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  once?: boolean;
  amount?: number;
};

export function Reveal({
  children,
  variants = crossfadeScale,
  className,
  once = true,
  amount = 0.3,
}: RevealProps) {
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  React.useEffect(() => {
    // Small delay to ensure smooth hydration, especially important on mobile
    // This prevents the flash from opacity:0 during hydration
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 50); // Small delay to prevent hydration flash on mobile

    return () => clearTimeout(timer);
  }, []);

  // During SSR and initial hydration, render without motion to prevent flicker
  if (!shouldAnimate) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        variants={variants}
        initial="initial"
        whileInView="animate"
        viewport={{ once, amount, margin: "0px 0px -5% 0px" }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}


