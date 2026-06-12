import { GlassCard } from '@/components/glass';

interface SettingsSectionProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      {children ?? (
        <p className="text-sm text-muted-foreground italic">
          Configuration options for this section are available in the admin console.
        </p>
      )}
    </GlassCard>
  );
}
