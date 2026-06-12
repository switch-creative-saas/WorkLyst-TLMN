import { useState } from 'react';
import { Calendar, Clock, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkflowStore } from '@/stores/useWorkflowStore';
import { qrPayloadForEmployee, useAttendanceStore } from '@/stores/useAttendanceStore';
import { QRCodeSVG } from 'qrcode.react';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block min-w-0 space-y-1 text-sm"><span className="font-medium text-gray-700">{label}</span>{children}</label>;
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm">{children}</section>;
}

export function MyTimesheetPage() {
  const user = useAuthStore((state) => state.user);
  const submitWorkflow = useWorkflowStore((state) => state.submitWorkflow);
  const [rows, setRows] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => ({ day, project: user.assignedProjects[0] ?? 'General Operations', activity: '', hours: 0, notes: '' })));
  const total = rows.reduce((sum, row) => sum + Number(row.hours || 0), 0);

  return (
    <ModulePage title="My Timesheet" breadcrumbs={[{ label: 'My Work' }, { label: 'Timesheet' }]}>
      <Panel>
        <div className="mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-[#82154F]" /><h2 className="font-semibold">Weekly Timesheet</h2></div>
        <div className="w-full overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-[#F8FAFC]"><tr>{['Day', 'Project', 'Activity', 'Hours', 'Notes'].map((head) => <th key={head} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{head}</th>)}</tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.day} className="border-t">
                  <td className="px-3 py-2">{row.day}</td>
                  <td className="px-3 py-2"><select value={row.project} onChange={(e) => setRows(rows.map((item, i) => i === index ? { ...item, project: e.target.value } : item))} className="h-10 w-full rounded-md border px-3">{(user.assignedProjects.length ? user.assignedProjects : ['General Operations']).map((project) => <option key={project}>{project}</option>)}</select></td>
                  <td className="px-3 py-2"><Input value={row.activity} onChange={(e) => setRows(rows.map((item, i) => i === index ? { ...item, activity: e.target.value } : item))} /></td>
                  <td className="px-3 py-2"><Input type="number" value={row.hours} onChange={(e) => setRows(rows.map((item, i) => i === index ? { ...item, hours: Number(e.target.value) } : item))} /></td>
                  <td className="px-3 py-2"><Input value={row.notes} onChange={(e) => setRows(rows.map((item, i) => i === index ? { ...item, notes: e.target.value } : item))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button className="mt-4 bg-[#82154F] text-white" onClick={() => { submitWorkflow({ type: 'timesheet', submitter: user, title: 'Weekly Timesheet', summary: `${total} hours submitted`, payload: rows }); toast.success('Timesheet submitted for approval'); }}>
          <Send className="h-4 w-4" /> Submit for Approval
        </Button>
      </Panel>
    </ModulePage>
  );
}

export function MyLeavePage() {
  const user = useAuthStore((state) => state.user);
  const submitWorkflow = useWorkflowStore((state) => state.submitWorkflow);
  const [form, setForm] = useState({ type: 'Annual', start: '', end: '', reason: '' });
  return (
    <ModulePage title="My Leave" breadcrumbs={[{ label: 'My Work' }, { label: 'Leave' }]}>
      <Panel>
        <div className="mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-[#82154F]" /><h2 className="font-semibold">Leave Request</h2></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Leave Type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-10 w-full rounded-md border px-3">{['Annual', 'Sick', 'Emergency', 'Maternity', 'Paternity', 'Other'].map((type) => <option key={type}>{type}</option>)}</select></Field>
          <Field label="Start Date"><Input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></Field>
          <Field label="End Date"><Input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></Field>
          <Field label="Supporting Document"><Input type="file" /></Field>
        </div>
        <div className="mt-4"><Field label="Reason"><Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field></div>
        <Button className="mt-4 bg-[#82154F] text-white" onClick={() => { submitWorkflow({ type: 'leave', submitter: user, title: `${form.type} Leave`, summary: `${form.start} to ${form.end}`, payload: form }); toast.success('Leave request submitted'); }}>Submit Leave Request</Button>
      </Panel>
    </ModulePage>
  );
}

export function MyActivityReportsPage() {
  const user = useAuthStore((state) => state.user);
  const submitWorkflow = useWorkflowStore((state) => state.submitWorkflow);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  return (
    <ModulePage title="Activity Reports" breadcrumbs={[{ label: 'My Work' }, { label: 'Activity Reports' }]}>
      <Panel>
        <div className="mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-[#82154F]" /><h2 className="font-semibold">Submit Activity Report</h2></div>
        <div className="grid gap-4">
          <Field label="Activity Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Report Body"><Textarea value={body} onChange={(e) => setBody(e.target.value)} /></Field>
          <Field label="Activity Photos"><Input type="file" multiple /></Field>
        </div>
        <Button className="mt-4 bg-[#82154F] text-white" onClick={() => { submitWorkflow({ type: 'activity_report', submitter: user, title: title || 'Activity Report', summary: 'Activity report submitted', payload: { title, body } }); toast.success('Activity report submitted'); }}>Submit Report</Button>
      </Panel>
    </ModulePage>
  );
}

export function MyAttendancePage() {
  const user = useAuthStore((state) => state.user);
  const records = useAttendanceStore((state) => state.recordsForEmployee(user.id));
  return (
    <ModulePage title="My Attendance" breadcrumbs={[{ label: 'My Work' }, { label: 'Attendance' }]}>
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Panel>
          <h2 className="mb-4 font-semibold">Personal QR Code</h2>
          <div className="flex justify-center rounded-xl bg-white p-4 ring-1 ring-gray-100">
            <QRCodeSVG value={qrPayloadForEmployee(user.employeeId)} size={180} level="H" />
          </div>
          <p className="mt-3 text-center text-sm text-gray-500">{user.employeeId}</p>
        </Panel>
        <Panel>
          <h2 className="mb-4 font-semibold">Attendance History</h2>
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-[#F8FAFC]"><tr>{['Date', 'Time In', 'Time Out', 'Status'].map((head) => <th key={head} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{head}</th>)}</tr></thead>
              <tbody>
                {records.map((record) => <tr key={record.id} className="border-t"><td className="px-3 py-2">{record.date}</td><td className="px-3 py-2">{record.signInTime ? new Date(record.signInTime).toLocaleTimeString() : '-'}</td><td className="px-3 py-2">{record.signOutTime ? new Date(record.signOutTime).toLocaleTimeString() : '-'}</td><td className="px-3 py-2">{record.status}</td></tr>)}
                {!records.length && <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-500">No attendance records yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </ModulePage>
  );
}
