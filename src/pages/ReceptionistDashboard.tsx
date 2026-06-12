import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Search, UserRoundPlus } from 'lucide-react';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmployeeVoiceWidget } from '@/components/safeguarding/EmployeeVoiceWidget';
import { demoUsers, useAuthStore } from '@/stores/useAuthStore';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { useVisitorStore } from '@/stores/useVisitorStore';
import { useAnnouncementsStore } from '@/stores/useAnnouncementsStore';
import { cn } from '@/lib/utils';

const todayKey = new Date().toISOString().slice(0, 10);

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm', className)}>{children}</section>;
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold" style={{ color }}>{value}</p>
    </Card>
  );
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-[#F8FAFC]"><tr>{headers.map((header) => <th key={header} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{header}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = status.includes('Present') ? 'bg-[#247833]/10 text-[#247833]' : status === 'Late' ? 'bg-[#F59E0B]/15 text-[#92400E]' : status === 'Absent' ? 'bg-[#E1332A]/10 text-[#E1332A]' : 'bg-gray-100 text-gray-600';
  return <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', color)}>{status}</span>;
}

export function ReceptionistDashboard() {
  const attendanceRecords = useAttendanceStore((state) => state.records);
  const summary = useAttendanceStore((state) => state.summary);
  const visitors = useVisitorStore((state) => state.visitors);
  const announcements = useAnnouncementsStore((state) => state.announcements);
  const todayRecords = attendanceRecords.filter((record) => record.date === todayKey);
  const attendance = summary();
  const onLeave = 2;

  return (
    <ModulePage title="Receptionist Dashboard" breadcrumbs={[{ label: 'Front Desk' }, { label: 'Dashboard' }]}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Total Staff Expected Today" value={attendance.expected} color="#111827" />
        <Metric label="Present" value={attendance.present} color="#247833" />
        <Metric label="Absent" value={attendance.absent} color="#E1332A" />
        <Metric label="Late" value={attendance.late} color="#F59E0B" />
        <Metric label="On Leave" value={onLeave} color="#00578A" />
      </div>

      <Card className="mt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold">Today's Attendance Live Feed</h3>
          <Button variant="outline" size="sm" onClick={() => downloadTextFile('today-attendance.pdf.txt', 'Attendance PDF export placeholder')}><Download className="h-4 w-4" /> Export PDF</Button>
        </div>
        <AttendanceTable records={todayRecords} />
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Leave List - Today + Upcoming 7 Days</h3>
            <Link to="/receptionist/leave" className="text-sm font-medium text-[#82154F]">View All</Link>
          </div>
          <Table headers={['Employee', 'Leave Type', 'Date Range', 'Status']}>
            {['James Adeyemi', 'Chidi Nwachukwu', 'Faith Musa'].map((name, index) => (
              <tr key={name} className="border-t"><td className="px-3 py-2">{name}</td><td className="px-3 py-2">{index === 1 ? 'Sick Leave' : 'Annual Leave'}</td><td className="px-3 py-2">{todayKey} - {todayKey}</td><td className="px-3 py-2"><StatusBadge status={index === 2 ? 'Scheduled' : 'Approved'} /></td></tr>
            ))}
          </Table>
        </Card>
        <DirectoryQuickLookup />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Visitor Log - Today</h3>
            <Button size="sm" className="bg-[#82154F] text-white" asChild><Link to="/receptionist/visitors">+ Log Visitor</Link></Button>
          </div>
          <Table headers={['Visitor', 'Host', 'Check In', 'Check Out', 'Purpose']}>
            {visitors.slice(0, 5).map((visitor) => (
              <tr key={visitor.id} className="border-t"><td className="px-3 py-2">{visitor.visitorName}</td><td className="px-3 py-2">{visitor.hostEmployeeName}</td><td className="px-3 py-2">{new Date(visitor.checkInTime).toLocaleTimeString()}</td><td className="px-3 py-2">{visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleTimeString() : '-'}</td><td className="px-3 py-2">{visitor.purpose}</td></tr>
            ))}
          </Table>
        </Card>
        <Card>
          <h3 className="mb-3 font-semibold">Latest News / Announcements</h3>
          <div className="space-y-3">
            {announcements.slice(0, 4).map((item) => <div key={item.id} className="rounded-lg bg-[#F8FAFC] p-3"><p className="font-medium">{item.title}</p><p className="text-xs text-gray-500">{item.type} - {new Date(item.createdAt).toLocaleDateString()}</p></div>)}
          </div>
        </Card>
      </div>
      <EmployeeVoiceWidget />
    </ModulePage>
  );
}

