export type ThemeMode = 'light' | 'dark' | 'auto' | 'custom';
export type ButtonStyle = 'rounded' | 'pill' | 'square';
export type BorderRadiusScale = 'sm' | 'md' | 'lg' | 'xl';
export type DashboardLayout = 'grid' | 'compact' | 'executive';
export type SidebarStyle = 'glass' | 'solid' | 'minimal';
export type AnimationIntensity = 'off' | 'reduced' | 'full';
export type TypographyStyle = 'modern' | 'classic' | 'compact';
export type BackgroundStyle = 'gradient' | 'mesh' | 'solid';
export type LayoutStyle = 'liquid-glass' | 'solid' | 'minimal';

export interface BrandingColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface TenantBranding {
  appName: string;
  logoUrl: string;
  colors: BrandingColors;
  theme: ThemeMode;
  font: string;
  layoutStyle: LayoutStyle;
  dashboardTitle: string;
}

export interface TenantBrandingConfig {
  tenantId: string;
  branding: TenantBranding;
}

export interface BrandingSettings {
  organizationName: string;
  organizationAcronym: string;
  tagline: string;
  organizationLogo: string;
  faviconUrl: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textOnPrimary: string;
  loginPanelColor: string;
  loginHeadline: string;
  loginSubtext: string;
  loginBgImageUrl: string;
  buttonStyle: ButtonStyle;
  borderRadius: BorderRadiusScale;
  dashboardLayout: DashboardLayout;
  sidebarStyle: SidebarStyle;
  glassIntensity: number;
  animationIntensity: AnimationIntensity;
  themePreset: string;
  typographyStyle: TypographyStyle;
  backgroundStyle: BackgroundStyle;
  themeMode: ThemeMode;
  font: string;
  dashboardTitle: string;
  layoutStyle: LayoutStyle;
}
