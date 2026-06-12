import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useBrandingStore } from '@/stores/useBrandingStore';

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: 'auto' | 'low' | 'medium' | 'high';
  noPadding?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, intensity = 'auto', noPadding, children, ...props }, ref) => {
    const glassIntensity = useBrandingStore((s) => s.settings.glassIntensity);
    const level =
      intensity === 'auto'
        ? glassIntensity < 40
          ? 'low'
          : glassIntensity < 70
            ? 'medium'
            : 'high'
        : intensity;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius)] border border-white/20 dark:border-white/10',
          'bg-glass shadow-glass backdrop-blur-glass',
          level === 'low' && 'bg-glass/60 backdrop-blur-sm',
          level === 'high' && 'bg-glass/90 backdrop-blur-xl',
          !noPadding && 'p-4 md:p-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = 'GlassPanel';
