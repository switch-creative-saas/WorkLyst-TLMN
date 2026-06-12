import { useState } from 'react';
import { Download, FileText, Image, Plus, Send, Target, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmployeeVoiceWidget } from '@/components/safeguarding/EmployeeVoiceWidget';
import { documents as seedDocuments } from '@/data/common';
import { goals as seedGoals } from '@/data/goals';
import { demoUsers, useAuthStore } from '@/stores/useAuthStore';
import { useAnnouncementsStore, type AnnouncementRecord, type AnnouncementType, type AnnouncementVisibility } from '@/stores/useAnnouncementsStore';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { cn } from '@/lib/utils';

type ModalKind = 'announcement' | 'news' | 'document' | 'broadcast' | 'media' | 'goal' | null;

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm', className)}>{children}</section>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <Card><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-[#82154F]">{value}</p></Card>;
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="w-full overflow-x-auto rounded-lg border"><table className="w-full min-w-[820px] text-sm"><thead className="bg-[#F8FAFC]"><tr>{headers.map((header) => <th key={header} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'Published' ? 'bg-[#247833]/10 text-[#247833]' : status === 'Scheduled' ? 'bg-[#00578A]/10 text-[#00578A]' : status === 'Expired' ? 'bg-[#E1332A]/10 text-[#E1332A]' : 'bg-gray-100 text-gray-600';
  return <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', color)}>{status}</span>;
}

const statusFor = (item: AnnouncementRecord) => {
  const now = Date.now();
  if (item.expiryDate && new Date(item.expiryDate).getTime() < now) return 'Expired';
  if (new Date(item.publishDate).getTime() > now) return 'Scheduled';
  return 'Published';
};

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl"><div className="mb-4 flex justify-between gap-3"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose}>Close</button></div>{children}</div></div>;
}

