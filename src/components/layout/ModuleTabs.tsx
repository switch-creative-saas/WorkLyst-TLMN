import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface ModuleTab {
  id: string;
  label: string;
  path?: string;
}

interface ModuleTabsProps {
  tabs: ModuleTab[];
  basePath: string;
}

export function ModuleTabs({ tabs, basePath }: ModuleTabsProps) {
  const location = useLocation();

  return (
    <div className="border-b border-border/40 bg-glass/40 backdrop-blur-sm px-4 md:px-6 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
          const to = tab.path ?? `${basePath}/${tab.id}`;
          const isActive =
            location.pathname === to ||
            (tab.id === '' && location.pathname === basePath) ||
            location.pathname.startsWith(`${to}/`);

          return (
            <NavLink
              key={tab.id || 'default'}
              to={to}
              end={tab.id === ''}
              className={cn(
                'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                isActive
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
