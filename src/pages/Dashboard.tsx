import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Download,
  FileDown,
  FileText,
  Goal,
  Pencil,
  Search,
  Settings,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { documents } from '@/data/common';
import { leaveRequests as seedLeaveRequests } from '@/data/leave';
import { goals as seedGoals } from '@/data/goals';
import { demoUsers, useAuthStore, type DemoUser } from '@/stores/useAuthStore';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { useAnnouncementsStore, type AnnouncementRecord, type AnnouncementType, type AnnouncementVisibility } from '@/stores/useAnnouncementsStore';
import { cn } from '@/lib/utils';

type DashboardTab = 'employees' | 'departments' | 'leave' | 'attendance' | 'onboarding';
type LeaveStatus = 'Approved' | 'Taken' | 'Scheduled' | 'Pending' | 'Rejected';

interface LeaveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  status: LeaveStatus;
  station: string;
  department: string;
  comments?: string;
  days: number;
}

interface DepartmentRecord {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  activeProjects: number;
}

const today = new Date();
const todayKey = today.toISOString().slice(0, 10);

const normalizeLeaveStatus = (status: string): LeaveStatus =>
  status === 'Pending Approval' ? 'Pending' : (status as LeaveStatus);

const initialLeaves: LeaveRecord[] = [
  ...seedLeaveRequests.map((leave, index) => {
    const user = demoUsers[index % demoUsers.length];
    return {
      id: leave.id,
      employeeId: user.id,
      employeeName: leave.employeeName,
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      status: normalizeLeaveStatus(leave.status),
      station: user.station,
      department: user.department,
      comments: leave.comments,
      days: leave.days,
    };
  }),
  {
    id: 'today-001',
    employeeId: 'u-james',
    employeeName: 'James Adeyemi',
    leaveType: 'Annual Leave',
    fromDate: todayKey,
    toDate: todayKey,
    status: 'Approved',
    station: 'Jos',
    department: 'Programs',
    comments: 'Approved one-day leave',
    days: 1,
  },
  {
    id: 'today-002',
    employeeId: 'u-chidi',
    employeeName: 'Chidi Nwachukwu',
    leaveType: 'Sick Leave',
    fromDate: todayKey,
    toDate: todayKey,
    status: 'Taken',
    station: 'Enugu',
    department: 'Programs',
    comments: 'Medical appointment',
    days: 1,
  },
];

const initialDepartments: DepartmentRecord[] = [
  'Programs',
  'Finance',
  'Audit',
  'Human Resources',
  'Communications',
  'Administration',
  'Monitoring & Evaluation',
  'National Director Office',
  'Procurement',
  'Logistics',
  'ICT',
].map((name, index) => ({
  id: `dept-${index}`,
  name,
  head: demoUsers.find((user) => user.department === name)?.name ?? 'Unassigned',
  staffCount: demoUsers.filter((user) => user.department === name).length,
  activeProjects: index % 4,
}));

const statusClasses: Record<string, string> = {
  Active: 'bg-[#247833]/10 text-[#247833]',
  Inactive: 'bg-gray-100 text-gray-600',
  Approved: 'bg-[#247833]/10 text-[#247833]',
  Taken: 'bg-gray-100 text-gray-600',
  Scheduled: 'bg-[#00578A]/10 text-[#00578A]',
  Pending: 'bg-[#F59E0B]/15 text-[#92400E]',
  Rejected: 'bg-[#E1332A]/10 text-[#E1332A]',
};

const canManageHr = (role: string) => ['HR Manager', 'HR Officer', 'Admin', 'Admin / Global Admin'].includes(role);
const canAdmin = (role: string) => ['Admin', 'Admin / Global Admin'].includes(role);

const dateInRange = (date: string, start: string, end: string) => date >= start && date <= end;

function StatusBadge({ status }: { status: string }) {
  return <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusClasses[status] ?? 'bg-gray-100 text-gray-600')}>{status}</span>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><XCircle className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm', className)}>{children}</section>;
}

