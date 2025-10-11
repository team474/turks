"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "#000000"
   */
  shineColor?: string | string[]
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          border: "var(--border-width) solid transparent",
          backgroundImage: `linear-gradient(#0000, #0000), radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          backgroundSize: "300% 300%, 300% 300%",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-shine animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] z-10",
        className
      )}
      {...props}
    />
  )
}
