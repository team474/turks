export const motionDurations = {
  fast: 0.18,
  normal: 0.25,
  slow: 0.4,
};

export const motionEasings = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// Hero-specific fade duration to match image crossfade
export const heroFadeDuration = 1.1;
// Text transitions in Hero should be faster: one-third of image fade
export const heroTextFadeDuration = heroFadeDuration / 3;

export const heroFade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: heroTextFadeDuration, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: heroTextFadeDuration, ease: motionEasings.inOut },
  },
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
export const slowDuration = 0.8;
export const slowUp = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: slowDuration, ease: motionEasings.out, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.5, ease: motionEasings.inOut },
  },
};

export const slowDown = {
  initial: { opacity: 0, y: -24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: slowDuration, ease: motionEasings.out, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.5, ease: motionEasings.inOut },
  },
};

export const slowLeft = {
  initial: { opacity: 0, x: 24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: slowDuration, ease: motionEasings.out, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.5, ease: motionEasings.inOut },
  },
};

export const slowRight = {
  initial: { opacity: 0, x: -24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: slowDuration, ease: motionEasings.out, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    x: 8,
    transition: { duration: 0.5, ease: motionEasings.inOut },
  },
};

// Hero stagger for initial mount
export const heroStagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

export const heroChild = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: slowDuration, ease: motionEasings.out },
  },
};

// Slower list item reveal for cards
export const listItemSlow = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.25, ease: motionEasings.inOut },
  },
};


