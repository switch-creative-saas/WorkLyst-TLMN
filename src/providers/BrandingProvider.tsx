import { useEffect } from 'react';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const tenantId = useAuthStore((s) => s.tenantId);
  const activeTenantId = useBrandingStore((s) => s.tenantId);
  const setTenant = useBrandingStore((s) => s.setTenant);
  const applyToDocument = useBrandingStore((s) => s.applyToDocument);
  const settings = useBrandingStore((s) => s.settings);

  useEffect(() => {
    if (tenantId && tenantId !== activeTenantId) {
      setTenant(tenantId);
    }
  }, [activeTenantId, setTenant, tenantId]);

  useEffect(() => {
    applyToDocument();
  }, [applyToDocument, settings]);

  return <>{children}</>;
}
