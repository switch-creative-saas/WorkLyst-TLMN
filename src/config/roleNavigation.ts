import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckSquare,
  ClipboardList,
  Clock,
  FileText,
  Folder,
  LayoutDashboard,
  QrCode,
  Settings,
  Shield,
  Newspaper,
  User,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/stores/useAuthStore';

export interface RoleNavItem {
  label: string;
  route: string;
  icon: LucideIcon;
}

export interface RoleNavGroup {
  id: string;
  label: string;
  items: RoleNavItem[];
}

const profile: RoleNavItem = { label: 'My Profile', route: '/profile', icon: User };
const personalQrAttendance: RoleNavItem = { label: 'Attendance (QR)', route: '/attendance/qr', icon: QrCode };

export const NavigationConfig: Record<UserRole, RoleNavGroup[]> = {
  'Employee (ESS)': [
    {
      id: 'self-service',
      label: 'Employee Self Service',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
        { label: 'My Timesheet', route: '/my-timesheet', icon: Clock },
        personalQrAttendance,
        { label: 'My Leave', route: '/my-leave', icon: Calendar },
        { label: 'My Requests', route: '/requests', icon: Wallet },
        { label: 'Activity Reports', route: '/activity-reports', icon: BarChart3 },
        { label: 'My Documents', route: '/documents', icon: Folder },
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  Supervisor: [
    {
      id: 'supervisor',
      label: 'Supervisor Workspace',
      items: [
        { label: 'Dashboard', route: '/supervisor/dashboard', icon: LayoutDashboard },
        personalQrAttendance,
        { label: 'My Team', route: '/supervisor/team', icon: Users },
        { label: 'Pending Approvals', route: '/requests/approvals', icon: CheckSquare },
        { label: 'Attendance Overview', route: '/supervisor/attendance', icon: QrCode },
        { label: 'Reports', route: '/supervisor/reports', icon: ClipboardList },
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  'Program Officer': [
    {
      id: 'program-officer',
      label: 'Program Officer',
      items: [
        { label: 'Dashboard', route: '/programs/dashboard', icon: LayoutDashboard },
        { label: 'My Timesheet', route: '/my-timesheet', icon: Clock },
        personalQrAttendance,
        { label: 'My Leave', route: '/my-leave', icon: Calendar },
        { label: 'Requests', route: '/requests', icon: Wallet },
        { label: 'Activity Reports', route: '/activity-reports', icon: BarChart3 },
        { label: 'My Documents', route: '/documents', icon: Folder },
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  'Program Lead': [
    {
      id: 'program-lead',
      label: 'Program Lead',
      items: [
        { label: 'Dashboard', route: '/programs/dashboard', icon: LayoutDashboard },
        personalQrAttendance,
        { label: 'My Team', route: '/programs/team', icon: Users },
        { label: 'Pending Approvals', route: '/requests/approvals', icon: CheckSquare },
        { label: 'Program Reports', route: '/reports/ngo', icon: ClipboardList },
        { label: 'Activity Reports', route: '/activity-reports', icon: BarChart3 },
        { label: 'Budget Overview', route: '/finance/dashboard', icon: Wallet },
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  'Finance Officer': [
    {
      id: 'finance',
      label: 'Finance',
      items: [
        { label: 'Dashboard', route: '/finance/dashboard', icon: LayoutDashboard },
        personalQrAttendance,
        { label: 'Payment Requests', route: '/requests', icon: Wallet },
        { label: 'Budget Tracker', route: '/finance', icon: BarChart3 },
        { label: 'Approved Payments', route: '/finance/approved-payments', icon: CheckSquare },
        { label: 'Finance Reports', route: '/reports/ngo', icon: FileText },
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  'Audit Officer': [
    {
      id: 'audit',
      label: 'Audit',
      items: [
        { label: 'Dashboard', route: '/audit/dashboard', icon: LayoutDashboard },
        personalQrAttendance,
        { label: 'Requests for Audit Review', route: '/requests/approvals', icon: Shield },
        { label: 'Audit Trail', route: '/audit', icon: ClipboardList },
        { label: 'Reports Review', route: '/reports/ngo', icon: FileText },
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  'HR Officer': [
    {
      id: 'hr',
      label: 'People & HR',
      items: [
        { label: 'Dashboard', route: '/hr/dashboard', icon: LayoutDashboard },
        personalQrAttendance,
        { label: 'Employee Management', route: '/hr/employee-management', icon: Users },
        { label: 'HR Administration', route: '/hr/hr-administration', icon: UserCog },
        { label: 'Attendance Management', route: '/hr/attendance', icon: QrCode },
        { label: 'Leave Management', route: '/hr/leave', icon: Calendar },
        { label: 'Timesheet Overview', route: '/hr/time-tracking', icon: Clock },
        { label: 'Recruitment', route: '/hr/recruitment', icon: BriefcaseBusiness },
        { label: 'Onboarding', route: '/hr/onboarding', icon: CheckSquare },
        { label: 'Training', route: '/hr/training', icon: FileText },
        { label: 'Announcements', route: '/notifications', icon: Bell },
        { label: 'Settings', route: '/hr/settings/attendance', icon: Settings },
        { label: 'Branding Configuration', route: '/admin/settings/branding', icon: Settings },
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  'HR Manager': [],
  'National Director': [
    {
      id: 'nd',
      label: 'Executive',
      items: [
        { label: 'Dashboard', route: '/nd/dashboard', icon: LayoutDashboard },
        personalQrAttendance,
        { label: 'Organization Overview', route: '/analytics', icon: Building2 },
        { label: 'All Reports', route: '/reports/ngo', icon: FileText },
        { label: 'All Requests', route: '/requests/approvals', icon: CheckSquare },
        { label: 'Attendance Summary', route: '/hr/attendance', icon: QrCode },
        { label: 'Finance Summary', route: '/finance/dashboard', icon: Wallet },
        { label: 'Announcements', route: '/notifications', icon: Bell },
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  Receptionist: [
    {
      id: 'front-desk',
      label: 'Front Desk',
      items: [
        { label: 'Dashboard', route: '/receptionist/dashboard', icon: LayoutDashboard },
        { label: 'Attendance', route: '/receptionist/attendance', icon: QrCode },
        { label: 'Leave List', route: '/receptionist/leave', icon: Calendar },
        { label: 'Employee Directory', route: '/receptionist/directory', icon: Users },
        { label: 'Visitor Log', route: '/receptionist/visitors', icon: ClipboardList },
      ],
    },
    {
      id: 'receptionist-operations',
      label: 'Operations',
      items: [
        { label: 'My Timesheet', route: '/my-timesheet', icon: Clock },
        personalQrAttendance,
        { label: 'My Leave', route: '/my-leave', icon: Calendar },
        { label: 'My Requests', route: '/requests', icon: Wallet },
        { label: 'Activity Reports', route: '/activity-reports', icon: BarChart3 },
        { label: 'My Documents', route: '/documents', icon: Folder },
      ],
    },
    {
      id: 'receptionist-communications',
      label: 'Communications',
      items: [
        { label: 'Announcements', route: '/receptionist/announcements', icon: Bell },
        { label: 'Latest News', route: '/receptionist/news', icon: Newspaper },
      ],
    },
    {
      id: 'receptionist-account',
      label: 'Account',
      items: [
        { label: 'My Safeguarding Reports', route: '/safeguarding/my-reports', icon: Shield },
        profile,
      ],
    },
  ],
  'Communications Officer': [
    {
      id: 'communications',
      label: 'Communications',
      items: [
        { label: 'Dashboard', route: '/communications/dashboard', icon: LayoutDashboard },
        { label: 'Announcements', route: '/communications/announcements', icon: Bell },
        { label: 'News Posts', route: '/communications/news', icon: Newspaper },
        { label: 'Broadcasts / Notices', route: '/communications/broadcasts', icon: Bell },
        { label: 'Documents Library', route: '/communications/documents', icon: Folder },
        { label: 'Media Assets', route: '/communications/media', icon: FileText },
        { label: 'Goals & OKRs', route: '/communications/goals', icon: CheckSquare },
      ],
    },
    {
      id: 'communications-insights',
      label: 'Insights',
      items: [
        { label: 'Org Directory', route: '/communications/directory', icon: Users },
        { label: 'Attendance Summary', route: '/communications/attendance', icon: QrCode },
        { label: 'Activity Reports', route: '/communications/activity-reports', icon: BarChart3 },
      ],
    },
    {
      id: 'communications-my-work',
      label: 'My Work',
      items: [
        { label: 'My Timesheet', route: '/my-timesheet', icon: Clock },
        personalQrAttendance,
        { label: 'My Leave', route: '/my-leave', icon: Calendar },
        { label: 'My Requests', route: '/requests', icon: Wallet },
      ],
    },
    {
      id: 'communications-account',
      label: 'Account',
      items: [
        profile,
      ],
    },
  ],
  'Admin / Global Admin': [],
  Admin: [],
};

NavigationConfig['HR Manager'] = NavigationConfig['HR Officer'];
NavigationConfig.Admin = [
  ...NavigationConfig['HR Manager'],
  {
    id: 'admin',
    label: 'System Admin',
    items: [
      { label: 'System Settings', route: '/settings', icon: Settings },
      { label: 'Branding Configuration', route: '/admin/settings/branding', icon: Settings },
      { label: 'User Management', route: '/hr/hr-administration', icon: UserCog },
      { label: 'Role Management', route: '/settings/access', icon: Shield },
      { label: 'Scanner Management', route: '/hr/settings/attendance', icon: QrCode },
      { label: 'Finance', route: '/finance/dashboard', icon: Wallet },
      { label: 'Audit', route: '/audit/dashboard', icon: Shield },
      { label: 'Programs', route: '/programs/dashboard', icon: BarChart3 },
      { label: 'Executive Dashboard', route: '/nd/dashboard', icon: LayoutDashboard },
    ],
  },
];
const hrAdminFeatures: RoleNavGroup = {
  id: 'hr-admin-features',
  label: 'Admin Features',
  items: [
    { label: 'Admin Dashboard', route: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'System Settings', route: '/settings', icon: Settings },
    { label: 'Branding Configuration', route: '/admin/settings/branding', icon: Settings },
    { label: 'Role Management', route: '/settings/access', icon: Shield },
    { label: 'Scanner Management', route: '/hr/settings/attendance', icon: QrCode },
  ],
};
NavigationConfig['HR Officer'] = [...NavigationConfig['HR Officer'], hrAdminFeatures];
NavigationConfig['HR Manager'] = NavigationConfig['HR Officer'];
NavigationConfig['Admin / Global Admin'] = NavigationConfig.Admin;

export const navForRole = (role: UserRole) => NavigationConfig[role] ?? NavigationConfig['Employee (ESS)'];

export const allowedRoutesForRole = (role: UserRole) =>
  navForRole(role).flatMap((group) => group.items.map((item) => item.route.split('?')[0]));

export const routeAllowedForRole = (role: UserRole, pathname: string) => {
  if (pathname === '/profile' || pathname === '/auth/set-password') return true;
  if (pathname.startsWith('/safeguarding')) return true;
  if ((role === 'HR Manager' || role === 'HR Officer' || role === 'Admin' || role === 'Admin / Global Admin') && pathname.startsWith('/receptionist')) return true;
  if ((role === 'HR Manager' || role === 'HR Officer') && (pathname.startsWith('/admin') || pathname.startsWith('/settings'))) return true;
  if (role === 'Admin' || role === 'Admin / Global Admin') return true;
  return allowedRoutesForRole(role).some((route) => pathname === route || pathname.startsWith(`${route}/`));
};
