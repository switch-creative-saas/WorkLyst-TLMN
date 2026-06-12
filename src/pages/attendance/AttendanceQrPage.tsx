import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, Download, Printer, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/glass';
import { useAttendanceStore, type AttendanceRecord, type AttendanceStatus } from '@/stores/useAttendanceStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { cn } from '@/lib/utils';

const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const monthKey = (date = new Date()) => localDateKey(date).slice(0, 7);

const timeLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '-';

const dateLabel = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

const dayLabel = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString([], { weekday: 'long' });

const minutesToMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.ceil((midnight.getTime() - now.getTime()) / 60000));
};

const formatRefreshCountdown = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const fallbackHash = (input: string) => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0').slice(0, 16);
};

async function dailyQrPayload(employeeId: string, date = new Date()) {
  const datePart = localDateKey(date);
  const secret = import.meta.env.VITE_QR_SECRET ?? 'tlmn-local-qr-secret';
  const input = `${employeeId}-${datePart}-${secret}`;

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoded = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    const salt = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 16);
    return `TLMN-EMP-${employeeId}-${salt}`;
  }

  return `TLMN-EMP-${employeeId}-${fallbackHash(input)}`;
}

const statusStyles: Record<AttendanceStatus | 'Weekend / Holiday' | 'Not Yet Signed In', string> = {
  Present: 'bg-[#247833]/10 text-[#247833]',
  Late: 'bg-[#F59E0B]/15 text-[#92400E]',
  Absent: 'bg-[#E1332A]/10 text-[#E1332A]',
  'Early Departure': 'bg-[#F59E0B]/15 text-[#92400E]',
  'Present - Full Day': 'bg-[#247833]/10 text-[#247833]',
  'Present - No Sign Out': 'bg-gray-100 text-gray-700',
  'Weekend / Holiday': 'bg-gray-100 text-gray-500 italic',
  'Not Yet Signed In': 'bg-gray-100 text-gray-700',
};

function StatusBadge({ status, minutesLate }: { status: AttendanceStatus | 'Weekend / Holiday' | 'Not Yet Signed In'; minutesLate?: number }) {
  const label = status === 'Late' && minutesLate ? `Late · ${minutesLate} mins` : status;
  return <Badge className={cn('border-0', statusStyles[status])}>{label}</Badge>;
}