function CardHeader({ title, icon: Icon, onSettings }: { title: string; icon: React.ElementType; onSettings?: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 p-4">
      <h3 className="flex items-center gap-2 font-semibold text-gray-900"><Icon className="h-5 w-5 text-gray-500" />{title}</h3>
      {onSettings && <button onClick={onSettings} className="text-gray-400 hover:text-gray-700"><Settings className="h-4 w-4" /></button>}
    </div>
  );
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csv(rows: Array<Array<string | number | undefined>>) {
  return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
}

export function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [employees, setEmployees] = useState<DemoUser[]>(demoUsers);
  const [leaves, setLeaves] = useState<LeaveRecord[]>(initialLeaves);
  const [departments, setDepartments] = useState<DepartmentRecord[]>(initialDepartments);
  const [goals, setGoals] = useState(seedGoals);
  const attendance = useAttendanceStore((state) => state.records);
  const announcements = useAnnouncementsStore((state) => state.announcements);
  const createAnnouncement = useAnnouncementsStore((state) => state.createAnnouncement);
  const canManageAnnouncements = useAnnouncementsStore((state) => state.canManage);
  const [activeTab, setActiveTab] = useState<DashboardTab>('employees');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null);
  const [selectedNews, setSelectedNews] = useState<AnnouncementRecord | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<(typeof seedGoals)[number] | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<DemoUser | null>(null);
  const [editEmployee, setEditEmployee] = useState<DemoUser | null>(null);
  const [tempPassword, setTempPassword] = useState<{ name: string; password: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DemoUser | null>(null);
  const [deleteText, setDeleteText] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState({ search: '', department: 'All', thematic: 'All', status: 'All', role: 'All' });
  const [widgetConfig, setWidgetConfig] = useState({ leaveRows: 5, showLeaveToday: true, newsRange: '30', docCategory: 'All', leaveBalanceType: 'Annual', leaveStatus: 'All' });
  const [settingsModal, setSettingsModal] = useState<string | null>(null);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    type: 'News' as AnnouncementType,
    body: '',
    thumbnail: '',
    visibility: 'All Staff' as AnnouncementVisibility,
    pinned: false,
    publishDate: new Date().toISOString().slice(0, 16),
    expiryDate: '',
  });

  const isHr = canManageHr(currentUser.role);
  const todayLeaves = leaves
    .filter((leave) => ['Approved', 'Taken', 'Scheduled'].includes(leave.status) && dateInRange(todayKey, leave.fromDate, leave.toDate))
    .slice(0, widgetConfig.leaveRows);
  const latestNews = announcements
    .filter((item) => item.type === 'News')
    .filter((item) => {
      if (widgetConfig.newsRange === 'All') return true;
      const age = (Date.now() - new Date(item.createdAt).getTime()) / 86400000;
      return age <= Number(widgetConfig.newsRange);
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt));
  const filteredEmployees = employees.filter((employee) => {
    const haystack = `${employee.name} ${employee.employeeId}`.toLowerCase();
    return (
      haystack.includes(filters.search.toLowerCase()) &&
      (filters.department === 'All' || employee.department === filters.department) &&
      (filters.thematic === 'All' || employee.thematics.includes(filters.thematic)) &&
      (filters.status === 'All' || employee.status === filters.status) &&
      (filters.role === 'All' || employee.role === filters.role)
    );
  });

  const leaveBalance = { used: 9, total: 24 };
  const remaining = leaveBalance.total - leaveBalance.used;
  const remainingPercent = remaining / leaveBalance.total;

  const updateLeave = (id: string, status: LeaveStatus) => {
    setLeaves((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    toast.success(`Leave ${status.toLowerCase()}`);
  };

  const resetPassword = (employee: DemoUser) => {
    const password = Math.random().toString(36).slice(2, 10);
    setEmployees((items) => items.map((item) => (item.id === employee.id ? { ...item, mustChangePassword: true, isFirstLogin: true } : item)));
    setTempPassword({ name: employee.name, password });
  };

  const exportEmployees = (rows = filteredEmployees) => {
    downloadTextFile('tlmn-employees.csv', csv([
      ['Name', 'Role', 'Department', 'Contact', 'Join Date'],
      ...rows.map((employee) => [employee.name, employee.role, employee.department, employee.email, '2026-01-01']),
    ]));
  };

  const bulkDeactivate = () => {
    setEmployees((items) => items.map((employee) => (selectedRows.includes(employee.id) ? { ...employee, status: 'Disabled' } : employee)));
    toast.success(`${selectedRows.length} employees deactivated`);
    setSelectedRows([]);
  };

  const createNews = () => {
    const record = createAnnouncement({
      ...announcementForm,
      publishDate: new Date(announcementForm.publishDate).toISOString(),
      expiryDate: announcementForm.expiryDate ? new Date(announcementForm.expiryDate).toISOString() : undefined,
    }, currentUser);
    if (!record) return toast.error('Only the Communications Officer can post announcements.');
    setAnnouncementOpen(false);
    toast.success('Announcement published');
  };

  return (
    <HrPageShell title="Employee Management" breadcrumbs={[{ label: 'People & HR' }, { label: 'Employee Management' }]}>
      <div className="w-full max-w-full min-w-0 overflow-hidden p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-sm text-gray-500">Live HR operations, staff records, leave, attendance, onboarding, and announcements.</p>
          </div>
          <Button className="bg-[#82154F] text-white" onClick={() => navigate('/hr/hr-administration')}>Create Staff Account</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {widgetConfig.showLeaveToday && (
            <Card>
              <CardHeader title="Employees on Leave Today" icon={Users} onSettings={() => setSettingsModal('leaveToday')} />
              <div className="divide-y divide-gray-50">
                {todayLeaves.map((leave) => (
                  <button key={leave.id} onClick={() => setSelectedLeave(leave)} className="flex w-full items-center gap-3 p-3 text-left hover:bg-gray-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#82154F]/10 text-sm font-semibold text-[#82154F]">{leave.employeeName[0]}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{leave.employeeName}</p>
                      <p className="truncate text-xs text-gray-500">{leave.leaveType} - {leave.station}</p>
                    </div>
                    <StatusBadge status={leave.status} />
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Latest News" icon={Bell} onSettings={() => setSettingsModal('news')} />
            <div className="space-y-3 p-4">
              {latestNews.slice(0, 3).map((news) => (
                <button key={news.id} onClick={() => setSelectedNews(news)} className="flex w-full gap-3 rounded-lg text-left hover:bg-gray-50">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#00578A]/10"><Bell className="h-5 w-5 text-[#00578A]" /></div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium">{news.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{new Date(news.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={() => canManageAnnouncements(currentUser.role) ? setAnnouncementOpen(true) : toast.error('Only the Communications Officer can post announcements.')}>
                Post Announcement
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Latest Documents" icon={FileDown} onSettings={() => setSettingsModal('documents')} />
            <div className="divide-y divide-gray-50">
              {documents.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3">
                  <FileText className="h-5 w-5 shrink-0 text-[#82154F]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.dateAdded}</p>
                  </div>
                  <button onClick={() => downloadTextFile(`${doc.name}.txt`, `${doc.name}\nDownloaded from TLMN DOHRMP`)} className="text-gray-500 hover:text-[#82154F]"><Download className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold"><Calendar className="h-5 w-5 text-gray-500" />Leave Balance</h3>
              <button onClick={() => setSettingsModal('balance')} className="text-gray-400 hover:text-gray-700"><Settings className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="9" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={remainingPercent < 0.3 ? '#F59E0B' : '#247833'} strokeWidth="9" strokeDasharray={`${remainingPercent * 251.2} 251.2`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{remaining}</span>
                  <span className="text-xs text-gray-500">of {leaveBalance.total} days</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold"><Calendar className="h-5 w-5 text-gray-500" />Leave List</h3>
              <button onClick={() => setSettingsModal('leaveList')} className="text-gray-400 hover:text-gray-700"><Settings className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 space-y-2">
              {leaves.slice(0, 5).map((leave) => (
                <button key={leave.id} onClick={() => setSelectedLeave(leave)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg p-2 text-left text-sm hover:bg-gray-50">
                  <span className="truncate">{leave.leaveType} - {leave.station}</span>
                  <StatusBadge status={leave.status} />
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold"><Goal className="h-5 w-5 text-gray-500" />Goals/OKRs</h3>
              <button onClick={() => setSettingsModal('goals')} className="text-gray-400 hover:text-gray-700"><Settings className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 space-y-3">
              {goals.slice(0, 5).map((goal) => (
                <button key={goal.id} onClick={() => setSelectedGoal(goal)} className="flex w-full items-center gap-3 rounded-lg text-left hover:bg-gray-50">
                  <ProgressRing value={goal.completion} />
                  <span className="min-w-0 truncate text-sm font-medium">{goal.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {[
              ['employees', 'All Employees'],
              ['departments', 'Departments'],
              ['leave', 'Leave Overview'],
              ['attendance', 'Attendance Summary'],
              ['onboarding', 'Onboarding Pipeline'],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key as DashboardTab)} className={cn('shrink-0 px-4 py-3 text-sm font-medium', activeTab === key ? 'border-b-2 border-[#82154F] text-[#82154F]' : 'text-gray-500 hover:text-gray-900')}>{label}</button>
            ))}
          </div>
          <div className="p-4">
            {activeTab === 'employees' && (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-5">
                  <div className="relative md:col-span-2"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input className="pl-9" placeholder="Search by name or ID" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></div>
                  <Select value={filters.department} onChange={(value) => setFilters({ ...filters, department: value })} options={['All', ...new Set(employees.map((x) => x.department))]} />
                  <Select value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} options={['All', 'Active', 'Disabled']} />
                  <Select value={filters.role} onChange={(value) => setFilters({ ...filters, role: value })} options={['All', ...new Set(employees.map((x) => x.role))]} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportEmployees(filteredEmployees)}>Bulk Export CSV</Button>
                  <Button variant="outline" size="sm" disabled={!selectedRows.length} onClick={bulkDeactivate}>Bulk Deactivate</Button>
                  <Button variant="outline" size="sm" disabled={!selectedRows.length} onClick={() => toast.success('Selected staff assigned to thematic')}>Bulk Assign Thematic</Button>
                </div>
                <Table headers={['', 'Photo', 'Name', 'Employee ID', 'Department', 'Designation', 'Thematic(s)', 'Status', 'Date Joined', 'Actions']}>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-t">
                      <td className="px-3 py-2"><input type="checkbox" checked={selectedRows.includes(employee.id)} onChange={(e) => setSelectedRows((rows) => e.target.checked ? [...rows, employee.id] : rows.filter((id) => id !== employee.id))} /></td>
                      <td className="px-3 py-2"><img src={employee.avatar} className="h-9 w-9 rounded-full object-cover" /></td>
                      <td className="px-3 py-2 font-medium">{employee.name}</td>
                      <td className="px-3 py-2">{employee.employeeId}</td>
                      <td className="px-3 py-2">{employee.department}</td>
                      <td className="px-3 py-2">{employee.designation}</td>
                      <td className="px-3 py-2">{employee.thematics.join(', ') || '-'}</td>
                      <td className="px-3 py-2"><StatusBadge status={employee.status === 'Active' ? 'Active' : 'Inactive'} /></td>
                      <td className="px-3 py-2">2026-01-01</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/hr/employees/${employee.id}/profile`)}>Profile</Button>
                          {isHr && <Button variant="ghost" size="sm" onClick={() => setEditEmployee(employee)}><Pencil className="h-4 w-4" /></Button>}
                          {isHr && <Button variant="ghost" size="sm" onClick={() => setEmployees((rows) => rows.map((row) => row.id === employee.id ? { ...row, status: row.status === 'Active' ? 'Disabled' : 'Active' } : row))}>{employee.status === 'Active' ? 'Deactivate' : 'Reactivate'}</Button>}
                          {isHr && <Button variant="ghost" size="sm" onClick={() => resetPassword(employee)}>Reset</Button>}
                          {canAdmin(currentUser.role) && <Button variant="ghost" size="sm" className="text-[#E1332A]" onClick={() => setDeleteTarget(employee)}><Trash2 className="h-4 w-4" /></Button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}
            {activeTab === 'departments' && (
              <div className="space-y-3">
                <Button className="bg-[#82154F] text-white" onClick={() => setDepartments([...departments, { id: `dept-${Date.now()}`, name: 'New Department', head: 'Unassigned', staffCount: 0, activeProjects: 0 }])}>Add Department</Button>
                <Table headers={['Name', 'Head of Department', 'Staff Count', 'Active Projects', 'Actions']}>
                  {departments.map((dept) => (
                    <tr key={dept.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{dept.name}</td>
                      <td className="px-3 py-2">{dept.head}</td>
                      <td className="px-3 py-2">{dept.staffCount}</td>
                      <td className="px-3 py-2">{dept.activeProjects}</td>
                      <td className="px-3 py-2"><Button variant="ghost" size="sm" onClick={() => toast.success('Department edit saved')}>Edit</Button><Button variant="ghost" size="sm" className="text-[#E1332A]" onClick={() => setDepartments(departments.filter((item) => item.id !== dept.id))}>Delete</Button></td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}
            {activeTab === 'leave' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadTextFile('leave-report.csv', csv([['Employee', 'Type', 'Date Range', 'Status'], ...leaves.map((leave) => [leave.employeeName, leave.leaveType, `${leave.fromDate} - ${leave.toDate}`, leave.status])]))}>Export CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => downloadTextFile('leave-report.pdf.txt', 'PDF export placeholder for leave report')}>Export PDF</Button>
                </div>
                <Table headers={['Employee', 'Leave Type', 'Station', 'Date Range', 'Status', 'Actions']}>
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="border-t">
                      <td className="px-3 py-2">{leave.employeeName}</td>
                      <td className="px-3 py-2">{leave.leaveType}</td>
                      <td className="px-3 py-2">{leave.station}</td>
                      <td className="px-3 py-2">{leave.fromDate} - {leave.toDate}</td>
                      <td className="px-3 py-2"><StatusBadge status={leave.status} /></td>
                      <td className="px-3 py-2"><Button variant="ghost" size="sm" onClick={() => setSelectedLeave(leave)}>View</Button>{leave.status === 'Pending' && isHr && <Button variant="ghost" size="sm" onClick={() => updateLeave(leave.id, 'Approved')}>Approve</Button>}{leave.status === 'Pending' && isHr && <Button variant="ghost" size="sm" className="text-[#E1332A]" onClick={() => updateLeave(leave.id, 'Rejected')}>Reject</Button>}</td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}
            {activeTab === 'attendance' && <AttendanceSummary employees={employees} records={attendance} />}
            {activeTab === 'onboarding' && <OnboardingPipeline employees={employees} />}
          </div>
        </div>
      </div>

      {selectedLeave && <Modal title="Leave Record" onClose={() => setSelectedLeave(null)}><LeaveDetail leave={selectedLeave} canApprove={isHr} onStatus={(status) => updateLeave(selectedLeave.id, status)} /></Modal>}
      {selectedNews && <Modal title={selectedNews.title} onClose={() => setSelectedNews(null)}><p className="text-sm text-gray-500">{new Date(selectedNews.createdAt).toLocaleString()} - {selectedNews.createdByName}</p><div className="mt-4 whitespace-pre-wrap text-sm">{selectedNews.body}</div></Modal>}
      {selectedGoal && <Modal title="Goal Detail" onClose={() => setSelectedGoal(null)}><GoalDetail goal={selectedGoal} canEdit={isHr} onProgress={(completion) => setGoals((items) => items.map((item) => item.id === selectedGoal.id ? { ...item, completion } : item))} /></Modal>}
      {selectedEmployee && <Modal title={selectedEmployee.name} onClose={() => setSelectedEmployee(null)}><pre className="overflow-auto rounded-lg bg-gray-50 p-4 text-xs">{JSON.stringify(selectedEmployee, null, 2)}</pre></Modal>}
      {editEmployee && <Modal title="Edit Employee" onClose={() => setEditEmployee(null)}><EditEmployee employee={editEmployee} onSave={(next) => { setEmployees((items) => items.map((item) => item.id === next.id ? next : item)); setEditEmployee(null); toast.success('Employee updated'); }} /></Modal>}
      {tempPassword && <Modal title="Temporary Password" onClose={() => setTempPassword(null)}><p className="text-sm">New temporary password for {tempPassword.name}:</p><div className="mt-3 rounded-lg bg-gray-50 p-3 font-mono text-lg">{tempPassword.password}</div><Button className="mt-3" onClick={() => navigator.clipboard.writeText(tempPassword.password)}>Copy</Button></Modal>}
      {deleteTarget && <Modal title="Confirm Delete" onClose={() => setDeleteTarget(null)}><p className="text-sm text-[#E1332A]">This will permanently delete all records for {deleteTarget.name}. Type DELETE to confirm.</p><Input className="mt-3" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} /><Button className="mt-3 bg-[#E1332A] text-white" disabled={deleteText !== 'DELETE'} onClick={() => { setEmployees((items) => items.filter((item) => item.id !== deleteTarget.id)); setDeleteTarget(null); setDeleteText(''); }}>Delete Permanently</Button></Modal>}
      {settingsModal && <Modal title="Widget Settings" onClose={() => setSettingsModal(null)}><WidgetSettings id={settingsModal} config={widgetConfig} setConfig={setWidgetConfig} /></Modal>}
      {announcementOpen && <Modal title="Create Announcement" onClose={() => setAnnouncementOpen(false)}><AnnouncementForm form={announcementForm} setForm={setAnnouncementForm} onSubmit={createNews} /></Modal>}
    </HrPageShell>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm">{options.map((option) => <option key={option}>{option}</option>)}</select>;
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-[#F8FAFC]"><tr>{headers.map((header) => <th key={header} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{header}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  return (
    <div className="relative h-10 w-10 shrink-0">
      <svg className="-rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={value >= 70 ? '#247833' : value >= 40 ? '#F59E0B' : '#00578A'} strokeWidth="10" strokeDasharray={`${(value / 100) * 251.2} 251.2`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{value}%</span>
    </div>
  );
}

function LeaveDetail({ leave, canApprove, onStatus }: { leave: LeaveRecord; canApprove: boolean; onStatus: (status: LeaveStatus) => void }) {
  return (
    <div className="space-y-3 text-sm">
      <p><b>Employee:</b> {leave.employeeName}</p>
      <p><b>Type:</b> {leave.leaveType}</p>
      <p><b>Date Range:</b> {leave.fromDate} - {leave.toDate}</p>
      <p><b>Station:</b> {leave.station}</p>
      <p><b>Comments:</b> {leave.comments}</p>
      <StatusBadge status={leave.status} />
      {canApprove && leave.status === 'Pending' && <div className="flex gap-2"><Button onClick={() => onStatus('Approved')} className="bg-[#247833] text-white">Approve</Button><Button onClick={() => onStatus('Rejected')} className="bg-[#E1332A] text-white">Reject</Button><Button variant="outline" onClick={() => toast.success('More information requested')}>Request More Info</Button></div>}
    </div>
  );
}

function GoalDetail({ goal, canEdit, onProgress }: { goal: (typeof seedGoals)[number]; canEdit: boolean; onProgress: (value: number) => void }) {
  const [progress, setProgress] = useState(goal.completion);
  return (
    <div className="space-y-3 text-sm">
      <p>{goal.description}</p>
      <p><b>Owner:</b> {goal.owner}</p>
      <p><b>Target Date:</b> {goal.dueDate}</p>
      <p><b>Status:</b> {goal.status}</p>
      <p><b>Key Results:</b> Recruitment quality, staff experience, process completion, audit readiness.</p>
      {canEdit && <div><Input type="number" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} /><Button className="mt-2 bg-[#82154F] text-white" onClick={() => onProgress(progress)}>Save Progress</Button></div>}
    </div>
  );
}

function EditEmployee({ employee, onSave }: { employee: DemoUser; onSave: (employee: DemoUser) => void }) {
  const [form, setForm] = useState(employee);
  return (
    <div className="grid gap-3">
      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
      <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
      <Input type="date" defaultValue="2026-01-01" />
      <Button className="bg-[#82154F] text-white" onClick={() => onSave(form)}>Save Changes</Button>
    </div>
  );
}

function WidgetSettings({ id, config, setConfig }: { id: string; config: { leaveRows: number; showLeaveToday: boolean; newsRange: string; docCategory: string; leaveBalanceType: string; leaveStatus: string }; setConfig: (config: { leaveRows: number; showLeaveToday: boolean; newsRange: string; docCategory: string; leaveBalanceType: string; leaveStatus: string }) => void }) {
  return (
    <div className="space-y-4 text-sm">
      {id === 'leaveToday' && <><label className="flex items-center gap-2"><input type="checkbox" checked={config.showLeaveToday} onChange={(e) => setConfig({ ...config, showLeaveToday: e.target.checked })} /> Show widget</label><Input type="number" value={config.leaveRows} onChange={(e) => setConfig({ ...config, leaveRows: Number(e.target.value) })} /></>}
      {id === 'news' && <Select value={config.newsRange} onChange={(value) => setConfig({ ...config, newsRange: value })} options={['7', '30', 'All']} />}
      {id === 'documents' && <Select value={config.docCategory} onChange={(value) => setConfig({ ...config, docCategory: value })} options={['All', 'Policy', 'HR', 'Finance', 'Project']} />}
      {id === 'balance' && <Select value={config.leaveBalanceType} onChange={(value) => setConfig({ ...config, leaveBalanceType: value })} options={['Annual', 'Sick', 'All combined']} />}
      {id === 'leaveList' && <Select value={config.leaveStatus} onChange={(value) => setConfig({ ...config, leaveStatus: value })} options={['All', 'Approved', 'Taken', 'Scheduled', 'Pending', 'Rejected']} />}
      {id === 'goals' && <p>Goal filters by department, owner, and status are ready for the connected database layer.</p>}
    </div>
  );
}

function AnnouncementForm({ form, setForm, onSubmit }: { form: { title: string; type: AnnouncementType; body: string; thumbnail: string; visibility: AnnouncementVisibility; pinned: boolean; publishDate: string; expiryDate: string }; setForm: (form: { title: string; type: AnnouncementType; body: string; thumbnail: string; visibility: AnnouncementVisibility; pinned: boolean; publishDate: string; expiryDate: string }) => void; onSubmit: () => void }) {
  return (
    <div className="grid gap-3">
      <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <Select value={form.type} onChange={(value) => setForm({ ...form, type: value as AnnouncementType })} options={['News', 'Policy Update', 'Event', 'General Announcement', 'Emergency Notice']} />
      <Textarea placeholder="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      <Input placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
      <Select value={form.visibility} onChange={(value) => setForm({ ...form, visibility: value as AnnouncementVisibility })} options={['All Staff', 'HR Only', 'Program Staff', 'Finance & Audit']} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Pin to top</label>
      <Input type="datetime-local" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} />
      <Input type="datetime-local" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
      <Button className="bg-[#82154F] text-white" onClick={onSubmit}>Publish</Button>
    </div>
  );
}

function AttendanceSummary({ employees, records }: { employees: DemoUser[]; records: ReturnType<typeof useAttendanceStore.getState>['records'] }) {
  const month = new Date().toISOString().slice(0, 7);
  return (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={() => downloadTextFile('attendance-summary.csv', csv([['Employee', 'Present', 'Absent', 'Late', 'Rate'], ...employees.map((employee) => [employee.name, records.filter((record) => record.employeeId === employee.id && record.date.startsWith(month)).length, 0, records.filter((record) => record.employeeId === employee.id && record.status === 'Late').length, '100%'])]))}>Export CSV</Button>
      <Table headers={['Employee', 'Days Present', 'Days Absent', 'Days Late', 'Attendance Rate', 'Actions']}>
        {employees.map((employee) => {
          const present = records.filter((record) => record.employeeId === employee.id && record.date.startsWith(month)).length;
          const late = records.filter((record) => record.employeeId === employee.id && record.status === 'Late').length;
          return <tr key={employee.id} className="border-t"><td className="px-3 py-2">{employee.name}</td><td className="px-3 py-2">{present}</td><td className="px-3 py-2">0</td><td className="px-3 py-2">{late}</td><td className="px-3 py-2">{present ? 100 : 0}%</td><td className="px-3 py-2"><Button variant="ghost" size="sm">History</Button></td></tr>;
        })}
      </Table>
    </div>
  );
}

function OnboardingPipeline({ employees }: { employees: DemoUser[] }) {
  return (
    <Table headers={['Employee', 'Account Created', 'First Login', 'Profile Complete', 'Actions']}>
      {employees.filter((employee) => employee.isFirstLogin || employee.mustChangePassword).concat(employees.slice(0, 3)).map((employee) => (
        <tr key={employee.id} className="border-t">
          <td className="px-3 py-2">{employee.name}</td>
          <td className="px-3 py-2"><CheckCircle2 className="h-4 w-4 text-[#247833]" /></td>
          <td className="px-3 py-2">{employee.isFirstLogin ? 'Pending' : 'Done'}</td>
          <td className="px-3 py-2">{employee.isFirstLogin ? 'Pending' : 'Complete'}</td>
          <td className="px-3 py-2"><Button variant="ghost" size="sm" onClick={() => toast.success(`Reminder sent to ${employee.name}`)}>Send Reminder</Button></td>
        </tr>
      ))}
    </Table>
  );
}
