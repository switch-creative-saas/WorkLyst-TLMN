import { Link } from 'react-router-dom';
import { ModulePage } from '@/components/layout/ModulePage';
import { KpiStatCard } from '@/components/shared/KpiStatCard';
import { GlassCard } from '@/components/glass';
import { programs } from '@/data/ngo/programs';
import { ngoRequests } from '@/data/ngo/requests';
import { actionItems, quickAccessItems } from '@/data/common';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { FolderKanban, ClipboardList, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const { appName, dashboardTitle } = useBrandingStore((s) => s.config.branding);
  const pending = ngoRequests.filter((r) => ['Submitted', 'In Review'].includes(r.status)).length;

  return (
    <ModulePage title={dashboardTitle || 'Worklyst Dashboard'} breadcrumbs={[{ label: 'Home' }]}>
      <GlassCard className="mb-6 bg-brand-primary/5 border-brand-primary/20">
        <h2 className="text-xl font-semibold">
          Welcome to {appName || 'Worklyst'}
        </h2>
        <p className="text-muted-foreground mt-1">{dashboardTitle || 'Worklyst Dashboard'}</p>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiStatCard title="Active Programs" value={programs.filter((p) => p.status === 'Active').length} icon={FolderKanban} />
        <KpiStatCard title="Pending Approvals" value={pending} icon={ClipboardList} />
        <KpiStatCard title="My Actions" value={actionItems.length} icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickAccessItems.slice(0, 6).map((item) => (
              <Button key={item.label} variant="outline" className="justify-start h-auto py-3" asChild>
                <Link to={item.route.startsWith('/') ? item.route : `/hr${item.route}`}>
                  {item.label}
                  <ArrowRight className="ml-auto h-3 w-3" />
                </Link>
              </Button>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-4">Leadership Insights</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View KPIs, budget utilization, and strategic metrics for your role.
          </p>
          <Button asChild className="bg-brand-primary text-white">
            <Link to="/dashboard/executive">Executive Dashboard</Link>
          </Button>
        </GlassCard>
      </div>
    </ModulePage>
  );
}
