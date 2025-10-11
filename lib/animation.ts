export const motionDurations = {
  fast: 0.18,
  normal: 0.25,
  slow: 0.4,
};

export const motionEasings = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const crossfadeScale = {
  initial: { opacity: 0, scale: 0.98, y: 6 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: motionDurations.normal, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -6,
    transition: { duration: motionDurations.normal, ease: motionEasings.inOut },
  },
};

export const listStagger = {
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

export const listItem = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.fast, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: motionDurations.fast, ease: motionEasings.inOut },
  },
};

export const fadeOnly = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: motionDurations.normal, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: motionDurations.normal, ease: motionEasings.inOut },
  },
};

// Unified color/gradient blend duration (seconds)
export const colorBlend = 0.6;


// Slower, directional variants for section reveals
export const slowUp = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.4, ease: motionEasings.inOut },
  },
};

export const slowDown = {
  initial: { opacity: 0, y: -24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.4, ease: motionEasings.inOut },
  },
};

export const slowLeft = {
  initial: { opacity: 0, x: 24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.4, ease: motionEasings.inOut },
  },
};

export const slowRight = {
  initial: { opacity: 0, x: -24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    x: 8,
    transition: { duration: 0.4, ease: motionEasings.inOut },
  },
};


