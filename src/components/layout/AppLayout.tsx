import { Outlet } from 'react-router-dom';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { ModuleSidebar } from './ModuleSidebar';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const backgroundStyle = useBrandingStore((s) => s.settings.backgroundStyle);

  return (
    <div
      className={cn(
        'flex h-screen w-full max-w-full overflow-hidden',
        backgroundStyle === 'gradient' && 'bg-app-gradient',
        backgroundStyle === 'mesh' && 'bg-app-mesh',
        backgroundStyle === 'solid' && 'bg-background'
      )}
    >
      <ModuleSidebar />
      <main
        className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden"
      >
        <Outlet />
      </main>
    </div>
  );
}
