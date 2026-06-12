import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { routeAllowedForRole } from '@/config/roleNavigation';

export type UserRole =
  | 'Employee (ESS)'
  | 'Supervisor'
  | 'Program Officer'
  | 'Program Lead'
  | 'Audit Officer'
  | 'Finance Officer'
  | 'HR Officer'
  | 'HR Manager'
  | 'National Director'
  | 'Receptionist'
  | 'Communications Officer'
  | 'Admin / Global Admin'
  | 'Admin';

export interface DemoUser {
  id: string;
  employeeId: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  department: string;
  thematic: string[];
  thematics: string[];
  assignedProjects: string[];
  designation: string;
  station: string;
  supervisor?: string;
  avatar: string;
  mustChangePassword: boolean;
  isFirstLogin: boolean;
  status: 'Active' | 'Disabled';
  isSafeguardingLead?: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PasswordResetTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export interface PasswordResetAuditRecord {
  id: string;
  userId?: string;
  usernameOrEmail: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  reason?: string;
}

export interface LocalEmailOutboxItem {
  id: string;
  to: string;
  subject: string;
  templateName: string;
  resetUrl?: string;
  createdAt: string;
}

const DEMO_PASSWORD = 'TLMNDemo2025';
export const LOCAL_AUTH_ACCOUNTS_KEY = 'tlmn_local_auth_accounts';

const withSessionDefaults = (user: Omit<DemoUser, 'thematics' | 'isFirstLogin' | 'status'> & Partial<DemoUser>) => ({
  ...user,
  thematics: user.thematics ?? user.thematic,
  isFirstLogin: user.isFirstLogin ?? user.mustChangePassword,
  status: user.status ?? 'Active',
  isSafeguardingLead: user.isSafeguardingLead ?? false,
});

export const demoUsers: DemoUser[] = [
  withSessionDefaults({
    id: 'u-aaron',
    employeeId: 'TLMN-HR-001',
    name: 'Aaron Hamilton',
    username: 'aaron.hamilton',
    email: 'aaron.hamilton@tlmn.org',
    role: 'HR Manager',
    department: 'Human Resources',
    thematic: [],
    assignedProjects: [],
    designation: 'HR Manager',
    station: 'Abuja',
    avatar: 'https://i.pravatar.cc/150?u=aaron',
    mustChangePassword: false,
  }),
  withSessionDefaults({
    id: 'u-grace',
    employeeId: 'TLMN-ND-001',
    name: 'Grace Okonkwo',
    username: 'grace.okonkwo',
    email: 'grace.okonkwo@tlmn.org',
    role: 'National Director',
    department: 'National Director Office',
    thematic: [],
    assignedProjects: [],
    designation: 'National Director',
    station: 'Abuja',
    avatar: 'https://i.pravatar.cc/150?u=grace',
    mustChangePassword: false,
    isSafeguardingLead: true,
  }),
  withSessionDefaults({
    id: 'u-james',
    employeeId: 'TLMN-PO-001',
    name: 'James Adeyemi',
    username: 'james.adeyemi',
    email: 'james.adeyemi@tlmn.org',
    role: 'Program Officer',
    department: 'Programs',
    thematic: ['Leprosy', 'NTDs'],
    assignedProjects: ['Inclusion Project', 'Community Drug Administration'],
    designation: 'Program Officer',
    station: 'Jos',
    supervisor: 'Faith Musa',
    avatar: 'https://i.pravatar.cc/150?u=james',
    mustChangePassword: false,
  }),
  withSessionDefaults({
    id: 'u-faith',
    employeeId: 'TLMN-PL-001',
    name: 'Faith Musa',
    username: 'faith.musa',
    email: 'faith.musa@tlmn.org',
    role: 'Program Lead',
    department: 'Programs',
    thematic: ['Leprosy'],
    assignedProjects: ['Inclusion Project', 'Community Outreach Project'],
    designation: 'Program Lead',
    station: 'Jos',
    avatar: 'https://i.pravatar.cc/150?u=faith',
    mustChangePassword: false,
  }),
  withSessionDefaults({
    id: 'u-emeka',
    employeeId: 'TLMN-FIN-001',
    name: 'Emeka Eze',
    username: 'emeka.eze',
    email: 'emeka.eze@tlmn.org',
    role: 'Finance Officer',
    department: 'Finance',
    thematic: [],
    assignedProjects: [],
    designation: 'Finance Officer',
    station: 'Abuja',
    avatar: 'https://i.pravatar.cc/150?u=emeka',
    mustChangePassword: false,
  }),
  withSessionDefaults({
    id: 'u-ngozi',
    employeeId: 'TLMN-AUD-001',
    name: 'Ngozi Bello',
    username: 'ngozi.bello',
    email: 'ngozi.bello@tlmn.org',
    role: 'Audit Officer',
    department: 'Audit',
    thematic: [],
    assignedProjects: [],
    designation: 'Audit Officer',
    station: 'Abuja',
    avatar: 'https://i.pravatar.cc/150?u=ngozi',
    mustChangePassword: false,
  }),
  withSessionDefaults({
    id: 'u-amina',
    employeeId: 'TLMN-FD-001',
    name: 'Amina Yusuf',
    username: 'amina.yusuf',
    email: 'amina.yusuf@tlmn.org',
    role: 'Receptionist',
    department: 'Administration',
    thematic: [],
    assignedProjects: [],
    designation: 'Front Desk Receptionist',
    station: 'Abuja',
    avatar: 'https://i.pravatar.cc/150?u=amina',
    mustChangePassword: false,
  }),
  withSessionDefaults({
    id: 'u-ada',
    employeeId: 'TLMN-COM-001',
    name: 'Ada Balogun',
    username: 'ada.balogun',
    email: 'ada.balogun@tlmn.org',
    role: 'Communications Officer',
    department: 'Communications',
    thematic: ['Communications'],
    assignedProjects: ['Impact Storytelling', 'Media Engagement'],
    designation: 'Communications Officer',
    station: 'Abuja',
    avatar: 'https://i.pravatar.cc/150?u=ada',
    mustChangePassword: false,
  }),
  withSessionDefaults({
    id: 'u-chidi',
    employeeId: 'TLMN-ESS-001',
    name: 'Chidi Nwachukwu',
    username: 'chidi.nwachukwu',
    email: 'chidi.nwachukwu@tlmn.org',
    role: 'Employee (ESS)',
    department: 'Programs',
    thematic: ['Disabilities'],
    assignedProjects: ['Inclusive Livelihoods', 'Assistive Devices Access'],
    designation: 'Project Assistant',
    station: 'Enugu',
    supervisor: 'Faith Musa',
    avatar: 'https://i.pravatar.cc/150?u=chidi',
    mustChangePassword: false,
  }),
];

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'Employee (ESS)': ['employee.*'],
  Supervisor: ['employee.*', 'approvals.supervisor'],
  'Program Officer': ['employee.*', 'programs.read', 'reports.create'],
  'Program Lead': ['employee.*', 'programs.*', 'approvals.program_lead'],
  'Audit Officer': ['employee.*', 'audit.*', 'approvals.audit'],
  'Finance Officer': ['employee.*', 'finance.*', 'approvals.finance'],
  'HR Officer': ['employee.*', 'hr.read'],
  'HR Manager': ['hr.*', 'dashboard.hr'],
  'National Director': ['*'],
  Receptionist: ['employee.*', 'attendance.read', 'visitors.*', 'announcements.create'],
  'Communications Officer': [
    'employee.*',
    'announcements.*',
    'documents.*',
    'notifications.*',
    'directory.read',
    'attendance.read',
    'activity_reports.read',
    'goals.*',
    'media.*',
  ],
  'Admin / Global Admin': ['*'],
  Admin: ['*'],
};

