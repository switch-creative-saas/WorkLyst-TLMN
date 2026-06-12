import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Folder,
  Home,
  IdCard,
  LogOut,
  QrCode,
  Send,
  Upload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmployeeVoiceWidget } from '@/components/safeguarding/EmployeeVoiceWidget';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAuth } from '@/contexts/AuthContext';
import { qrPayloadForEmployee, useAttendanceStore } from '@/stores/useAttendanceStore';
import {
  useWorkflowStore,
  type WorkflowItem,
  workflowLabels,
  type WorkflowStatus,
  type WorkflowType,
} from '@/stores/useWorkflowStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TLMN_PURPLE = '#82154F';
const TLMN_GREEN = '#247833';
const TLMN_BLUE = '#00578A';
const TLMN_RED = '#E1332A';

const navItems = [
  ['dashboard', 'Dashboard', Home],
  ['timesheet', 'My Timesheet', Clock],
  ['attendance', 'Attendance (QR)', QrCode],
  ['leave', 'Leave Request', Calendar],
  ['payment', 'My Requests', CreditCard],
  ['activity', 'Activity Reports', BarChart3],
  ['documents', 'Documents', Folder],
  ['profile', 'My Profile', IdCard],
  ['approvals', 'Pending Approvals', CheckCircle],
] as const;

type EmployeeSection = (typeof navItems)[number][0];

const statusStyle: Record<WorkflowStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-[#00578A]/10 text-[#00578A]',
  under_review: 'bg-[#82154F]/10 text-[#82154F]',
  approved: 'bg-[#247833]/10 text-[#247833]',
  rejected: 'bg-[#E1332A]/10 text-[#E1332A]',
  revision_requested: 'bg-[#F59E0B]/15 text-[#92400E]',
};

const amountInWords = (amount: number) =>
  amount > 0 ? `${amount.toLocaleString()} naira only` : 'zero naira only';

