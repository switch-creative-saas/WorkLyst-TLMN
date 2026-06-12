export const TLMN_COLORS = {
  purple: '#82154F',
  green: '#247833',
  blue: '#00578A',
  red: '#E1332A',
  amber: '#F59E0B',
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  mutedText: '#6B7280',
} as const;

export const TLMN_CHART_SEQUENCE = [
  TLMN_COLORS.purple,
  TLMN_COLORS.green,
  TLMN_COLORS.blue,
  TLMN_COLORS.red,
] as const;

export const TLMN_ROLE_ACCENTS = {
  nationalDirector: TLMN_COLORS.purple,
  finance: TLMN_COLORS.green,
  programs: TLMN_COLORS.blue,
  audit: TLMN_COLORS.red,
} as const;
