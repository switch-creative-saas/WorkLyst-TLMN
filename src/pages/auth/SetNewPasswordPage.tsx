import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

export function SetNewPasswordPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setNewPassword = useAuthStore((s) => s.setNewPassword);
  const getDashboardRoute = useAuthStore((s) => s.getDashboardRoute);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      toast.error('Password must be at least 8 characters and include one uppercase letter and one number.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setNewPassword(password);
    toast.success('Password updated');
    navigate(getDashboardRoute(), { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full max-w-full items-center justify-center overflow-hidden bg-[#F8FAFC] p-4">
      <form onSubmit={submit} className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#82154F] font-bold text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-balance text-xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-sm text-[#6B7280]">
            Please set your password to continue.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <p className="text-xs text-[#6B7280]">Minimum 8 characters, one uppercase letter, and one number.</p>
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          </div>
          <Button className="w-full bg-[#82154F] text-white hover:bg-[#6F1143]">Continue</Button>
        </div>
      </form>
    </div>
  );
}
