import { HrPageShell } from '@/components/layout/HrPageShell';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { Link2 } from 'lucide-react';

export function Integrations() {
  const appName = useBrandingStore((s) => s.config.branding.appName);

  return (
    <HrPageShell title="Integrations" breadcrumbs={[{ label: 'Integrations' }]}>
    <div>
      

      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Integrations</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Connect {appName || 'Worklyst'} with your favorite tools and services. Integrations help streamline your HR workflows.
          </p>
        </div>
      </div>
    </div>
    </HrPageShell>
  );
}