interface AuthState {
  user: DemoUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  tenantId: string;
  notifications: NotificationItem[];
  resetTokens: PasswordResetTokenRecord[];
  resetAudits: PasswordResetAuditRecord[];
  emailOutbox: LocalEmailOutboxItem[];
  forgotPasswordRequests: Record<string, string[]>;
  login: (username: string, password?: string) => { ok: boolean; reason?: string; redirectTo?: string };
  demoLogin: (username: string) => string;
  logout: () => void;
  setNewPassword: (password: string) => void;
  requestPasswordReset: (usernameOrEmail: string) => Promise<{ ok: boolean; resetUrl?: string; reason?: string }>;
  validateResetToken: (token: string) => Promise<{ valid: boolean; userName?: string; reason?: string }>;
  resetPasswordWithToken: (token: string, newPassword: string) => Promise<{ ok: boolean; reason?: string }>;
  hydrateSession: () => Promise<void>;
  getDashboardRoute: () => string;
  addNotification: (message: string) => void;
  markNotificationsRead: () => void;
  hasPermission: (permission: string) => boolean;
}

const findDemoUser = (username: string) => {
  const normalized = username.trim().toLowerCase();
  return demoUsers.find((user) => user.username === normalized || user.email === normalized);
};

const localAccounts = (): Array<DemoUser & { password: string }> => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_AUTH_ACCOUNTS_KEY) ?? '[]') as Array<DemoUser & { password: string }>;
  } catch {
    return [];
  }
};

const findLocalAccount = (username: string) => {
  const normalized = username.trim().toLowerCase();
  return localAccounts().find((user) => user.username === normalized || user.email === normalized);
};

