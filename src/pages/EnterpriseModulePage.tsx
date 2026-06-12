import { ModulePage } from '@/components/layout/ModulePage';
import { GlassCard } from '@/components/glass';
import { Button } from '@/components/ui/button';
import { ClipboardList, FileText, ShieldCheck } from 'lucide-react';

interface EnterpriseModulePageProps {
  title: string;
  description: string;
  workflow: string[];
  metrics?: { label: string; value: string }[];
}

export function EnterpriseModulePage({
  title,
  description,
  workflow,
  metrics = [
    { label: 'Open Items', value: '0' },
    { label: 'Pending Approval', value: '0' },
    { label: 'Completed', value: '0' },
  ],
}: EnterpriseModulePageProps) {
  return (
    <ModulePage title={title} breadcrumbs={[{ label: title }]}>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <GlassCard key={metric.label}>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#82154F]">{metric.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-[#00578A]/10 p-2 text-[#00578A]">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">{title} Workspace</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-[#E5E7EB] bg-white/70 p-6">
            <p className="text-sm text-muted-foreground">
              This module is part of the TLMN DOHRMP enterprise workflow map and is ready for
              Laravel API integration, permissions, approval routing, document attachments, and
              audit tracking.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button className="bg-[#82154F] text-white hover:bg-[#6F1143]">
                <FileText className="h-4 w-4" />
                New Record
              </Button>
              <Button variant="outline">
                <ShieldCheck className="h-4 w-4" />
                View Approvals
              </Button>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 font-semibold">Workflow</h2>
          <ol className="space-y-3">
            {workflow.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#82154F]/10 text-xs font-bold text-[#82154F]">
                  {index + 1}
                </span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </GlassCard>
      </div>
    </ModulePage>
  );
}
