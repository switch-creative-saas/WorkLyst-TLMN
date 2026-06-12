import { useEffect, useMemo, useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { users as seedUsers, locations, jobTitles, payGrades } from '@/data/common';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { LOCAL_AUTH_ACCOUNTS_KEY, type DemoUser, type UserRole } from '@/stores/useAuthStore';
import { useSafeguardingStore } from '@/stores/useSafeguardingStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Copy, Eye, Mail, Pencil, Plus, Save, Search, Trash2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { User } from '@/types';

type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve';
type PermissionMatrix = Record<string, Record<PermissionAction, boolean>>;

interface StaffUser extends User {
  email: string;
  phone: string;
  designation: string;
  station: string;
  dateOfEmployment: string;
  profilePhoto?: string;
  thematics: string[];
  thematicProjects: Record<string, string[]>;
  departmentHead: boolean;
  department?: string;
  forcePasswordChange: boolean;
  temporaryPassword?: string;
  isSafeguardingLead?: boolean;
}

interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: PermissionMatrix;
  system?: boolean;
}

interface StaffForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  station: string;
  dateOfEmployment: string;
  profilePhoto: string;
  roles: string[];
  thematicProjects: Record<string, string[]>;
  departmentHead: boolean;
  department: string;
  isSafeguardingLead: boolean;
}

const STORAGE_USERS = 'tlmn_hr_admin_staff_users';
const STORAGE_ROLES = 'tlmn_hr_admin_roles';
const STORAGE_OUTBOX = 'tlmn_hr_admin_email_outbox';

const SYSTEM_ROLES = [
  'Employee (ESS)',
  'Supervisor',
  'Program Officer',
  'Program Lead',
  'Audit Officer',
  'Finance Officer',
  'HR Officer',
  'HR Manager',
  'Receptionist',
  'Communications Officer',
  'National Director',
  'Admin / Global Admin',
];

const PERMISSION_MODULES = [
  'Dashboard',
  'Timesheets',
  'Attendance',
  'Leave',
  'Requests',
  'Reports',
  'Audit',
  'Finance',
  'HR Admin',
  'Recruitment',
  'Onboarding',
  'Training',
  'Goals',
  'Documents',
];

const PERMISSION_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'approve'];

const TLMN_THEMATICS = [
  {
    name: 'Leprosy',
    projects: ['Inclusion Project', 'Community Outreach Project', 'Self-Care Groups'],
  },
  {
    name: 'NTDs (Neglected Tropical Diseases)',
    projects: ['NTD Case Finding', 'Community Drug Administration', 'Morbidity Management'],
  },
  {
    name: 'Disabilities',
    projects: ['Inclusive Livelihoods', 'Assistive Devices Access', 'Disability Rights Advocacy'],
  },
  {
    name: 'Dermatology',
    projects: ['Skin Health Outreach', 'Referral Strengthening', 'Dermatology Training'],
  },
  {
    name: 'Mental Health',
    projects: ['Community Mental Health Project', 'Wellness Initiative', 'Psychosocial Support'],
  },
  {
    name: 'Gender',
    projects: ['Gender Inclusion Project', 'Women Empowerment Circles', 'Safeguarding Champions'],
  },
  {
    name: 'Research',
    projects: ['Operational Research Desk', 'Impact Evidence Project', 'Learning Agenda'],
  },
  {
    name: 'Stigma',
    projects: ['Anti-Stigma Campaign', 'Community Dialogue Project', 'Champions of Inclusion'],
  },
  {
    name: 'Tuberculosis',
    projects: ['TB Contact Tracing', 'Integrated Case Management', 'Community TB Awareness'],
  },
  {
    name: 'Communications',
    projects: ['Impact Storytelling', 'Digital Communications', 'Donor Visibility'],
  },
];

const DEPARTMENTS = [
  'Programs',
  'Finance',
  'Audit',
  'Human Resources',
  'Communications',
  'Administration',
  'Monitoring & Evaluation',
  'National Director Office',
  'Procurement',
  'Logistics',
  'ICT',
];

const emptyPermissions = (): PermissionMatrix =>
  Object.fromEntries(
    PERMISSION_MODULES.map((module) => [
      module,
      Object.fromEntries(PERMISSION_ACTIONS.map((action) => [action, false])) as Record<
        PermissionAction,
        boolean
      >,
    ])
  );

