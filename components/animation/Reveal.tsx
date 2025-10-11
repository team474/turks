"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
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
  amount = 0.25,
}: RevealProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


