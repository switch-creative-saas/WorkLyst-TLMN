import { Badge } from '@/components/ui/badge';
import type { ApprovalStatus } from '@/types/ngo';
import { cn } from '@/lib/utils';

const statusStyles: Record<ApprovalStatus, string> = {
  Draft: 'bg-muted text-muted-foreground',
  Submitted: 'bg-[#00578A]/10 text-[#00578A]',
  'In Review': 'bg-[#82154F]/10 text-[#82154F]',
  'Revision Requested': 'bg-[#F59E0B]/15 text-[#92400E]',
  Approved: 'bg-[#247833]/10 text-[#247833]',
  Rejected: 'bg-[#E1332A]/10 text-[#E1332A]',
  Cancelled: 'bg-gray-100 text-gray-600',
};

export function WorkflowStatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge variant="outline" className={cn('border-0 font-medium', statusStyles[status])}>
      {status}
    </Badge>
  );
}
