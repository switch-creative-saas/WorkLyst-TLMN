import { GlassCard } from '@/components/glass';
import { AnimatedCounter } from '@/components/motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiStatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
  accentColor?: string;
}

export function KpiStatCard({
  title,
  value,
  suffix,
  prefix,
  icon: Icon,
  trend,
  className,
  accentColor = '#82154F',
}: KpiStatCardProps) {
  return (
    <GlassCard className={cn('', className)} padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">
            <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
          </p>
          {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg p-2" style={{ backgroundColor: `${accentColor}1A` }}>
            <Icon className="h-5 w-5" style={{ color: accentColor }} />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
