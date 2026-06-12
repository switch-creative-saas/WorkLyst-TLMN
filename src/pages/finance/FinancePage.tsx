import { ModulePage } from '@/components/layout/ModulePage';
import { GlassCard } from '@/components/glass';
import { KpiStatCard } from '@/components/shared/KpiStatCard';
import { DataTable } from '@/components/shared/DataTable';
import { useBudgetLines } from '@/api/hooks';
import { grants } from '@/data/ngo/finance';
import { Wallet, TrendingUp } from 'lucide-react';
import type { BudgetLine } from '@/types/ngo';
import { TLMN_ROLE_ACCENTS } from '@/design/tlmn';

export function FinancePage() {
  const { data: lines = [] } = useBudgetLines();
  const totalAllocated = lines.reduce((s, l) => s + l.allocated, 0);
  const totalSpent = lines.reduce((s, l) => s + l.spent, 0);

  const columns = [
    { key: 'category', header: 'Category' },
    {
      key: 'allocated',
      header: 'Allocated',
      render: (row: BudgetLine) => `₦${row.allocated.toLocaleString()}`,
    },
    {
      key: 'spent',
      header: 'Spent',
      render: (row: BudgetLine) => `₦${row.spent.toLocaleString()}`,
    },
    {
      key: 'remaining',
      header: 'Remaining',
      render: (row: BudgetLine) => `₦${row.remaining.toLocaleString()}`,
    },
    {
      key: 'util',
      header: '%',
      render: (row: BudgetLine) => `${Math.round((row.spent / row.allocated) * 100)}%`,
    },
  ];

  return (
    <ModulePage title="Finance" breadcrumbs={[{ label: 'Finance' }]}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <KpiStatCard title="Total Allocated" value={Math.round(totalAllocated / 1e6)} suffix="M" prefix="₦" icon={Wallet} accentColor={TLMN_ROLE_ACCENTS.finance} />
        <KpiStatCard title="Total Spent" value={Math.round(totalSpent / 1e6)} suffix="M" prefix="₦" icon={TrendingUp} accentColor={TLMN_ROLE_ACCENTS.finance} />
        <KpiStatCard
          title="Utilization"
          value={Math.round((totalSpent / totalAllocated) * 100)}
          suffix="%"
          accentColor={TLMN_ROLE_ACCENTS.finance}
        />
      </div>
      <DataTable columns={columns} data={lines} />
      <GlassCard className="mt-6">
        <h3 className="font-semibold mb-4">Grant Tracking</h3>
        <ul className="space-y-2 text-sm">
          {grants.map((g) => (
            <li key={g.id} className="flex justify-between border-b border-border/30 pb-2">
              <span>Grant {g.id}</span>
              <span>
                ₦{(g.utilized / 1e6).toFixed(1)}M / ₦{(g.amount / 1e6).toFixed(1)}M (
                {Math.round((g.utilized / g.amount) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </ModulePage>
  );
}

