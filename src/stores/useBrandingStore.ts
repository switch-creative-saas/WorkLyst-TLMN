import { create } from 'zustand';
import type { BrandingSettings, TenantBranding, TenantBrandingConfig } from '@/types/branding';
import {
  TLMN_BRANDING_CONFIG,
  WORKLYST_BRANDING_CONFIG,
  WORKLYST_TENANT_ID,
  configToSettings,
} from '@/design/presets';
import { radiusScaleMap } from '@/design/tokens';
import { TLMN_COLORS } from '@/design/tlmn';

const BRANDING_STORAGE_PREFIX = 'worklyst_branding_';
const BRANDING_SETTINGS_STORAGE_KEY = 'worklyst_deployment_branding_settings';

const storageKey = (tenantId: string) => `${BRANDING_STORAGE_PREFIX}${tenantId}`;

const hexToHsl = (hexOrHsl: string) => {
  if (!hexOrHsl.startsWith('#')) return hexOrHsl;

  const hex = hexOrHsl.replace('#', '');
  const value = hex.length === 3
    ? hex.split('').map((char) => char + char).join('')
    : hex;
  const r = Number.parseInt(value.slice(0, 2), 16) / 255;
  const g = Number.parseInt(value.slice(2, 4), 16) / 255;
  const b = Number.parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (max === g) h = (b - r) / d + 2;
    if (max === b) h = (r - g) / d + 4;
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const getStoredConfig = (tenantId: string): TenantBrandingConfig | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(storageKey(tenantId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TenantBrandingConfig;
    if (parsed.tenantId !== tenantId || !parsed.branding) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveStoredConfig = (config: TenantBrandingConfig) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey(config.tenantId), JSON.stringify(config));
};

const getStoredSettings = (): Partial<BrandingSettings> => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(BRANDING_SETTINGS_STORAGE_KEY) ?? '{}') as Partial<BrandingSettings>;
  } catch {
    return {};
  }
};

const saveStoredSettings = (settings: BrandingSettings) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BRANDING_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

const removeStoredConfig = (tenantId: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(storageKey(tenantId));
};

const defaultConfigForTenant = (tenantId: string): TenantBrandingConfig => ({
  tenantId,
  branding: { ...WORKLYST_BRANDING_CONFIG.branding },
});

const normalizeConfig = (config: TenantBrandingConfig): TenantBrandingConfig => ({
  tenantId: config.tenantId || WORKLYST_TENANT_ID,
  branding: {
    ...WORKLYST_BRANDING_CONFIG.branding,
    ...config.branding,
    colors: {
      ...WORKLYST_BRANDING_CONFIG.branding.colors,
      ...config.branding?.colors,
    },
  },
});

const migrateSeededTenantConfig = (config: TenantBrandingConfig): TenantBrandingConfig => {
  const oldSeededPrimary = ['#', '3B82F6'].join('');
  const oldSeededSecondary = ['#', '10B981'].join('');
  const isOldSeededTlmn =
    config.tenantId === 'tlmn' &&
    config.branding?.colors?.primary === oldSeededPrimary &&
    config.branding?.colors?.secondary === oldSeededSecondary;

  return isOldSeededTlmn ? TLMN_BRANDING_CONFIG : config;
};

const settingsToBranding = (settings: BrandingSettings): TenantBranding => ({
  appName: settings.organizationName || 'Worklyst',
  logoUrl: settings.organizationLogo || '',
  colors: {
    primary: settings.primaryColor,
    secondary: settings.secondaryColor,
    background: settings.themeMode === 'dark' ? '#0B1220' : TLMN_COLORS.background,
    text: settings.themeMode === 'dark' ? '#FFFFFF' : TLMN_COLORS.text,
  },
  theme: settings.themeMode,
  font: settings.font || 'Inter',
  layoutStyle: settings.layoutStyle,
  dashboardTitle: settings.dashboardTitle || `${settings.organizationName || 'Worklyst'} Dashboard`,
});

interface BrandingState {
  tenantId: string;
  config: TenantBrandingConfig;
  settings: BrandingSettings;
  setTenant: (tenantId: string) => void;
  updateBranding: (tenantId: string, newBranding: Partial<TenantBranding>) => void;
  updateSettings: (partial: Partial<BrandingSettings>) => void;
  resetToPreset: (preset: BrandingSettings | TenantBrandingConfig) => void;
  resetToDefault: () => void;
  importConfig: (config: TenantBrandingConfig) => void;
  exportConfig: () => TenantBrandingConfig;
  applyToDocument: () => void;
}

const initialConfig = normalizeConfig(
  migrateSeededTenantConfig(getStoredConfig(WORKLYST_TENANT_ID) ?? WORKLYST_BRANDING_CONFIG)
);
const initialSettings = { ...configToSettings(initialConfig), ...getStoredSettings() };

