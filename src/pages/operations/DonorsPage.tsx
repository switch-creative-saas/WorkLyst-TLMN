import { ModulePage } from '@/components/layout/ModulePage';
import { GlassCard } from '@/components/glass';
import { donors, partners } from '@/data/ngo/programs';

export function DonorsPage() {
  return (
    <ModulePage title="Donors & Partners" breadcrumbs={[{ label: 'Operations' }, { label: 'Donors & Partners' }]}>
      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard>
          <h3 className="font-semibold mb-4">Donors</h3>
          <ul className="space-y-3">
            {donors.map((d) => (
              <li key={d.id} className="flex justify-between text-sm border-b border-border/30 pb-2">
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-muted-foreground">{d.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦{(d.totalFunding / 1e6).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">{d.activePrograms} programs</p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-4">Partners</h3>
          <ul className="space-y-3">
            {partners.map((p) => (
              <li key={p.id} className="text-sm border-b border-border/30 pb-2">
                <p className="font-medium">{p.name}</p>
                <p className="text-muted-foreground">
                  {p.type} · {p.location}
                </p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </ModulePage>
  );
}