export function CommunicationsDashboard() {
  const announcements = useAnnouncementsStore((state) => state.announcements);
  const orgName = 'TLMN DOHRMP';
  const news = announcements.filter((item) => item.type === 'News');
  const [modal, setModal] = useState<ModalKind>(null);
  return (
    <ModulePage title="Communications Dashboard" breadcrumbs={[{ label: 'Communications' }, { label: 'Dashboard' }]}>
      <Card className="mb-4 border-[#82154F]/20 bg-[#82154F]/5">
        <h2 className="text-2xl font-bold">Communications Hub - {orgName}</h2>
        <p className="mt-1 text-sm text-gray-600">Manage announcements, news, and organizational communications.</p>
      </Card>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Announcements Published" value={announcements.length} />
        <Metric label="Active News Posts" value={news.length} />
        <Metric label="Documents in Library" value={seedDocuments.length} />
        <Metric label="Upcoming Events/Notices" value={announcements.filter((item) => item.type === 'Event').length} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <QuickAction icon={Plus} label="New Announcement" onClick={() => setModal('announcement')} />
        <QuickAction icon={FileText} label="News Post" onClick={() => setModal('news')} />
        <QuickAction icon={Download} label="Upload Document" onClick={() => setModal('document')} />
        <QuickAction icon={Send} label="Broadcast Notice" onClick={() => setModal('broadcast')} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AnnouncementsTable items={announcements.slice(0, 5)} onCreate={() => setModal('announcement')} />
        <DocumentsPreview onUpload={() => setModal('document')} />
      </div>
      <Card className="mt-4">
        <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Goals/OKRs Overview</h3><Button size="sm" onClick={() => setModal('goal')}><Plus className="h-4 w-4" /> Add Goal</Button></div>
        <GoalsTable />
      </Card>
      <EmployeeVoiceWidget />
      {modal && <Modal title="Create Content" onClose={() => setModal(null)}><CreateContentForm kind={modal} onDone={() => setModal(null)} /></Modal>}
    </ModulePage>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex min-w-0 items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm hover:border-[#82154F]/40"><Icon className="h-6 w-6 text-[#82154F]" /><span className="font-semibold">{label}</span></button>;
}

function AnnouncementsTable({ items, onCreate }: { items: AnnouncementRecord[]; onCreate: () => void }) {
  const deleteAnnouncement = useAnnouncementsStore((state) => state.deleteAnnouncement);
  const user = useAuthStore((state) => state.user);
  return <Card><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Recent Announcements</h3><Button size="sm" onClick={onCreate}>Create New</Button></div><Table headers={['Title', 'Type', 'Visibility', 'Published Date', 'Status', 'Actions']}>{items.map((item) => <tr key={item.id} className="border-t"><td className="px-3 py-2">{item.title}</td><td className="px-3 py-2">{item.type}</td><td className="px-3 py-2">{item.visibility}</td><td className="px-3 py-2">{new Date(item.publishDate).toLocaleDateString()}</td><td className="px-3 py-2"><StatusBadge status={statusFor(item)} /></td><td className="px-3 py-2"><Button variant="ghost" size="sm">Edit</Button><Button variant="ghost" size="sm" onClick={() => toast.success('Draft copy created')}>Duplicate</Button><Button variant="ghost" size="sm" className="text-[#E1332A]" onClick={() => deleteAnnouncement(item.id, user.role)}><Trash2 className="h-4 w-4" /></Button></td></tr>)}</Table></Card>;
}

function DocumentsPreview({ onUpload }: { onUpload: () => void }) {
  return <Card><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Documents Library Preview</h3><Button size="sm" variant="outline" onClick={onUpload}>Upload</Button></div><Table headers={['Filename', 'Category', 'Upload Date', 'Downloads', 'Actions']}>{seedDocuments.slice(0, 5).map((doc, index) => <tr key={doc.id} className="border-t"><td className="px-3 py-2">{doc.name}</td><td className="px-3 py-2">{doc.type}</td><td className="px-3 py-2">{doc.dateAdded}</td><td className="px-3 py-2">{index * 7 + 3}</td><td className="px-3 py-2"><Button variant="ghost" size="sm">Download</Button><Button variant="ghost" size="sm">Edit</Button><Button variant="ghost" size="sm" className="text-[#E1332A]">Delete</Button></td></tr>)}</Table></Card>;
}

function GoalsTable() {
  return <Table headers={['Goal Title', 'Owner', 'Department', 'Progress', 'Target Date', 'Status', 'Actions']}>{seedGoals.slice(0, 6).map((goal) => <tr key={goal.id} className="border-t"><td className="px-3 py-2">{goal.name}</td><td className="px-3 py-2">{goal.owner}</td><td className="px-3 py-2">{goal.level}</td><td className="px-3 py-2">{goal.completion}%</td><td className="px-3 py-2">{goal.dueDate}</td><td className="px-3 py-2">{goal.completion >= 100 ? 'Completed' : goal.completion < 40 ? 'At Risk' : 'On Track'}</td><td className="px-3 py-2"><Button variant="ghost" size="sm">Edit</Button></td></tr>)}</Table>;
}

function CreateContentForm({ kind, onDone }: { kind: ModalKind; onDone: () => void }) {
  const user = useAuthStore((state) => state.user);
  const createAnnouncement = useAnnouncementsStore((state) => state.createAnnouncement);
  const [form, setForm] = useState({ title: '', type: kind === 'news' ? 'News' : 'General Announcement', body: '', visibility: 'All Staff', publishDate: new Date().toISOString().slice(0, 16), expiryDate: '', pinned: false });
  const submit = () => {
    if (kind === 'broadcast') {
      useAuthStore.getState().addNotification(`Broadcast: ${form.title}`);
      toast.success('Broadcast sent');
      onDone();
      return;
    }
    if (kind === 'document' || kind === 'media' || kind === 'goal') {
      toast.success(`${kind} saved`);
      onDone();
      return;
    }
    createAnnouncement({
      title: form.title,
      type: form.type as AnnouncementType,
      body: form.body,
      visibility: form.visibility as AnnouncementVisibility,
      pinned: form.pinned,
      publishDate: new Date(form.publishDate).toISOString(),
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
    }, user);
    toast.success(kind === 'news' ? 'News post published' : 'Announcement published');
    onDone();
  };
  return <div className="grid gap-3"><Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />{kind !== 'broadcast' && <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-10 rounded-md border px-3">{['News', 'Policy Update', 'Event', 'General Announcement', 'Emergency Notice', 'Staff Notice', 'Holiday Notice'].map((x) => <option key={x}>{x}</option>)}</select>}<Textarea placeholder={kind === 'broadcast' ? 'Short message' : 'Body / rich text content'} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />{kind !== 'broadcast' && <Input placeholder="Thumbnail / asset URL" />}{kind !== 'media' && <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })} className="h-10 rounded-md border px-3">{['All Staff', 'HR Only', 'Program Staff', 'Finance & Audit', 'Leadership'].map((x) => <option key={x}>{x}</option>)}</select>}<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Pin to top</label><Input type="datetime-local" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} /><Input type="datetime-local" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /><Button className="bg-[#82154F] text-white" onClick={submit}>{kind === 'broadcast' ? 'Send Broadcast' : 'Save'}</Button></div>;
}

export function CommunicationsAnnouncementsPage() {
  const announcements = useAnnouncementsStore((state) => state.announcements);
  const [open, setOpen] = useState(false);
  return <ModulePage title="Announcements" breadcrumbs={[{ label: 'Communications' }, { label: 'Announcements' }]} actions={<Button className="bg-[#82154F] text-white" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create Announcement</Button>}><AnnouncementsTable items={announcements} onCreate={() => setOpen(true)} />{open && <Modal title="Create Announcement" onClose={() => setOpen(false)}><CreateContentForm kind="announcement" onDone={() => setOpen(false)} /></Modal>}</ModulePage>;
}

export function CommunicationsNewsPage() {
  const news = useAnnouncementsStore((state) => state.announcements.filter((item) => item.type === 'News'));
  const [open, setOpen] = useState(false);
  return <ModulePage title="News Posts" breadcrumbs={[{ label: 'Communications' }, { label: 'News' }]} actions={<Button className="bg-[#82154F] text-white" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> News Post</Button>}><AnnouncementsTable items={news} onCreate={() => setOpen(true)} />{open && <Modal title="Create News Post" onClose={() => setOpen(false)}><CreateContentForm kind="news" onDone={() => setOpen(false)} /></Modal>}</ModulePage>;
}

export function CommunicationsBroadcastsPage() {
  const [open, setOpen] = useState(false);
  return <ModulePage title="Broadcasts / Notices" breadcrumbs={[{ label: 'Communications' }, { label: 'Broadcasts' }]} actions={<Button className="bg-[#82154F] text-white" onClick={() => setOpen(true)}><Send className="h-4 w-4" /> Send Broadcast</Button>}><Card><Table headers={['Title', 'Date Sent', 'Audience', 'Read Count']}>{['Policy reminder', 'Office closure notice'].map((title, index) => <tr key={title} className="border-t"><td className="px-3 py-2">{title}</td><td className="px-3 py-2">{new Date().toLocaleDateString()}</td><td className="px-3 py-2">All Staff</td><td className="px-3 py-2">{index + 4}</td></tr>)}</Table></Card>{open && <Modal title="Send Broadcast" onClose={() => setOpen(false)}><CreateContentForm kind="broadcast" onDone={() => setOpen(false)} /></Modal>}</ModulePage>;
}

export function CommunicationsDocumentsPage() {
  const [open, setOpen] = useState(false);
  return <ModulePage title="Documents Library" breadcrumbs={[{ label: 'Communications' }, { label: 'Documents' }]} actions={<Button className="bg-[#82154F] text-white" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Upload Document</Button>}><DocumentsPreview onUpload={() => setOpen(true)} />{open && <Modal title="Upload Document" onClose={() => setOpen(false)}><CreateContentForm kind="document" onDone={() => setOpen(false)} /></Modal>}</ModulePage>;
}

export function CommunicationsMediaPage() {
  const [open, setOpen] = useState(false);
  return <ModulePage title="Media Assets" breadcrumbs={[{ label: 'Communications' }, { label: 'Media' }]} actions={<Button className="bg-[#82154F] text-white" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Upload Asset</Button>}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{['Logo', 'Staff Photos', 'Event Photos', 'Program Photos'].map((item) => <Card key={item}><div className="flex aspect-video items-center justify-center rounded-lg bg-[#82154F]/10"><Image className="h-8 w-8 text-[#82154F]" /></div><p className="mt-3 font-medium">{item}</p><Button variant="outline" size="sm" className="mt-2">Download</Button></Card>)}</div>{open && <Modal title="Upload Media Asset" onClose={() => setOpen(false)}><CreateContentForm kind="media" onDone={() => setOpen(false)} /></Modal>}</ModulePage>;
}

export function CommunicationsGoalsPage() {
  const [open, setOpen] = useState(false);
  return <ModulePage title="Goals & OKRs" breadcrumbs={[{ label: 'Communications' }, { label: 'Goals' }]} actions={<Button className="bg-[#82154F] text-white" onClick={() => setOpen(true)}><Target className="h-4 w-4" /> Add Goal</Button>}><Card><GoalsTable /></Card>{open && <Modal title="Add Goal" onClose={() => setOpen(false)}><CreateContentForm kind="goal" onDone={() => setOpen(false)} /></Modal>}</ModulePage>;
}

export function CommunicationsDirectoryPage() {
  return <ModulePage title="Org Directory" breadcrumbs={[{ label: 'Insights' }, { label: 'Directory' }]}><Card><Table headers={['Name', 'Department', 'Designation', 'Station']}>{demoUsers.map((user) => <tr key={user.id} className="border-t"><td className="px-3 py-2">{user.name}</td><td className="px-3 py-2">{user.department}</td><td className="px-3 py-2">{user.designation}</td><td className="px-3 py-2">{user.station}</td></tr>)}</Table></Card></ModulePage>;
}

export function CommunicationsAttendancePage() {
  const records = useAttendanceStore((state) => state.records);
  return <ModulePage title="Attendance Summary" breadcrumbs={[{ label: 'Insights' }, { label: 'Attendance' }]}><Card><Table headers={['Employee', 'Date', 'Time In', 'Time Out', 'Status']}>{records.map((record) => <tr key={record.id} className="border-t"><td className="px-3 py-2">{record.employeeName}</td><td className="px-3 py-2">{record.date}</td><td className="px-3 py-2">{record.signInTime ? new Date(record.signInTime).toLocaleTimeString() : '-'}</td><td className="px-3 py-2">{record.signOutTime ? new Date(record.signOutTime).toLocaleTimeString() : '-'}</td><td className="px-3 py-2">{record.status}</td></tr>)}</Table></Card></ModulePage>;
}
