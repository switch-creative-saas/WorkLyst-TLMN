import { motion } from 'framer-motion';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { cardHover } from '@/design/motion';
import { useBrandingStore } from '@/stores/useBrandingStore';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverable = true, padding = 'md', children, ...props }, ref) => {
    const animationIntensity = useBrandingStore((s) => s.settings.animationIntensity);
    const paddingClass = {
      none: '',
      sm: 'p-3',
      md: 'p-4 md:p-5',
      lg: 'p-6 md:p-8',
    }[padding];

    const Component = animationIntensity !== 'off' && hoverable ? motion.div : 'div';
    const motionProps =
      animationIntensity !== 'off' && hoverable
        ? {
            variants: cardHover,
            initial: 'rest',
            whileHover: 'hover',
            transition: { duration: animationIntensity === 'reduced' ? 0.15 : 0.25 },
          }
        : {};

    return (
      <Component
        ref={ref as never}
        className={cn(
          'rounded-[var(--radius)] border border-white/25 dark:border-white/10',
          'bg-glass shadow-glass backdrop-blur-glass',
          paddingClass,
          className
        )}
        {...motionProps}
        {...(props as object)}
      >
        {children}
      </Component>
    );
  }
);
GlassCard.displayName = 'GlassCard';