export const useBrandingStore = create<BrandingState>()((set, get) => ({
  tenantId: initialConfig.tenantId,
  config: initialConfig,
  settings: initialSettings,
  setTenant: (tenantId) => {
    const defaultConfig = tenantId === 'tlmn' ? TLMN_BRANDING_CONFIG : defaultConfigForTenant(tenantId);
    const nextConfig = normalizeConfig(migrateSeededTenantConfig(getStoredConfig(tenantId) ?? defaultConfig));
    set({
      tenantId,
      config: nextConfig,
      settings: { ...configToSettings(nextConfig), ...getStoredSettings() },
    });
    get().applyToDocument();
  },
  updateBranding: (tenantId, newBranding) => {
    const current =
      tenantId === get().tenantId
        ? get().config
        : normalizeConfig(getStoredConfig(tenantId) ?? defaultConfigForTenant(tenantId));
    const nextConfig = normalizeConfig({
      tenantId,
      branding: {
        ...current.branding,
        ...newBranding,
        colors: {
          ...current.branding.colors,
          ...newBranding.colors,
        },
      },
    });

    saveStoredConfig(nextConfig);

    if (tenantId === get().tenantId) {
      set({ config: nextConfig, settings: { ...configToSettings(nextConfig), ...getStoredSettings() } });
      get().applyToDocument();
    }
  },
  updateSettings: (partial) => {
    const nextSettings = { ...get().settings, ...partial };
    saveStoredSettings(nextSettings);
    get().updateBranding(get().tenantId, settingsToBranding(nextSettings));
  },
  resetToPreset: (preset) => {
    const nextConfig = 'branding' in preset
      ? normalizeConfig({ ...preset, tenantId: get().tenantId })
      : normalizeConfig({ tenantId: get().tenantId, branding: settingsToBranding(preset) });

    saveStoredConfig(nextConfig);
    const nextSettings = { ...configToSettings(nextConfig), ...getStoredSettings() };
    saveStoredSettings(nextSettings);
    set({ config: nextConfig, settings: nextSettings });
    get().applyToDocument();
  },
  resetToDefault: () => {
    removeStoredConfig(get().tenantId);
    const nextConfig = normalizeConfig(defaultConfigForTenant(get().tenantId));
    const nextSettings = configToSettings(nextConfig);
    saveStoredSettings(nextSettings);
    set({ config: nextConfig, settings: nextSettings });
    get().applyToDocument();
  },
  importConfig: (config) => {
    const tenantId = config.tenantId || get().tenantId;
    const nextConfig = normalizeConfig({ ...config, tenantId });
    saveStoredConfig(nextConfig);
    const nextSettings = { ...configToSettings(nextConfig), ...getStoredSettings() };
    saveStoredSettings(nextSettings);
    set({ tenantId, config: nextConfig, settings: nextSettings });
    get().applyToDocument();
  },
  exportConfig: () => get().config,
  applyToDocument: () => {
    if (typeof document === 'undefined') return;

    const { settings, config } = get();
    const root = document.documentElement;
    const backgroundHsl = hexToHsl(config.branding.colors.background);
    const textHsl = hexToHsl(config.branding.colors.text);

    root.style.setProperty('--color-primary', settings.primaryColor);
    root.style.setProperty('--color-secondary', settings.secondaryColor);
    root.style.setProperty('--color-accent', settings.accentColor);
    root.style.setProperty('--color-primary-foreground', settings.textOnPrimary);
    root.style.setProperty('--font-family', settings.font);
    root.style.setProperty('--login-panel-color', settings.loginPanelColor);
    root.style.setProperty('--primary-color', settings.primaryColor);
    root.style.setProperty('--secondary-color', settings.secondaryColor);
    root.style.setProperty('--accent-color', settings.accentColor);
    root.style.setProperty('--bg-color', config.branding.colors.background);
    root.style.setProperty('--text-color', config.branding.colors.text);
    root.style.setProperty('--brand-primary', hexToHsl(settings.primaryColor));
    root.style.setProperty('--brand-secondary', hexToHsl(settings.secondaryColor));
    root.style.setProperty('--brand-accent', hexToHsl(settings.accentColor));
    root.style.setProperty('--brand-danger', hexToHsl(TLMN_COLORS.red));
    root.style.setProperty('--brand-warning', hexToHsl(TLMN_COLORS.amber));
    root.style.setProperty('--background', backgroundHsl);
    root.style.setProperty('--foreground', textHsl);
    root.style.setProperty('--primary', hexToHsl(settings.primaryColor));
    root.style.setProperty('--sidebar-primary', hexToHsl(settings.primaryColor));
    root.style.setProperty('--ring', hexToHsl(settings.primaryColor));
    root.style.setProperty('--radius', radiusScaleMap[settings.borderRadius]);
    root.style.setProperty('--glass-opacity', String(settings.glassIntensity / 100));
    root.style.setProperty(
      '--glass-blur',
      settings.glassIntensity < 40 ? '8px' : settings.glassIntensity < 70 ? '12px' : '16px'
    );
    root.style.fontFamily = `${settings.font}, Inter, system-ui, sans-serif`;
    root.dataset.tenantId = get().tenantId;
    root.dataset.sidebarStyle = settings.sidebarStyle;
    root.dataset.backgroundStyle = settings.backgroundStyle;
    root.dataset.typography = settings.typographyStyle;
    root.classList.toggle('dark', config.branding.theme === 'dark');
    document.title = `${settings.organizationName || config.branding.appName || 'Worklyst'} - HRMS`;
    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    if (settings.faviconUrl) favicon.href = settings.faviconUrl;
  },
}));

