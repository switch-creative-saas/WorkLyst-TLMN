import { ModulePage } from '@/components/layout/ModulePage';
import { GlassCard } from '@/components/glass';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TLMN_CHART_SEQUENCE } from '@/design/tlmn';

const attendanceData = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 91 },
  { month: 'Apr', rate: 95 },
  { month: 'May', rate: 93 },
  { month: 'Jun', rate: 96 },
];

const requestData = [
  { month: 'Jan', submitted: 12, approved: 10 },
  { month: 'Feb', submitted: 18, approved: 15 },
  { month: 'Mar', submitted: 14, approved: 13 },
  { month: 'Apr', submitted: 22, approved: 19 },
  { month: 'May', submitted: 16, approved: 14 },
];

export function AnalyticsPage() {
  return (
    <ModulePage title="Analytics" breadcrumbs={[{ label: 'Analytics' }]}>
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="font-semibold mb-4">Attendance Analytics</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis unit="%" domain={[85, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke={TLMN_CHART_SEQUENCE[0]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-4">Request Analytics</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={requestData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="submitted" stroke={TLMN_CHART_SEQUENCE[2]} />
              <Line type="monotone" dataKey="approved" stroke={TLMN_CHART_SEQUENCE[1]} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </ModulePage>
  );
}