const grant = (modules: string[], actions: PermissionAction[]) => {
  const permissions = emptyPermissions();
  modules.forEach((module) => {
    actions.forEach((action) => {
      permissions[module][action] = true;
    });
  });
  return permissions;
};

const mergePermissions = (
  base: PermissionMatrix,
  modules: string[],
  actions: PermissionAction[]
) => {
  const next = structuredClone(base) as PermissionMatrix;
  modules.forEach((module) => {
    actions.forEach((action) => {
      next[module][action] = true;
    });
  });
  return next;
};

const allAccess = () => grant(PERMISSION_MODULES, PERMISSION_ACTIONS);

const defaultRoles = (): RoleDefinition[] => {
  const employee = mergePermissions(
    grant(PERMISSION_MODULES, ['view']),
    ['Timesheets', 'Leave', 'Requests', 'Reports'],
    ['create']
  );
  const supervisor = mergePermissions(employee, ['Timesheets', 'Leave'], ['approve']);
  const programOfficer = mergePermissions(employee, ['Requests', 'Reports'], ['create']);
  const programLead = mergePermissions(programOfficer, ['Requests', 'Reports'], ['approve']);

  return [
    {
      id: 'role-ess',
      name: 'Employee (ESS)',
      description: 'Self-service staff role with basic view access and personal submissions.',
      permissions: employee,
      system: true,
    },
    {
      id: 'role-supervisor',
      name: 'Supervisor',
      description: 'Employee role plus approvals for timesheets and leave.',
      permissions: supervisor,
      system: true,
    },
    {
      id: 'role-program-officer',
      name: 'Program Officer',
      description: 'Program staff role for creating requests and reports.',
      permissions: programOfficer,
      system: true,
    },
    {
      id: 'role-program-lead',
      name: 'Program Lead',
      description: 'Program leadership role for request and report approvals.',
      permissions: programLead,
      system: true,
    },
    {
      id: 'role-audit',
      name: 'Audit Officer',
      description: 'Full access to audit reviews, findings, and compliance workflows.',
      permissions: mergePermissions(employee, ['Audit'], PERMISSION_ACTIONS),
      system: true,
    },
    {
      id: 'role-finance',
      name: 'Finance Officer',
      description: 'Full access to finance workflows, budgets, and payment processing.',
      permissions: mergePermissions(employee, ['Finance'], PERMISSION_ACTIONS),
      system: true,
    },
    {
      id: 'role-hr-officer',
      name: 'HR Officer',
      description: 'Operational HR access for staff records and onboarding support.',
      permissions: mergePermissions(employee, ['HR Admin', 'Recruitment', 'Onboarding'], ['view', 'create', 'edit']),
      system: true,
    },
    {
      id: 'role-hr-manager',
      name: 'HR Manager',
      description: 'Full HR administration access.',
      permissions: mergePermissions(employee, ['HR Admin'], PERMISSION_ACTIONS),
      system: true,
    },
    {
      id: 'role-national-director',
      name: 'National Director',
      description: 'Full platform access for executive oversight and final approvals.',
      permissions: allAccess(),
      system: true,
    },
    {
      id: 'role-admin',
      name: 'Admin / Global Admin',
      description: 'Super access for global system administration.',
      permissions: allAccess(),
      system: true,
    },
  ];
};

const defaultStaffForm = (): StaffForm => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  designation: '',
  station: '',
  dateOfEmployment: '',
  profilePhoto: '',
  roles: ['Employee (ESS)'],
  thematicProjects: {},
  departmentHead: false,
  department: 'Programs',
  isSafeguardingLead: false,
});

