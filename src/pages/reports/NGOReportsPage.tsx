import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable } from '@/components/shared/DataTable';
import { WorkflowStatusBadge } from '@/components/shared/WorkflowStatusBadge';
import { GlassCard } from '@/components/glass';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNGOReports } from '@/api/hooks';
import { Plus, FileDown } from 'lucide-react';
import type { NGOReport } from '@/types/ngo';
import { useState } from 'react';
import { toast } from 'sonner';

const REPORT_TYPES = [
  'Activity Report',
  'Field Report',
  'Project Report',
  'Monthly Report',
  'Quarterly Report',
  'Annual Report',
  'Training Report',
  'Monitoring Report',
  'Evaluation Report',
];

export function NGOReportsPage() {
  const { data: reports = [] } = useNGOReports();
  const [editorOpen, setEditorOpen] = useState(false);
  const [content, setContent] = useState('');

  const columns = [
    { key: 'title', header: 'Report' },
    { key: 'type', header: 'Type' },
    { key: 'author', header: 'Author' },
    { key: 'period', header: 'Period' },
    {
      key: 'status',
      header: 'Status',
      render: (row: NGOReport) => <WorkflowStatusBadge status={row.status} />,
    },
    {
      key: 'export',
      header: '',
      render: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.success('Export queued (PDF)')}
        >
          <FileDown className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <ModulePage
      title="NGO Reports"
      breadcrumbs={[{ label: 'Reports' }]}
      actions={
        <Button size="sm" className="bg-brand-primary text-white" onClick={() => setEditorOpen(!editorOpen)}>
          <Plus className="h-4 w-4 mr-1" /> New Report
        </Button>
      }
    >
      {editorOpen && (
        <GlassCard className="mb-6">
          <h3 className="font-semibold mb-2">Report Editor</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Types: {REPORT_TYPES.join(', ')}
          </p>
          <Textarea
            placeholder="Enter report content (rich text supported in production)..."
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-3"
          />
          <div className="flex gap-2">
            <Button onClick={() => toast.success('Report submitted for approval')}>Submit</Button>
            <Button variant="outline" onClick={() => toast.info('Export to Word')}>
              Export Word
            </Button>
            <Button variant="outline" onClick={() => toast.info('Export to PDF')}>
              Export PDF
            </Button>
          </div>
        </GlassCard>
      )}
      <DataTable columns={columns} data={reports} />
    </ModulePage>
  );
}
