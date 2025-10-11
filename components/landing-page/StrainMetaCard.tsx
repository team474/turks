'use client'

import { motion } from 'framer-motion'

interface StrainMetaCardProps {
  name: string;
  colorHex?: string | null;
  effects: string[];
  terpenes: string[];
  className?: string;
}

function generateShortName(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  if (words.length === 1) {
    const w = words[0];
    return (w?.slice(0, 3) || "").toUpperCase().padEnd(3, "_");
  }

  if (words.length === 2) {
    const first = words[0]?.[0] ?? "";
    const second = words[1]?.slice(0, 2) ?? "";
    return (first + second).toUpperCase();
  }

  return words
    .slice(0, 3)
    .map((w) => w?.[0] ?? "")
    .join("")
    .toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  let h = hex.trim();
  if (h[0] === '#') h = h.slice(1);
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixWithWhite(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const p = Math.max(0, Math.min(100, percent)) / 100;
  const r = rgb.r + (255 - rgb.r) * p;
  const g = rgb.g + (255 - rgb.g) * p;
  const b = rgb.b + (255 - rgb.b) * p;
  return rgbToHex(r, g, b);
}

function mixWithBlack(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const p = Math.max(0, Math.min(100, percent)) / 100;
  const r = rgb.r * (1 - p);
  const g = rgb.g * (1 - p);
  const b = rgb.b * (1 - p);
  return rgbToHex(r, g, b);
}

function gradientAround(hex: string): string {
  const base = hex || '#FFFFFF';
  const light = mixWithWhite(base, 15);
  const dark = mixWithBlack(base, 15);
  return `linear-gradient(180deg, ${light} 0%, ${base} 50%, ${dark} 100%)`;
}

export function StrainMetaCard({ name, colorHex, effects, terpenes, className }: StrainMetaCardProps) {
  const backgroundGradient = gradientAround(colorHex || '#FFFFFF');
  const borderColor = mixWithBlack(colorHex || '#FFFFFF', 12);

  return (
    <motion.div
      className={`flex gap-1 sm:gap-1.5 rounded-2xl w-full min-h-[135px] sm:min-h-[176px] p-2 sm:p-3 hover:shadow-lg transition-all duration-300 ease-out ${className ?? ''}`}
      style={{ backgroundImage: backgroundGradient, backgroundSize: '300% 300%', backgroundPositionY: '0%', backgroundRepeat: 'no-repeat', border: `1px solid ${borderColor}` }}
      animate={{ backgroundPositionY: ['0%', '100%', '0%'] }}
      transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
    >
      <div className="relative flex p-4 sm:p-10 justify-center items-center gap-2.5 flex-1 rounded-2xl font-medium uppercase text-[#202020]" style={{ background: 'transparent' }}>
        <p className="text-xs sm:text-sm font-semibold absolute top-2.5 left-2.5">Hybrid</p>
        <p className="text-xs sm:text-sm font-semibold absolute bottom-2.5 right-2.5">{name}</p>
        <p className="text-[32px] sm:text-[44px] leading-[120%]">{generateShortName(name)}</p>
      </div>
      <span className="w-px self-center h-[70%] bg-[#1010101A]"></span>

      <div className="flex p-2 sm:p-4 flex-col items-start gap-3 sm:gap-4 flex-1">
        <p className="text-sm sm:text-lg font-bold leading-[120%] uppercase text-[#101010]">
          Effects
        </p>
        <span className="w-full h-px min-h-px bg-[#1010101A]"></span>
        <div className="flex flex-col gap-4 items-start">
          {effects.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <p className="text-sm sm:text-lg font-normal leading-[150%] text-center text-[#101010]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
      <span className="w-px self-center h-[70%] bg-[#1010101A]"></span>

      <div className="flex p-2 sm:p-4 flex-col items-start gap-3 sm:gap-4 flex-1">
        <p className="text-sm sm:text-lg font-bold leading-[120%] uppercase text-[#101010]">
          Terpenes
        </p>
        <span className="w-full h-px min-h-px bg-[#1010101A]"></span>
        <div className="flex flex-col gap-4 items-start">
          {terpenes.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <p className="text-sm sm:text-lg font-normal leading-[150%] text-center text-[#101010]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


