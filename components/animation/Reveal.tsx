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
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        variants={variants}
        initial="initial"
        whileInView="animate"
        viewport={{ once, amount, margin: "0px 0px -5% 0px" }}
        className={className}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}


