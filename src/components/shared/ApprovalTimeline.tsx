import { CheckCircle2, Circle, XCircle, Clock } from 'lucide-react';
import type { ApprovalStep } from '@/types/ngo';
import { cn } from '@/lib/utils';

interface ApprovalTimelineProps {
  steps: ApprovalStep[];
  className?: string;
}

export function ApprovalTimeline({ steps, className }: ApprovalTimelineProps) {
  return (
    <ol className={cn('space-y-4', className)}>
      {steps.map((step, i) => {
        const Icon =
          step.status === 'Approved'
            ? CheckCircle2
            : step.status === 'Rejected'
              ? XCircle
              : step.status === 'Pending'
                ? Clock
                : Circle;

        return (
          <li key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  step.status === 'Approved' && 'text-green-600',
                  step.status === 'Rejected' && 'text-destructive',
                  step.status === 'Pending' && 'text-amber-500',
                  step.status === 'Skipped' && 'text-muted-foreground'
                )}
              />
              {i < steps.length - 1 && <div className="w-px flex-1 bg-border my-1 min-h-[24px]" />}
            </div>
            <div className="pb-4">
              <p className="font-medium text-sm">{step.role}</p>
              {step.approver && (
                <p className="text-xs text-muted-foreground">{step.approver}</p>
              )}
              {step.date && (
                <p className="text-xs text-muted-foreground">{step.date}</p>
              )}
              {step.comment && (
                <p className="text-sm mt-1 text-muted-foreground">{step.comment}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
