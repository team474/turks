
'use client'

import { mixWithBlack, saturateHex, gradientAround } from '@/lib/color'
import { motion, AnimatePresence } from 'framer-motion'

interface StrainSelectorItem {
  name: string;
  color: string;
}

interface StrainSelectorProps {
  title?: string;
  items: StrainSelectorItem[];
  selectedName?: string | null;
  onSelect: (name: string) => void;
  className?: string;
  titleColor?: string;
}

export function StrainSelector({ title = 'Select Strain', items, selectedName, onSelect, className, titleColor }: StrainSelectorProps) {

  return (
    <div className={`flex flex-col items-center sm:items-start gap-4 w-full ${className ?? ''}`} role="radiogroup" aria-label={title}>
      <motion.p 
        className="text-lg sm:text-2xl font-bold leading-[120%] uppercase text-center sm:text-left"
        animate={{ color: titleColor || '#101010' }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {title}
      </motion.p>
      <div className="grid grid-cols-[max-content_max-content] justify-center gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:justify-start sm:gap-4 w-full">
        {items.slice(0, 6).map((item, index) => {
          const isSelected = selectedName === item.name;
          const baseColor = item.color || '#FFFFFF';
          const gradientIntensity = isSelected ? 8 : 5;
          const backgroundGradient = gradientAround(baseColor, gradientIntensity);
          const borderColor = mixWithBlack(baseColor, 12);
          // StrainsInfo color system
          const panelDarker = mixWithBlack(baseColor, 27);
          const saturated = saturateHex(panelDarker, 30); // "saturated"
          const saturatedDark = saturateHex(mixWithBlack(baseColor, 68), 38); // "saturated dark"
          // Circle ring = saturated dark when selected; otherwise use control border
          const circleColor = isSelected ? saturatedDark : borderColor;
          return (
            <motion.button
              key={`${item.name}-${index}`}
              onClick={() => onSelect(item.name)}
              style={{ background: backgroundGradient, border: `1px solid ${borderColor}` }}
              className={`flex px-3.5 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3 items-center rounded-full transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:brightness-105`}
              role="radio"
              aria-checked={isSelected}
              animate={{ borderColor }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="relative flex items-center justify-center size-4 sm:size-6 rounded-full"
                animate={{ backgroundColor: circleColor }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnimatePresence initial={false} mode="wait">
                  {isSelected && (
                    <motion.span
                      key="selected-dot"
                      className="block size-2 sm:size-3 rounded-full"
                      style={{ backgroundColor: saturated }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </AnimatePresence>
              </motion.span>
              <p className="text-sm sm:text-lg font-medium leading-[150%] text-[#202020] whitespace-nowrap">
                {item.name}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}


