import { motion, useReducedMotion } from 'framer-motion';
import { pageTransition } from '@/design/motion';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { getMotionDuration } from '@/design/motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const animationIntensity = useBrandingStore((s) => s.settings.animationIntensity);
  const duration = getMotionDuration(animationIntensity);

  if (prefersReducedMotion || animationIntensity === 'off' || duration === 0) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}
