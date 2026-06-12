import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSafeguardingStore, type SafeguardingReport, type SafeguardingStatus } from '@/stores/useSafeguardingStore';

const statuses: SafeguardingStatus[] = ['New', 'Under Review', 'Resolved', 'Escalated'];

function StatusBadge({ status }: { status: SafeguardingStatus }) {
  const style =
    status === 'New'
      ? 'bg-[#E1332A]/10 text-[#E1332A]'
      : status === 'Under Review'
        ? 'bg-[#82154F]/10 text-[#82154F]'
        : status === 'Escalated'
          ? 'bg-[#F59E0B]/15 text-[#92400E]'
          : 'bg-[#247833]/10 text-[#247833]';
  return <Badge className={`border-0 ${style}`}>{status}</Badge>;
}

function ReportDetail({
  report,
  canManage,
}: {
  report: SafeguardingReport;
  canManage: boolean;
}) {
  const user = useAuthStore((state) => state.user);
  const addNotification = useAuthStore((state) => state.addNotification);
  const updateStatus = useSafeguardingStore((state) => state.updateStatus);
  const updateInternalNotes = useSafeguardingStore((state) => state.updateInternalNotes);
  const [status, setStatus] = useState<SafeguardingStatus>(report.status);
  const [note, setNote] = useState('');
  const [internalNotes, setInternalNotes] = useState(report.internalNotes ?? '');

  const saveStatus = (nextStatus = status) => {
    const updated = updateStatus(report.id, nextStatus, user, note);
    if (updated) {
      addNotification(`Your safeguarding report ${updated.reportCode} has been updated to: ${nextStatus}`);
      toast.success('Safeguarding report updated');
      setNote('');
    }
  };

  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{report.reportCode}</h2>
          <p className="text-sm text-muted-foreground">{report.issueType} - {report.location}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
        <Info label="Reporter" value={report.isAnonymous ? 'Anonymous' : report.reporterName ?? 'Unknown'} />
        <Info label="Date Submitted" value={new Date(report.createdAt).toLocaleString()} />
        <Info label="Incident Date" value={report.incidentDate} />
        <Info label="Persons Involved" value={report.personsInvolved || '-'} />
        <div className="md:col-span-2">
          <Info label="Description" value={report.description} />
        </div>
        {report.evidenceUrl && <Info label="Evidence" value={report.evidenceUrl} />}
      </div>

      <h3 className="mt-6 font-semibold">Status Timeline</h3>
      <div className="mt-3 space-y-2">
        {report.statusHistory.map((entry) => (
          <div key={entry.id} className="rounded-lg bg-muted p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{entry.status}</span>
              <span className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</span>
            </div>
            {entry.note && <p className="mt-1 text-muted-foreground">{entry.note}</p>}
          </div>
        ))}
      </div>

      {canManage && (
        <div className="mt-6 rounded-xl border border-border p-4">
          <h3 className="font-semibold">Safeguarding Lead Actions</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
            <select value={status} onChange={(event) => setStatus(event.target.value as SafeguardingStatus)} className="h-10 rounded-md border border-input bg-background px-3">
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input value={note} onChange={(event) => setNote(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3" placeholder="Non-confidential update note" />
          </div>
          <Textarea className="mt-3" value={internalNotes} onChange={(event) => setInternalNotes(event.target.value)} placeholder="Internal notes, visible only to Safeguarding Lead" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => saveStatus()}>Update Status</Button>
            <Button variant="outline" onClick={() => { updateInternalNotes(report.id, internalNotes); toast.success('Internal notes saved'); }}>Save Internal Notes</Button>
            <Button className="bg-[#E1332A] text-white hover:bg-[#C42B24]" onClick={() => saveStatus('Escalated')}>
              Escalate to National Director
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-words">{value}</p>
    </div>
  );
}

export function SafeguardingInboxPage() {
  const user = useAuthStore((state) => state.user);
  const reports = useSafeguardingStore((state) => state.reports);
  const leadId = useSafeguardingStore((state) => state.safeguardingLeadId);
  const markLeadRead = useSafeguardingStore((state) => state.markLeadRead);
  const [selectedId, setSelectedId] = useState<string | null>(reports[0]?.id ?? null);
  const selected = reports.find((report) => report.id === selectedId) ?? reports[0];
  const canManage = user.id === leadId || user.role === 'Admin' || user.role === 'Admin / Global Admin';

  const columns: Column<SafeguardingReport>[] = [
    { key: 'reportCode', header: 'Report ID' },
    { key: 'createdAt', header: 'Date Submitted', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'issueType', header: 'Issue Type' },
    { key: 'reporter', header: 'Reporter', render: (row) => (row.isAnonymous ? 'Anonymous' : row.reporterName ?? 'Unknown') },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', header: 'Actions', render: (row) => <Button variant="outline" size="sm" onClick={() => setSelectedId(row.id)}>View</Button> },
  ];

  return (
    <ModulePage title="Safeguarding Inbox" breadcrumbs={[{ label: 'Safeguarding' }, { label: 'Inbox' }]}>
      {!canManage && (
        <div className="rounded-xl border border-[#E1332A]/20 bg-[#E1332A]/10 p-4 text-sm text-[#991B1B]">
          Only the assigned Safeguarding Lead can manage this inbox.
        </div>
      )}
      <div onMouseEnter={markLeadRead}>
        <DataTable columns={columns} data={reports} emptyMessage="No safeguarding reports yet." />
      </div>
      {selected && <ReportDetail report={selected} canManage={canManage} />}
    </ModulePage>
  );
}

export function MySafeguardingReportsPage() {
  const user = useAuthStore((state) => state.user);
  const reportsForReporter = useSafeguardingStore((state) => state.reportsForReporter);
  const reports = reportsForReporter(user.id);
  const [selectedId, setSelectedId] = useState<string | null>(reports[0]?.id ?? null);
  const selected = useMemo(() => reports.find((report) => report.id === selectedId) ?? reports[0], [reports, selectedId]);
  const columns: Column<SafeguardingReport>[] = [
    { key: 'reportCode', header: 'Report ID' },
    { key: 'incidentDate', header: 'Date' },
    { key: 'issueType', header: 'Issue Type' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'anonymous', header: 'Submission', render: (row) => (row.isAnonymous ? 'Submitted Anonymously' : 'Named') },
    { key: 'actions', header: 'Actions', render: (row) => <Button variant="outline" size="sm" onClick={() => setSelectedId(row.id)}>View</Button> },
  ];

  return (
    <ModulePage title="My Safeguarding Reports" breadcrumbs={[{ label: 'Safeguarding' }, { label: 'My Reports' }]}>
      <DataTable columns={columns} data={reports} emptyMessage="You have not submitted any safeguarding reports." />
      {selected && <ReportDetail report={selected} canManage={false} />}
    </ModulePage>
  );
}
