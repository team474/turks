'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { colorBlend } from '@/lib/animation'

interface GradientFadeProps {
  gradient: string;
  className?: string;
  animateDrift?: boolean;
}

export function GradientFade({ gradient, className, animateDrift = false }: GradientFadeProps) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ''}`} style={{ zIndex: 0 }}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={gradient}
          className="absolute inset-0"
          style={{ backgroundImage: gradient, backgroundSize: '300% 300%', backgroundRepeat: 'no-repeat', backgroundPositionY: '0%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, ...(!prefersReducedMotion && animateDrift ? { backgroundPositionY: ['0%', '100%', '0%'] } : {}) }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: colorBlend, ease: [0.16, 1, 0.3, 1] },
            backgroundPositionY: !prefersReducedMotion && animateDrift ? { duration: 30, ease: 'linear', repeat: Infinity } : undefined,
          }}
        />
      </AnimatePresence>
    </div>
  );
}


