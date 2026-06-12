import { useLocation } from 'react-router-dom';
import { settingsSections } from '@/config/navigation';
import { SettingsSection } from './SettingsSection';
import { BrandingSettings } from './BrandingSettings';

export function GenericSettingsPage() {
  const { pathname } = useLocation();
  const section = settingsSections.find((s) => s.route === pathname);

  if (
    pathname === '/admin/settings/branding' ||
    pathname === '/settings/branding' ||
    pathname === '/settings/appearance' ||
    pathname === '/settings/themes'
  ) {
    return <BrandingSettings />;
  }

  return (
    <SettingsSection
      title={section?.label ?? 'Settings'}
      description={`Configure ${section?.label?.toLowerCase() ?? 'system'} for your NGO operations platform.`}
    />
  );
}
