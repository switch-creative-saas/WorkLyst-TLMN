import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  FileSignature,
  Plus,
  RotateCcw,
  Send,
  Trash2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/glass';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  type BudgetLineItem,
  type FinanceDisbursement,
  type RequestAttachment,
  type UnifiedRequest,
  type UnifiedRequestInput,
  type UnifiedRequestStatus,
  type UnifiedRequestType,
  stageForRole,
  unifiedRequestTypes,
  useUnifiedRequestStore,
} from '@/stores/useUnifiedRequestStore';
import { cn } from '@/lib/utils';

const THEMATIC_PROJECTS: Record<string, string[]> = {
  Leprosy: ['Inclusion Project', 'Community Outreach Project', 'Self-Care Groups'],
  NTDs: ['Community Drug Administration', 'NTD Case Finding'],
  Disabilities: ['Inclusive Livelihoods', 'Assistive Devices Access'],
  Dermatology: ['Skin Health Outreach', 'Case Management Strengthening'],
  'Mental Health': ['Community Mental Health Project', 'Wellness Initiative'],
  Gender: ['Gender Inclusion Initiative', 'Women Empowerment Circles'],
  Research: ['Operational Research Cohort', 'Evidence for Impact'],
  Stigma: ['Anti-Stigma Campaign', 'Community Champions'],
  Tuberculosis: ['TB Case Finding', 'Integrated TB Support'],
  Communications: ['Impact Storytelling', 'Media Engagement'],
};

const blankLineItem = (): BudgetLineItem => ({
  id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  description: '',
  unit: '',
  qty: 1,
  unitCost: 0,
  total: 0,
});

const formatNaira = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);

const wordsUnderThousand = (value: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (value < 20) return ones[value];
  if (value < 100) return `${tens[Math.floor(value / 10)]} ${ones[value % 10]}`.trim();
  return `${ones[Math.floor(value / 100)]} Hundred ${wordsUnderThousand(value % 100)}`.trim();
};

const amountInWords = (amount: number) => {
  const value = Math.round(amount);
  if (!value) return 'Zero Naira Only';
  const parts: string[] = [];
  const millions = Math.floor(value / 1_000_000);
  const thousands = Math.floor((value % 1_000_000) / 1_000);
  const remainder = value % 1_000;
  if (millions) parts.push(`${wordsUnderThousand(millions)} Million`);
  if (thousands) parts.push(`${wordsUnderThousand(thousands)} Thousand`);
  if (remainder) parts.push(wordsUnderThousand(remainder));
  return `${parts.join(' ')} Naira Only`;
};

const statusClass: Record<UnifiedRequestStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-[#00578A]/10 text-[#00578A]',
  'Under Review': 'bg-[#F59E0B]/15 text-[#92400E]',
  'Revision Required': 'bg-[#F59E0B]/20 text-[#92400E]',
  Rejected: 'bg-[#E1332A]/10 text-[#E1332A]',
  'Awaiting ND Approval': 'bg-[#82154F]/10 text-[#82154F]',
  Disbursed: 'bg-[#247833]/10 text-[#247833]',
};

function StatusBadge({ status }: { status: UnifiedRequestStatus }) {
  return <Badge className={cn('border-0', statusClass[status])}>{status}</Badge>;
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('block min-w-0 space-y-1 text-sm', className)}>
      <span className="font-medium text-[#374151]">{label}</span>
      {children}
    </label>
  );
}