export function EmployeeDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const notifications = useAuthStore((s) => s.notifications);
  const addNotification = useAuthStore((s) => s.addNotification);
  const submitWorkflow = useWorkflowStore((s) => s.submitWorkflow);
  const pendingForRole = useWorkflowStore((s) => s.pendingForRole);
  const actOnWorkflow = useWorkflowStore((s) => s.actOnWorkflow);
  const items = useWorkflowStore((s) => s.items);
  const requestedSection = searchParams.get('section') as EmployeeSection | null;
  const [section, setSection] = useState<EmployeeSection>(
    requestedSection && navItems.some(([key]) => key === requestedSection) ? requestedSection : 'dashboard'
  );
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const pending = pendingForRole(user.role);
  const myItems = items.filter((item) => item.submitterId === user.id);

  const submit = (type: WorkflowType, title: string, summary: string, payload: unknown) => {
    const item = submitWorkflow({ type, submitter: user, title, summary, payload });
    addNotification(`${workflowLabels[type]} submitted and routed to ${item.currentStage}`);
    toast.success(`${workflowLabels[type]} submitted`);
  };

  const handleLogout = async () => {
    await logout();
    setLogoutConfirmOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] text-[#111827]">
      <div className="grid w-full max-w-full min-w-0 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="flex min-w-0 flex-col overflow-hidden border-r border-[#E5E7EB] bg-white lg:min-h-screen">
          <div className="border-b border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#82154F] text-sm font-bold text-white">
                TLMN
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-[#6B7280]">{user.role}</p>
              </div>
            </div>
          </div>
          <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto overflow-y-hidden p-2 lg:block lg:space-y-1 lg:overflow-x-hidden lg:overflow-y-auto">
            {navItems
              .filter(([key]) => key !== 'approvals' || pending.length > 0)
              .map(([key, label, Icon]) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'profile') navigate('/profile');
                    else if (key === 'payment') navigate('/requests');
                    else setSection(key);
                  }}
                  className={cn(
                    'flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap lg:w-full',
                    section === key ? 'bg-[#82154F]/10 text-[#82154F] font-medium' : 'text-[#6B7280] hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{label}</span>
                  {key === 'approvals' && <Badge className="ml-auto bg-[#E1332A] text-white">{pending.length}</Badge>}
                </button>
              ))}
          </nav>
          <div className="relative border-t border-[#E5E7EB] p-2">
            {logoutConfirmOpen && (
              <div className="absolute bottom-full left-2 right-2 z-50 mb-2 rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-lg">
                <p className="text-xs font-medium">Are you sure you want to log out?</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-md bg-[#E1332A] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#C42B24]"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoutConfirmOpen(false)}
                    className="rounded-md border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen((open) => !open)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[#6B7280] transition-colors hover:bg-[#E1332A]/10 hover:text-[#E1332A]"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 overflow-hidden p-4 md:p-6">
          <header className="mb-6 flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-[#6B7280]">TLMN Staff Workspace</p>
              <h1 className="text-2xl font-bold">{navItems.find(([key]) => key === section)?.[1]}</h1>
            </div>
            <div className="w-fit max-w-full rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-sm text-[#6B7280]">
              {notifications.filter((note) => !note.read).length} unread notifications
            </div>
          </header>

          {section === 'dashboard' && <DashboardHome userName={user.name} myItems={myItems} pending={pending} />}
          {section === 'timesheet' && <TimesheetModule submit={submit} projects={user.assignedProjects} />}
          {section === 'attendance' && <AttendanceModule employeeId={user.employeeId} />}
          {section === 'leave' && <LeaveModule submit={submit} />}
          {section === 'payment' && <PaymentRequestModule submit={submit} user={user} />}
          {section === 'activity' && <ActivityReportModule submit={submit} />}
          {section === 'documents' && <SimplePanel title="Documents" text="Your uploaded documents, approved reports, unified requests, and HR files will appear here." />}
          {section === 'profile' && <ProfilePanel />}
          {section === 'approvals' && (
            <ApprovalsPanel
              pending={pending}
              onAction={(item, action, comment) => {
                if ((action === 'rejected' || action === 'revision_requested') && !comment.trim()) {
                  toast.error('Comment is required');
                  return;
                }
                const updated = actOnWorkflow(item.id, user, action, comment);
                if (updated) addNotification(`${updated.title} was ${action.replace('_', ' ')}`);
                toast.success('Workflow updated');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm', className)}>{children}</section>;
}

function StatusBadge({ status }: { status: WorkflowStatus }) {
  return <Badge className={cn('border-0 capitalize', statusStyle[status])}>{status.replace('_', ' ')}</Badge>;
}

function WorkflowProgress({ item, type }: { item?: WorkflowItem; type: WorkflowType }) {
  const stages = item?.stages ?? {
    timesheet: ['Employee', 'Supervisor', 'Finance'],
    leave: ['Employee', 'Supervisor', 'HR Manager'],
    payment: ['Employee', 'Supervisor', 'Audit', 'Finance', 'National Director'],
    activity_report: ['Employee', 'Supervisor', 'Program Lead', 'Archive'],
    concept_note: ['Employee', 'Program Lead', 'Finance', 'National Director'],
  }[type];
  const current = item?.currentStage ?? stages[0];
  const currentIndex = stages.indexOf(current);
  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((stage, index) => (
        <span
          key={stage}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            index < currentIndex && 'bg-[#247833]/10 text-[#247833]',
            index === currentIndex && 'bg-[#82154F]/10 text-[#82154F]',
            index > currentIndex && 'bg-gray-100 text-gray-500'
          )}
        >
          {stage}
        </span>
      ))}
    </div>
  );
}

function DashboardHome({ userName, myItems, pending }: { userName: string; myItems: WorkflowItem[]; pending: WorkflowItem[] }) {
  return (
    <div className="w-full max-w-full min-w-0 space-y-6 overflow-hidden">
      <Card className="bg-[#82154F] text-white">
        <p className="text-sm opacity-80">Welcome back</p>
        <h2 className="text-2xl font-bold">{userName}</h2>
        <p className="mt-1 max-w-2xl text-sm opacity-90">
          Submit timesheets, leave, unified requests with embedded concept notes, and activity reports from your staff dashboard.
        </p>
      </Card>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Metric label="My Submissions" value={myItems.length} color={TLMN_BLUE} />
        <Metric label="Approved" value={myItems.filter((item) => item.status === 'approved').length} color={TLMN_GREEN} />
        <Metric label="Under Review" value={myItems.filter((item) => item.status === 'under_review' || item.status === 'submitted').length} color={TLMN_PURPLE} />
        <Metric label="Pending My Approval" value={pending.length} color={TLMN_RED} />
      </div>
      <Card>
        <h3 className="mb-3 font-semibold">Recent Activities</h3>
        <div className="space-y-2">
          {myItems.slice(0, 5).map((item) => (
            <div key={item.id} className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-gray-50 p-3 text-sm">
              <span className="min-w-0 truncate">{item.title}</span>
              <StatusBadge status={item.status} />
            </div>
          ))}
          {myItems.length === 0 && <p className="text-sm text-[#6B7280]">No submissions yet.</p>}
        </div>
      </Card>
      <EmployeeVoiceWidget />
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card>
      <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: color }} />
      <p className="mt-3 text-sm text-[#6B7280]">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </Card>
  );
}

function TimesheetModule({ submit, projects }: { submit: Function; projects: string[] }) {
  const [status, setStatus] = useState<WorkflowStatus>('draft');
  const [rows, setRows] = useState(
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => ({
      day,
      date: `2026-06-${String(8 + index).padStart(2, '0')}`,
      project: projects[0] ?? 'General Operations',
      activity: '',
      hours: 0,
      notes: '',
    }))
  );
  return (
    <Card>
      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <h2 className="font-semibold">Weekly Timesheet</h2>
          <WorkflowProgress type="timesheet" />
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="w-full overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[840px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Date', 'Project', 'Activity', 'Hours', 'Notes'].map((head) => (
                <th key={head} className="px-3 py-2 text-left text-xs font-semibold text-[#6B7280]">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.day} className="border-t">
                <td className="px-3 py-2"><input type="date" value={row.date} onChange={(e) => setRows(rows.map((r, i) => i === index ? { ...r, date: e.target.value } : r))} className="h-9 w-full rounded border px-2" /></td>
                <td className="px-3 py-2"><select value={row.project} onChange={(e) => setRows(rows.map((r, i) => i === index ? { ...r, project: e.target.value } : r))} className="h-9 w-full rounded border px-2">{(projects.length ? projects : ['General Operations']).map((p) => <option key={p}>{p}</option>)}</select></td>
                <td className="px-3 py-2"><input value={row.activity} onChange={(e) => setRows(rows.map((r, i) => i === index ? { ...r, activity: e.target.value } : r))} className="h-9 w-full rounded border px-2" /></td>
                <td className="px-3 py-2"><input type="number" min="0" value={row.hours} onChange={(e) => setRows(rows.map((r, i) => i === index ? { ...r, hours: Number(e.target.value) } : r))} className="h-9 w-20 rounded border px-2" /></td>
                <td className="px-3 py-2"><input value={row.notes} onChange={(e) => setRows(rows.map((r, i) => i === index ? { ...r, notes: e.target.value } : r))} className="h-9 w-full rounded border px-2" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button className="mt-4 bg-[#82154F] text-white hover:bg-[#6F1143]" onClick={() => { submit('timesheet', 'Weekly Timesheet', `${rows.reduce((s, r) => s + Number(r.hours), 0)} hours submitted`, rows); setStatus('submitted'); }}>
        <Send className="h-4 w-4" /> Submit for Supervisor Approval
      </Button>
    </Card>
  );
}

