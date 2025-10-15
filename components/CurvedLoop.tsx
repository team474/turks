"use client";

import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useId,
  FC,
  PointerEvent,
} from "react";

interface ResponsivePadding {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  bgColor?: string;
  bgStrokeWidth?: number;
  bgOffsetY?: number;
  autoBalancePadding?: boolean;
  paddingTopOverride?: number | ResponsivePadding;
  paddingBottomOverride?: number | ResponsivePadding;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true,
  bgColor,
  bgStrokeWidth = 80,
  bgOffsetY = -15,
  autoBalancePadding = true,
  paddingTopOverride,
  paddingBottomOverride,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (
      (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0"
    );
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const baseY = 40;
  const pathD = `M-100,${baseY} Q500,${baseY + curveAmount} 1540,${baseY}`;
  const bgPathD = `M-100,${baseY + bgOffsetY} Q500,${baseY + curveAmount + bgOffsetY} 1540,${baseY + bgOffsetY}`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<"left" | "right">(direction);
  const velRef = useRef(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join("")
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current)
      setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute("startOffset", initial + "px");
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const currentOffset = parseFloat(
          textPathRef.current.getAttribute("startOffset") || "0"
        );
        let newOffset = currentOffset + delta;
        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;
        textPathRef.current.setAttribute("startOffset", newOffset + "px");
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  // Helper to resolve responsive padding value
  const getResponsivePadding = (value: number | ResponsivePadding | undefined, autoValue: number): number => {
    if (value === undefined) return autoValue;
    if (typeof value === 'number') return value;
    
    // Responsive object - use media queries
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (width < 768) {
      return value.mobile ?? value.tablet ?? value.desktop ?? autoValue;
    } else if (width < 1024) {
      return value.tablet ?? value.desktop ?? value.mobile ?? autoValue;
    } else {
      return value.desktop ?? value.tablet ?? value.mobile ?? autoValue;
    }
  };

  // Auto-balance vertical padding so inside/outside spacing feels even
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updatePadding = () => {
      if (!containerRef.current) return;
      
      // Calculate auto values
      const basePad = 16;
      const insideExtra = Math.max(
        0,
        Math.abs(curveAmount) * 0.15 + (bgColor ? bgStrokeWidth * 0.2 : 0)
      );
      const autoTop = curveAmount < 0 ? basePad + insideExtra : basePad;
      const autoBottom = curveAmount > 0 ? basePad + insideExtra : basePad;
      
      // Use overrides if provided, otherwise use auto-balance
      let padTop: number;
      let padBottom: number;
      
      if (paddingTopOverride !== undefined || paddingBottomOverride !== undefined) {
        // Manual override mode (supports responsive)
        padTop = getResponsivePadding(paddingTopOverride, autoTop);
        padBottom = getResponsivePadding(paddingBottomOverride, autoBottom);
      } else if (autoBalancePadding) {
        // Auto-balance mode
        padTop = autoTop;
        padBottom = autoBottom;
      } else {
        // No auto-balance and no overrides
        return;
      }
      
      // Handle negative values with margin instead of padding
      if (padTop < 0) {
        containerRef.current.style.marginTop = `${padTop}px`;
        containerRef.current.style.paddingTop = '0px';
      } else {
        containerRef.current.style.paddingTop = `${padTop}px`;
        containerRef.current.style.marginTop = '0px';
      }
      
      if (padBottom < 0) {
        containerRef.current.style.marginBottom = `${padBottom}px`;
        containerRef.current.style.paddingBottom = '0px';
      } else {
        containerRef.current.style.paddingBottom = `${padBottom}px`;
        containerRef.current.style.marginBottom = '0px';
      }
    };
    
    updatePadding();
    
    // Update on window resize for responsive values
    if (typeof paddingTopOverride === 'object' || typeof paddingBottomOverride === 'object') {
      window.addEventListener('resize', updatePadding);
      return () => window.removeEventListener('resize', updatePadding);
    }
  }, [autoBalancePadding, curveAmount, bgStrokeWidth, bgColor, paddingTopOverride, paddingBottomOverride]);

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(
      textPathRef.current.getAttribute("startOffset") || "0"
    );
    let newOffset = currentOffset + dx;
    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;
    textPathRef.current.setAttribute("startOffset", newOffset + "px");
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  const cursorStyle = interactive
    ? dragRef.current
      ? "grabbing"
      : "grab"
    : "auto";

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full transition-opacity duration-500 ease-in-out"
      style={{ 
        cursor: cursorStyle, 
        opacity: ready ? 1 : 0,
        pointerEvents: ready ? 'auto' : 'none'
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="relative select-none w-full overflow-visible block text-[4rem] font-bold uppercase leading-none z-10"
        viewBox="0 0 1440 120"
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        >
          {text}
        </text>
        <defs>
          <path
            ref={pathRef}
            id={pathId}
            d={pathD}
            fill="none"
            stroke="transparent"
          />
        </defs>
        {bgColor && (
          <path
            d={bgPathD}
            fill="none"
            stroke={bgColor}
            strokeWidth={bgStrokeWidth}
            strokeLinecap="round"
          />
        )}
        {ready && (
          <text xmlSpace="preserve" className={`${className || "fill-white"}`}>
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={offset + "px"}
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
