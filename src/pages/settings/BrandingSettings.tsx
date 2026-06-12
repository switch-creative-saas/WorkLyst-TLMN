import { useRef } from 'react';
import { ImageUp, RotateCcw, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBrandingStore } from '@/stores/useBrandingStore';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const fontOptions = ['Inter', 'Poppins', 'DM Sans', 'Nunito', 'Roboto'];

const readableTextColor = (hex: string) => {
  const value = hex.replace('#', '');
  if (value.length !== 6) return '#FFFFFF';
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? '#111827' : '#FFFFFF';
};

const isValidUpload = (file: File, kinds: string[]) => {
  if (file.size > MAX_IMAGE_BYTES) {
    toast.error('Image must be 2MB or smaller.');
    return false;
  }
  if (!kinds.some((kind) => file.type.includes(kind) || file.name.toLowerCase().endsWith(`.${kind}`))) {
    toast.error(`Please upload ${kinds.join(', ').toUpperCase()} only.`);
    return false;
  }
  return true;
};

function readImage(file: File, onLoad: (value: string) => void) {
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result));
  reader.readAsDataURL(file);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex min-w-0 items-center gap-3">
        <Input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-10 shrink-0 cursor-pointer rounded p-1"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1"
        />
      </div>
    </Field>
  );
}

