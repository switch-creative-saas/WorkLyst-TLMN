import { Link, useParams } from 'react-router-dom';
import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/glass';
import { ApprovalTimeline } from '@/components/shared/ApprovalTimeline';
import { Button } from '@/components/ui/button';
import { usePrograms, useProgram } from '@/api/hooks';
import { projects } from '@/data/ngo/programs';
import { Plus } from 'lucide-react';
import type { Program } from '@/types/ngo';

function formatCurrency(n: number) {
  return `₦${(n / 1e6).toFixed(2)}M`;
}

export function ProgramsListPage() {
  const { data: programs = [], isLoading } = usePrograms();

  const columns = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Program' },
    {
      key: 'status',
      header: 'Status',
      render: (row: Program) => (
        <Badge variant="outline" className="border-0 bg-brand-primary/10 text-brand-primary">
          {row.status}
        </Badge>
      ),
    },
    { key: 'donor', header: 'Donor' },
    {
      key: 'budget',
      header: 'Budget',
      render: (row: Program) => formatCurrency(row.budget),
    },
    {
      key: 'utilization',
      header: 'Utilization',
      render: (row: Program) => `${Math.round((row.spent / row.budget) * 100)}%`,
    },
    {
      key: 'actions',
      header: '',
      render: (row: Program) => (
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/operations/programs/${row.id}`}>View</Link>
        </Button>
      ),
    },
  ];

  return (
    <ModulePage
      title="Programs & Projects"
      breadcrumbs={[{ label: 'Operations' }, { label: 'Programs' }]}
      actions={
        <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
          <Plus className="h-4 w-4 mr-1" /> New Program
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <DataTable columns={columns} data={programs} />
      )}
    </ModulePage>
  );
}

export function ProgramDetailPage() {
  const { programId } = useParams();
  const { data: program } = useProgram(programId ?? '');
  const progProjects = projects.filter((p) => p.programId === programId);

  if (!program) {
    return (
      <ModulePage title="Program" breadcrumbs={[{ label: 'Programs' }]}>
        <p>Program not found</p>
      </ModulePage>
    );
  }

  return (
    <ModulePage
      title={program.name}
      breadcrumbs={[
        { label: 'Programs', href: '/operations/programs' },
        { label: program.code },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h3 className="font-semibold mb-2">Overview</h3>
          <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Manager</dt>
              <dd className="font-medium">{program.manager}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="font-medium">{program.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Donor</dt>
              <dd className="font-medium">{program.donor}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Period</dt>
              <dd className="font-medium">
                {program.startDate} – {program.endDate}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Budget</dt>
              <dd className="font-medium">{formatCurrency(program.budget)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Spent</dt>
              <dd className="font-medium">
                {formatCurrency(program.spent)} (
                {Math.round((program.spent / program.budget) * 100)}%)
              </dd>
            </div>
          </dl>
          <h4 className="font-medium mt-6 mb-2">Projects</h4>
          <ul className="space-y-2">
            {progProjects.map((p) => (
              <li key={p.id} className="text-sm border-b border-border/30 pb-2">
                {p.name} — {p.indicators} indicators
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-4">Approval History</h3>
          <ApprovalTimeline
            steps={[
              { id: '1', role: 'Program Director', status: 'Approved', date: program.startDate },
              { id: '2', role: 'Finance', status: 'Approved', date: program.startDate },
              { id: '3', role: 'National Director', status: 'Approved', date: program.startDate },
            ]}
          />
        </GlassCard>
      </div>
    </ModulePage>
  );
}