function SignatureTrail({ request }: { request: UnifiedRequest }) {
  return (
    <GlassCard>
      <h3 className="mb-4 font-semibold">Signature Trail</h3>
      <div className="space-y-3 text-sm">
        {request.workflowChain.map((stage) => {
          const signature = [...request.signatures].reverse().find((sig) => sig.stage === stage || (stage === 'Submitter' && sig.stage === 'Submitter'));
          const isCurrent = request.currentStage === stage;
          return (
            <div key={stage} className="grid gap-2 rounded-lg bg-[#F8FAFC] p-3 sm:grid-cols-[24px_minmax(0,1fr)_auto] sm:items-center">
              <span>{signature?.action === 'Approved' || signature?.action === 'Submitted' ? '✅' : isCurrent ? '⏳' : '⬜'}</span>
              <div className="min-w-0">
                <p className="truncate font-medium">{stage}</p>
                <p className="truncate text-xs text-[#6B7280]">
                  {signature ? `${signature.signedByName} - ${signature.action}` : isCurrent ? 'Awaiting review' : 'Pending'}
                </p>
              </div>
              <span className="text-xs text-[#6B7280]">
                {signature ? new Date(signature.signedAt).toLocaleString() : ''}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function WorkflowProgress({ request }: { request: UnifiedRequest }) {
  const currentIndex = request.workflowChain.indexOf(request.currentStage);
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-max items-start gap-2 py-1">
        {request.workflowChain.map((stage, index) => {
          const signature = [...request.signatures].reverse().find((sig) => sig.stage === stage);
          const done = !!signature && signature.action !== 'SentBack' && signature.action !== 'Rejected';
          const current = index === currentIndex;
          return (
            <div key={stage} className="flex items-center gap-2">
              <div className="min-w-[110px] rounded-lg border bg-white p-2 text-center text-xs">
                <div
                  className={cn(
                    'mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full text-white',
                    done && 'bg-[#247833]',
                    current && !done && 'bg-[#F59E0B]',
                    !current && !done && 'bg-gray-300'
                  )}
                >
                  {done ? '✓' : current ? '…' : ''}
                </div>
                <p className="font-medium">{stage}</p>
                <p className="mt-1 truncate text-[#6B7280]">{signature?.signedByName ?? (current ? 'Waiting' : 'Pending')}</p>
              </div>
              {index < request.workflowChain.length - 1 && <div className="h-px w-8 bg-[#E5E7EB]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RequestPreview({ request }: { request: UnifiedRequestInput & Partial<UnifiedRequest> }) {
  return (
    <div className="space-y-5">
      <GlassCard>
        <h3 className="text-lg font-semibold">The Leprosy Mission Nigeria Request Form</h3>
        <dl className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          {[
            ['Request Title', request.title],
            ['Request Type', request.requestType],
            ['Fund Source', request.fundSource === 'Other Projects' ? request.otherFundSource : request.fundSource],
            ['Thematic / Project', `${request.thematicArea} - ${request.project}`],
            ['Station', request.station],
            ['Date', request.dateOfRequest],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-[#6B7280]">{label}</dt>
              <dd className="break-words font-medium">{value || '-'}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>
      <GlassCard>
        <h3 className="font-semibold">Embedded Concept Note</h3>
        <div className="mt-3 grid gap-4 text-sm">
          {[
            ['Background / Rationale', request.background],
            ['Objectives', request.objectives],
            ['Planned Activities / Work Plan', request.plannedActivities],
            ['Expected Outputs', request.expectedOutputs],
            ['Expected Outcomes', request.expectedOutcomes],
            ['Implementation Timeline', `${request.startDate || '-'} to ${request.endDate || '-'}`],
            ['Implementing Team / Partners', request.implementingTeam],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <p className="font-medium">{label}</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-[#6B7280]">{value || '-'}</p>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <h3 className="font-semibold">Budget Breakdown</h3>
        <BudgetTable rows={request.lineItems} readOnly />
        <div className="mt-4 rounded-lg bg-[#F8FAFC] p-4 text-sm">
          <p className="font-semibold">Total Amount Requested: {formatNaira(request.totalAmount)}</p>
          <p>Amount in Words: {request.amountInWords}</p>
          <p>Being payment for: {request.beingPaymentFor || '-'}</p>
        </div>
      </GlassCard>
      <GlassCard>
        <h3 className="font-semibold">Supporting Documents</h3>
        <div className="mt-3 space-y-2 text-sm">
          {request.attachments.length ? request.attachments.map((file) => (
            <div key={file.id} className="rounded-lg border p-3">
              <p className="truncate font-medium">{file.fileName}</p>
              <p className="text-xs text-[#6B7280]">{(file.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          )) : <p className="text-[#6B7280]">No attachments uploaded.</p>}
        </div>
      </GlassCard>
    </div>
  );
}

function BudgetTable({
  rows,
  onChange,
  readOnly = false,
}: {
  rows: BudgetLineItem[];
  onChange?: (rows: BudgetLineItem[]) => void;
  readOnly?: boolean;
}) {
  const update = (index: number, patch: Partial<BudgetLineItem>) => {
    if (!onChange) return;
    onChange(
      rows.map((row, i) => {
        if (i !== index) return row;
        const next = { ...row, ...patch };
        return { ...next, total: Number(next.qty || 0) * Number(next.unitCost || 0) };
      })
    );
  };
  return (
    <div className="mt-3 w-full overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[820px] text-sm">
        <thead className="bg-[#F8FAFC]">
          <tr>
            {['S/N', 'Description / Details', 'Unit', 'Qty', 'Unit Cost (₦)', 'Total (₦)', ''].map((head) => (
              <th key={head} className="px-3 py-2 text-left text-xs font-semibold text-[#6B7280]">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="border-t">
              <td className="px-3 py-2">{index + 1}</td>
              <td className="px-3 py-2">
                {readOnly ? row.description : <Input value={row.description} onChange={(e) => update(index, { description: e.target.value })} />}
              </td>
              <td className="px-3 py-2">{readOnly ? row.unit : <Input value={row.unit} onChange={(e) => update(index, { unit: e.target.value })} />}</td>
              <td className="px-3 py-2">{readOnly ? row.qty : <Input type="number" min="0" value={row.qty} onChange={(e) => update(index, { qty: Number(e.target.value) })} />}</td>
              <td className="px-3 py-2">{readOnly ? formatNaira(row.unitCost) : <Input type="number" min="0" value={row.unitCost} onChange={(e) => update(index, { unitCost: Number(e.target.value) })} />}</td>
              <td className="px-3 py-2 font-medium">{formatNaira(row.total)}</td>
              <td className="px-3 py-2">
                {!readOnly && (
                  <button type="button" onClick={() => onChange?.(rows.filter((_, i) => i !== index))} className="text-[#E1332A]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <Button type="button" variant="outline" className="m-2" onClick={() => onChange?.([...rows, blankLineItem()])}>
          Add Row
        </Button>
      )}
    </div>
  );
}

export function RequestsListPage() {
  const user = useAuthStore((state) => state.user);
  const visibleForUser = useUnifiedRequestStore((state) => state.visibleForUser);
  const visible = visibleForUser(user);
  const approverView = visible.some((request) => request.requestingOfficerId !== user.id);
  const columns = [
    { key: 'requestCode', header: 'Code' },
    { key: 'title', header: 'Request' },
    { key: 'requestType', header: 'Type' },
    ...(approverView
      ? [{ key: 'requestingOfficerName', header: 'Submitted By' }]
      : []),
    { key: 'totalAmount', header: 'Amount', render: (row: UnifiedRequest) => formatNaira(row.totalAmount) },
    { key: 'status', header: 'Status', render: (row: UnifiedRequest) => <StatusBadge status={row.status} /> },
    { key: 'currentStage', header: 'Current Stage' },
    {
      key: 'actions',
      header: '',
      render: (row: UnifiedRequest) => (
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/requests/${row.id}`}>View</Link>
        </Button>
      ),
    },
  ];

  return (
    <ModulePage
      title="Requests"
      breadcrumbs={[{ label: 'Requests' }]}
      actions={
        <Button size="sm" className="bg-[#82154F] text-white" asChild>
          <Link to="/requests/new"><Plus className="mr-1 h-4 w-4" /> New Request</Link>
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={visible}
      />
    </ModulePage>
  );
}

export function NewRequestPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const submitRequest = useUnifiedRequestStore((state) => state.submitRequest);
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState('');
  const userThematics = user.thematics.length ? user.thematics : Object.keys(THEMATIC_PROJECTS);
  const [form, setForm] = useState<UnifiedRequestInput>({
    title: '',
    requestType: 'Program Activity Request',
    fundSource: 'TLMN',
    otherFundSource: '',
    thematicArea: userThematics[0] ?? 'Leprosy',
    project: (THEMATIC_PROJECTS[userThematics[0] ?? 'Leprosy'] ?? ['General Operations'])[0],
    station: user.station,
    dateOfRequest: new Date().toISOString().slice(0, 10),
    background: '',
    objectives: '',
    plannedActivities: '',
    expectedOutputs: '',
    expectedOutcomes: '',
    startDate: '',
    endDate: '',
    implementingTeam: '',
    lineItems: [blankLineItem()],
    totalAmount: 0,
    amountInWords: 'Zero Naira Only',
    beingPaymentFor: '',
    attachments: [],
  });
  const projects = THEMATIC_PROJECTS[form.thematicArea] ?? ['General Operations'];
  const total = useMemo(() => form.lineItems.reduce((sum, row) => sum + row.total, 0), [form.lineItems]);
  const normalizedForm = { ...form, totalAmount: total, amountInWords: amountInWords(total) };
  const nameMatches = signature.trim().toLowerCase() === user.name.trim().toLowerCase();

  const update = (patch: Partial<UnifiedRequestInput>) => setForm((current) => ({ ...current, ...patch }));
  const requiredConceptComplete = [
    form.background,
    form.objectives,
    form.plannedActivities,
    form.expectedOutputs,
    form.expectedOutcomes,
    form.startDate,
    form.endDate,
    form.implementingTeam,
  ].every((value) => value.trim().length > 0);

  const next = () => {
    if (step === 1 && (!form.title.trim() || !form.project.trim())) return toast.error('Complete request details before continuing');
    if (step === 2 && !requiredConceptComplete) return toast.error('All embedded concept note fields are required');
    if (step === 3 && (!form.beingPaymentFor.trim() || total <= 0)) return toast.error('Complete the budget and payment summary');
    setStep((current) => Math.min(5, current + 1));
  };

  const submit = () => {
    if (!nameMatches) return toast.error('Name does not match your account name. Please type your full name exactly as registered.');
    const request = submitRequest(normalizedForm, user, signature.trim());
    toast.success(`${request.requestCode} submitted to ${request.currentStage}`);
    navigate(`/requests/${request.id}`);
  };

  return (
    <ModulePage title="New Unified Request" breadcrumbs={[{ label: 'Requests' }, { label: 'New Request' }]}>
      <div className="mb-5 flex flex-wrap gap-2">
        {['Request Details', 'Concept Note', 'Budget', 'Documents', 'Review & Sign'].map((label, index) => (
          <Badge key={label} className={cn('border-0', step === index + 1 ? 'bg-[#82154F] text-white' : 'bg-gray-100 text-gray-600')}>
            {index + 1}. {label}
          </Badge>
        ))}
      </div>
      <GlassCard>
        {step === 1 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Request Title"><Input value={form.title} onChange={(e) => update({ title: e.target.value })} /></Field>
            <Field label="Request Type">
              <select value={form.requestType} onChange={(e) => update({ requestType: e.target.value as UnifiedRequestType })} className="h-10 w-full rounded-md border px-3">
                {unifiedRequestTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </Field>
            <Field label="Fund Source">
              <div className="flex flex-wrap gap-3 rounded-md border px-3 py-2">
                {['TLMN', 'GFATM', 'Other Projects'].map((source) => (
                  <label key={source} className="flex items-center gap-2"><input type="radio" checked={form.fundSource === source} onChange={() => update({ fundSource: source })} /> {source}</label>
                ))}
              </div>
            </Field>
            {form.fundSource === 'Other Projects' && <Field label="Other Project Source"><Input value={form.otherFundSource} onChange={(e) => update({ otherFundSource: e.target.value })} /></Field>}
            <Field label="Thematic Area">
              <select
                value={form.thematicArea}
                onChange={(e) => {
                  const thematicArea = e.target.value;
                  update({ thematicArea, project: (THEMATIC_PROJECTS[thematicArea] ?? [])[0] ?? '' });
                }}
                className="h-10 w-full rounded-md border px-3"
              >
                {userThematics.map((theme) => <option key={theme}>{theme}</option>)}
              </select>
            </Field>
            <Field label="Project">
              <select value={form.project} onChange={(e) => update({ project: e.target.value })} className="h-10 w-full rounded-md border px-3">
                {projects.map((project) => <option key={project}>{project}</option>)}
              </select>
            </Field>
            <Field label="Station / Location"><Input value={form.station} onChange={(e) => update({ station: e.target.value })} /></Field>
            <Field label="Date of Request"><Input type="date" value={form.dateOfRequest} onChange={(e) => update({ dateOfRequest: e.target.value })} /></Field>
            <Field label="Requesting Officer"><Input readOnly value={`${user.name} - ${user.designation}`} className="bg-gray-50" /></Field>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4">
            {[
              ['Background / Rationale', 'Why is this activity/request needed?', 'background'],
              ['Objectives', 'What does this request aim to achieve?', 'objectives'],
              ['Planned Activities / Work Plan', 'What specific activities will be carried out?', 'plannedActivities'],
              ['Expected Outputs', 'What immediate results are expected?', 'expectedOutputs'],
              ['Expected Outcomes', 'What medium-term changes will this contribute to?', 'expectedOutcomes'],
            ].map(([label, placeholder, key]) => (
              <Field key={key} label={label}>
                <Textarea value={String(form[key as keyof UnifiedRequestInput] ?? '')} placeholder={placeholder} onChange={(e) => update({ [key]: e.target.value } as Partial<UnifiedRequestInput>)} />
              </Field>
            ))}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Start Date"><Input type="date" value={form.startDate} onChange={(e) => update({ startDate: e.target.value })} /></Field>
              <Field label="End Date"><Input type="date" value={form.endDate} onChange={(e) => update({ endDate: e.target.value })} /></Field>
            </div>
            <Field label="Implementing Team / Partners"><Input value={form.implementingTeam} onChange={(e) => update({ implementingTeam: e.target.value })} /></Field>
          </div>
        )}
        {step === 3 && (
          <div>
            <BudgetTable rows={form.lineItems} onChange={(lineItems) => update({ lineItems })} />
            <div className="mt-4 rounded-lg bg-[#F8FAFC] p-4 text-sm">
              <p className="font-semibold">Total Amount Requested: {formatNaira(total)}</p>
              <p>Amount in Words: {amountInWords(total)}</p>
            </div>
            <Field label="Being payment for" className="mt-4">
              <Input value={form.beingPaymentFor} onChange={(e) => update({ beingPaymentFor: e.target.value })} />
            </Field>
          </div>
        )}
        {step === 4 && (
          <div>
            <Field label="Upload attachments">
              <input
                type="file"
                multiple
                className="w-full rounded-md border p-3 text-sm"
                onChange={(e) => {
                  const files: RequestAttachment[] = Array.from(e.target.files ?? []).map((file) => ({
                    id: `file-${Date.now()}-${file.name}`,
                    fileName: file.name,
                    fileUrl: URL.createObjectURL(file),
                    fileSize: file.size,
                    uploadedAt: new Date().toISOString(),
                  }));
                  update({ attachments: [...form.attachments, ...files] });
                }}
              />
            </Field>
            <div className="mt-4 space-y-2">
              {form.attachments.map((file) => (
                <div key={file.id} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border p-3 text-sm">
                  <span className="min-w-0 truncate">{file.fileName} ({(file.fileSize / 1024).toFixed(1)} KB)</span>
                  <button type="button" className="text-[#E1332A]" onClick={() => update({ attachments: form.attachments.filter((item) => item.id !== file.id) })}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-5">
            <RequestPreview request={normalizedForm} />
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
              <h3 className="font-semibold">Digital Signature - Requested By</h3>
              <p className="mt-2 text-sm text-[#6B7280]">
                By signing below, I confirm that all information in this request is accurate and I take responsibility for this submission.
              </p>
              <Field label="Type your full name to sign" className="mt-4">
                <Input value={signature} onChange={(e) => setSignature(e.target.value)} />
              </Field>
              <p className="mt-2 text-sm text-[#6B7280]">Your name on record: {user.name}</p>
              {signature && !nameMatches && <p className="mt-2 text-sm text-[#E1332A]">Name does not match your account name. Please type your full name exactly as registered.</p>}
            </div>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button type="button" variant="outline" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>Back</Button>
          {step < 5 ? (
            <Button type="button" className="bg-[#82154F] text-white" onClick={next}>Continue</Button>
          ) : (
            <Button type="button" className="bg-[#247833] text-white" disabled={!nameMatches} onClick={submit}>
              <Send className="h-4 w-4" /> Submit Request
            </Button>
          )}
        </div>
      </GlassCard>
    </ModulePage>
  );
}

export function RequestDetailPage() {
  const { requestId } = useParams();
  const user = useAuthStore((state) => state.user);
  const request = useUnifiedRequestStore((state) => state.requestForId(requestId));
  const canViewRequest = useUnifiedRequestStore((state) => state.canViewRequest);
  const approveRequest = useUnifiedRequestStore((state) => state.approveRequest);
  const sendBackRequest = useUnifiedRequestStore((state) => state.sendBackRequest);
  const rejectRequest = useUnifiedRequestStore((state) => state.rejectRequest);
  const resubmitRequest = useUnifiedRequestStore((state) => state.resubmitRequest);
  const [signature, setSignature] = useState('');
  const [comment, setComment] = useState('');
  const [finance, setFinance] = useState<FinanceDisbursement>({
    paymentMethod: 'Bank Transfer',
    paymentDate: new Date().toISOString().slice(0, 10),
    transactionRef: '',
    amountDisbursed: 0,
    financeNotes: '',
  });

  if (!request) {
    return <ModulePage title="Request"><p className="text-sm text-[#6B7280]">Request not found.</p></ModulePage>;
  }

  if (!canViewRequest(request, user)) {
    return (
      <ModulePage title="Access Restricted" breadcrumbs={[{ label: 'Requests' }]}>
        <GlassCard>
          <h2 className="font-semibold text-[#111827]">You don't have access to this request.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Requests are only visible to the submitter and approvers assigned to the active workflow chain.
          </p>
          <Button className="mt-4" variant="outline" asChild>
            <Link to="/requests">Back to Requests</Link>
          </Button>
        </GlassCard>
      </ModulePage>
    );
  }

  const stagesForRole = stageForRole(user.role);
  const canApprove = stagesForRole.includes(request.currentStage) && !['Rejected', 'Disbursed'].includes(request.status);
  const canResubmit = request.status === 'Revision Required' && request.requestingOfficerId === user.id;
  const nameMatches = signature.trim().toLowerCase() === user.name.trim().toLowerCase();

  const approve = () => {
    if (!nameMatches) return toast.error('Type your full registered name to sign approval');
    if (request.currentStage === 'Finance' && (!finance.transactionRef.trim() || finance.amountDisbursed <= 0)) {
      return toast.error('Complete finance disbursement details before approving');
    }
    const updated = approveRequest(request.id, user, signature.trim(), comment, request.currentStage === 'Finance' ? finance : undefined);
    toast.success(updated?.status === 'Disbursed' ? 'Request disbursed' : `Request moved to ${updated?.currentStage}`);
    setSignature('');
    setComment('');
  };

  const sendBack = () => {
    if (!comment.trim()) return toast.error('Comment is required to send back for correction');
    sendBackRequest(request.id, user, comment);
    toast.success('Request sent back for correction');
    setComment('');
  };

  const reject = () => {
    if (!comment.trim()) return toast.error('Comment is required to reject');
    rejectRequest(request.id, user, comment);
    toast.success('Request rejected');
    setComment('');
  };

  const resubmit = () => {
    if (!nameMatches) return toast.error('Type your full registered name to resubmit');
    resubmitRequest(request.id, user, signature.trim());
    toast.success(`Request resubmitted to ${request.returnToStage}`);
    setSignature('');
  };

  return (
    <ModulePage title={request.requestCode} breadcrumbs={[{ label: 'Requests' }, { label: request.requestCode }]}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
        <div className="min-w-0 space-y-6">
          <GlassCard>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold">{request.title}</h2>
                <p className="text-sm text-[#6B7280]">{request.requestType} by {request.requestingOfficerName}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>
            <div className="mt-4">
              <WorkflowProgress request={request} />
            </div>
            {request.status === 'Revision Required' && (
              <div className="mt-4 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-sm text-[#92400E]">
                <p className="font-semibold"><AlertTriangle className="mr-1 inline h-4 w-4" /> Sent back by {request.revisionFrom}</p>
                <p className="mt-1">{request.revisionComment}</p>
              </div>
            )}
          </GlassCard>
          <RequestPreview request={request} />
        </div>
        <div className="min-w-0 space-y-6">
          <SignatureTrail request={request} />
          {canApprove && (
            <GlassCard>
              <h3 className="font-semibold">Your Review - {user.name}</h3>
              <Field label="Internal Comment" className="mt-4">
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Required for reject or send back" />
              </Field>
              {request.currentStage === 'Finance' && (
                <div className="mt-4 space-y-4 rounded-lg border p-4">
                  <h4 className="font-semibold">Finance Disbursement</h4>
                  <Field label="Payment Method">
                    <select value={finance.paymentMethod} onChange={(e) => setFinance({ ...finance, paymentMethod: e.target.value as FinanceDisbursement['paymentMethod'] })} className="h-10 w-full rounded-md border px-3">
                      {['Cash', 'Bank Transfer', 'Cheque'].map((method) => <option key={method}>{method}</option>)}
                    </select>
                  </Field>
                  <Field label="Payment Date"><Input type="date" value={finance.paymentDate} onChange={(e) => setFinance({ ...finance, paymentDate: e.target.value })} /></Field>
                  <Field label="Transaction Reference / Cheque Number"><Input value={finance.transactionRef} onChange={(e) => setFinance({ ...finance, transactionRef: e.target.value })} /></Field>
                  <Field label="Amount Disbursed"><Input type="number" value={finance.amountDisbursed} onChange={(e) => setFinance({ ...finance, amountDisbursed: Number(e.target.value) })} /></Field>
                  <Field label="Finance Notes"><Textarea value={finance.financeNotes} onChange={(e) => setFinance({ ...finance, financeNotes: e.target.value })} /></Field>
                </div>
              )}
              <Field label="Type your full name to sign" className="mt-4">
                <Input value={signature} onChange={(e) => setSignature(e.target.value)} />
              </Field>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="bg-[#247833] text-white" onClick={approve}><CheckCircle2 className="h-4 w-4" /> Approve</Button>
                <Button className="bg-[#F59E0B] text-white" onClick={sendBack}><RotateCcw className="h-4 w-4" /> Send Back</Button>
                <Button className="bg-[#E1332A] text-white" onClick={reject}><XCircle className="h-4 w-4" /> Reject</Button>
              </div>
            </GlassCard>
          )}
          {canResubmit && (
            <GlassCard>
              <h3 className="font-semibold">Edit & Resubmit</h3>
              <p className="mt-2 text-sm text-[#6B7280]">Previous approvals are preserved. This request will resume from {request.returnToStage}.</p>
              <Field label="Type your full name to re-sign" className="mt-4">
                <Input value={signature} onChange={(e) => setSignature(e.target.value)} />
              </Field>
              <Button className="mt-4 bg-[#82154F] text-white" onClick={resubmit}>
                <FileSignature className="h-4 w-4" /> Resubmit Request
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </ModulePage>
  );
}

export function MyApprovalsPage() {
  const user = useAuthStore((state) => state.user);
  const pendingForUser = useUnifiedRequestStore((state) => state.pendingForUser);
  const pending = pendingForUser(user);

  return (
    <ModulePage title="Pending Approvals" breadcrumbs={[{ label: 'Requests' }, { label: 'Approvals' }]}>
      <DataTable
        columns={[
          { key: 'requestCode', header: 'Code' },
          { key: 'requestingOfficerName', header: 'Submitter' },
          { key: 'requestType', header: 'Request Type' },
          { key: 'createdAt', header: 'Date Submitted', render: (row: UnifiedRequest) => new Date(row.createdAt).toLocaleDateString() },
          { key: 'title', header: 'Summary' },
          { key: 'totalAmount', header: 'Amount', render: (row: UnifiedRequest) => formatNaira(row.totalAmount) },
          { key: 'currentStage', header: 'Stage' },
          {
            key: 'actions',
            header: '',
            render: (row: UnifiedRequest) => (
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/requests/${row.id}`}>Review</Link>
              </Button>
            ),
          },
        ]}
        data={pending}
      />
    </ModulePage>
  );
}
