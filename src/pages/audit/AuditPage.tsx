import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useAuditItems } from '@/api/hooks';
import type { AuditItem } from '@/types/ngo';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const auditStatusColor: Record<AuditItem['status'], string> = {
  'Pending Review': 'bg-amber-100 text-amber-800',
  Clarification: 'bg-[#82154F]/10 text-[#82154F]',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Escalated: 'bg-purple-100 text-purple-800',
};

export function AuditPage() {
  const { data: items = [] } = useAuditItems();

  const columns = [
    { key: 'title', header: 'Item' },
    { key: 'entityType', header: 'Type' },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: AuditItem) => (row.amount ? `₦${row.amount.toLocaleString()}` : '—'),
    },
    { key: 'submittedBy', header: 'Submitted By' },
    {
      key: 'status',
      header: 'Status',
      render: (row: AuditItem) => (
        <Badge variant="outline" className={cn('border-0', auditStatusColor[row.status])}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">
            Approve
          </Button>
          <Button variant="ghost" size="sm">
            Clarify
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ModulePage title="Audit" breadcrumbs={[{ label: 'Audit' }]}>
      <DataTable columns={columns} data={items} />
    </ModulePage>
  );
}