function AttendanceTable({ records }: { records: ReturnType<typeof useAttendanceStore.getState>['records'] }) {
  const [query, setQuery] = useState('');
  const filtered = records.filter((record) => record.employeeName.toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      <div className="relative mb-3 max-w-md"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input className="pl-9" placeholder="Search by name or department" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      <Table headers={['Employee Name', 'Sign In Time', 'Sign Out Time', 'Status']}>
        {filtered.map((record) => (
          <tr key={record.id} className="border-t"><td className="px-3 py-2">{record.employeeName}</td><td className="px-3 py-2">{record.signInTime ? new Date(record.signInTime).toLocaleTimeString() : '-'}</td><td className="px-3 py-2">{record.signOutTime ? new Date(record.signOutTime).toLocaleTimeString() : '-'}</td><td className="px-3 py-2"><StatusBadge status={record.status} /></td></tr>
        ))}
        {!filtered.length && <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-500">No scans recorded today.</td></tr>}
      </Table>
    </div>
  );
}

function DirectoryQuickLookup() {
  const [query, setQuery] = useState('');
  const employees = demoUsers.filter((user) => `${user.name} ${user.department}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <Card>
      <h3 className="mb-3 font-semibold">Employee Directory Quick Lookup</h3>
      <div className="relative mb-3"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input className="pl-9" placeholder="Type name or department" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      <div className="grid gap-2 sm:grid-cols-2">
        {employees.slice(0, 8).map((employee) => (
          <div key={employee.id} className="flex min-w-0 gap-3 rounded-lg bg-[#F8FAFC] p-3">
            <img src={employee.avatar} className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{employee.name}</p>
              <p className="truncate text-xs text-gray-500">{employee.designation} - {employee.department}</p>
              <p className="text-xs text-gray-500">Ext {employee.employeeId.slice(-3)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ReceptionistVisitorsPage() {
  const user = useAuthStore((state) => state.user);
  const visitors = useVisitorStore((state) => state.visitors);
  const logVisitor = useVisitorStore((state) => state.logVisitor);
  const checkOut = useVisitorStore((state) => state.checkOut);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    visitorName: '',
    visitorPhone: '',
    hostEmployeeId: demoUsers[0].id,
    purpose: '',
    checkInTime: new Date().toISOString().slice(0, 16),
    expectedDuration: '1 hr',
    photoUrl: '',
  });
  const host = demoUsers.find((employee) => employee.id === form.hostEmployeeId) ?? demoUsers[0];
  const totalToday = visitors.filter((visitor) => visitor.checkInTime.slice(0, 10) === todayKey).length;
  const checkedIn = visitors.filter((visitor) => visitor.status === 'Checked In').length;

  const submit = () => {
    if (!form.visitorName.trim() || !form.purpose.trim()) return toast.error('Visitor name and purpose are required');
    logVisitor({ ...form, hostEmployeeName: host.name, checkInTime: new Date(form.checkInTime).toISOString() }, user);
    setFormOpen(false);
    toast.success('Visitor logged');
  };

  return (
    <ModulePage title="Visitor Log" breadcrumbs={[{ label: 'Front Desk' }, { label: 'Visitor Log' }]} actions={<Button className="bg-[#82154F] text-white" onClick={() => setFormOpen(true)}><UserRoundPlus className="h-4 w-4" /> Log New Visitor</Button>}>
      <div className="mb-4 grid gap-4 sm:grid-cols-2"><Metric label="Total visitors today" value={totalToday} color="#00578A" /><Metric label="Currently checked in" value={checkedIn} color="#247833" /></div>
      <div className="mb-3 flex flex-wrap gap-2"><Button variant="outline" onClick={() => downloadTextFile('visitor-log.csv', 'Visitor CSV export')}>Export CSV</Button><Button variant="outline" onClick={() => downloadTextFile('visitor-log.pdf.txt', 'Visitor PDF export placeholder')}>Export PDF</Button></div>
      <Table headers={['S/N', 'Visitor Name', 'Phone', 'Host', 'Purpose', 'Check-In', 'Check-Out', 'Status', 'Actions']}>
        {visitors.map((visitor, index) => (
          <tr key={visitor.id} className="border-t"><td className="px-3 py-2">{index + 1}</td><td className="px-3 py-2">{visitor.visitorName}</td><td className="px-3 py-2">{visitor.visitorPhone}</td><td className="px-3 py-2">{visitor.hostEmployeeName}</td><td className="px-3 py-2">{visitor.purpose}</td><td className="px-3 py-2">{new Date(visitor.checkInTime).toLocaleTimeString()}</td><td className="px-3 py-2">{visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleTimeString() : '-'}</td><td className="px-3 py-2"><StatusBadge status={visitor.status} /></td><td className="px-3 py-2">{visitor.status === 'Checked In' && <Button variant="ghost" size="sm" onClick={() => checkOut(visitor.id)}>Check Out</Button>}</td></tr>
        ))}
      </Table>
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold">Log New Visitor</h2>
            <div className="mt-4 grid gap-3">
              <Input placeholder="Visitor Name" value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} />
              <Input placeholder="Visitor Phone" value={form.visitorPhone} onChange={(e) => setForm({ ...form, visitorPhone: e.target.value })} />
              <select value={form.hostEmployeeId} onChange={(e) => setForm({ ...form, hostEmployeeId: e.target.value })} className="h-10 rounded-md border px-3">{demoUsers.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select>
              <Textarea placeholder="Purpose of Visit" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
              <Input type="datetime-local" value={form.checkInTime} onChange={(e) => setForm({ ...form, checkInTime: e.target.value })} />
              <select value={form.expectedDuration} onChange={(e) => setForm({ ...form, expectedDuration: e.target.value })} className="h-10 rounded-md border px-3">{['30 min', '1 hr', '2 hrs', 'Other'].map((item) => <option key={item}>{item}</option>)}</select>
            </div>
            <div className="mt-4 flex gap-2"><Button className="bg-[#82154F] text-white" onClick={submit}>Save Visitor</Button><Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button></div>
          </div>
        </div>
      )}
    </ModulePage>
  );
}

export function ReceptionistAttendancePage() {
  const records = useAttendanceStore((state) => state.records).filter((record) => record.date === todayKey);
  return <ModulePage title="Attendance - Read Only" breadcrumbs={[{ label: 'Front Desk' }, { label: 'Attendance' }]} actions={<Button variant="outline" onClick={() => downloadTextFile('reception-attendance.csv', 'Attendance export')}>Export</Button>}><AttendanceTable records={records} /></ModulePage>;
}

export function ReceptionistDirectoryPage() {
  return <ModulePage title="Employee Directory" breadcrumbs={[{ label: 'Front Desk' }, { label: 'Directory' }]}><DirectoryQuickLookup /></ModulePage>;
}

export function ReceptionistLeavePage() {
  return (
    <ModulePage title="Leave List - Read Only" breadcrumbs={[{ label: 'Front Desk' }, { label: 'Leave List' }]}>
      <Table headers={['Employee', 'Leave Type', 'Date Range', 'Status']}>
        {['James Adeyemi', 'Chidi Nwachukwu', 'Faith Musa', 'Aaron Hamilton'].map((name, index) => <tr key={name} className="border-t"><td className="px-3 py-2">{name}</td><td className="px-3 py-2">{index === 1 ? 'Sick Leave' : 'Annual Leave'}</td><td className="px-3 py-2">{todayKey} - {todayKey}</td><td className="px-3 py-2"><StatusBadge status={index === 3 ? 'Scheduled' : 'Approved'} /></td></tr>)}
      </Table>
    </ModulePage>
  );
}

export function ReceptionistAnnouncementsPage() {
  const announcements = useAnnouncementsStore((state) => state.announcements);
  return <ModulePage title="Announcements" breadcrumbs={[{ label: 'Communications' }]}><div className="grid gap-3">{announcements.map((item) => <Card key={item.id}><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-gray-500">{item.type} - {item.visibility}</p><p className="mt-3 text-sm">{item.body}</p></Card>)}</div></ModulePage>;
}
