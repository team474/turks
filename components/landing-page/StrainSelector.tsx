
'use client'

import { mixWithWhite, mixWithBlack } from '@/lib/color'
import { motion } from 'framer-motion'

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
}

export function StrainSelector({ title = 'Select Strain', items, selectedName, onSelect, className }: StrainSelectorProps) {

  return (
    <div className={`flex flex-col items-start gap-4 w-full ${className ?? ''}`} role="radiogroup" aria-label={title}>
      <p className="text-lg sm:text-2xl font-bold leading-[120%] uppercase text-[#101010]">
        {title}
      </p>
      <div className="flex items-start gap-2.5 sm:gap-4 flex-wrap">
        {items.map((item, index) => {
          const isSelected = selectedName === item.name;
          const baseColor = item.color || '#FFFFFF';
          const backgroundColor = isSelected ? mixWithWhite(baseColor, 15) : baseColor;
          const borderColor = mixWithBlack(backgroundColor, 12);
          const circleColor = isSelected ? mixWithBlack(baseColor, 40) : borderColor;
          return (
            <motion.button
              key={`${item.name}-${index}`}
              onClick={() => onSelect(item.name)}
              style={{ backgroundColor, border: `1px solid ${borderColor}` }}
              className={`flex px-3.5 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3 items-center rounded-full transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:brightness-105`}
              role="radio"
              aria-checked={isSelected}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className="relative flex items-center justify-center size-4 sm:size-6 rounded-full"
                style={{ backgroundColor: circleColor }}
              >
                {isSelected && (
                  <span className="block size-2 sm:size-3 rounded-full bg-white/70" />
                )}
              </span>
              <p className="text-sm sm:text-lg font-medium leading-[150%] text-[#202020]">
                {item.name}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}