const findAnyAccount = (username: string) => findLocalAccount(username) ?? findDemoUser(username);

const randomHex = (bytes = 32) => {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hashToken = async (token: string) => {
  const encoded = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const upsertLocalPassword = (user: DemoUser, password: string) => {
  if (typeof window === 'undefined') return;
  const accounts = localAccounts();
  const existing = accounts.find((account) => account.id === user.id);
  const nextAccount = {
    ...user,
    mustChangePassword: false,
    isFirstLogin: false,
    status: user.status ?? 'Active',
    password,
  };
  const next = existing
    ? accounts.map((account) => (account.id === user.id ? { ...account, ...nextAccount } : account))
    : [...accounts, nextAccount];
  window.localStorage.setItem(LOCAL_AUTH_ACCOUNTS_KEY, JSON.stringify(next));
};

export const dashboardRouteForRole = (role: UserRole) => {
  if (role === 'HR Manager' || role === 'HR Officer' || role === 'Admin / Global Admin' || role === 'Admin') {
    return role === 'Admin / Global Admin' || role === 'Admin' ? '/admin/dashboard' : '/hr/dashboard';
  }
  if (role === 'National Director') return '/nd/dashboard';
  if (role === 'Receptionist') return '/receptionist/dashboard';
  if (role === 'Communications Officer') return '/communications/dashboard';
  if (role === 'Program Officer' || role === 'Program Lead') return '/programs/dashboard';
  if (role === 'Finance Officer') return '/finance/dashboard';
  if (role === 'Audit Officer') return '/audit/dashboard';
  if (role === 'Supervisor') return '/supervisor/dashboard';
  return '/dashboard';
};

const adminRoles: UserRole[] = ['Admin', 'Admin / Global Admin'];

export const canRoleAccessPath = (role: UserRole, pathname: string) => {
  if (pathname.startsWith('/hr/employees/') && pathname.endsWith('/profile')) {
    return role === 'HR Manager' || role === 'HR Officer' || adminRoles.includes(role);
  }
  return routeAllowedForRole(role, pathname);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: demoUsers[0],
      isAuthenticated: false,
      isLoading: false,
      tenantId: 'tlmn',
      notifications: [],
      resetTokens: [],
      resetAudits: [],
      emailOutbox: [],
      forgotPasswordRequests: {},
      login: (username, password = DEMO_PASSWORD) => {
        const localUser = findLocalAccount(username);
        const demoUser = findDemoUser(username);
        const user = localUser ?? demoUser;
        const expectedPassword = localUser?.password ?? DEMO_PASSWORD;
        if (!user || password !== expectedPassword) {
          return { ok: false, reason: 'Invalid username or password' };
        }
        if (user.status === 'Disabled') {
          return { ok: false, reason: 'Your account has been disabled. Contact HR.' };
        }
        const sessionUser = { ...user, mustChangePassword: user.isFirstLogin };
        set({ isAuthenticated: true, tenantId: 'tlmn', user: sessionUser });
        return {
          ok: true,
          redirectTo: sessionUser.mustChangePassword ? '/auth/set-password' : dashboardRouteForRole(user.role),
        };
      },
      demoLogin: (username) => {
        const user = findDemoUser(username) ?? demoUsers[0];
        set({ isAuthenticated: true, tenantId: 'tlmn', user: { ...user, mustChangePassword: false } });
        return dashboardRouteForRole(user.role);
      },
      logout: () => set({ isAuthenticated: false, user: demoUsers[0], notifications: [] }),
      setNewPassword: (password) => {
        set((state) => {
          const nextUser = { ...state.user, mustChangePassword: false, isFirstLogin: false };
          if (typeof window !== 'undefined') {
            const accounts = localAccounts().map((account) =>
              account.id === nextUser.id ? { ...account, ...nextUser, password } : account
            );
            window.localStorage.setItem(LOCAL_AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
          }
          return { user: nextUser };
        });
      },
      requestPasswordReset: async (usernameOrEmail) => {
        const normalized = usernameOrEmail.trim().toLowerCase();
        const now = Date.now();
        const recent = (get().forgotPasswordRequests[normalized] ?? []).filter(
          (timestamp) => now - new Date(timestamp).getTime() < 60 * 60 * 1000
        );
        if (recent.length >= 3) {
          set((state) => ({
            resetAudits: [
              {
                id: `audit-${now}`,
                usernameOrEmail: normalized,
                timestamp: new Date(now).toISOString(),
                ipAddress: 'local-demo',
                success: false,
                reason: 'rate_limited',
              },
              ...state.resetAudits,
            ],
          }));
          return { ok: false, reason: 'Too many reset attempts. Please try again later.' };
        }

        const user = findAnyAccount(normalized);
        let resetUrl: string | undefined;
        let tokenRecord: PasswordResetTokenRecord | undefined;
        if (user) {
          const rawToken = randomHex(32);
          const tokenHash = await hashToken(rawToken);
          const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
          resetUrl = `${origin}/auth/reset-password?token=${rawToken}`;
          tokenRecord = {
            id: `prt-${now}`,
            userId: user.id,
            tokenHash,
            expiresAt: new Date(now + 60 * 60 * 1000).toISOString(),
            used: false,
            createdAt: new Date(now).toISOString(),
          };
        }

        set((state) => ({
          forgotPasswordRequests: {
            ...state.forgotPasswordRequests,
            [normalized]: [...recent, new Date(now).toISOString()],
          },
          resetTokens: tokenRecord ? [tokenRecord, ...state.resetTokens] : state.resetTokens,
          resetAudits: [
            {
              id: `audit-${now}`,
              userId: user?.id,
              usernameOrEmail: normalized,
              timestamp: new Date(now).toISOString(),
              ipAddress: 'local-demo',
              success: Boolean(user),
              reason: user ? 'email_queued' : 'account_not_found_generic_success',
            },
            ...state.resetAudits,
          ],
          emailOutbox: user
            ? [
                {
                  id: `email-${now}`,
                  to: user.email,
                  subject: 'Password Reset Request',
                  templateName: 'forgot-password',
                  resetUrl,
                  createdAt: new Date(now).toISOString(),
                },
                ...state.emailOutbox,
              ]
            : state.emailOutbox,
        }));
        return { ok: true, resetUrl };
      },
      validateResetToken: async (token) => {
        if (!token) return { valid: false, reason: 'missing' };
        const tokenHash = await hashToken(token);
        const record = get().resetTokens.find((item) => item.tokenHash === tokenHash);
        const user = record ? findAnyAccount(record.userId) ?? demoUsers.find((item) => item.id === record.userId) : undefined;
        if (!record || !user || record.used || new Date(record.expiresAt).getTime() <= Date.now()) {
          return { valid: false, reason: 'invalid_or_expired' };
        }
        return { valid: true, userName: user.name };
      },
      resetPasswordWithToken: async (token, newPassword) => {
        const tokenHash = await hashToken(token);
        const record = get().resetTokens.find((item) => item.tokenHash === tokenHash);
        const user = record ? findAnyAccount(record.userId) ?? demoUsers.find((item) => item.id === record.userId) : undefined;
        const valid = Boolean(record && user && !record.used && new Date(record.expiresAt).getTime() > Date.now());
        if (!record || !user || !valid) {
          set((state) => ({
            resetAudits: [
              {
                id: `audit-${Date.now()}`,
                userId: record?.userId,
                usernameOrEmail: record?.userId ?? 'unknown-token',
                timestamp: new Date().toISOString(),
                ipAddress: 'local-demo',
                success: false,
                reason: 'invalid_or_expired',
              },
              ...state.resetAudits,
            ],
          }));
          return { ok: false, reason: 'Link invalid or expired' };
        }
        upsertLocalPassword(user, newPassword);
        set((state) => ({
          isAuthenticated: false,
          resetTokens: state.resetTokens.map((item) =>
            item.userId === user.id ? { ...item, used: true } : item
          ),
          resetAudits: [
            {
              id: `audit-${Date.now()}`,
              userId: user.id,
              usernameOrEmail: user.username,
              timestamp: new Date().toISOString(),
              ipAddress: 'local-demo',
              success: true,
              reason: 'password_reset',
            },
            ...state.resetAudits,
          ],
          emailOutbox: [
            {
              id: `email-${Date.now()}`,
              to: user.email,
              subject: 'Password Reset Successful',
              templateName: 'password-reset-success',
              createdAt: new Date().toISOString(),
            },
            ...state.emailOutbox,
          ],
        }));
        return { ok: true };
      },
      hydrateSession: async () => {
        set({ isLoading: false });
      },
      getDashboardRoute: () => dashboardRouteForRole(get().user.role),
      addNotification: (message) =>
        set((state) => ({
          notifications: [
            { id: `note-${Date.now()}`, message, createdAt: new Date().toISOString(), read: false },
            ...state.notifications,
          ],
        })),
      markNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
        })),
      hasPermission: (permission) => {
        const perms = ROLE_PERMISSIONS[get().user.role] ?? [];
        if (perms.includes('*')) return true;
        return perms.some(
          (p) => p === permission || (p.endsWith('.*') && permission.startsWith(p.replace('.*', '')))
        );
      },
    }),
    { name: 'tlmn-demo-auth-v2' }
  )
);
