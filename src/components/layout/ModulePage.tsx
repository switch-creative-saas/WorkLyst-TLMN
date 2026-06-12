import { PageTransition } from '@/components/motion';
import { BreadcrumbNav } from './BreadcrumbNav';
import { TopBar } from './TopBar';
import { ModuleTabs, type ModuleTab } from './ModuleTabs';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ModulePageProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  tabs?: ModuleTab[];
  tabBasePath?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ModulePage({
  title,
  breadcrumbs = [],
  tabs,
  tabBasePath,
  actions,
  children,
  className,
  noPadding,
}: ModulePageProps) {
  return (
    <div className="flex min-h-full w-full max-w-full min-w-0 flex-col overflow-hidden">
      <TopBar title={title} actions={actions} />
      {breadcrumbs.length > 0 && (
        <div className="min-w-0 border-b border-border/40 px-4 py-2 md:px-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      )}
      {tabs && tabBasePath && (
        <ModuleTabs tabs={tabs} basePath={tabBasePath} />
      )}
      <PageTransition
        className={cn(
          'min-w-0 flex-1 overflow-hidden',
          !noPadding && 'w-full max-w-full px-4 py-4 md:px-6 md:py-6',
          className
        )}
      >
        {children}
      </PageTransition>
    </div>
  );
}
