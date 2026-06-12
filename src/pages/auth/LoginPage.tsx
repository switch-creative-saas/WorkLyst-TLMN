import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoUsers, useAuthStore } from '@/stores/useAuthStore';
import { useAuth } from '@/contexts/AuthContext';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { cn } from '@/lib/utils';

const showDemoLogins =
  import.meta.env.NEXT_PUBLIC_SHOW_DEMO_LOGINS !== 'false' &&
  import.meta.env.VITE_SHOW_DEMO_LOGINS !== 'false';

const demoLabels: Record<string, string> = {
  'HR Manager': 'HR Manager',
  'National Director': 'National Director',
  'Program Officer': 'Program Officer',
  'Program Lead': 'Program Lead',
  'Finance Officer': 'Finance Officer',
  'Audit Officer': 'Audit Officer',
  Receptionist: 'Receptionist',
  'Communications Officer': 'Communications Officer',
  'Employee (ESS)': 'Employee/ESS',
};

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const settings = useBrandingStore((state) => state.settings);
  const demoLogin = useAuthStore((state) => state.demoLogin);
  const [username, setUsername] = useState('aaron.hamilton');
  const [password, setPassword] = useState('TLMNDemo2025');
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoOpen, setDemoOpen] = useState(true);

  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      toast.error('Your session expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await login(username, password, remember);
      if (!result.ok) {
        toast.error(result.reason ?? 'Unable to sign in');
        return;
      }
      navigate(result.redirectTo ?? '/dashboard', { replace: true });
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] text-[#111827] lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section className="relative hidden min-h-screen min-w-0 overflow-hidden text-white lg:flex" style={{ backgroundColor: settings.loginPanelColor }}>
        {settings.loginBgImageUrl && (
          <img src={settings.loginBgImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(0,0,0,0.22),transparent_26%)]" />
        <div className="relative z-10 flex w-full min-w-0 flex-col justify-between p-12">
          <div className="flex items-center gap-4">
            {settings.organizationLogo ? (
              <img src={settings.organizationLogo} alt="" className="h-16 w-16 shrink-0 rounded-2xl bg-white object-contain p-2 shadow-xl" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-bold shadow-xl" style={{ color: settings.primaryColor }}>
                {settings.organizationAcronym.slice(0, 2)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A8D7B2]">
                {settings.organizationName}
              </p>
              <h1 className="truncate text-3xl font-bold">{settings.organizationAcronym}</h1>
            </div>
          </div>

          <div className="max-w-2xl min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#A8D7B2]">
              Enterprise NGO Operations
            </p>
            <h2 className="mt-4 text-5xl font-bold leading-tight">{settings.loginHeadline}</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/78">
              {settings.loginSubtext || settings.tagline}
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            {[
              ['#82154F', 'HR & Admin'],
              ['#247833', 'Finance Controls'],
              ['#00578A', 'Programs Delivery'],
              ['#E1332A', 'Audit Assurance'],
            ].map(([color, label]) => (
              <div key={label} className="rounded-xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                <div className="mb-3 h-1.5 w-12 rounded-full" style={{ backgroundColor: color }} />
                <p className="font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex min-h-screen min-w-0 items-center justify-center overflow-hidden p-5 sm:p-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xl shadow-[#82154F]/10 sm:p-8"
        >
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold text-white" style={{ backgroundColor: settings.primaryColor, color: settings.textOnPrimary }}>
              {settings.organizationLogo ? (
                <img src={settings.organizationLogo} alt="" className="h-full w-full rounded-2xl bg-white object-contain p-1" />
              ) : (
                settings.organizationAcronym.slice(0, 2)
              )}
            </div>
            <h1 className="text-balance text-2xl font-bold">Sign in to {settings.organizationName}</h1>
            <p className="mt-1 text-sm text-[#6B7280]">{settings.tagline}</p>
            <p className="mt-3 rounded-lg bg-[#247833]/10 px-3 py-2 text-xs font-medium text-[#247833]">
              Local demo authentication is active. No backend is required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="aaron.hamilton"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex min-w-0 items-center gap-2 text-[#4B5563]">
                <Checkbox checked={remember} onCheckedChange={(value) => setRemember(value === true)} />
                Remember me
              </label>
              <Link to="/auth/forgot-password" className="font-medium text-[#82154F] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full" style={{ backgroundColor: settings.primaryColor, color: settings.textOnPrimary }}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {showDemoLogins && (
            <Collapsible open={demoOpen} onOpenChange={setDemoOpen} className="mt-6 border-t border-[#E5E7EB] pt-5">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-1 py-2 text-left text-sm font-semibold text-[#111827]">
                Demo Accounts
                <ChevronDown className={cn('h-4 w-4 transition-transform', demoOpen && 'rotate-180')} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="grid gap-2">
                  {demoUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => navigate(demoLogin(user.username), { replace: true })}
                      className="min-w-0 rounded-lg border border-[#E5E7EB] px-3 py-2 text-left text-xs transition-colors hover:border-[#82154F]/40 hover:bg-[#82154F]/5"
                    >
                      <span className="block font-semibold text-[#111827]">
                        {demoLabels[user.role] ?? user.role} ({user.name})
                      </span>
                      <span className="block truncate text-[#6B7280]">{user.username} / TLMNDemo2025</span>
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6B7280]">
            <LockKeyhole className="h-3.5 w-3.5" />
            Secured by role-based access controls
          </div>
        </motion.section>
      </main>
    </div>
  );
}
