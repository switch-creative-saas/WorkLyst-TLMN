import { cn } from '@/lib/utils';

interface GlassSkeletonProps {
  className?: string;
  lines?: number;
}

export function GlassSkeleton({ className, lines = 3 }: GlassSkeletonProps) {
  return (
    <div className={cn('space-y-3 animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-md bg-muted/60"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function GlassCardSkeleton() {
  return (
    <div className="rounded-[var(--radius)] border border-white/20 bg-glass/50 p-5 backdrop-blur-glass animate-pulse">
      <div className="mb-4 h-6 w-1/3 rounded-md bg-muted/60" />
      <GlassSkeleton lines={4} />
    </div>
  );
}