function AttendanceModule({ employeeId }: { employeeId: string }) {
  const user = useAuthStore((state) => state.user);
  const allRecords = useAttendanceStore((state) => state.records);
  const records = useMemo(
    () => allRecords.filter((record) => record.employeeId === user.id),
    [allRecords, user.id]
  );
  const scanQrPayload = useAttendanceStore((state) => state.scanQrPayload);
  const config = useAttendanceStore((state) => state.config);
  const qrPayload = qrPayloadForEmployee(employeeId);

  const clock = () => {
    const result = scanQrPayload(qrPayload, 'employee-dashboard-demo');
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  return (
    <div className="grid w-full max-w-full min-w-0 gap-6 overflow-hidden lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <Card className="text-center">
        <h2 className="mb-4 font-semibold">Personal QR Code</h2>
        <div className="inline-block rounded-xl bg-white p-4 ring-1 ring-[#E5E7EB]">
          <QRCodeSVG value={qrPayload} size={180} level="H" />
        </div>
        <p className="mt-3 text-sm text-[#6B7280]">{employeeId}</p>
        <p className="mt-2 text-xs text-[#6B7280]">
          Work hours: {config.workStartTime} - {config.workEndTime}
        </p>
        <Button className="mt-4 bg-[#247833] text-white hover:bg-[#1F682C]" onClick={clock}>Clock In / Out</Button>
      </Card>
      <Card>
        <h2 className="mb-4 font-semibold">Attendance History</h2>
        <SimpleTable
          headers={['Date', 'Time In', 'Time Out', 'Status']}
          rows={records.map((record) => [
            record.date,
            record.signInTime ? new Date(record.signInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            record.signOutTime ? new Date(record.signOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            record.status,
          ])}
        />
      </Card>
    </div>
  );
}

function LeaveModule({ submit }: { submit: Function }) {
  const [form, setForm] = useState({ type: 'Annual', start: '', end: '', reason: '', file: '' });
  return (
    <Card>
      <h2 className="mb-2 font-semibold">Leave Request</h2>
      <WorkflowProgress type="leave" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Leave Type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-10 w-full rounded border px-3">{['Annual', 'Sick', 'Emergency', 'Maternity', 'Paternity', 'Other'].map((type) => <option key={type}>{type}</option>)}</select></Field>
        <Field label="Supporting Document"><input type="file" className="w-full max-w-full text-sm" onChange={(e) => setForm({ ...form, file: e.target.files?.[0]?.name ?? '' })} /></Field>
        <Field label="Start Date"><input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className="h-10 w-full rounded border px-3" /></Field>
        <Field label="End Date"><input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className="h-10 w-full rounded border px-3" /></Field>
      </div>
      <Field label="Reason" className="mt-4"><Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field>
      <Button className="mt-4 bg-[#82154F] text-white hover:bg-[#6F1143]" onClick={() => submit('leave', `${form.type} Leave`, `${form.start} to ${form.end}`, form)}>Submit Leave Request</Button>
    </Card>
  );
}

function PaymentRequestModule({ submit, user }: { submit: Function; user: { name: string; designation: string; station: string } }) {
  const [fund, setFund] = useState('TLMN');
  const [purpose, setPurpose] = useState('');
  const [items, setItems] = useState([{ details: '', amount: 0 }]);
  const total = items.reduce((sum, item) => sum + Number(item.amount), 0);
  return (
    <Card>
      <h2 className="font-semibold">The Leprosy Mission Nigeria Payment Request</h2>
      <WorkflowProgress type="payment" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Fund Source"><div className="flex flex-wrap gap-3">{['TLMN', 'GFATM', 'Other Projects'].map((f) => <label key={f} className="flex items-center gap-2 text-sm"><input type="radio" checked={fund === f} onChange={() => setFund(f)} />{f}</label>)}</div></Field>
        <Field label="Name"><input value={user.name} readOnly className="h-10 w-full rounded border bg-gray-50 px-3" /></Field>
        <Field label="Designation"><input value={user.designation} readOnly className="h-10 w-full rounded border bg-gray-50 px-3" /></Field>
        <Field label="Date"><input type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="h-10 w-full rounded border px-3" /></Field>
        <Field label="Station"><input value={user.station} readOnly className="h-10 w-full rounded border bg-gray-50 px-3" /></Field>
      </div>
      <LineItems items={items} setItems={setItems} />
      <div className="mt-4 rounded-lg bg-[#F8FAFC] p-4 text-sm">
        <p className="font-semibold">Total Amount Requested: ₦{total.toLocaleString()}</p>
        <p className="mt-2">I hereby request for the sum of ₦{total.toLocaleString()} ({amountInWords(total)}) being payment for <input value={purpose} onChange={(e) => setPurpose(e.target.value)} className="min-w-0 max-w-full border-b bg-transparent px-2 outline-none" />.</p>
      </div>
      <ApprovalChain stages={['Requested by', 'Recommended by', 'Reviewed by', 'Approved by']} />
      <Button className="mt-4 bg-[#82154F] text-white hover:bg-[#6F1143]" onClick={() => submit('payment', 'Payment Request', `₦${total.toLocaleString()} requested`, { fund, purpose, items, total })}>Submit Payment Request</Button>
    </Card>
  );
}

function ActivityReportModule({ submit }: { submit: Function }) {
  const [title, setTitle] = useState('');
  const [genderRows, setGenderRows] = useState([{ name: '', sex: 'Male', phone: '', community: '' }]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [sections, setSections] = useState<Record<string, string>>({});
  const textSections = ['Background', 'Objectives of Activity', 'Work Methodology', 'Collaboration with Partners', 'Outcomes', 'Safeguarding', 'Lessons Learnt', 'Challenges Encountered', 'Recommendations / New Ideas'];
  return (
    <Card>
      <h2 className="font-semibold">Activity Report</h2>
      <WorkflowProgress type="activity_report" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Title of Activity"><input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 w-full rounded border px-3" /></Field>
        <Field label="Date"><input type="date" className="h-10 w-full rounded border px-3" /></Field>
        <Field label="State"><input className="h-10 w-full rounded border px-3" /></Field>
        <Field label="Location"><input className="h-10 w-full rounded border px-3" /></Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {textSections.map((section) => <Field key={section} label={section}><Textarea value={sections[section] ?? ''} onChange={(e) => setSections({ ...sections, [section]: e.target.value })} /></Field>)}
      </div>
      <h3 className="mt-6 font-semibold">Gender Breakdown</h3>
      <SimpleEditableRows rows={genderRows} setRows={setGenderRows} columns={['name', 'sex', 'phone', 'community']} />
      <h3 className="mt-6 font-semibold">Age Disaggregation</h3>
      <SimpleTable headers={['', 'Below 18', 'Above 18']} rows={[['Male', '0', '0'], ['Female', '0', '0']]} />
      <h3 className="mt-6 font-semibold">Disability Disaggregation</h3>
      <SimpleTable headers={['Type', 'Male Below 18', 'Male Above 18', 'Female Below 18', 'Female Above 18']} rows={['V', 'H', 'P', 'L', 'M', 'O'].map((x) => [x, '0', '0', '0', '0'])} />
      <div className="mt-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <Upload className="h-4 w-4" /> Activity Photos
          <input type="file" multiple className="hidden" onChange={(e) => setPhotos(Array.from(e.target.files ?? []).map((file) => file.name))} />
        </label>
        {photos.length > 0 && <p className="mt-2 truncate text-sm text-[#6B7280]">{photos.join(', ')}</p>}
      </div>
      <Button className="mt-4 bg-[#82154F] text-white hover:bg-[#6F1143]" onClick={() => submit('activity_report', title || 'Activity Report', 'Activity report submitted', { title, sections, genderRows, photos })}>Submit Activity Report</Button>
    </Card>
  );
}

function ApprovalsPanel({ pending, onAction }: { pending: WorkflowItem[]; onAction: (item: WorkflowItem, action: 'approved' | 'rejected' | 'revision_requested', comment: string) => void }) {
  const [selected, setSelected] = useState<WorkflowItem | null>(pending[0] ?? null);
  const [comment, setComment] = useState('');
  return (
    <div className="grid w-full max-w-full min-w-0 gap-6 overflow-hidden lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <Card>
        <h2 className="mb-3 font-semibold">Awaiting My Action</h2>
        <div className="space-y-2">
          {pending.map((item) => (
            <button key={item.id} onClick={() => setSelected(item)} className={cn('w-full min-w-0 rounded-lg border p-3 text-left text-sm', selected?.id === item.id ? 'border-[#82154F] bg-[#82154F]/5' : 'border-[#E5E7EB]')}>
              <p className="truncate font-medium">{item.submitterName}</p>
              <p className="truncate text-[#6B7280]">{workflowLabels[item.type]} - {item.summary}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{new Date(item.submittedAt).toLocaleString()}</p>
            </button>
          ))}
          {pending.length === 0 && <p className="text-sm text-[#6B7280]">No pending approvals.</p>}
        </div>
      </Card>
      {selected && (
        <Card>
          <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="min-w-0">
              <h2 className="font-semibold">{selected.title}</h2>
              <p className="truncate text-sm text-[#6B7280]">{selected.summary}</p>
            </div>
            <StatusBadge status={selected.status} />
          </div>
          <WorkflowProgress item={selected} type={selected.type} />
          <pre className="mt-4 max-h-80 max-w-full overflow-auto rounded-lg bg-gray-50 p-4 text-xs">{JSON.stringify(selected.payload, null, 2)}</pre>
          <div className="mt-4 rounded-xl border border-[#E5E7EB] p-4">
            <h3 className="font-semibold">Approval Panel</h3>
            <Textarea className="mt-3" placeholder="Comment is required for rejection or revision" value={comment} onChange={(e) => setComment(e.target.value)} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button className="bg-[#247833] text-white hover:bg-[#1F682C]" onClick={() => onAction(selected, 'approved', comment)}>Approve</Button>
              <Button className="bg-[#E1332A] text-white hover:bg-[#B92922]" onClick={() => onAction(selected, 'rejected', comment)}>Reject</Button>
              <Button className="bg-[#F59E0B] text-white hover:bg-[#D97706]" onClick={() => onAction(selected, 'revision_requested', comment)}>Request Revision</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function ProfilePanel() {
  const user = useAuthStore((s) => s.user);
  return <Card><h2 className="mb-4 font-semibold">My Profile</h2><SimpleTable headers={['Field', 'Value']} rows={[['Name', user.name], ['Employee ID', user.employeeId], ['Role', user.role], ['Designation', user.designation], ['Station', user.station], ['Thematics', user.thematic.join(', ') || '-'], ['Projects', user.assignedProjects.join(', ') || '-']]} /></Card>;
}

function SimplePanel({ title, text }: { title: string; text: string }) {
  return <Card><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-[#6B7280]">{text}</p></Card>;
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={cn('block min-w-0 space-y-1 text-sm', className)}><span className="font-medium text-[#374151]">{label}</span>{children}</label>;
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="w-full overflow-x-auto rounded-lg border"><table className="w-full min-w-[600px] text-sm"><thead className="bg-gray-50"><tr>{headers.map((h) => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-[#6B7280]">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="max-w-[260px] px-3 py-2"><div className="truncate">{cell}</div></td>)}</tr>)}</tbody></table></div>;
}

function LineItems({ items, setItems }: { items: { details: string; amount: number }[]; setItems: (items: { details: string; amount: number }[]) => void }) {
  return <div className="mt-4 w-full overflow-x-auto rounded-lg border"><table className="w-full min-w-[620px] text-sm"><thead className="bg-gray-50"><tr>{['S/N', 'Details', 'Amount (₦)', ''].map((h) => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-[#6B7280]">{h}</th>)}</tr></thead><tbody>{items.map((item, index) => <tr key={index} className="border-t"><td className="px-3 py-2">{index + 1}</td><td className="px-3 py-2"><input value={item.details} onChange={(e) => setItems(items.map((x, i) => i === index ? { ...x, details: e.target.value } : x))} className="h-9 w-full rounded border px-2" /></td><td className="px-3 py-2"><input type="number" value={item.amount} onChange={(e) => setItems(items.map((x, i) => i === index ? { ...x, amount: Number(e.target.value) } : x))} className="h-9 w-full rounded border px-2" /></td><td className="px-3 py-2"><button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-[#E1332A]">Remove</button></td></tr>)}</tbody></table><Button variant="outline" className="m-2" onClick={() => setItems([...items, { details: '', amount: 0 }])}>Add Row</Button></div>;
}

function SimpleEditableRows<T extends Record<string, string>>({ rows, setRows, columns }: { rows: T[]; setRows: (rows: T[]) => void; columns: (keyof T & string)[] }) {
  const emptyRow = () => Object.fromEntries(columns.map((c) => [c, ''])) as T;
  return <div className="mt-2 w-full overflow-x-auto rounded-lg border"><table className="w-full min-w-[680px] text-sm"><thead className="bg-gray-50"><tr>{columns.map((c) => <th key={c} className="px-3 py-2 text-left text-xs font-semibold capitalize text-[#6B7280]">{c}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t">{columns.map((col) => <td key={col} className="px-3 py-2"><input value={row[col] ?? ''} onChange={(e) => setRows(rows.map((r, i) => i === index ? { ...r, [col]: e.target.value } as T : r))} className="h-9 w-full rounded border px-2" /></td>)}</tr>)}</tbody></table><Button variant="outline" className="m-2" onClick={() => setRows([...rows, emptyRow()])}>Add Row</Button></div>;
}

function ApprovalChain({ stages }: { stages: string[] }) {
  return <div className="mt-4 flex flex-wrap gap-2">{stages.map((stage, index) => <Badge key={stage} className={cn('border-0', index === 0 ? 'bg-[#247833]/10 text-[#247833]' : 'bg-gray-100 text-gray-600')}>{stage}</Badge>)}</div>;
}