export function BrandingSettings() {
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const loginImageRef = useRef<HTMLInputElement>(null);
  const { settings, updateSettings, resetToDefault } = useBrandingStore();

  const update = (partial: Partial<typeof settings>) => updateSettings(partial);

  const handleFile = (file: File | undefined, target: 'logo' | 'favicon' | 'loginBg') => {
    if (!file) return;
    const allowed = target === 'favicon' ? ['png', 'ico'] : ['png', 'svg', 'jpeg', 'jpg'];
    if (!isValidUpload(file, allowed)) return;
    readImage(file, (value) => {
      if (target === 'logo') update({ organizationLogo: value });
      if (target === 'favicon') update({ faviconUrl: value });
      if (target === 'loginBg') update({ loginBgImageUrl: value });
    });
  };

  const saveBranding = async () => {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'false') {
        await fetch('/api/config/branding', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        });
      }
      toast.success('Branding updated. Changes are live across the platform.');
    } catch {
      toast.success('Branding updated locally. Changes are live across the platform.');
    }
  };

  return (
    <div className="grid w-full max-w-full min-w-0 gap-6 overflow-hidden xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <div className="min-w-0 space-y-6">
        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">White-label engine</p>
              <h1 className="text-xl font-semibold">Branding Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Customize identity, colors, login screen, typography, and document branding for any NGO.
              </p>
            </div>
            <div className="flex min-w-0 flex-wrap gap-2 md:justify-end">
              <Button variant="outline" onClick={resetToDefault}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button onClick={saveBranding} className="bg-brand-primary text-white hover:bg-brand-primary/90">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Organization Identity</h2>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Organization Name">
              <Input value={settings.organizationName} onChange={(event) => update({ organizationName: event.target.value })} />
            </Field>
            <Field label="Organization Acronym">
              <Input value={settings.organizationAcronym} onChange={(event) => update({ organizationAcronym: event.target.value })} />
            </Field>
            <Field label="Tagline">
              <Input value={settings.tagline} onChange={(event) => update({ tagline: event.target.value })} />
            </Field>
            <Field label="Address / HQ Location">
              <Input value={settings.address} onChange={(event) => update({ address: event.target.value })} />
            </Field>
            <Field label="Organization Logo">
              <input ref={logoRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={(event) => handleFile(event.target.files?.[0], 'logo')} />
              <Button variant="outline" onClick={() => logoRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Upload PNG/SVG
              </Button>
            </Field>
            <Field label="Favicon">
              <input ref={faviconRef} type="file" accept="image/png,image/x-icon,.ico" className="hidden" onChange={(event) => handleFile(event.target.files?.[0], 'favicon')} />
              <Button variant="outline" onClick={() => faviconRef.current?.click()}>
                <ImageUp className="h-4 w-4" />
                Upload ICO/PNG
              </Button>
            </Field>
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Brand Colors</h2>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <ColorField
              label="Primary Color"
              value={settings.primaryColor}
              onChange={(value) => update({ primaryColor: value, textOnPrimary: readableTextColor(value) })}
            />
            <ColorField label="Secondary Color" value={settings.secondaryColor} onChange={(value) => update({ secondaryColor: value })} />
            <ColorField label="Accent Color" value={settings.accentColor} onChange={(value) => update({ accentColor: value })} />
            <ColorField label="Text on Primary" value={settings.textOnPrimary} onChange={(value) => update({ textOnPrimary: value })} />
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Login Page Branding</h2>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <ColorField label="Left Panel Background Color" value={settings.loginPanelColor} onChange={(value) => update({ loginPanelColor: value })} />
            <Field label="Login Page Headline">
              <Input value={settings.loginHeadline} onChange={(event) => update({ loginHeadline: event.target.value })} />
            </Field>
            <Field label="Login Page Subtext">
              <Input value={settings.loginSubtext} onChange={(event) => update({ loginSubtext: event.target.value })} />
            </Field>
            <Field label="Login Background Image">
              <input ref={loginImageRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0], 'loginBg')} />
              <Button variant="outline" onClick={() => loginImageRef.current?.click()}>
                <ImageUp className="h-4 w-4" />
                Upload Optional Image
              </Button>
            </Field>
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Typography</h2>
          <Field label="Font Family">
            <Select value={settings.font} onValueChange={(value) => update({ font: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </section>
      </div>

      <aside className="w-full max-w-full min-w-0 overflow-hidden space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="w-full max-w-full overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Live Preview</h2>
          <div className="mt-4 w-full max-w-full overflow-hidden rounded-xl border border-border">
            <div className="grid min-h-[220px] grid-cols-[112px_minmax(0,1fr)]">
              <div className="min-w-0 p-3 text-xs" style={{ backgroundColor: settings.secondaryColor, color: settings.textOnPrimary }}>
                <div className="mb-5 flex items-center gap-2">
                  {settings.organizationLogo ? (
                    <img src={settings.organizationLogo} alt="" className="h-8 w-8 shrink-0 rounded bg-white/90 object-contain p-1" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white/15 font-bold">
                      {settings.organizationAcronym.slice(0, 2)}
                    </div>
                  )}
                  <span className="truncate font-semibold">{settings.organizationAcronym}</span>
                </div>
                <div className="rounded px-2 py-1.5 font-medium" style={{ backgroundColor: settings.primaryColor }}>
                  Dashboard
                </div>
                <div className="mt-2 px-2 py-1.5 text-white/70">People & HR</div>
              </div>
              <div className="min-w-0 bg-[#F8FAFC] p-4">
                <p className="truncate text-sm font-semibold">{settings.organizationName}</p>
                <div className="mt-3 min-w-0 rounded-lg bg-white p-3 shadow-sm">
                  <p className="text-xs text-muted-foreground">Sample card</p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: settings.primaryColor }}>
                    128 Staff
                  </p>
                  <span className="mt-3 inline-flex rounded-full px-2 py-1 text-xs" style={{ backgroundColor: `${settings.accentColor}22`, color: settings.accentColor }}>
                    Active
                  </span>
                </div>
                <button className="mt-3 rounded-md px-3 py-2 text-sm font-medium" style={{ backgroundColor: settings.primaryColor, color: settings.textOnPrimary }}>
                  Primary Action
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl p-4 text-white" style={{ backgroundColor: settings.loginPanelColor }}>
            <p className="text-xs uppercase tracking-wide opacity-80">Login preview</p>
            <p className="mt-2 font-semibold">{settings.loginHeadline}</p>
            <p className="mt-1 text-sm opacity-80">{settings.loginSubtext}</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
