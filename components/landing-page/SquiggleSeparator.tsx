import React, { useId } from "react";

type Props = {
  color?: string;
  strokeWidth?: number;
  className?: string;
  jitter?: boolean;
};

export function SquiggleSeparator({
  color = "#1D431D",
  strokeWidth = 6,
  className,
  jitter = true,
}: Props) {
  const id = useId();
  const filterIdA = `squiggle-jitter-a-${id}`;
  const filterIdB = `squiggle-jitter-b-${id}`;
  const innerStrokeWidth = Math.max(1, strokeWidth - 2);

  return (
    <svg
      className={className}
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      {jitter && (
        <defs>
          <filter id={filterIdA}>
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
          <filter id={filterIdB}>
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="11" />
            <feDisplacementMap in="SourceGraphic" scale="2.5" />
          </filter>
        </defs>
      )}

      {/* Hand-drawn squiggle: slightly oversized amplitude and dual strokes */}
      <path
        d="M0 40 C 80 5, 160 75, 240 40 S 400 5, 480 40 640 75, 720 40 880 5, 960 40 1120 75, 1200 40"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
        filter={jitter ? `url(#${filterIdA})` : undefined}
      />
      <path
        d="M0 40 C 80 5, 160 75, 240 40 S 400 5, 480 40 640 75, 720 40 880 5, 960 40 1120 75, 1200 40"
        stroke={color}
        strokeWidth={innerStrokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.75}
        filter={jitter ? `url(#${filterIdB})` : undefined}
      />
    </svg>
  );
}


