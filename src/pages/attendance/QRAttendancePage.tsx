import { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, MapPin, QrCode, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { GlassCard } from '@/components/glass';
import { DataTable } from '@/components/shared/DataTable';
import { KpiStatCard } from '@/components/shared/KpiStatCard';
import { Button } from '@/components/ui/button';
import { demoUsers, useAuthStore } from '@/stores/useAuthStore';
import { qrPayloadForEmployee, useAttendanceStore, type AttendanceRecord } from '@/stores/useAttendanceStore';

const time = (value?: string) => (value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-');

export function QRAttendancePage() {
  const user = useAuthStore((state) => state.user);
  const records = useAttendanceStore((state) => state.records);
  const scanQrPayload = useAttendanceStore((state) => state.scanQrPayload);
  const qrToken = qrPayloadForEmployee(user.employeeId);
  const summary = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const today = records.filter((record) => record.date === todayKey);
    const expected = demoUsers.filter((demoUser) => demoUser.status === 'Active').length;
    const present = today.filter((record) => record.status.includes('Present')).length;
    const late = today.filter((record) => record.status === 'Late').length;

    return { expected, present, late, notYetIn: Math.max(0, expected - today.length) };
  }, [records]);

  const columns = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'signInTime', header: 'Time In', render: (row: AttendanceRecord) => time(row.signInTime) },
    { key: 'signOutTime', header: 'Time Out', render: (row: AttendanceRecord) => time(row.signOutTime) },
    {
      key: 'status',
      header: 'Status',
      render: (row: AttendanceRecord) => (
        <span className={row.status === 'Late' ? 'font-medium text-[#F59E0B]' : row.status === 'Early Departure' ? 'font-medium text-[#E1332A]' : 'font-medium text-[#247833]'}>
          {row.status}
        </span>
      ),
    },
  ];

  const simulate = () => {
    const result = scanQrPayload(qrToken, 'hr-dashboard-demo');
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  return (
    <ModulePage title="QR Attendance" breadcrumbs={[{ label: 'People & HR' }, { label: 'Attendance & QR' }]}>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <KpiStatCard title="Expected Today" value={summary.expected} icon={QrCode} />
        <KpiStatCard title="Present" value={summary.present} icon={Clock} />
        <KpiStatCard title="Late Arrivals" value={summary.late} icon={Clock} />
        <KpiStatCard title="Not Yet In" value={summary.notYetIn} icon={MapPin} />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <GlassCard className="flex flex-col items-center">
          <h3 className="mb-4 font-semibold">My QR Code</h3>
          <QRCodeSVG value={qrToken} size={160} level="H" />
          <p className="mt-3 text-center text-xs text-muted-foreground">Secure daily token for {user.name}</p>
        </GlassCard>
        <GlassCard className="lg:col-span-2">
          <h3 className="mb-4 font-semibold">Configured Check-In Station</h3>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-brand-primary text-white" onClick={simulate}>
              Simulate QR Scan
            </Button>
            <Button variant="outline" asChild>
              <a href="/scanner" target="_blank" rel="noreferrer">Open Tablet Scanner</a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/hr/settings/attendance">
                <Settings className="h-4 w-4" />
                Attendance Settings
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Scans use the HR-configured work schedule, grace period, early departure threshold, and notification rules.
          </p>
        </GlassCard>
      </div>

      <DataTable columns={columns} data={records} />
    </ModulePage>
  );
}

export function AttendanceKioskPage() {
  return <QRAttendancePage />;
}