const staffFromSeed = (user: User): StaffUser => ({
  ...user,
  email: `${user.username}@tlmn.org`,
  phone: '',
  designation: user.userRoles.includes('Admin') ? 'System Administrator' : 'Staff',
  station: 'Abuja',
  dateOfEmployment: '',
  thematics: user.region ? [user.region] : [],
  thematicProjects: {},
  departmentHead: false,
  forcePasswordChange: false,
  isSafeguardingLead: false,
});

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const usernameFromName = (firstName: string, lastName: string) =>
  `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z0-9._-]/g, '').replace(/\.+/g, '.');

const selectedThematics = (thematicProjects: Record<string, string[]>) =>
  Object.entries(thematicProjects)
    .filter(([, projects]) => projects.length > 0)
    .map(([thematic]) => thematic);

const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function HRAdministration() {
  const appName = useBrandingStore((s) => s.config.branding.appName);
  const [activeTab, setActiveTab] = useState('Users');
  const [jobSubTab, setJobSubTab] = useState('Manage Job Titles');
  const [orgSubTab, setOrgSubTab] = useState('General Information');
  const [search, setSearch] = useState('');
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() =>
    loadJson(STORAGE_USERS, seedUsers.map(staffFromSeed))
  );
  const [roles, setRoles] = useState<RoleDefinition[]>(() => loadJson(STORAGE_ROLES, defaultRoles()));
  const [staffDrawerOpen, setStaffDrawerOpen] = useState(false);
  const safeguardingLeadId = useSafeguardingStore((state) => state.safeguardingLeadId);
  const setSafeguardingLead = useSafeguardingStore((state) => state.setLead);
  const [staffStep, setStaffStep] = useState(1);
  const [staffForm, setStaffForm] = useState<StaffForm>(() => defaultStaffForm());
  const [expandedThematics, setExpandedThematics] = useState<Record<string, boolean>>({
    Leprosy: true,
  });
  const [createdCredential, setCreatedCredential] = useState<{
    username: string;
    password: string;
    email: string;
  } | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleForm, setRoleForm] = useState<RoleDefinition>({
    id: '',
    name: '',
    description: '',
    permissions: emptyPermissions(),
  });

  const tabs = ['Users', 'Manage User Roles', 'Job', 'Organization', 'Announcements', 'Configuration'];
  const jobSubTabs = [
    'Manage Salary Components',
    'Manage Job Titles',
    'Manage Pay Grades',
    'Manage Employment Status',
    'Manage Job Categories',
  ];
  const orgSubTabs = ['General Information', 'Locations', 'Structure', 'Cost Centers'];

  useEffect(() => {
    window.localStorage.setItem(STORAGE_USERS, JSON.stringify(staffUsers));
  }, [staffUsers]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ROLES, JSON.stringify(roles));
  }, [roles]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return staffUsers;
    return staffUsers.filter((user) =>
      [user.username, user.employeeName, user.email, user.userRoles.join(' '), user.region]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [search, staffUsers]);

  const assignedUserCount = (roleName: string) =>
    staffUsers.filter((user) => user.userRoles.includes(roleName)).length;

  const updateStaffForm = (partial: Partial<StaffForm>) => {
    setStaffForm((current) => ({ ...current, ...partial }));
  };

  const toggleStaffRole = (roleName: string) => {
    setStaffForm((current) => {
      const roles = current.roles.includes(roleName)
        ? current.roles.filter((role) => role !== roleName)
        : [...current.roles, roleName];
      return { ...current, roles: roles.length ? roles : ['Employee (ESS)'] };
    });
  };

  const toggleThematicProject = (thematic: string, project: string) => {
    setStaffForm((current) => {
      const currentProjects = current.thematicProjects[thematic] ?? [];
      const nextProjects = currentProjects.includes(project)
        ? currentProjects.filter((item) => item !== project)
        : [...currentProjects, project];
      return {
        ...current,
        thematicProjects: {
          ...current.thematicProjects,
          [thematic]: nextProjects,
        },
      };
    });
  };

  const openAddStaff = () => {
    setStaffForm(defaultStaffForm());
    setStaffStep(1);
    setCreatedCredential(null);
    setStaffDrawerOpen(true);
  };

  const createStaff = () => {
    const password = generatePassword();
    const username = usernameFromName(staffForm.firstName, staffForm.lastName);
    const thematics = selectedThematics(staffForm.thematicProjects);
    const currentLead = [...staffUsers, ...loadJson<Array<DemoUser & { password: string }>>(LOCAL_AUTH_ACCOUNTS_KEY, [])]
      .find((user) => user.id === safeguardingLeadId || ('isSafeguardingLead' in user && user.isSafeguardingLead));
    if (staffForm.isSafeguardingLead && currentLead) {
      const ok = window.confirm(`This will replace ${'employeeName' in currentLead ? currentLead.employeeName : currentLead.name} as Safeguarding Lead. Continue?`);
      if (!ok) return;
    }
    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      username,
      userRoles: staffForm.roles,
      employeeName: `${staffForm.firstName} ${staffForm.lastName}`.trim(),
      status: 'Enabled',
      region: staffForm.departmentHead ? `${staffForm.department} Head` : thematics.join(', '),
      email: staffForm.email,
      phone: staffForm.phone,
      designation: staffForm.designation,
      station: staffForm.station,
      dateOfEmployment: staffForm.dateOfEmployment,
      profilePhoto: staffForm.profilePhoto,
      thematics,
      thematicProjects: staffForm.thematicProjects,
      departmentHead: staffForm.departmentHead,
      department: staffForm.department,
      forcePasswordChange: true,
      temporaryPassword: password,
      isSafeguardingLead: staffForm.isSafeguardingLead,
    };

    const outbox = loadJson<Array<Record<string, string>>>(STORAGE_OUTBOX, []);
    window.localStorage.setItem(
      STORAGE_OUTBOX,
      JSON.stringify([
        ...outbox,
        {
          to: staffForm.email,
          subject: 'Your TLMN DOHRMP account credentials',
          body: `Login: ${window.location.origin}/login\nUsername: ${username}\nTemporary password: ${password}`,
          createdAt: new Date().toISOString(),
        },
      ])
    );

    const authAccounts = loadJson<Array<DemoUser & { password: string }>>(LOCAL_AUTH_ACCOUNTS_KEY, []);
    const authUser: DemoUser & { password: string } = {
      id: newStaff.id,
      employeeId: newStaff.id.toUpperCase(),
      name: newStaff.employeeName,
      username,
      email: staffForm.email,
      role: (staffForm.roles[0] || 'Employee (ESS)') as UserRole,
      department: staffForm.department || 'Programs',
      thematic: thematics,
      thematics,
      assignedProjects: Object.values(staffForm.thematicProjects).flat(),
      designation: staffForm.designation,
      station: staffForm.station,
      supervisor: '',
      avatar: staffForm.profilePhoto || `https://i.pravatar.cc/150?u=${username}`,
      mustChangePassword: true,
      isFirstLogin: true,
      status: 'Active',
      isSafeguardingLead: staffForm.isSafeguardingLead,
      password,
    };
    const nextAuthAccounts = [authUser, ...authAccounts.filter((account) => account.username !== username)].map((account) => ({
      ...account,
      isSafeguardingLead: staffForm.isSafeguardingLead ? account.username === username : account.isSafeguardingLead,
    }));
    window.localStorage.setItem(
      LOCAL_AUTH_ACCOUNTS_KEY,
      JSON.stringify(nextAuthAccounts)
    );
    if (staffForm.isSafeguardingLead) {
      setSafeguardingLead(authUser.id);
      setStaffUsers((current) => current.map((user) => ({ ...user, isSafeguardingLead: false })));
    }

    setStaffUsers((current) => [newStaff, ...current]);
    setCreatedCredential({ username, password, email: staffForm.email });
    toast.success('Staff account created and email queued');
  };

  const openAddRole = () => {
    setEditingRoleId(null);
    setRoleForm({ id: '', name: '', description: '', permissions: emptyPermissions() });
    setRoleModalOpen(true);
  };

  const openEditRole = (role: RoleDefinition) => {
    setEditingRoleId(role.id);
    setRoleForm(structuredClone(role) as RoleDefinition);
    setRoleModalOpen(true);
  };

  const saveRole = () => {
    if (!roleForm.name.trim()) {
      toast.error('Role name is required');
      return;
    }
    if (editingRoleId) {
      setRoles((current) =>
        current.map((role) => (role.id === editingRoleId ? { ...roleForm, id: editingRoleId } : role))
      );
      toast.success('Role updated');
    } else {
      setRoles((current) => [
        ...current,
        { ...roleForm, id: `role-${Date.now()}`, name: roleForm.name.trim() },
      ]);
      toast.success('Role created');
    }
    setRoleModalOpen(false);
  };

  const deleteRole = (role: RoleDefinition) => {
    if (assignedUserCount(role.name) > 0) {
      toast.error('Cannot delete a role assigned to users');
      return;
    }
    setRoles((current) => current.filter((item) => item.id !== role.id));
    toast.success('Role deleted');
  };

  const togglePermission = (module: string, action: PermissionAction) => {
    setRoleForm((current) => ({
      ...current,
      permissions: {
        ...current.permissions,
        [module]: {
          ...current.permissions[module],
          [action]: !current.permissions[module][action],
        },
      },
    }));
  };

  const renderStep = () => {
    if (createdCredential) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#247833]/20 bg-[#247833]/5 p-4">
            <h3 className="font-semibold text-[#247833]">Staff account created</h3>
            <p className="mt-1 text-sm text-gray-600">
              Credentials were generated, password change is required on first login, and an email was queued.
            </p>
          </div>
          <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{createdCredential.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Username</p>
              <p className="font-medium">{createdCredential.username}</p>
            </div>
            <div>
              <p className="text-gray-500">Temporary Password</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                  {createdCredential.password}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(createdCredential.password);
                    toast.success('Temporary password copied');
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (staffStep === 1) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['First Name', 'firstName'],
            ['Last Name', 'lastName'],
            ['Email', 'email'],
            ['Phone Number', 'phone'],
            ['Designation', 'designation'],
            ['Station/Location', 'station'],
            ['Date of Employment', 'dateOfEmployment'],
            ['Profile Photo URL (optional)', 'profilePhoto'],
          ].map(([label, key]) => (
            <label key={key} className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">{label}</span>
              <input
                type={key === 'dateOfEmployment' ? 'date' : key === 'email' ? 'email' : 'text'}
                value={staffForm[key as keyof StaffForm] as string}
                onChange={(event) => updateStaffForm({ [key]: event.target.value } as Partial<StaffForm>)}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#82154F]/20"
              />
            </label>
          ))}
        </div>
      );
    }

    if (staffStep === 2) {
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {SYSTEM_ROLES.map((role) => (
              <label key={role} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <Checkbox checked={staffForm.roles.includes(role)} onCheckedChange={() => toggleStaffRole(role)} />
                <span>{role}</span>
              </label>
            ))}
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-[#E1332A]/20 bg-[#E1332A]/5 p-4 text-sm">
            <Checkbox
              checked={staffForm.isSafeguardingLead}
              onCheckedChange={(checked) => updateStaffForm({ isSafeguardingLead: checked === true })}
            />
            <span>
              <span className="block font-semibold text-[#991B1B]">Assign as Safeguarding Lead</span>
              <span className="text-gray-600">Only one active Safeguarding Lead can receive confidential reports at a time.</span>
            </span>
          </label>
        </div>
      );
    }

    if (staffStep === 3) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">Department Head</p>
                <p className="text-sm text-gray-500">Use this when assigning a department head such as Programs, Finance, Audit, or HR.</p>
              </div>
              <Checkbox
                checked={staffForm.departmentHead}
                onCheckedChange={(checked) => updateStaffForm({ departmentHead: checked === true })}
              />
            </div>
            {staffForm.departmentHead && (
              <select
                value={staffForm.department}
                onChange={(event) => updateStaffForm({ department: event.target.value })}
                className="mt-3 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm"
              >
                {DEPARTMENTS.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>
            )}
          </div>

          {!staffForm.departmentHead && (
            <div className="space-y-3">
              {TLMN_THEMATICS.map((thematic) => (
                <div key={thematic.name} className="rounded-xl border border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedThematics((current) => ({
                        ...current,
                        [thematic.name]: !current[thematic.name],
                      }))
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
                  >
                    <span>{thematic.name}</span>
                    <span className="text-xs text-gray-500">
                      {(staffForm.thematicProjects[thematic.name] ?? []).length} selected
                    </span>
                  </button>
                  {expandedThematics[thematic.name] && (
                    <div className="grid gap-2 border-t border-gray-100 p-3 sm:grid-cols-2">
                      {thematic.projects.map((project) => (
                        <label key={project} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm">
                          <Checkbox
                            checked={(staffForm.thematicProjects[thematic.name] ?? []).includes(project)}
                            onCheckedChange={() => toggleThematicProject(thematic.name, project)}
                          />
                          <span>{project}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 text-sm md:grid-cols-2">
          <Summary label="Name" value={`${staffForm.firstName} ${staffForm.lastName}`} />
          <Summary label="Email" value={staffForm.email} />
          <Summary label="Phone" value={staffForm.phone || '-'} />
          <Summary label="Designation" value={staffForm.designation || '-'} />
          <Summary label="Station" value={staffForm.station || '-'} />
          <Summary label="Date of Employment" value={staffForm.dateOfEmployment || '-'} />
          <Summary label="Roles" value={staffForm.roles.join(', ')} />
          <Summary label="Safeguarding Lead" value={staffForm.isSafeguardingLead ? 'Yes' : 'No'} />
          <Summary
            label="Regions/Thematics"
            value={
              staffForm.departmentHead
                ? `${staffForm.department} Head`
                : selectedThematics(staffForm.thematicProjects).join(', ') || '-'
            }
          />
        </div>
        <div className="rounded-xl border border-[#82154F]/15 bg-[#82154F]/5 p-4 text-sm text-gray-700">
          On confirm, the system will create a staff record, generate a temporary password, queue the credential email,
          and force password change on first login.
        </div>
      </div>
    );
  };

  return (
    <HrPageShell title="HR Administration" breadcrumbs={[{ label: 'HR Administration' }]}>
      <div>
        <div className="bg-glass/40 border-b border-border/40 backdrop-blur-sm px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab
                    ? 'text-brand-primary border-b-2 border-brand-primary'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'Users' && (
            <div>
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 md:w-72"
                  />
                </div>
                <Button onClick={openAddStaff} className="rounded-full bg-[#247833] text-white hover:bg-[#1F682C]">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <TableHead>Username</TableHead>
                        <TableHead>User Role(s)</TableHead>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Regions/Thematic</TableHead>
                        <TableHead>Actions</TableHead>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{user.username}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.userRoles.join(', ')}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.employeeName}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-[#247833]/10 px-2 py-0.5 text-xs font-medium text-[#247833]">
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.region || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                              <button className="rounded p-1 hover:bg-gray-100" aria-label="View user">
                                <Eye className="h-4 w-4 text-gray-500" />
                              </button>
                              <button className="rounded p-1 hover:bg-gray-100" aria-label="Email user">
                                <Mail className="h-4 w-4 text-[#00578A]" />
                              </button>
                              <button
                                className="rounded p-1 hover:bg-gray-100"
                                aria-label="Disable user"
                                onClick={() =>
                                  setStaffUsers((current) =>
                                    current.map((item) =>
                                      item.id === user.id
                                        ? { ...item, status: item.status === 'Enabled' ? 'Disabled' : 'Enabled' }
                                        : item
                                    )
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4 text-[#E1332A]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Manage User Roles' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Manage User Roles</h2>
                  <p className="text-sm text-gray-500">Configure permissions by module and approval responsibility.</p>
                </div>
                <Button onClick={openAddRole} className="rounded-full bg-[#247833] text-white hover:bg-[#1F682C]">
                  <Plus className="h-4 w-4" />
                  Add Role
                </Button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Assigned Users</TableHead>
                      <TableHead>Actions</TableHead>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roles.map((role) => (
                      <tr key={role.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{role.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{role.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{assignedUserCount(role.name)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="rounded p-1 hover:bg-gray-100" onClick={() => openEditRole(role)}>
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </button>
                            <button className="rounded p-1 hover:bg-gray-100" onClick={() => deleteRole(role)}>
                              <Trash2 className="h-4 w-4 text-[#E1332A]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Job' && (
            <LegacyJobTab
              jobSubTabs={jobSubTabs}
              jobSubTab={jobSubTab}
              setJobSubTab={setJobSubTab}
            />
          )}

          {activeTab === 'Organization' && (
            <LegacyOrganizationTab
              appName={appName}
              orgSubTabs={orgSubTabs}
              orgSubTab={orgSubTab}
              setOrgSubTab={setOrgSubTab}
            />
          )}

          {(activeTab === 'Announcements' || activeTab === 'Configuration') && (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{activeTab}</h2>
              <p className="mt-1 text-sm text-gray-500">Configuration options will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <Sheet open={staffDrawerOpen} onOpenChange={setStaffDrawerOpen}>
        <SheetContent className="w-full max-w-full overflow-y-auto sm:max-w-3xl">
          <SheetHeader>
            <SheetTitle>Create Staff Account</SheetTitle>
            <SheetDescription>
              Step {createdCredential ? 4 : staffStep} of 4 -{' '}
              {['Personal Info', 'Role Assignment', 'Thematic & Project Assignment', 'Review & Create'][
                (createdCredential ? 4 : staffStep) - 1
              ]}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            <div className="mb-5 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={cn(
                    'h-1.5 rounded-full',
                    step <= staffStep || createdCredential ? 'bg-[#82154F]' : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
            {renderStep()}
          </div>
          <SheetFooter>
            {!createdCredential && (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={staffStep === 1}
                  onClick={() => setStaffStep((step) => Math.max(1, step - 1))}
                >
                  Back
                </Button>
                {staffStep < 4 ? (
                  <Button
                    type="button"
                    className="bg-[#82154F] text-white hover:bg-[#6F1143]"
                    onClick={() => setStaffStep((step) => Math.min(4, step + 1))}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button type="button" className="bg-[#247833] text-white hover:bg-[#1F682C]" onClick={createStaff}>
                    <UserPlus className="h-4 w-4" />
                    Create Staff
                  </Button>
                )}
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
          <DialogContent className="max-h-[90vh] w-full max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editingRoleId ? 'Edit Role' : 'Add Role'}</DialogTitle>
            <DialogDescription>
              Set role details and module permissions independently for view, create, edit, delete, and approve.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Role Name</span>
              <input
                value={roleForm.name}
                onChange={(event) => setRoleForm((current) => ({ ...current, name: event.target.value }))}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#82154F]/20"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Description</span>
              <input
                value={roleForm.description}
                onChange={(event) =>
                  setRoleForm((current) => ({ ...current, description: event.target.value }))
                }
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#82154F]/20"
              />
            </label>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full min-w-[760px]">
              <thead className="bg-gray-50">
                <tr>
                  <TableHead>Module</TableHead>
                  {PERMISSION_ACTIONS.map((action) => (
                    <TableHead key={action} className="capitalize">
                      {action}
                    </TableHead>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PERMISSION_MODULES.map((module) => (
                  <tr key={module}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{module}</td>
                    {PERMISSION_ACTIONS.map((action) => (
                      <td key={action} className="px-4 py-3">
                        <Checkbox
                          checked={roleForm.permissions[module][action]}
                          onCheckedChange={() => togglePermission(module, action)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#82154F] text-white hover:bg-[#6F1143]" onClick={saveRole}>
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HrPageShell>
  );
}

function TableHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={cn('px-4 py-3 text-left text-xs font-semibold text-gray-600', className)}>{children}</th>;
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}

function LegacyJobTab({
  jobSubTabs,
  jobSubTab,
  setJobSubTab,
}: {
  jobSubTabs: string[];
  jobSubTab: string;
  setJobSubTab: (tab: string) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-1 border-b border-gray-200">
        {jobSubTabs.map((sub) => (
          <button
            key={sub}
            onClick={() => setJobSubTab(sub)}
            className={cn(
              'px-3 py-2 text-sm transition-colors',
              jobSubTab === sub ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {sub}
          </button>
        ))}
      </div>

      {jobSubTab === 'Manage Job Titles' && (
        <div>
          <div className="mb-4 flex justify-end">
            <Button className="rounded-full bg-[#247833] text-white hover:bg-[#1F682C]">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full min-w-[760px]">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Pay Grade</TableHead>
                  <TableHead>Job Specification</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobTitles.map((jobTitle) => (
                  <tr key={jobTitle.id} className="group hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{jobTitle.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{jobTitle.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{jobTitle.payGrade}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{jobTitle.specification}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="rounded p-1 hover:bg-gray-100">
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="rounded p-1 hover:bg-gray-100">
                          <Trash2 className="h-4 w-4 text-[#E1332A]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {jobSubTab === 'Manage Pay Grades' && (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <TableHead>Name</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Minimum Salary</TableHead>
                <TableHead>Maximum Salary</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payGrades.map((payGrade) => (
                <tr key={payGrade.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{payGrade.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{payGrade.currency}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">${payGrade.minSalary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">${payGrade.maxSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LegacyOrganizationTab({
  appName,
  orgSubTabs,
  orgSubTab,
  setOrgSubTab,
}: {
  appName: string;
  orgSubTabs: string[];
  orgSubTab: string;
  setOrgSubTab: (tab: string) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-1 border-b border-gray-200">
        {orgSubTabs.map((sub) => (
          <button
            key={sub}
            onClick={() => setOrgSubTab(sub)}
            className={cn(
              'px-3 py-2 text-sm transition-colors',
              orgSubTab === sub ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {sub}
          </button>
        ))}
      </div>

      {orgSubTab === 'General Information' && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">General Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[#82154F]">Organization Name*</span>
              <input defaultValue={appName || 'TLMN DOHRMP'} className="h-10 w-full rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-600">Email</span>
              <input defaultValue="info@tlmn.org" className="h-10 w-full rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="rounded-full bg-[#247833] text-white hover:bg-[#1F682C]">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      )}

      {orgSubTab === 'Locations' && (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>No of Employees</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{location.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{location.city}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{location.country}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{location.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{location.employeeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
