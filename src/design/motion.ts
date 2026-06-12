import type { Variants, Transition } from 'framer-motion';

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.01, y: -2 },
};

export const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export function getMotionDuration(intensity: 'off' | 'reduced' | 'full'): number {
  switch (intensity) {
    case 'off':
      return 0;
    case 'reduced':
      return 0.15;
    default:
      return 0.3;
  }
}
