'use client';

import React, { useId, useEffect, useRef, useState } from "react";

type Props = {
  color?: string;
  strokeWidth?: number;
  className?: string;
  jitter?: boolean;
  animate?: boolean;
};

export function SquiggleSeparator({
  color = "#1D431D",
  strokeWidth = 6,
  className,
  jitter = true,
  animate = true,
}: Props) {
  const id = useId();
  const filterIdA = `squiggle-jitter-a-${id}`;
  const filterIdB = `squiggle-jitter-b-${id}`;
  const innerStrokeWidth = Math.max(1, strokeWidth - 2);
  
  const [path1, setPath1] = useState("M0 40 C 80 5, 160 75, 240 40 S 400 5, 480 40 640 75, 720 40 880 5, 960 40 1120 75, 1200 40");
  const [path2, setPath2] = useState("M0 40 C 80 5, 160 75, 240 40 S 400 5, 480 40 640 75, 720 40 880 5, 960 40 1120 75, 1200 40");
  const rafRef = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!animate) return;

    let time = 0;
    const animateWave = () => {
      // Faster on mobile (0.016), slower on desktop (0.008)
      time += isMobile ? 0.016 : 0.008;
      
      // Generate wave path with sine functions for smooth, organic movement
      const generatePath = (offset: number, amplitude: number) => {
        const segments: string[] = [];
        
        for (let i = 0; i < 1200; i += 240) {
          // More frequent waves: increased frequency multiplier from 0.005 to 0.012
          const y1 = 40 + Math.sin(time + i * 0.012 + offset) * amplitude;
          const y2 = 40 + Math.sin(time + (i + 80) * 0.012 + offset) * amplitude;
          const y3 = 40 + Math.sin(time + (i + 160) * 0.012 + offset) * amplitude;
          const y4 = 40 + Math.sin(time + (i + 240) * 0.012 + offset) * amplitude;
          
          if (i === 0) {
            segments.push(`M0 ${y1}`);
            segments.push(`C ${80} ${y2}, ${160} ${y3}, ${240} ${y4}`);
          } else {
            segments.push(`S ${i + 160} ${y3}, ${i + 240} ${y4}`);
          }
        }
        
        return segments.join(" ");
      };
      
      // Two paths with different offsets for layered organic movement
      // Bigger amplitude: 28 and 26 (was 20 and 18)
      setPath1(generatePath(0, 28));
      setPath2(generatePath(0.5, 26));
      
      rafRef.current = requestAnimationFrame(animateWave);
    };

    rafRef.current = requestAnimationFrame(animateWave);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate, isMobile]);

  return (
    <svg
      className={className}
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        {jitter && (
          <>
            {/* Static jitter filters */}
            <filter id={filterIdA}>
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="3" />
            </filter>
            <filter id={filterIdB}>
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="11" />
              <feDisplacementMap in="SourceGraphic" scale="2.5" />
            </filter>
          </>
        )}
      </defs>

      {/* Hand-drawn squiggle with animated curves */}
      <path
        d={path1}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
        filter={jitter ? `url(#${filterIdA})` : undefined}
      />
      <path
        d={path2}
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