function hoursWorked(record?: AttendanceRecord) {
  if (!record?.signInTime || !record.signOutTime) return '-';
  const hours = (new Date(record.signOutTime).getTime() - new Date(record.signInTime).getTime()) / 36e5;
  return `${Math.max(0, hours).toFixed(1)}h`;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function daysInSelectedMonth(selectedMonth: string) {
  const [year, month] = selectedMonth.split('-').map(Number);
  const count = new Date(year, month, 0).getDate();
  return Array.from({ length: count }, (_, index) => `${selectedMonth}-${String(index + 1).padStart(2, '0')}`);
}

export function AttendanceQrPage() {
  const user = useAuthStore((state) => state.user);
  const branding = useBrandingStore((state) => state.settings);
  const { config, records } = useAttendanceStore();
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrPayload, setQrPayload] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(monthKey());
  const [refreshMinutes, setRefreshMinutes] = useState(minutesToMidnight());
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    let active = true;
    dailyQrPayload(user.employeeId).then((payload) => {
      if (active) setQrPayload(payload);
    });
    return () => {
      active = false;
    };
  }, [user.employeeId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const minutes = minutesToMidnight();
      setRefreshMinutes(minutes);
      if (minutes >= 23 * 60 + 59) {
        dailyQrPayload(user.employeeId).then(setQrPayload);
      }
    }, 60000);
    return () => window.clearInterval(timer);
  }, [user.employeeId]);

  const userRecords = useMemo(
    () => records.filter((record) => record.employeeId === user.id),
    [records, user.id]
  );

  const today = localDateKey();
  const todayRecord = userRecords.find((record) => record.date === today);
  const monthRecords = userRecords.filter((record) => record.date.startsWith(selectedMonth));
  const monthRecordByDate = new Map(monthRecords.map((record) => [record.date, record]));
  const monthDays = daysInSelectedMonth(selectedMonth);
  const workDaySet = new Set(config.workDays);
  const dayCodes = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthSummary = {
    present: monthRecords.filter((record) => record.status.includes('Present') || record.status === 'Early Departure').length,
    late: monthRecords.filter((record) => record.status === 'Late').length,
    absent: monthRecords.filter((record) => record.status === 'Absent').length,
  };
  const expectedWorkDays = monthDays.filter((date) => workDaySet.has(dayCodes[new Date(`${date}T12:00:00`).getDay()])).length;
  const attendanceRate = expectedWorkDays ? Math.round(((monthSummary.present + monthSummary.late) / expectedWorkDays) * 100) : 0;

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return toast.error('QR code is still loading');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const image = new Image();
    const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 320;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 40, 40, 240, 240);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `attendance-qr-${user.name.toLowerCase().replace(/\s+/g, '-')}-${today}.png`;
      link.click();
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const exportReport = () => {
    const lines = [
      `${branding.organizationName} Attendance Report`,
      `Employee: ${user.name}`,
      `Employee ID: ${user.employeeId}`,
      `Month: ${selectedMonth}`,
      '',
      `Present: ${monthSummary.present}`,
      `Late: ${monthSummary.late}`,
      `Absent: ${monthSummary.absent}`,
      `Attendance Rate: ${attendanceRate}%`,
      '',
      'Date,Day,Sign In,Sign Out,Status,Hours Worked',
      ...monthDays.map((date) => {
        const record = monthRecordByDate.get(date);
        const isWorkDay = workDaySet.has(dayCodes[new Date(`${date}T12:00:00`).getDay()]);
        return [
          date,
          dayLabel(date),
          timeLabel(record?.signInTime),
          timeLabel(record?.signOutTime),
          record?.status ?? (isWorkDay ? 'No Record' : 'Weekend / Holiday'),
          hoursWorked(record),
        ].join(',');
      }),
    ];
    downloadTextFile(`attendance-report-${user.employeeId}-${selectedMonth}.pdf.txt`, lines.join('\n'));
    toast.success('Attendance report exported for this month');
  };

  const presentIcon = todayRecord ? <CheckCircle2 className="h-5 w-5 text-[#247833]" /> : <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />;
  const presentTitle = todayRecord
    ? `Signed In - ${timeLabel(todayRecord.signInTime)}`
    : `Today: ${new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;

  return (
    <ModulePage title="Attendance (QR)" breadcrumbs={[{ label: 'Attendance' }, { label: 'My QR Code' }]}>
      <div className="grid w-full max-w-full grid-cols-1 gap-6 overflow-hidden xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <GlassCard className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#82154F]/10 text-[#82154F]">
              <QrCode className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">My Attendance QR Code</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#6B7280]">
              Hold this QR code up to the office scanner at the entrance to record your attendance.
            </p>
            <div ref={qrRef} className="mx-auto my-6 flex h-[280px] w-[280px] max-w-full items-center justify-center rounded-2xl border bg-white p-5 shadow-sm">
              {qrPayload ? (
                <QRCodeSVG value={qrPayload} size={240} marginSize={2} level="H" fgColor="#18181b" bgColor="#ffffff" />
              ) : (
                <div className="text-sm text-[#6B7280]">Generating QR...</div>
              )}
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-[#111827]">{user.name}</p>
              <p className="text-sm text-[#6B7280]">
                {user.designation} {user.thematics.length ? `- ${user.thematics.join(', ')}` : ''}
              </p>
              <p className="text-sm font-medium text-[#111827]">Employee ID: {user.employeeId}</p>
              <p className="text-xs text-[#6B7280]">Refreshes in {formatRefreshCountdown(refreshMinutes)}</p>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button type="button" variant="outline" onClick={downloadQr}>
                <Download className="h-4 w-4" /> Download QR
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowPrint(true)}>
                <Printer className="h-4 w-4" /> Print QR
              </Button>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-3">
              {presentIcon}
              <div className="min-w-0">
                <h3 className="font-semibold">{presentTitle}</h3>
                {todayRecord ? (
                  <div className="mt-2 space-y-1 text-sm text-[#6B7280]">
                    <p>Status: <StatusBadge status={todayRecord.status} minutesLate={todayRecord.minutesLate} /></p>
                    <p>Sign out recorded: {timeLabel(todayRecord.signOutTime)}</p>
                    {todayRecord.status === 'Late' && (
                      <p>Work start time: {config.workStartTime} | Grace period: {config.gracePeriodMinutes} mins</p>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 space-y-1 text-sm text-[#6B7280]">
                    <p>Status: <StatusBadge status="Not Yet Signed In" /></p>
                    <p>Work starts at: {config.workStartTime}</p>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="min-w-0 space-y-6">
          <GlassCard>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">My Attendance History</h2>
                <p className="text-sm text-[#6B7280]">
                  This Month: Present: {monthSummary.present} | Late: {monthSummary.late} | Absent: {monthSummary.absent} | Attendance Rate: {attendanceRate}%
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-[#6B7280]" />
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="bg-transparent outline-none"
                  />
                </label>
                <Button type="button" variant="outline" onClick={exportReport}>
                  <Download className="h-4 w-4" /> Export My Attendance (PDF)
                </Button>
              </div>
            </div>
            <div className="mt-4 w-full overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-[#F8FAFC] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  <tr>
                    {['Date', 'Day', 'Sign In', 'Sign Out', 'Status', 'Hours Worked'].map((header) => (
                      <th key={header} className="px-4 py-3">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthDays.map((date) => {
                    const record = monthRecordByDate.get(date);
                    const isWorkDay = workDaySet.has(dayCodes[new Date(`${date}T12:00:00`).getDay()]);
                    return (
                      <tr key={date} className="border-t">
                        <td className="px-4 py-3 font-medium">{dateLabel(date)}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{dayLabel(date)}</td>
                        <td className="px-4 py-3">{timeLabel(record?.signInTime)}</td>
                        <td className="px-4 py-3">{timeLabel(record?.signOutTime)}</td>
                        <td className="px-4 py-3">
                          {record ? (
                            <StatusBadge status={record.status} minutesLate={record.minutesLate} />
                          ) : (
                            <StatusBadge status={isWorkDay ? 'Not Yet Signed In' : 'Weekend / Holiday'} />
                          )}
                        </td>
                        <td className="px-4 py-3">{hoursWorked(record)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>

      {showPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="rounded-lg border p-6 text-center">
              {branding.organizationLogo ? (
                <img src={branding.organizationLogo} alt={branding.organizationName} className="mx-auto mb-3 h-12 w-auto object-contain" />
              ) : (
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#82154F] text-lg font-bold text-white">
                  {branding.organizationAcronym}
                </div>
              )}
              <h3 className="font-semibold">{branding.organizationName}</h3>
              <div className="mx-auto my-5 flex justify-center">
                {qrPayload && <QRCodeSVG value={qrPayload} size={240} marginSize={2} level="H" />}
              </div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-[#6B7280]">{user.designation}</p>
              <p className="mt-1 text-sm font-medium">Employee ID: {user.employeeId}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPrint(false)}>Cancel</Button>
              <Button type="button" className="bg-[#82154F] text-white" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print
              </Button>
            </div>
          </div>
        </div>
      )}
    </ModulePage>
  );
}

