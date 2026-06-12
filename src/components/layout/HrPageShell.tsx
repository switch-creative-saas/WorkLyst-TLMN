import { ModulePage } from './ModulePage';

interface HrPageShellProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}

/** Wraps legacy HR pages with the new glass shell */
export function HrPageShell({ title, breadcrumbs, children }: HrPageShellProps) {
  return (
    <ModulePage title={title} breadcrumbs={breadcrumbs ?? [{ label: title }]}>
      <div className="hr-module-content">{children}</div>
    </ModulePage>
  );
}
