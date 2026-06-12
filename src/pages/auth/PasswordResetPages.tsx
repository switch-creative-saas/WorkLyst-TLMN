import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, KeyRound, Loader2, Lock, MailCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

function AuthShell({ children }: { children: React.ReactNode }) {
  const settings = useBrandingStore((state) => state.settings);
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] text-[#111827] lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section className="relative hidden min-h-screen min-w-0 overflow-hidden text-white lg:flex" style={{ backgroundColor: settings.loginPanelColor }}>
        {settings.loginBgImageUrl && <img src={settings.loginBgImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />}
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A8D7B2]">{settings.organizationName}</p>
              <h1 className="truncate text-3xl font-bold">{settings.organizationAcronym}</h1>
            </div>
          </div>
          <div className="max-w-2xl min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#A8D7B2]">Secure Account Recovery</p>
            <h2 className="mt-4 text-5xl font-bold leading-tight">{settings.loginHeadline}</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/78">{settings.loginSubtext || settings.tagline}</p>
          </div>
          <p className="text-sm text-white/70">Password reset links expire after 1 hour and can only be used once.</p>
        </div>
      </section>
      <main className="flex min-h-screen min-w-0 items-center justify-center overflow-hidden p-5 sm:p-8">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xl shadow-[#82154F]/10 sm:p-8">
          {children}
        </motion.section>
      </main>
    </div>
  );
}

export function ForgotPasswordPage() {
  const settings = useBrandingStore((state) => state.settings);
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;
    const id = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const submit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!usernameOrEmail.trim()) return toast.error('Enter your username or email');
    setIsSubmitting(true);
    try {
      const result = await requestPasswordReset(usernameOrEmail);
      if (!result.ok) {
        toast.error(result.reason ?? 'Please try again later');
        return;
      }
      setSent(true);
      setResetUrl(result.resetUrl);
      setCooldown(60);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      {!sent ? (
        <>
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: settings.primaryColor }}>
              <KeyRound className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold">Forgot your password?</h1>
            <p className="mt-2 text-sm text-[#6B7280]">Enter your username or email address and we'll send you a reset link.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Username or Email</Label>
              <Input id="usernameOrEmail" value={usernameOrEmail} onChange={(event) => setUsernameOrEmail(event.target.value)} placeholder="aaron.hamilton or email@tlmn.org" autoComplete="username" />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full" style={{ backgroundColor: settings.primaryColor, color: settings.textOnPrimary }}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Link to="/login" className="block text-center text-sm font-medium text-[#82154F] hover:underline">← Back to Login</Link>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#247833]/10 text-[#247833]">
            <MailCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="mt-3 text-sm leading-6 text-[#6B7280]">We've sent a password reset link to the email address associated with your account. The link will expire in 1 hour.</p>
          {resetUrl && (
            <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-left">
              <p className="text-xs font-semibold text-[#6B7280]">Local demo reset link</p>
              <Link to={new URL(resetUrl).pathname + new URL(resetUrl).search} className="mt-1 block break-all text-sm font-medium text-[#82154F] hover:underline">{resetUrl}</Link>
            </div>
          )}
          <div className="mt-5 flex flex-col gap-2">
            <Button variant="outline" disabled={cooldown > 0 || isSubmitting} onClick={() => submit()}>
              {cooldown > 0 ? `Resend Email (${cooldown}s)` : 'Resend Email'}
            </Button>
            <Button asChild className="w-full" style={{ backgroundColor: settings.primaryColor, color: settings.textOnPrimary }}>
              <Link to="/login">← Back to Login</Link>
            </Button>
          </div>
        </div>
      )}
    </AuthShell>
  );
}

