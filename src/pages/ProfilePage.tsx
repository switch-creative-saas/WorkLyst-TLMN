import { useMemo, useState } from 'react';
import { Lock, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { useWorkflowStore } from '@/stores/useWorkflowStore';
import { ModulePage } from '@/components/layout/ModulePage';
import { cn } from '@/lib/utils';

const tabs = ['Personal Information', 'Security', 'My Assignments', 'Activity Summary'] as const;

function Field({
  label,
  value,
  onChange,
  locked,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  locked?: boolean;
}) {
  return (
    <label className="min-w-0 space-y-1 text-sm">
      <span className="flex items-center gap-1 font-medium text-[#374151]">
        {label}
        {locked && <Lock className="h-3.5 w-3.5 text-[#6B7280]" aria-label="Contact HR to update" />}
      </span>
      <Input value={value} disabled={locked} onChange={(event) => onChange?.(event.target.value)} />
    </label>
  );
}

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setNewPassword = useAuthStore((state) => state.setNewPassword);
  const attendanceRecords = useAttendanceStore((state) => state.records);
  const workflowRecords = useWorkflowStore((state) => state.items);
  const attendance = useMemo(
    () => attendanceRecords.filter((record) => record.employeeId === user.id),
    [attendanceRecords, user.id]
  );
  const workflowItems = useMemo(
    () => workflowRecords.filter((item) => item.submitterId === user.id),
    [workflowRecords, user.id]
  );
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Personal Information');
  const [profile, setProfile] = useState({
    phone: '',
    personalEmail: '',
    homeAddress: '',
    stateOfOrigin: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    avatar: user.avatar,
  });
  const [security, setSecurity] = useState({ current: '', next: '', confirm: '' });

  const save = () => {
    toast.success('Profile updated successfully.');
  };

  const changePassword = () => {
    if (security.next.length < 8 || !/[A-Z]/.test(security.next) || !/\d/.test(security.next)) {
      toast.error('Password must be at least 8 characters and include one uppercase letter and one number.');
      return;
    }
    if (security.next !== security.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setNewPassword(security.next);
    toast.success('Password updated.');
    setSecurity({ current: '', next: '', confirm: '' });
  };

  return (
    <ModulePage title="My Profile" breadcrumbs={[{ label: 'My Profile' }]} noPadding>
    <div className="w-full max-w-full overflow-x-hidden bg-[#F8FAFC] p-4 text-[#111827] md:p-6">
      <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-6 overflow-hidden lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <aside className="min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="text-center">
            <img src={profile.avatar} alt="" className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-[#82154F]/10" />
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm">
              <Upload className="h-4 w-4" />
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setProfile((current) => ({ ...current, avatar: String(reader.result) }));
                reader.readAsDataURL(file);
              }} />
            </label>
            <h1 className="mt-4 truncate text-2xl font-bold">{user.name}</h1>
            <Badge className="mt-2 bg-[#82154F] text-white">{user.role}</Badge>
          </div>
          <div className="mt-5 min-w-0 space-y-2 text-sm">
            <p><span className="text-[#6B7280]">Employee ID:</span> {user.employeeId}</p>
            <p><span className="text-[#6B7280]">Joined:</span> Not set</p>
            <p><span className="text-[#6B7280]">Status:</span> <span className="font-medium text-[#247833]">{user.status}</span></p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">{user.department}</Badge>
            {user.thematics.map((thematic) => <Badge key={thematic} variant="outline">{thematic}</Badge>)}
          </div>
        </aside>

        <main className="min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex max-w-full flex-wrap gap-2 overflow-hidden border-b border-[#E5E7EB] pb-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn('rounded-lg px-3 py-2 text-sm', activeTab === tab ? 'bg-[#82154F]/10 text-[#82154F] font-medium' : 'text-[#6B7280] hover:bg-gray-50')}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Personal Information' && (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Phone Number" value={profile.phone} onChange={(phone) => setProfile({ ...profile, phone })} />
              <Field label="Personal Email" value={profile.personalEmail} onChange={(personalEmail) => setProfile({ ...profile, personalEmail })} />
              <Field label="Home Address" value={profile.homeAddress} onChange={(homeAddress) => setProfile({ ...profile, homeAddress })} />
              <Field label="State of Origin" value={profile.stateOfOrigin} onChange={(stateOfOrigin) => setProfile({ ...profile, stateOfOrigin })} />
              <Field label="Next of Kin Name" value={profile.nextOfKinName} onChange={(nextOfKinName) => setProfile({ ...profile, nextOfKinName })} />
              <Field label="Next of Kin Phone" value={profile.nextOfKinPhone} onChange={(nextOfKinPhone) => setProfile({ ...profile, nextOfKinPhone })} />
              <Field label="Next of Kin Relationship" value={profile.nextOfKinRelationship} onChange={(nextOfKinRelationship) => setProfile({ ...profile, nextOfKinRelationship })} />
              <Field label="Full Name" value={user.name} locked />
              <Field label="Employee ID" value={user.employeeId} locked />
              <Field label="Official Email / Username" value={user.email || user.username} locked />
              <Field label="Department" value={user.department} locked />
              <Field label="Designation / Job Title" value={user.designation} locked />
              <Button onClick={save} className="md:col-span-2 bg-[#82154F] text-white hover:bg-[#6F1143]">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="mt-5 max-w-xl min-w-0 space-y-4">
              {user.isFirstLogin && <div className="rounded-lg bg-[#F59E0B]/10 p-3 text-sm text-[#92400E]">You were advised to change your temporary password. Keep your password secure.</div>}
              <Field label="Current Password" value={security.current} onChange={(current) => setSecurity({ ...security, current })} />
              <Field label="New Password" value={security.next} onChange={(next) => setSecurity({ ...security, next })} />
              <Field label="Confirm Password" value={security.confirm} onChange={(confirm) => setSecurity({ ...security, confirm })} />
              <Button onClick={changePassword} className="bg-[#82154F] text-white hover:bg-[#6F1143]">Change Password</Button>
            </div>
          )}

          {activeTab === 'My Assignments' && (
            <div className="mt-5 space-y-4">
              <div><h3 className="font-semibold">Assigned Thematics</h3><div className="mt-2 flex flex-wrap gap-2">{user.thematics.map((x) => <Badge key={x}>{x}</Badge>)}</div></div>
              <div><h3 className="font-semibold">Assigned Projects</h3><ul className="mt-2 list-disc pl-5 text-sm text-[#4B5563]">{user.assignedProjects.map((x) => <li key={x} className="break-words">{x}</li>)}</ul></div>
              <p className="text-sm"><span className="text-[#6B7280]">Reporting Supervisor:</span> {user.supervisor || 'Not assigned'}</p>
              <p className="text-sm"><span className="text-[#6B7280]">Department Head:</span> Not assigned</p>
            </div>
          )}

          {activeTab === 'Activity Summary' && (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Summary label="Timesheets submitted this month" value={workflowItems.filter((item) => item.type === 'timesheet').length} />
              <Summary label="Attendance rate this month" value={`${attendance.length ? 100 : 0}%`} />
              <Summary label="Leave days used / remaining" value="0 / 21" />
              <Summary label="Requests submitted" value={workflowItems.length} />
            </div>
          )}
        </main>
      </div>
    </div>
    </ModulePage>
  );
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return <div className="min-w-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4"><p className="truncate text-sm text-[#6B7280]">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>;
}
