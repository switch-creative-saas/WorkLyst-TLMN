import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  Handshake,
  Users,
  UserCog,
  Calendar,
  Clock,
  CheckSquare,
  ClipboardList,
  FileText,
  BarChart3,
  Wallet,
  Shield,
  Settings,
  GraduationCap,
  Target,
  TrendingUp,
  Route,
  Link2,
  MessageSquare,
  Scale,
  Search,
  UserPlus,
  CalendarDays,
  QrCode,
  FileStack,
  PieChart,
  Bell,
  Car,
  Landmark,
  Layers3,
  PackageCheck,
} from 'lucide-react';

export interface NavItem {
  label: string;
  route: string;
  icon: LucideIcon;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const navigationGroups: NavGroup[] = [
  {
    id: 'insights',
    label: 'Insights',
    items: [
      { label: 'Home', route: '/', icon: LayoutDashboard },
      { label: 'Executive Dashboard', route: '/dashboard/executive', icon: PieChart },
      { label: 'Analytics', route: '/analytics', icon: BarChart3 },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { label: 'Programs & Projects', route: '/operations/programs', icon: FolderKanban },
      { label: 'Projects', route: '/projects', icon: FolderKanban },
      { label: 'Thematics', route: '/thematics', icon: Layers3 },
      { label: 'Activities', route: '/operations/activities', icon: MapPin },
      { label: 'Activity Reports', route: '/activity-reports', icon: ClipboardList },
      { label: 'Beneficiaries', route: '/operations/beneficiaries', icon: Users },
      { label: 'Donors & Partners', route: '/operations/donors', icon: Handshake },
    ],
  },
  {
    id: 'requests',
    label: 'Requests & Approvals',
    items: [
      { label: 'All Requests', route: '/requests', icon: ClipboardList },
      { label: 'My Approvals', route: '/requests/approvals', icon: CheckSquare },
    ],
  },
  {
    id: 'documents',
    label: 'Documents & Reports',
    items: [
      { label: 'Documents', route: '/documents', icon: FileStack },
      { label: 'NGO Reports', route: '/reports/ngo', icon: FileText },
      { label: 'HR Reports', route: '/hr/reports', icon: BarChart3 },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Audit',
    items: [
      { label: 'Finance', route: '/finance', icon: Wallet },
      { label: 'Procurement', route: '/procurement', icon: PackageCheck },
      { label: 'Audit', route: '/audit', icon: Shield },
      { label: 'Vehicles', route: '/vehicles', icon: Car },
    ],
  },
  {
    id: 'people',
    label: 'People & HR',
    items: [
      { label: 'Employee Management', route: '/hr/employee-management', icon: Users },
      { label: 'HR Administration', route: '/hr/hr-administration', icon: UserCog },
      { label: 'Leave', route: '/hr/leave', icon: Calendar },
      { label: 'Time & Timesheets', route: '/hr/time-tracking', icon: Clock },
      { label: 'Attendance & QR', route: '/hr/attendance', icon: QrCode },
      { label: 'Attendance Settings', route: '/hr/settings/attendance', icon: Settings },
      { label: 'Roster', route: '/hr/roster', icon: CalendarDays },
      { label: 'Recruitment', route: '/hr/recruitment', icon: Search },
      { label: 'Onboarding', route: '/hr/onboarding', icon: UserPlus },
      { label: 'Training', route: '/hr/training', icon: GraduationCap },
      { label: 'Goals', route: '/hr/goals', icon: Target },
      { label: 'Performance', route: '/hr/performance', icon: TrendingUp },
      { label: 'Career Development', route: '/hr/career-development', icon: Route },
      { label: 'Request Desk (HR)', route: '/hr/request-desk', icon: ClipboardList },
      { label: 'Survey', route: '/hr/survey', icon: FileText },
      { label: 'Employee Voice', route: '/hr/employee-voice', icon: MessageSquare },
      { label: 'Discipline', route: '/hr/discipline', icon: Scale },
      { label: 'Integrations', route: '/hr/integrations', icon: Link2 },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    items: [
      { label: 'Notifications', route: '/notifications', icon: Bell },
      { label: 'Settings', route: '/settings', icon: Settings },
      { label: 'Roles & Permissions', route: '/settings/access', icon: Landmark },
    ],
  },
];

export const settingsSections = [
  { id: 'general', label: 'General Settings', route: '/settings/general' },
  { id: 'appearance', label: 'Appearance', route: '/settings/appearance' },
  { id: 'themes', label: 'Themes', route: '/settings/themes' },
  { id: 'branding', label: 'Branding', route: '/settings/branding' },
  { id: 'notifications', label: 'Notifications', route: '/settings/notifications' },
  { id: 'workflows', label: 'Workflow Configuration', route: '/settings/workflows' },
  { id: 'approvals', label: 'Approvals', route: '/settings/approvals' },
  { id: 'document-templates', label: 'Document Templates', route: '/settings/document-templates' },
  { id: 'report-templates', label: 'Report Templates', route: '/settings/report-templates' },
  { id: 'integrations', label: 'System Integrations', route: '/settings/integrations' },
  { id: 'audit', label: 'Audit Settings', route: '/settings/audit' },
  { id: 'security', label: 'Security Settings', route: '/settings/security' },
  { id: 'access', label: 'User Access', route: '/settings/access' },
  { id: 'regional', label: 'Regional Settings', route: '/settings/regional' },
  { id: 'org', label: 'Organization Structure', route: '/settings/organization' },
];
