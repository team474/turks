'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { gradientAround, mixWithBlack } from '@/lib/color'
import { BorderBeam } from '@/components/ui/border-beam'
import { listItem, listStagger, colorBlend } from '@/lib/animation'

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

// color helpers now imported from lib/color

export function StrainMetaCard({ name, colorHex, effects, terpenes, className }: StrainMetaCardProps) {
  const backgroundGradient = gradientAround(colorHex || '#FFFFFF', 15);
  const borderColor = mixWithBlack(colorHex || '#FFFFFF', 12);
  const wrapperStyle: React.CSSProperties & { ['--primary']?: string } = {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor,
    background: backgroundGradient,
    ['--primary']: borderColor,
  };

  const animationProps: {
    initial: Record<'--x', string>;
    animate: Record<'--x', string>;
    transition: {
      repeat: number;
      repeatType: 'loop';
      repeatDelay: number;
      type: 'spring';
      stiffness: number;
      damping: number;
      mass: number;
    };
  } = {
    initial: { ['--x']: '100%' },
    animate: { ['--x']: '-100%' },
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
    <motion.div
      className={`relative overflow-hidden flex gap-1 sm:gap-1.5 rounded-2xl w-full min-h-[135px] sm:min-h-[176px] p-2 sm:p-3 hover:shadow-lg transition-all duration-300 ease-out ${className ?? ''}`}
      style={wrapperStyle}
      animate={{ borderColor }}
      transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Shimmer overlay across the entire card surface */}
      <motion.span
        {...animationProps}
        className="absolute inset-0 z-0 block rounded-[inherit] pointer-events-none"
        style={{
          // Light sheen that brightens instead of darkening
          backgroundImage:
            'linear-gradient(-75deg, rgba(255,255,255,0) calc(var(--x) + 10%), rgba(255,255,255,0.14) calc(var(--x) + 20%), rgba(255,255,255,0) calc(var(--x) + 90%))',
          mixBlendMode: 'screen',
          opacity: 0.9,
        }}
      />
      {/* Two subtle beams, same direction, opposite starting positions */}
      <>
        <BorderBeam
          size={140}
          duration={10}
          borderWidth={0.75}
          initialOffset={0}
          colorFrom={mixWithBlack(borderColor, 28)}
          colorTo={mixWithBlack(borderColor, 55)}
          style={{ opacity: 0.55 }}
        />
        <BorderBeam
          size={140}
          duration={10}
          borderWidth={0.75}
          initialOffset={50}
          colorFrom={mixWithBlack(borderColor, 28)}
          colorTo={mixWithBlack(borderColor, 55)}
          style={{ opacity: 0.55 }}
        />
      </>
      <div className="relative z-10 flex w-full gap-1 sm:gap-1.5">
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`effects-${name}`} className="flex flex-col gap-4 items-start" variants={listStagger} initial="initial" animate="animate" exit="exit">
            {effects.map((item, index) => (
              <motion.div key={index} className="flex items-center gap-2" variants={listItem}>
                <p className="text-sm sm:text-lg font-normal leading-[150%] text-center text-[#101010]">
                  {item}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="w-px self-center h-[70%] bg-[#1010101A]"></span>

      <div className="flex p-2 sm:p-4 flex-col items-start gap-3 sm:gap-4 flex-1">
        <p className="text-sm sm:text-lg font-bold leading-[120%] uppercase text-[#101010]">
          Flavors
        </p>
        <span className="w-full h-px min-h-px bg-[#1010101A]"></span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`terpenes-${name}`} className="flex flex-col gap-4 items-start" variants={listStagger} initial="initial" animate="animate" exit="exit">
            {terpenes.map((item, index) => (
              <motion.div key={index} className="flex items-center gap-2" variants={listItem}>
                <p className="text-sm sm:text-lg font-normal leading-[150%] text-center text-[#101010]">
                  {item}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </motion.div>
  );
}


