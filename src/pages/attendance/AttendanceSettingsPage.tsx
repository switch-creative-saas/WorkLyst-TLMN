import { Copy, KeyRound, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAttendanceStore, type AttendanceConfig } from '@/stores/useAttendanceStore';

const workDays = [
  ['MON', 'Mon'],
  ['TUE', 'Tue'],
  ['WED', 'Wed'],
  ['THU', 'Thu'],
  ['FRI', 'Fri'],
  ['SAT', 'Sat'],
  ['SUN', 'Sun'],
] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(value) => onChange(value === true)} />
      {label}
    </label>
  );
}

export function AttendanceSettingsPage() {
  const config = useAttendanceStore((state) => state.config);
  const updateConfig = useAttendanceStore((state) => state.updateConfig);
  const scannerAccessCode = useAttendanceStore((state) => state.scannerAccessCode);
  const generateScannerCode = useAttendanceStore((state) => state.generateScannerCode);
  const revokeScanner = useAttendanceStore((state) => state.revokeScanner);

  const update = (partial: Partial<AttendanceConfig>) => updateConfig(partial);

  const save = async () => {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'false') {
        await fetch('/api/attendance/config', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
      }
      toast.success('Attendance configuration saved.');
    } catch {
      toast.success('Attendance configuration saved locally.');
    }
  };

  const setWorkDay = (day: string, checked: boolean) => {
    const next = checked ? [...config.workDays, day] : config.workDays.filter((item) => item !== day);
    update({ workDays: Array.from(new Set(next)) });
  };

  return (
    <ModulePage title="Attendance Configuration" breadcrumbs={[{ label: 'People & HR' }, { label: 'Attendance Settings' }]}>
      <div className="grid w-full max-w-full min-w-0 gap-6 overflow-hidden xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
        <div className="min-w-0 space-y-6">
          <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Work Schedule Settings</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Work Start Time">
                <Input type="time" value={config.workStartTime} onChange={(event) => update({ workStartTime: event.target.value })} />
              </Field>
              <Field label="Work End Time">
                <Input type="time" value={config.workEndTime} onChange={(event) => update({ workEndTime: event.target.value })} />
              </Field>
              <Field label="Grace Period for Late Arrival (minutes)">
                <Input type="number" value={config.gracePeriodMinutes} onChange={(event) => update({ gracePeriodMinutes: Number(event.target.value) })} />
              </Field>
              <Field label="Early Departure Threshold (minutes)">
                <Input type="number" value={config.earlyDepartureMinutes} onChange={(event) => update({ earlyDepartureMinutes: Number(event.target.value) })} />
              </Field>
              <Field label="Break Duration (minutes)">
                <Input type="number" value={config.breakDurationMinutes} onChange={(event) => update({ breakDurationMinutes: Number(event.target.value) })} />
              </Field>
              <Field label="Work Days">
                <div className="flex flex-wrap gap-2">
                  {workDays.map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                      <Checkbox checked={config.workDays.includes(value)} onCheckedChange={(checked) => setWorkDay(value, checked === true)} />
                      {label}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Attendance Status Rules</h2>
            <div className="mt-4 w-full overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Condition</th>
                    <th className="px-3 py-2">Status Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Scanned within grace period of start time', 'Present'],
                    ['Scanned after grace period', 'Late'],
                    ['Did not scan by end of day', 'Absent'],
                    ['Scanned out before early departure threshold', 'Early Departure'],
                    ['Scanned in + out within normal hours', 'Present - Full Day'],
                    ['Scanned in only with no out scan', 'Present - No Sign Out'],
                  ].map(([condition, status]) => (
                    <tr key={condition} className="border-t border-border">
                      <td className="px-3 py-2">{condition}</td>
                      <td className="px-3 py-2 font-medium">{status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <div className="mt-4 grid gap-3">
              <ToggleRow label="Notify employee via in-app when marked Late" checked={config.notifyLate} onChange={(notifyLate) => update({ notifyLate })} />
              <ToggleRow label="Notify supervisor when employee is Absent" checked={config.notifyAbsent} onChange={(notifyAbsent) => update({ notifyAbsent })} />
              <ToggleRow label="Send daily attendance summary to HR at end of work day" checked={config.dailySummaryToHR} onChange={(dailySummaryToHR) => update({ dailySummaryToHR })} />
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-6 overflow-hidden xl:sticky xl:top-6 xl:self-start">
          <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Scanner Access Code</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use this code to log the entrance tablet into scanner mode. It stays active until revoked.
            </p>
            <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/40 p-3 font-mono text-lg font-semibold">
              {scannerAccessCode}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard?.writeText(scannerAccessCode)}>
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={() => toast.success(`New code: ${generateScannerCode()}`)}>
                <KeyRound className="h-4 w-4" />
                Generate
              </Button>
              <Button variant="outline" onClick={revokeScanner}>
                Revoke
              </Button>
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Current Rule Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Office opens</dt><dd className="font-medium">{config.workStartTime}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Office closes</dt><dd className="font-medium">{config.workEndTime}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Late after</dt><dd className="font-medium">{config.gracePeriodMinutes} mins</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Early leave</dt><dd className="font-medium">{config.earlyDepartureMinutes} mins</dd></div>
            </dl>
          </section>

          <Button onClick={save} className="w-full bg-brand-primary text-white hover:bg-brand-primary/90">
            <Save className="h-4 w-4" />
            Save Attendance Config
          </Button>
        </aside>
      </div>
    </ModulePage>
  );
}
