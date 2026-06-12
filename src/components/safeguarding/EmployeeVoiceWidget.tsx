import { useState } from 'react';
import { ExternalLink, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSafeguardingStore } from '@/stores/useSafeguardingStore';

const issueTypes = [
  'Harassment',
  'Abuse of Power',
  'Discrimination',
  'Gender-Based Violence',
  'Child Safeguarding Concern',
  'Workplace Bullying',
  'Fraud / Misconduct',
  'Other',
];

export function EmployeeVoiceWidget() {
  const user = useAuthStore((state) => state.user);
  const addNotification = useAuthStore((state) => state.addNotification);
  const submitReport = useSafeguardingStore((state) => state.submitReport);
  const lead = useSafeguardingStore((state) => state.getLead());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    issueType: issueTypes[0],
    incidentDate: '',
    location: '',
    description: '',
    personsInvolved: '',
    evidenceUrl: '',
    isAnonymous: false,
  });

  const submit = () => {
    if (!form.incidentDate || !form.location.trim()) {
      toast.error('Please provide the incident date and location.');
      return;
    }
    if (form.description.trim().length < 50) {
      toast.error('Description must be at least 50 characters.');
      return;
    }
    const report = submitReport(user, form);
    addNotification(`New safeguarding report submitted ${report.reportCode} - Issue Type: ${report.issueType}`);
    toast.success(`Report ${report.reportCode} submitted confidentially.`);
    setOpen(false);
    setForm({
      issueType: issueTypes[0],
      incidentDate: '',
      location: '',
      description: '',
      personsInvolved: '',
      evidenceUrl: '',
      isAnonymous: false,
    });
  };

  return (
    <>
      <section className="mt-6 w-full overflow-hidden rounded-xl border border-[#E1332A]/20 border-l-4 border-l-[#E1332A] bg-[#E1332A]/10 p-5 shadow-sm">
        <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#E1332A] shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[#111827]">Employee Voice & Safeguarding</h2>
              <p className="mt-1 text-sm text-[#4B5563]">
                Your voice matters. Report concerns confidentially. All reports go directly to the Safeguarding Lead
                {lead ? `, ${lead.name}` : ''}.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button onClick={() => setOpen(true)} className="bg-[#E1332A] text-white hover:bg-[#C42B24]">
              Report a Safeguarding Issue
            </Button>
            <Button asChild variant="outline">
              <Link to="/safeguarding/my-reports">View My Reports</Link>
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a Safeguarding Issue</DialogTitle>
            <DialogDescription>
              This report will be sent directly and confidentially to the Safeguarding Lead.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium">Issue Type</span>
              <select
                value={form.issueType}
                onChange={(event) => setForm({ ...form, issueType: event.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3"
              >
                {issueTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Date of Incident</span>
              <Input type="date" value={form.incidentDate} onChange={(event) => setForm({ ...form, incidentDate: event.target.value })} />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span className="font-medium">Location of Incident</span>
              <Input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span className="font-medium">Description</span>
              <Textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Please describe the incident in as much detail as you are comfortable sharing."
              />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span className="font-medium">Persons Involved</span>
              <Input
                value={form.personsInvolved}
                onChange={(event) => setForm({ ...form, personsInvolved: event.target.value })}
                placeholder="You may name individuals if safe to do so"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Supporting Evidence</span>
              <Input type="file" accept="image/*,.pdf" onChange={(event) => setForm({ ...form, evidenceUrl: event.target.files?.[0]?.name ?? '' })} />
            </label>
            <label className="flex items-center gap-2 rounded-lg border p-3 text-sm">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(event) => setForm({ ...form, isAnonymous: event.target.checked })}
              />
              Submit anonymously
            </label>
          </div>
          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            This report will be sent directly and confidentially to the Safeguarding Lead. You will receive updates on
            the status of your report. You can also report via the global form:{' '}
            <a className="font-medium text-[#00578A] underline" href="https://forms.gle/XcfCuTGxDUXCAq1X9" target="_blank" rel="noreferrer">
              open global form <ExternalLink className="inline h-3.5 w-3.5" />
            </a>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} className="bg-[#E1332A] text-white hover:bg-[#C42B24]">Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
