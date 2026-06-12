import { NavLink, Outlet } from 'react-router-dom';
import { ModulePage } from '@/components/layout/ModulePage';
import { settingsSections } from '@/config/navigation';
import { cn } from '@/lib/utils';

export function SettingsLayout() {
  return (
    <ModulePage title="NGO Settings" breadcrumbs={[{ label: 'Settings' }]}>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-56 shrink-0">
          <nav className="rounded-[var(--radius)] border border-border/50 bg-glass/60 backdrop-blur-glass p-2 space-y-0.5">
            {settingsSections.map((section) => (
              <NavLink
                key={section.id}
                to={section.route}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-brand-primary/15 text-brand-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted/50'
                  )
                }
              >
                {section.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </ModulePage>
  );
}
