import type { BrandingSettings, TenantBrandingConfig } from '@/types/branding';
import { TLMN_COLORS } from './tlmn';

export const WORKLYST_TENANT_ID = 'worklyst';

export const WORKLYST_BRANDING_CONFIG: TenantBrandingConfig = {
  tenantId: WORKLYST_TENANT_ID,
  branding: {
    appName: 'Worklyst',
    logoUrl: '',
    colors: {
      primary: TLMN_COLORS.purple,
      secondary: TLMN_COLORS.blue,
      background: TLMN_COLORS.background,
      text: TLMN_COLORS.text,
    },
    theme: 'light',
    font: 'Inter',
    layoutStyle: 'liquid-glass',
    dashboardTitle: 'Worklyst Dashboard',
  },
};

export const TLMN_BRANDING_CONFIG: TenantBrandingConfig = {
  tenantId: 'tlmn',
  branding: {
    appName: 'TLMN DOHRMP',
    logoUrl: '',
    colors: {
      primary: TLMN_COLORS.purple,
      secondary: TLMN_COLORS.blue,
      background: TLMN_COLORS.background,
      text: TLMN_COLORS.text,
    },
    theme: 'light',
    font: 'Inter',
    layoutStyle: 'liquid-glass',
    dashboardTitle: 'TLMN Digital Operations & HR Management Platform',
  },
};

export const HUMANITARIAN_BRANDING_CONFIG: TenantBrandingConfig = {
  tenantId: 'humanitarian',
  branding: {
    appName: 'Humanitarian Operations',
    logoUrl: '',
    colors: {
      primary: '#0EA5E9',
      secondary: '#14B8A6',
      background: '#FFFFFF',
      text: '#111827',
    },
    theme: 'light',
    font: 'Inter',
    layoutStyle: 'liquid-glass',
    dashboardTitle: 'Humanitarian Dashboard',
  },
};

export const acronymFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'WL';

export const configToSettings = (config: TenantBrandingConfig): BrandingSettings => ({
  organizationName: config.branding.appName,
  organizationAcronym: acronymFromName(config.branding.appName),
  tagline: 'Digitizing Operations for Better Impact',
  organizationLogo: config.branding.logoUrl,
  faviconUrl: '',
  address: 'National Office, Abuja, Nigeria',
  primaryColor: config.branding.colors.primary,
  secondaryColor: config.branding.colors.secondary,
  accentColor: config.branding.colors.secondary,
  textOnPrimary: '#FFFFFF',
  loginPanelColor: config.branding.colors.secondary,
  loginHeadline: `Welcome to ${config.branding.appName} Operations`,
  loginSubtext: 'Digitizing Operations for Better Impact',
  loginBgImageUrl: '',
  buttonStyle: 'rounded',
  borderRadius: 'md',
  dashboardLayout: 'grid',
  sidebarStyle: config.branding.layoutStyle === 'liquid-glass' ? 'glass' : config.branding.layoutStyle,
  glassIntensity: config.branding.layoutStyle === 'liquid-glass' ? 72 : 45,
  animationIntensity: 'full',
  themePreset: config.tenantId,
  typographyStyle: 'modern',
  backgroundStyle: 'solid',
  themeMode: config.branding.theme,
  font: config.branding.font,
  dashboardTitle: config.branding.dashboardTitle,
  layoutStyle: config.branding.layoutStyle,
});

export const WORKLYST_PRESET = configToSettings(WORKLYST_BRANDING_CONFIG);
export const TLMN_PRESET = configToSettings(TLMN_BRANDING_CONFIG);
export const HUMANITARIAN_PRESET = configToSettings(HUMANITARIAN_BRANDING_CONFIG);

export const THEME_PRESETS: Record<string, TenantBrandingConfig> = {
  worklyst: WORKLYST_BRANDING_CONFIG,
  tlmn: TLMN_BRANDING_CONFIG,
  humanitarian: HUMANITARIAN_BRANDING_CONFIG,
};
