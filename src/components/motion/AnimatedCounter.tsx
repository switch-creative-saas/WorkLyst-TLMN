import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useBrandingStore } from '@/stores/useBrandingStore';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const animationIntensity = useBrandingStore((s) => s.settings.animationIntensity);
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (v) =>
    `${prefix}${v.toFixed(decimals)}${suffix}`
  );
  const [text, setText] = useState(`${prefix}${value.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (prefersReducedMotion || animationIntensity === 'off') {
      setText(`${prefix}${value.toFixed(decimals)}${suffix}`);
      return;
    }
    spring.set(value);
    const unsub = display.on('change', (v) => setText(v));
    return () => unsub();
  }, [value, spring, display, prefix, suffix, decimals, prefersReducedMotion, animationIntensity]);

  if (prefersReducedMotion || animationIntensity === 'off') {
    return <span className={className}>{text}</span>;
  }

  return <motion.span className={className}>{text}</motion.span>;
}
