export const defaultBrandColors = {
  primary: '217 91% 45%',
  secondary: '199 89% 38%',
  accent: '142 71% 40%',
} as const;

export const glassIntensityMap = {
  low: { blur: '8px', opacity: 0.65, border: 0.12 },
  medium: { blur: '12px', opacity: 0.75, border: 0.18 },
  high: { blur: '16px', opacity: 0.85, border: 0.22 },
} as const;

export const animationIntensityMap = {
  off: { duration: 0, scale: 1 },
  reduced: { duration: 0.15, scale: 1.01 },
  full: { duration: 0.3, scale: 1.02 },
} as const;

export const radiusScaleMap = {
  sm: '0.375rem',
  md: '0.625rem',
  lg: '0.875rem',
  xl: '1.25rem',
} as const;
