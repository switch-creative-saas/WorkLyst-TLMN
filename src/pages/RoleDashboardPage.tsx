import { useMemo } from 'react';
import { Calendar, CheckSquare, Clock, FileText, Shield, Users, Wallet, type LucideIcon } from 'lucide-react';
import { ModulePage } from '@/components/layout/ModulePage';
import { KpiStatCard } from '@/components/shared/KpiStatCard';
import { GlassCard } from '@/components/glass';
import { EmployeeVoiceWidget } from '@/components/safeguarding/EmployeeVoiceWidget';
import { demoUsers, useAuthStore } from '@/stores/useAuthStore';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { useWorkflowStore } from '@/stores/useWorkflowStore';
import { useUnifiedRequestStore } from '@/stores/useUnifiedRequestStore';

interface DashboardCard {
  title: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  trend?: string;
}

export function RoleDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const attendanceRecords = useAttendanceStore((state) => state.records);
  const pendingForRole = useWorkflowStore((state) => state.pendingForRole);
  const items = useWorkflowStore((state) => state.items);
  const unifiedRequests = useUnifiedRequestStore((state) => state.requests);
  const pending = pendingForRole(user.role);
  const attendanceSummary = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const today = attendanceRecords.filter((record) => record.date === todayKey);
    const expected = demoUsers.filter((demoUser) => demoUser.status === 'Active').length;
    const present = today.filter((record) => record.status.includes('Present')).length;
    const late = today.filter((record) => record.status === 'Late').length;
    const absent = today.filter((record) => record.status === 'Absent').length;

    return { expected, present, late, absent, notYetIn: Math.max(0, expected - today.length) };
  }, [attendanceRecords]);

  const cards: DashboardCard[] = (() => {
    if (user.role === 'Supervisor') {
      return [
        { title: 'Team attendance today', value: attendanceSummary.present, suffix: `/${attendanceSummary.expected}`, icon: Users },
        { title: 'Pending approvals', value: pending.length, icon: CheckSquare },
        { title: 'Team leave calendar', value: 3, trend: 'upcoming', icon: Calendar },
      ];
    }
    if (user.role === 'Finance Officer') {
      return [
        { title: 'Awaiting finance review', value: pending.length, icon: Wallet },
        { title: 'Approved this month', value: 2450000, prefix: 'NGN ', icon: CheckSquare },
        { title: 'Rejected requests', value: items.filter((item) => item.status === 'rejected').length, icon: FileText },
      ];
    }
    if (user.role === 'Audit Officer') {
      return [
        { title: 'Awaiting audit review', value: pending.length, icon: Shield },
        { title: 'Recently reviewed', value: 8, icon: CheckSquare },
        { title: 'Flagged items', value: 2, icon: FileText },
      ];
    }
    if (user.role === 'National Director') {
      return [
        { title: 'Org attendance today', value: attendanceSummary.present, suffix: `/${attendanceSummary.expected}`, icon: Users },
        { title: 'Total pending approvals', value: pending.length, icon: CheckSquare },
        { title: 'Program activity summary', value: 14, trend: 'active', icon: FileText },
        { title: 'Monthly finance summary', value: 9800000, prefix: 'NGN ', icon: Wallet },
      ];
    }
    if (user.role === 'HR Manager' || user.role === 'HR Officer') {
      return [
        { title: 'Total staff count', value: attendanceSummary.expected, icon: Users },
        { title: 'Present today', value: attendanceSummary.present, trend: `${attendanceSummary.late} late`, icon: Clock },
        { title: 'Pending onboarding', value: 4, icon: CheckSquare },
        { title: 'Leave requests pending', value: pending.length, icon: Calendar },
      ];
    }
    if (user.role === 'Program Lead' || user.role === 'Program Officer') {
      return [
        { title: 'Active requests', value: unifiedRequests.filter((request) => request.status !== 'Rejected' && request.status !== 'Disbursed').length, icon: FileText },
        { title: 'Activity reports', value: items.filter((item) => item.type === 'activity_report').length, icon: FileText },
        { title: 'Pending approvals', value: pending.length, icon: CheckSquare },
        { title: 'Attendance records today', value: attendanceSummary.present, icon: Clock },
      ];
    }
    return [
      { title: "This week's timesheets", value: items.filter((item) => item.type === 'timesheet').length, icon: Clock },
      { title: "Today's attendance", value: attendanceSummary.present, icon: CheckSquare },
      { title: 'Pending leave requests', value: items.filter((item) => item.type === 'leave').length, icon: Calendar },
      { title: 'Recent request statuses', value: items.length, icon: FileText },
    ];
  })();

  return (
    <ModulePage title={`${user.role} Dashboard`} breadcrumbs={[{ label: 'Dashboard' }]}>
      <GlassCard className="mb-6 border-brand-primary/20 bg-brand-primary/5">
        <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {user.department} - {user.designation}
        </p>
      </GlassCard>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <KpiStatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            prefix={card.prefix}
            suffix={card.suffix}
            trend={card.trend}
          />
        ))}
      </div>
      <EmployeeVoiceWidget />
    </ModulePage>
  );
}
