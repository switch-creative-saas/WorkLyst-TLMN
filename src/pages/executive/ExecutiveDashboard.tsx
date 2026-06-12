import { ModulePage } from '@/components/layout/ModulePage';
import { KpiStatCard } from '@/components/shared/KpiStatCard';
import { GlassCard } from '@/components/glass';
import { programs } from '@/data/ngo/programs';
import { ngoRequests } from '@/data/ngo/requests';
import { employees } from '@/data/employees';
import { attendanceRecords } from '@/data/ngo/finance';
import {
  FolderKanban,
  Wallet,
  Users,
  ClipboardList,
  AlertTriangle,
  CheckSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WorkflowStatusBadge } from '@/components/shared/WorkflowStatusBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TLMN_CHART_SEQUENCE, TLMN_ROLE_ACCENTS } from '@/design/tlmn';

const budgetData = programs.map((p) => ({
  name: p.code,
  utilized: Math.round((p.spent / p.budget) * 100),
}));

const COLORS = TLMN_CHART_SEQUENCE;

export function ExecutiveDashboard() {
  const pendingRequests = ngoRequests.filter((r) => r.status === 'In Review' || r.status === 'Submitted');
  const totalBudget = programs.reduce((s, p) => s + p.budget, 0);
  const totalSpent = programs.reduce((s, p) => s + p.spent, 0);

  return (
    <ModulePage
      title="Executive Dashboard"
      breadcrumbs={[{ label: 'Insights' }, { label: 'Executive Dashboard' }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiStatCard title="Active Programs" value={programs.filter((p) => p.status === 'Active').length} icon={FolderKanban} accentColor={TLMN_ROLE_ACCENTS.nationalDirector} />
        <KpiStatCard
          title="Budget Utilization"
          value={Math.round((totalSpent / totalBudget) * 100)}
          suffix="%"
          icon={Wallet}
          accentColor={TLMN_ROLE_ACCENTS.nationalDirector}
          trend={`₦${(totalSpent / 1e6).toFixed(1)}M of ₦${(totalBudget / 1e6).toFixed(1)}M`}
        />
        <KpiStatCard title="Staff" value={employees.length} icon={Users} accentColor={TLMN_ROLE_ACCENTS.nationalDirector} />
        <KpiStatCard title="Pending Approvals" value={pendingRequests.length} icon={ClipboardList} accentColor={TLMN_ROLE_ACCENTS.nationalDirector} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <GlassCard>
          <h3 className="font-semibold mb-4">Program Budget Utilization</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="utilized" fill={TLMN_ROLE_ACCENTS.nationalDirector} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-4">Program Portfolio</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={programs.map((p) => ({ name: p.code, value: p.budget }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {programs.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `₦${(v / 1e6).toFixed(1)}M`} />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Approval Backlog
            </h3>
            <Button variant="outline" size="sm" asChild>
              <Link to="/requests/approvals">View all</Link>
            </Button>
          </div>
          <ul className="space-y-2">
            {pendingRequests.slice(0, 5).map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
              >
                <span>{r.title}</span>
                <WorkflowStatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Today&apos;s Attendance
          </h3>
          <ul className="space-y-2 text-sm">
            {attendanceRecords.map((a) => (
              <li key={a.id} className="flex justify-between">
                <span>{a.employeeName}</span>
                <span className={a.late ? 'text-[#F59E0B]' : 'text-[#247833]'}>
                  {a.late ? 'Late' : 'Present'}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </ModulePage>
  );
}