const passwordChecks = (password: string) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const settings = useBrandingStore((state) => state.settings);
  const validateResetToken = useAuthStore((state) => state.validateResetToken);
  const resetPasswordWithToken = useAuthStore((state) => state.resetPasswordWithToken);
  const [state, setState] = useState<'loading' | 'valid' | 'invalid' | 'success'>('loading');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const checks = useMemo(() => passwordChecks(password), [password]);
  const rulesPass = checks.length && checks.uppercase && checks.number;
  const match = password.length > 0 && password === confirm;
  const strength = rulesPass && checks.special ? 'Strong' : rulesPass ? 'Fair' : 'Weak';

  useEffect(() => {
    void validateResetToken(token).then((result) => {
      setState(result.valid ? 'valid' : 'invalid');
      setUserName(result.userName ?? '');
    });
  }, [token, validateResetToken]);

  useEffect(() => {
    if (state !== 'success') return;
    const id = window.setTimeout(() => navigate('/login', { replace: true }), 3000);
    return () => window.clearTimeout(id);
  }, [navigate, state]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rulesPass || !match) return;
    setSubmitting(true);
    const result = await resetPasswordWithToken(token, password);
    setSubmitting(false);
    if (!result.ok) {
      setState('invalid');
      return;
    }
    setState('success');
  };

  return (
    <AuthShell>
      {state === 'loading' && <div className="py-16 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-[#82154F]" /><p className="mt-3 text-sm text-[#6B7280]">Validating reset link...</p></div>}
      {state === 'invalid' && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1332A]/10 text-[#E1332A]"><ShieldAlert className="h-7 w-7" /></div>
          <h1 className="text-2xl font-bold">Link Invalid or Expired</h1>
          <p className="mt-3 text-sm leading-6 text-[#6B7280]">This password reset link is no longer valid. Reset links expire after 1 hour and can only be used once.</p>
          <Button asChild className="mt-5" style={{ backgroundColor: settings.primaryColor, color: settings.textOnPrimary }}><Link to="/auth/forgot-password">Request a New Link →</Link></Button>
        </div>
      )}
      {state === 'success' && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#247833]/10 text-[#247833]">✓</div>
          <h1 className="text-2xl font-bold">Password Reset Successful</h1>
          <p className="mt-3 text-sm text-[#6B7280]">Your password has been updated. You can now log in with your new password.</p>
          <Button asChild className="mt-5" style={{ backgroundColor: settings.primaryColor, color: settings.textOnPrimary }}><Link to="/login">Go to Login →</Link></Button>
        </div>
      )}
      {state === 'valid' && (
        <>
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: settings.primaryColor }}><Lock className="h-7 w-7" /></div>
            <h1 className="text-2xl font-bold">Set New Password</h1>
            <p className="mt-2 text-sm text-[#6B7280]">Choose a strong password for {userName || 'your account'}.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2.5 text-[#6B7280]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              <div className={cn('text-sm font-medium', strength === 'Strong' ? 'text-[#247833]' : strength === 'Fair' ? 'text-[#F59E0B]' : 'text-[#E1332A]')}>{strength}</div>
              <div className="grid gap-1 text-xs text-[#6B7280]">
                <Rule ok={checks.length} text="At least 8 characters" />
                <Rule ok={checks.uppercase} text="At least one uppercase letter" />
                <Rule ok={checks.number} text="At least one number" />
                <Rule ok={checks.special} text="At least one special character (bonus)" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(event) => setConfirm(event.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowConfirm((value) => !value)} className="absolute right-3 top-2.5 text-[#6B7280]">{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              {confirm && <p className={cn('text-xs', match ? 'text-[#247833]' : 'text-[#E1332A]')}>{match ? 'Passwords match ✓' : 'Passwords do not match'}</p>}
            </div>
            <Button type="submit" disabled={!rulesPass || !match || submitting} className="w-full" style={{ backgroundColor: settings.primaryColor, color: settings.textOnPrimary }}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {submitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </>
      )}
    </AuthShell>
  );
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return <span className={ok ? 'text-[#247833]' : 'text-[#6B7280]'}>{ok ? '✓' : '○'} {text}</span>;
}
