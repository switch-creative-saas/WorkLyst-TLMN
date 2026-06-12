import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, KeyRound, MonitorUp, QrCode, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAttendanceStore, qrPayloadForEmployee, type ScanResult } from '@/stores/useAttendanceStore';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { demoUsers } from '@/stores/useAuthStore';

const timeText = (value?: string) =>
  value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

function officeOpen(config: { workStartTime: string; workEndTime: string; workDays: string[] }, now: Date) {
  const dayCodes = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  if (!config.workDays.includes(dayCodes[now.getDay()])) return false;
  const current = now.toTimeString().slice(0, 5);
  return current >= config.workStartTime && current <= config.workEndTime;
}

export function ScannerPage() {
  const branding = useBrandingStore((state) => state.settings);
  const config = useAttendanceStore((state) => state.config);
  const scannerAuthorized = useAttendanceStore((state) => state.scannerAuthorized);
  const scannerAccessCode = useAttendanceStore((state) => state.scannerAccessCode);
  const authorizeScanner = useAttendanceStore((state) => state.authorizeScanner);
  const scanQrPayload = useAttendanceStore((state) => state.scanQrPayload);
  const queueScan = useAttendanceStore((state) => state.queueScan);
  const syncQueuedScans = useAttendanceStore((state) => state.syncQueuedScans);
  const offlineQueue = useAttendanceStore((state) => state.offlineQueue);
  const allRecords = useAttendanceStore((state) => state.records);
  const records = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    return allRecords.filter((record) => record.date === todayKey);
  }, [allRecords]);
  const summary = useMemo(() => {
    const expected = demoUsers.filter((user) => user.status === 'Active').length;
    const present = records.filter((record) => record.status.includes('Present')).length;
    const late = records.filter((record) => record.status === 'Late').length;
    const absent = records.filter((record) => record.status === 'Absent').length;

    return { expected, present, late, absent, notYetIn: Math.max(0, expected - records.length) };
  }, [records]);
  const [now, setNow] = useState(new Date());
  const [code, setCode] = useState('');
  const [payload, setPayload] = useState(qrPayloadForEmployee(demoUsers[0].employeeId));
  const [result, setResult] = useState<ScanResult | null>(null);
  const isOpen = useMemo(() => officeOpen(config, now), [config, now]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (result) {
      const timer = window.setTimeout(() => setResult(null), 3000);
      return () => window.clearTimeout(timer);
    }
  }, [result]);

  if (!scannerAuthorized) {
    return (
      <div className="flex min-h-screen w-full max-w-full items-center justify-center overflow-hidden bg-[#0B1220] p-4 text-white sm:p-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!authorizeScanner(code)) return;
          }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur sm:p-8"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-center text-2xl font-bold">Scanner Access</h1>
          <p className="mt-2 text-center text-sm text-white/70">Enter the HR-generated scanner access code.</p>
          <Input value={code} onChange={(event) => setCode(event.target.value)} className="mt-6 bg-white text-[#111827]" placeholder="SCAN-XXXXXX" />
          <Button className="mt-4 w-full bg-[#247833] text-white hover:bg-[#1E652B]">Authorize Tablet</Button>
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => {
              setCode(scannerAccessCode);
              authorizeScanner(scannerAccessCode);
            }}
          >
            Demo Scanner Login
          </Button>
          <p className="mt-2 text-center text-xs text-white/60">Demo code: {scannerAccessCode}</p>
        </form>
      </div>
    );
  }

  const runScan = (nextPayload = payload) => {
    if (!navigator.onLine) {
      queueScan(nextPayload, 'entrance-tablet');
      setResult({ ok: false, message: 'Offline - scan queued for sync' });
      return;
    }
    setResult(scanQrPayload(nextPayload, 'entrance-tablet'));
  };

  const tone = result?.ok
    ? result.record?.status === 'Late'
      ? 'bg-[#F59E0B]'
      : 'bg-[#247833]'
    : 'bg-[#E1332A]';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] text-[#111827]">
      {result && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center text-white ${tone}`}>
          {result.ok ? <CheckCircle2 className="h-24 w-24" /> : <XCircle className="h-24 w-24" />}
          <h2 className="mt-6 text-5xl font-bold">{result.message}</h2>
          {result.employee && <p className="mt-3 text-2xl">{result.employee.name}</p>}
          {result.record && <p className="mt-2 text-xl">{result.action} - {timeText(result.record.signOutTime ?? result.record.signInTime)}</p>}
        </div>
      )}

      <header className="flex w-full max-w-full min-w-0 flex-col gap-4 overflow-hidden border-b border-[#E5E7EB] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {branding.organizationLogo ? (
            <img src={branding.organizationLogo} alt="" className="h-12 w-12 shrink-0 rounded-xl object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary font-bold text-white">
              {branding.organizationAcronym.slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold">{branding.organizationName}</p>
            <p className="text-sm text-[#6B7280]">Entrance Attendance Scanner</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-right">
            <p className="text-xs text-[#6B7280]">{now.toLocaleDateString()}</p>
            <p className="text-3xl font-bold tabular-nums">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${isOpen ? 'bg-[#247833]' : 'bg-[#E1332A]'}`}>
            {isOpen ? 'Office Open' : 'Office Closed'}
          </span>
        </div>
      </header>

      <main className="grid w-full max-w-full min-w-0 gap-4 overflow-hidden p-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 space-y-4 overflow-hidden">
          <div className="grid min-h-[52vh] place-items-center rounded-2xl border-4 border-dashed border-[#00578A]/30 bg-[#0B1220] p-6 text-center text-white">
            <div>
              <QrCode className="mx-auto h-20 w-20 text-white/80" />
              <h1 className="mt-5 text-3xl font-bold">Hold employee QR code up to camera</h1>
              <p className="mt-2 text-white/60">Camera decoder adapter ready; local demo scan is available below.</p>
              <div className="mx-auto mt-6 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <Input value={payload} onChange={(event) => setPayload(event.target.value)} className="min-w-0 bg-white text-[#111827]" />
                <Button onClick={() => runScan()} className="bg-[#247833] text-white hover:bg-[#1E652B]">
                  Simulate Scan
                </Button>
              </div>
              {offlineQueue.length > 0 && (
                <Button variant="outline" className="mt-3 bg-white text-[#111827]" onClick={() => syncQueuedScans()}>
                  <MonitorUp className="h-4 w-4" />
                  Sync {offlineQueue.length} queued scans
                </Button>
              )}
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Recent Activity</h2>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
              {records.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-3">
                  <img src={record.employeePhoto} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{record.employeeName}</p>
                    <p className="text-xs text-[#6B7280]">{timeText(record.signOutTime ?? record.signInTime)}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#00578A]/10 px-2 py-1 text-xs font-medium text-[#00578A]">{record.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="hidden min-w-0 space-y-4 overflow-hidden xl:block">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Today's Summary</h2>
            {[
              ['Total Expected', summary.expected, '#6B7280'],
              ['Present', summary.present, '#247833'],
              ['Late', summary.late, '#F59E0B'],
              ['Absent', summary.absent, '#E1332A'],
              ['Not Yet In', summary.notYetIn, '#6B7280'],
            ].map(([label, value, color]) => (
              <div key={label} className="mt-3 flex items-center justify-between rounded-lg bg-[#F8FAFC] px-3 py-2">
                <span className="text-sm text-[#6B7280]">{label}</span>
                <span className="text-xl font-bold" style={{ color: String(color) }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-sm shadow-sm">
            <Clock className="mb-2 h-5 w-5 text-[#00578A]" />
            Work hours: {config.workStartTime} - {config.workEndTime}
          </div>
        </aside>
      </main>
    </div>
  );
}
