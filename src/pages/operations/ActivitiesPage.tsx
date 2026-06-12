import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable } from '@/components/shared/DataTable';
import { WorkflowStatusBadge } from '@/components/shared/WorkflowStatusBadge';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/api/hooks';
import { Plus } from 'lucide-react';
import type { Activity } from '@/types/ngo';

export function ActivitiesPage() {
  const { data: activities = [] } = useActivities();

  const columns = [
    { key: 'title', header: 'Activity' },
    { key: 'type', header: 'Type' },
    { key: 'date', header: 'Date' },
    { key: 'location', header: 'Location' },
    { key: 'lead', header: 'Lead' },
    {
      key: 'status',
      header: 'Status',
      render: (row: Activity) => <WorkflowStatusBadge status={row.status} />,
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (row: Activity) => `₦${row.budget.toLocaleString()}`,
    },
  ];

  return (
    <ModulePage
      title="Activities"
      breadcrumbs={[{ label: 'Operations' }, { label: 'Activities' }]}
      actions={
        <Button size="sm" className="bg-brand-primary text-white">
          <Plus className="h-4 w-4 mr-1" /> New Activity
        </Button>
      }
    >
      <DataTable columns={columns} data={activities} />
    </ModulePage>
  );
}
