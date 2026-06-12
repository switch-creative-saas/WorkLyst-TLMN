import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable } from '@/components/shared/DataTable';
import { WorkflowStatusBadge } from '@/components/shared/WorkflowStatusBadge';
import { GlassCard } from '@/components/glass';
import { useTimesheets } from '@/api/hooks';
import type { TimesheetWeek } from '@/types/ngo';

export function TimesheetsPage() {
  const { data: timesheets = [] } = useTimesheets();

  const columns = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'weekStart', header: 'Week' },
    { key: 'totalHours', header: 'Hours' },
    {
      key: 'allocations',
      header: 'Program Allocation',
      render: (row: TimesheetWeek) =>
        row.allocations.map((a) => `${a.program}: ${a.hours}h`).join(', '),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: TimesheetWeek) => <WorkflowStatusBadge status={row.status} />,
    },
  ];

  return (
    <ModulePage
      title="Timesheet Management"
      breadcrumbs={[{ label: 'People & HR' }, { label: 'Timesheets' }]}
    >
      <GlassCard className="mb-4" padding="sm">
        <p className="text-sm text-muted-foreground">
          Weekly timesheets with program/project allocation, supervisor and finance approval lanes.
        </p>
      </GlassCard>
      <DataTable columns={columns} data={timesheets} />
    </ModulePage>
  );
}
