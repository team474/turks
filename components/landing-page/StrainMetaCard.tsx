'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { gradientAround, mixWithBlack, saturateHex } from '@/lib/color'
import { BorderBeam } from '@/components/ui/border-beam'
import { listItem, listStagger, colorBlend } from '@/lib/animation'

interface StrainMetaCardProps {
  name: string;
  colorHex?: string | null;
  effects: string[];
  terpenes: string[];
  description?: string;
  className?: string;
  concentration?: string | null;
  flavors?: string[];
}

export function StrainMetaCard({
  name,
  colorHex,
  effects,
  terpenes,
  description,
  className,
  concentration,
  flavors,
}: StrainMetaCardProps) {

  const backgroundGradient = gradientAround(colorHex || "#FFFFFF", 15);
  const borderColor = mixWithBlack(colorHex || "#FFFFFF", 12);
  const base = colorHex || "#1D431D";
  const textColor = saturateHex(mixWithBlack(base, 82), 45); // Darker for better contrast
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
      className={`relative overflow-hidden flex gap-1 sm:gap-1.5 rounded-2xl w-full min-h-[180px] sm:min-h-[240px] p-2 sm:p-3 hover:shadow-lg transition-all duration-300 ease-out ${className ?? ''}`}
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
      {/* Two subtle beams, reversed direction, opposite starting positions */}
      <>
        <BorderBeam
          size={140}
          duration={10}
          borderWidth={0.75}
          initialOffset={0}
          colorFrom={mixWithBlack(borderColor, 28)}
          colorTo={mixWithBlack(borderColor, 55)}
          style={{ opacity: 0.55 }}
          reverse={true}
        />
        <BorderBeam
          size={140}
          duration={10}
          borderWidth={0.75}
          initialOffset={50}
          colorFrom={mixWithBlack(borderColor, 28)}
          colorTo={mixWithBlack(borderColor, 55)}
          style={{ opacity: 0.55 }}
          reverse={true}
        />
      </>
      <div className="relative z-10 flex flex-col w-full gap-3 sm:gap-4">
        {/* Top section with strain info, effects, and flavors */}
        <div className="flex w-full gap-1 sm:gap-1.5">
          <div
            className="relative flex p-4 sm:p-10 justify-center items-center gap-2.5 flex-1 rounded-2xl font-medium uppercase"
            style={{ background: "transparent" }}
          >
            <motion.p
              className="text-xs sm:text-sm font-semibold absolute top-2.5 left-2.5"
              animate={{ color: textColor }}
              transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
            >
              Hybrid
            </motion.p>
            <motion.p
              className="text-xs sm:text-sm font-semibold absolute bottom-2.5 right-2.5"
              animate={{ color: textColor }}
              transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
            >
              {name}
            </motion.p>
            <div className="flex items-baseline gap-1.5">
              <motion.p
                className="text-[32px] sm:text-[44px] leading-[120%] font-bold"
                animate={{ color: textColor }}
                transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
              >
                {concentration || "23.4"}
              </motion.p>
              <motion.p
                className="text-xs sm:text-sm font-semibold"
                animate={{ color: textColor }}
                transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
              >
                THC
              </motion.p>
            </div>
          </div>
          <span className="w-px self-center h-[70%] bg-[#1010101A]"></span>

          <div className="flex p-2 sm:p-4 flex-col items-start gap-3 sm:gap-4 flex-1">
            <motion.p
              className="text-sm sm:text-lg font-bold leading-[120%] uppercase"
              animate={{ color: textColor }}
              transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
            >
              Effects
            </motion.p>
            <span className="w-full h-px min-h-px bg-[#1010101A]"></span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`effects-${name}`}
                className="flex flex-col gap-4 items-start"
                variants={listStagger}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {effects.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    variants={listItem}
                  >
                    <motion.p
                      className="text-sm sm:text-lg font-normal leading-[150%] text-center"
                      animate={{ color: textColor }}
                      transition={{
                        duration: colorBlend,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {item}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="w-px self-center h-[70%] bg-[#1010101A]"></span>

          <div className="flex p-2 sm:p-4 flex-col items-start gap-3 sm:gap-4 flex-1">
            <motion.p
              className="text-sm sm:text-lg font-bold leading-[120%] uppercase"
              animate={{ color: textColor }}
              transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
            >
              Flavors
            </motion.p>
            <span className="w-full h-px min-h-px bg-[#1010101A]"></span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`flavors-${name}`}
                className="flex flex-col gap-4 items-start"
                variants={listStagger}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {flavors?.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    variants={listItem}
                  >
                    <motion.p
                      className="text-sm sm:text-lg font-normal leading-[150%] text-center"
                      animate={{ color: textColor }}
                      transition={{
                        duration: colorBlend,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {item}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
          <span className="w-full h-px min-h-px bg-[#1010101A]"></span>
        <div className="flex py-1 sm:py-2 px-2 sm:px-4 items-center gap-3 sm:gap-4 flex-1">
          <motion.p
            className="text-sm sm:text-lg font-bold leading-[120%] uppercase"
            animate={{ color: textColor }}
            transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
          >
            Terpenes
          </motion.p>
          <span className="w-px self-center h-[70%] bg-[#1010101A]"></span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`terpenes-${name}`}
              className="flex gap-2 sm:gap-3 items-center"
              variants={listStagger}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {terpenes?.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3"
                  variants={listItem}
                >
                  <motion.p
                    className="text-sm sm:text-lg font-normal leading-[150%] text-center"
                    animate={{ color: textColor }}
                    transition={{
                      duration: colorBlend,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {item}
                  </motion.p>
                  {index < terpenes.length - 1 && (
                    <motion.span
                      className="w-1 h-1 rounded-full"
                      animate={{ backgroundColor: textColor }}
                      transition={{
                        duration: colorBlend,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Description section below with divider */}
        {description && (
          <>
            <span className="w-full h-px bg-[#1010101A]"></span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`description-${name}`}
                className="px-2 sm:px-4 pb-2 sm:pb-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, color: textColor }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="text-sm sm:text-base font-normal leading-[150%]"
                  dangerouslySetInnerHTML={{ __html: description }}
                  suppressHydrationWarning
                />
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}


