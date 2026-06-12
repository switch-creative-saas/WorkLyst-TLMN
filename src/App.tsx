import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GlassCardSkeleton } from '@/components/glass';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const ExecutiveDashboard = lazy(() =>
  import('@/pages/executive/ExecutiveDashboard').then((m) => ({ default: m.ExecutiveDashboard }))
);
const ProgramsListPage = lazy(() =>
  import('@/pages/operations/ProgramsPage').then((m) => ({ default: m.ProgramsListPage }))
);
const ProgramDetailPage = lazy(() =>
  import('@/pages/operations/ProgramsPage').then((m) => ({ default: m.ProgramDetailPage }))
);
const ActivitiesPage = lazy(() =>
  import('@/pages/operations/ActivitiesPage').then((m) => ({ default: m.ActivitiesPage }))
);
const BeneficiariesPage = lazy(() =>
  import('@/pages/operations/BeneficiariesPage').then((m) => ({ default: m.BeneficiariesPage }))
);
const DonorsPage = lazy(() =>
  import('@/pages/operations/DonorsPage').then((m) => ({ default: m.DonorsPage }))
);
const RequestsListPage = lazy(() =>
  import('@/pages/requests/RequestsPage').then((m) => ({ default: m.RequestsListPage }))
);
const NewRequestPage = lazy(() =>
  import('@/pages/requests/RequestsPage').then((m) => ({ default: m.NewRequestPage }))
);
const RequestDetailPage = lazy(() =>
  import('@/pages/requests/RequestsPage').then((m) => ({ default: m.RequestDetailPage }))
);
const MyApprovalsPage = lazy(() =>
  import('@/pages/requests/RequestsPage').then((m) => ({ default: m.MyApprovalsPage }))
);
const DocumentsPage = lazy(() =>
  import('@/pages/documents/DocumentsPage').then((m) => ({ default: m.DocumentsPage }))
);
const NGOReportsPage = lazy(() =>
  import('@/pages/reports/NGOReportsPage').then((m) => ({ default: m.NGOReportsPage }))
);
const FinancePage = lazy(() =>
  import('@/pages/finance/FinancePage').then((m) => ({ default: m.FinancePage }))
);
const AuditPage = lazy(() =>
  import('@/pages/audit/AuditPage').then((m) => ({ default: m.AuditPage }))
);
const AnalyticsPage = lazy(() =>
  import('@/pages/analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);
const SettingsLayout = lazy(() =>
  import('@/pages/settings/SettingsLayout').then((m) => ({ default: m.SettingsLayout }))
);
const GenericSettingsPage = lazy(() =>
  import('@/pages/settings/GenericSettingsPage').then((m) => ({ default: m.GenericSettingsPage }))
);
const WorkflowBuilderPage = lazy(() =>
  import('@/pages/settings/WorkflowBuilderPage').then((m) => ({ default: m.WorkflowBuilderPage }))
);
const QRAttendancePage = lazy(() =>
  import('@/pages/attendance/QRAttendancePage').then((m) => ({ default: m.QRAttendancePage }))
);
const AttendanceKioskPage = lazy(() =>
  import('@/pages/attendance/QRAttendancePage').then((m) => ({ default: m.AttendanceKioskPage }))
);
const AttendanceSettingsPage = lazy(() =>
  import('@/pages/attendance/AttendanceSettingsPage').then((m) => ({ default: m.AttendanceSettingsPage }))
);
const AttendanceQrPage = lazy(() =>
  import('@/pages/attendance/AttendanceQrPage').then((m) => ({ default: m.AttendanceQrPage }))
);
const ScannerPage = lazy(() =>
  import('@/pages/attendance/ScannerPage').then((m) => ({ default: m.ScannerPage }))
);
const TimesheetsPage = lazy(() =>
  import('@/pages/timesheets/TimesheetsPage').then((m) => ({ default: m.TimesheetsPage }))
);
const MyTimesheetPage = lazy(() =>
  import('@/pages/MyWorkPages').then((m) => ({ default: m.MyTimesheetPage }))
);
const MyLeavePage = lazy(() =>
  import('@/pages/MyWorkPages').then((m) => ({ default: m.MyLeavePage }))
);
const MyAttendancePage = lazy(() =>
  import('@/pages/MyWorkPages').then((m) => ({ default: m.MyAttendancePage }))
);
const MyActivityReportsPage = lazy(() =>
  import('@/pages/MyWorkPages').then((m) => ({ default: m.MyActivityReportsPage }))
);
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/PasswordResetPages').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/PasswordResetPages').then((m) => ({ default: m.ResetPasswordPage }))
);
const SetNewPasswordPage = lazy(() =>
  import('@/pages/auth/SetNewPasswordPage').then((m) => ({ default: m.SetNewPasswordPage }))
);
const EmployeeDashboard = lazy(() =>
  import('@/pages/employee/EmployeeDashboard').then((m) => ({ default: m.EmployeeDashboard }))
);
const RoleDashboardPage = lazy(() =>
  import('@/pages/RoleDashboardPage').then((m) => ({ default: m.RoleDashboardPage }))
);
const ReceptionistDashboard = lazy(() =>
  import('@/pages/ReceptionistDashboard').then((m) => ({ default: m.ReceptionistDashboard }))
);
const ReceptionistVisitorsPage = lazy(() =>
  import('@/pages/ReceptionistDashboard').then((m) => ({ default: m.ReceptionistVisitorsPage }))
);
const ReceptionistAttendancePage = lazy(() =>
  import('@/pages/ReceptionistDashboard').then((m) => ({ default: m.ReceptionistAttendancePage }))
);
const ReceptionistDirectoryPage = lazy(() =>
  import('@/pages/ReceptionistDashboard').then((m) => ({ default: m.ReceptionistDirectoryPage }))
);
const ReceptionistLeavePage = lazy(() =>
  import('@/pages/ReceptionistDashboard').then((m) => ({ default: m.ReceptionistLeavePage }))
);
const ReceptionistAnnouncementsPage = lazy(() =>
  import('@/pages/ReceptionistDashboard').then((m) => ({ default: m.ReceptionistAnnouncementsPage }))
);
const CommunicationsDashboard = lazy(() =>
  import('@/pages/communications/CommunicationsPages').then((m) => ({ default: m.CommunicationsDashboard }))
);
const CommunicationsAnnouncementsPage = lazy(() =>
  import('@/pages/communications/CommunicationsPages').then((m) => ({ default: m.CommunicationsAnnouncementsPage }))
);
const CommunicationsNewsPage = lazy(() => import('@/pages/communications/NewsPostsPage'));
const CommunicationsBroadcastsPage = lazy(() =>
  import('@/pages/communications/CommunicationsPages').then((m) => ({ default: m.CommunicationsBroadcastsPage }))
);
const CommunicationsDocumentsPage = lazy(() =>
  import('@/pages/communications/CommunicationsPages').then((m) => ({ default: m.CommunicationsDocumentsPage }))
);
const CommunicationsMediaPage = lazy(() =>
  import('@/pages/communications/CommunicationsPages').then((m) => ({ default: m.CommunicationsMediaPage }))
);
const CommunicationsGoalsPage = lazy(() =>
  import('@/pages/communications/CommunicationsPages').then((m) => ({ default: m.CommunicationsGoalsPage }))
);
const CommunicationsDirectoryPage = lazy(() =>
  import('@/pages/communications/CommunicationsPages').then((m) => ({ default: m.CommunicationsDirectoryPage }))
);
const CommunicationsAttendancePage = lazy(() =>
  import('@/pages/communications/CommunicationsPages').then((m) => ({ default: m.CommunicationsAttendancePage }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SafeguardingInboxPage = lazy(() =>
  import('@/pages/safeguarding/SafeguardingPages').then((m) => ({ default: m.SafeguardingInboxPage }))
);
const MySafeguardingReportsPage = lazy(() =>
  import('@/pages/safeguarding/SafeguardingPages').then((m) => ({ default: m.MySafeguardingReportsPage }))
);
const EnterpriseModulePage = lazy(() =>
  import('@/pages/EnterpriseModulePage').then((m) => ({ default: m.EnterpriseModulePage }))
);

// HR modules (existing)
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const EmployeeList = lazy(() => import('@/pages/EmployeeList').then((m) => ({ default: m.EmployeeList })));
const MyInfo = lazy(() => import('@/pages/MyInfo').then((m) => ({ default: m.MyInfo })));
const Directory = lazy(() => import('@/pages/Directory').then((m) => ({ default: m.Directory })));
const AddEmployee = lazy(() => import('@/pages/AddEmployee').then((m) => ({ default: m.AddEmployee })));
const HRAdministration = lazy(() =>
  import('@/pages/HRAdministration').then((m) => ({ default: m.HRAdministration }))
);
const Reports = lazy(() => import('@/pages/Reports').then((m) => ({ default: m.Reports })));
const Leave = lazy(() => import('@/pages/Leave').then((m) => ({ default: m.Leave })));
const TimeTracking = lazy(() => import('@/pages/TimeTracking').then((m) => ({ default: m.TimeTracking })));
const Attendance = lazy(() => import('@/pages/Attendance').then((m) => ({ default: m.Attendance })));
const Roster = lazy(() => import('@/pages/Roster').then((m) => ({ default: m.Roster })));
const Recruitment = lazy(() => import('@/pages/Recruitment').then((m) => ({ default: m.Recruitment })));
const Onboarding = lazy(() => import('@/pages/Onboarding').then((m) => ({ default: m.Onboarding })));
const Training = lazy(() => import('@/pages/Training').then((m) => ({ default: m.Training })));
const Goals = lazy(() => import('@/pages/Goals').then((m) => ({ default: m.Goals })));
const Performance = lazy(() => import('@/pages/Performance').then((m) => ({ default: m.Performance })));
const CareerDevelopment = lazy(() =>
  import('@/pages/CareerDevelopment').then((m) => ({ default: m.CareerDevelopment }))
);
const RequestDesk = lazy(() => import('@/pages/RequestDesk').then((m) => ({ default: m.RequestDesk })));
const Integrations = lazy(() => import('@/pages/Integrations').then((m) => ({ default: m.Integrations })));
const Survey = lazy(() => import('@/pages/Survey').then((m) => ({ default: m.Survey })));
const EmployeeVoice = lazy(() =>
  import('@/pages/EmployeeVoice').then((m) => ({ default: m.EmployeeVoice }))
);
const Discipline = lazy(() => import('@/pages/Discipline').then((m) => ({ default: m.Discipline })));

function PageLoader() {
  return (
    <div className="p-6 grid gap-4 md:grid-cols-2">
      <GlassCardSkeleton />
      <GlassCardSkeleton />
    </div>
  );
}

function LegacyRedirect({ to }: { to: string }) {
  return <Navigate to={to} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
        <Route path="/attendance/kiosk" element={<AttendanceKioskPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/set-new-password" element={<Navigate to="/auth/set-password" replace />} />
        <Route
          path="/auth/set-password"
          element={
            <ProtectedRoute>
              <SetNewPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-timesheet" element={<MyTimesheetPage />} />
          <Route path="/my-leave" element={<MyLeavePage />} />
          <Route path="/my-attendance" element={<MyAttendancePage />} />
          <Route path="/attendance/qr" element={<AttendanceQrPage />} />
          <Route path="/my-activity-reports" element={<MyActivityReportsPage />} />
          <Route path="/hr/employees/:id/profile" element={<ProfilePage />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin/dashboard"
            element={<EnterpriseModulePage title="Admin Dashboard" description="Global DOHRMP administration for tenant configuration, users, permissions, security, and platform controls." workflow={['Review organization-wide activity', 'Manage roles and access', 'Configure platform settings', 'Monitor system health']} />}
          />
          <Route path="/admin/settings/branding" element={<BrandingSettingsRoute />} />
          <Route path="/hr/dashboard" element={<RoleDashboardPage />} />
          <Route path="/dashboard/executive" element={<ExecutiveDashboard />} />
          <Route path="/nd/dashboard" element={<RoleDashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

          <Route path="/operations/programs" element={<ProgramsListPage />} />
          <Route path="/operations/programs/:programId" element={<ProgramDetailPage />} />
          <Route path="/operations/activities" element={<ActivitiesPage />} />
          <Route path="/operations/beneficiaries" element={<BeneficiariesPage />} />
          <Route path="/operations/donors" element={<DonorsPage />} />
          <Route
            path="/programs/dashboard"
            element={<RoleDashboardPage />}
          />
          <Route path="/programs/team" element={<EnterpriseModulePage title="My Team" description="View program team members, reporting structure, and direct reports." workflow={['Review direct reports', 'Track assignments', 'Monitor program delivery']} />} />
          <Route
            path="/projects"
            element={<EnterpriseModulePage title="Projects" description="Manage TLMN projects by thematic area, donor, budget, timeline, manager, and assigned staff." workflow={['Create project under a thematic area', 'Assign project manager and staff', 'Track budget, progress, reports, and approvals']} />}
          />
          <Route
            path="/thematics"
            element={<EnterpriseModulePage title="Thematics" description="Administer Leprosy, NTDs, Disabilities, Dermatology, Mental Health, Gender, Research, Stigma, Tuberculosis, Communications, and future thematic portfolios." workflow={['Create or edit thematic area', 'Assign projects and staff', 'Archive inactive thematic portfolios']} />}
          />
          <Route
            path="/activity-reports"
            element={<EnterpriseModulePage title="Activity Reports" description="Capture structured activity reports, disaggregation data, photos, outcomes, lessons, and PDF archives." workflow={['Officer submits report', 'Supervisor reviews', 'Program Manager and M&E validate', 'Archive and generate PDF']} />}
          />

          <Route path="/requests" element={<RequestsListPage />} />
          <Route path="/requests/new" element={<NewRequestPage />} />
          <Route path="/requests/approvals" element={<MyApprovalsPage />} />
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />

          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/reports/ngo" element={<NGOReportsPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/finance/dashboard" element={<RoleDashboardPage />} />
          <Route path="/finance/approved-payments" element={<EnterpriseModulePage title="Approved Payments" description="Review approved payment requests and finance processing status." workflow={['Review approved requests', 'Confirm payment processing', 'Archive finance record']} />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/audit/dashboard" element={<RoleDashboardPage />} />
          <Route
            path="/supervisor/dashboard"
            element={<RoleDashboardPage />}
          />
          <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
          <Route path="/receptionist/attendance" element={<ReceptionistAttendancePage />} />
          <Route path="/receptionist/leave" element={<ReceptionistLeavePage />} />
          <Route path="/receptionist/directory" element={<ReceptionistDirectoryPage />} />
          <Route path="/receptionist/visitors" element={<ReceptionistVisitorsPage />} />
          <Route path="/receptionist/announcements" element={<ReceptionistAnnouncementsPage />} />
          <Route path="/receptionist/news" element={<ReceptionistAnnouncementsPage />} />
          <Route path="/communications/dashboard" element={<CommunicationsDashboard />} />
          <Route path="/communications/announcements" element={<CommunicationsAnnouncementsPage />} />
          <Route path="/communications/news" element={<CommunicationsNewsPage />} />
          <Route path="/communications/broadcasts" element={<CommunicationsBroadcastsPage />} />
          <Route path="/communications/documents" element={<CommunicationsDocumentsPage />} />
          <Route path="/communications/media" element={<CommunicationsMediaPage />} />
          <Route path="/communications/goals" element={<CommunicationsGoalsPage />} />
          <Route path="/communications/directory" element={<CommunicationsDirectoryPage />} />
          <Route path="/communications/attendance" element={<CommunicationsAttendancePage />} />
          <Route path="/communications/activity-reports" element={<MyActivityReportsPage />} />
          <Route path="/supervisor/team" element={<EnterpriseModulePage title="My Team" description="Direct reports, attendance, leave, and activity summary for your team." workflow={['View direct reports', 'Review workload', 'Track staff activity']} />} />
          <Route path="/supervisor/attendance" element={<EnterpriseModulePage title="Attendance Overview" description="Team-only attendance status and trends." workflow={['View team attendance', 'Identify exceptions', 'Follow up on absences']} />} />
          <Route path="/supervisor/reports" element={<EnterpriseModulePage title="Team Reports" description="Team activity reports and submission status." workflow={['Review submitted reports', 'Approve or return reports', 'Track team delivery']} />} />
          <Route
            path="/procurement"
            element={<EnterpriseModulePage title="Procurement" description="Manage procurement requests, quotations, vendors, purchase orders, and goods received notes." workflow={['Requester submits procurement request', 'Supervisor reviews', 'Procurement sources quotations', 'Finance and National Director approve']} />}
          />
          <Route
            path="/vehicles"
            element={<EnterpriseModulePage title="Vehicles" description="Track fleet requests, vehicle assignments, trips, maintenance, documents, and audit history." workflow={['Staff requests vehicle', 'Logistics assigns vehicle', 'Supervisor approves', 'Trip is closed and archived']} />}
          />
          <Route
            path="/notifications"
            element={<EnterpriseModulePage title="Notifications" description="Centralize approval alerts, reminders, escalations, email notifications, and in-app messages." workflow={['System detects event', 'Notify assigned role or user', 'Escalate overdue items', 'Record notification audit trail']} />}
          />
          <Route path="/safeguarding/inbox" element={<SafeguardingInboxPage />} />
          <Route path="/safeguarding/my-reports" element={<MySafeguardingReportsPage />} />
          <Route path="/timesheets" element={<TimesheetsPage />} />

          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="/settings/branding" replace />} />
            <Route path="branding" element={<GenericSettingsPage />} />
            <Route path="appearance" element={<GenericSettingsPage />} />
            <Route path="themes" element={<GenericSettingsPage />} />
            <Route path="general" element={<GenericSettingsPage />} />
            <Route path="notifications" element={<GenericSettingsPage />} />
            <Route path="approvals" element={<GenericSettingsPage />} />
            <Route path="document-templates" element={<GenericSettingsPage />} />
            <Route path="report-templates" element={<GenericSettingsPage />} />
            <Route path="integrations" element={<GenericSettingsPage />} />
            <Route path="audit" element={<GenericSettingsPage />} />
            <Route path="security" element={<GenericSettingsPage />} />
            <Route path="access" element={<GenericSettingsPage />} />
            <Route path="regional" element={<GenericSettingsPage />} />
            <Route path="organization" element={<GenericSettingsPage />} />
            <Route path="workflows" element={<WorkflowBuilderPage />} />
          </Route>

          {/* HR routes */}
          <Route path="/hr/employee-management" element={<Dashboard />} />
          <Route path="/hr/employee-management/employee-list" element={<EmployeeList />} />
          <Route path="/hr/employee-management/my-info" element={<MyInfo />} />
          <Route path="/hr/employee-management/directory" element={<Directory />} />
          <Route path="/hr/employee-management/add-employee" element={<AddEmployee />} />
          <Route path="/hr/hr-administration" element={<HRAdministration />} />
          <Route path="/hr/hr-administration/*" element={<HRAdministration />} />
          <Route path="/hr/reports" element={<Reports />} />
          <Route path="/hr/reports/*" element={<Reports />} />
          <Route path="/hr/leave" element={<Leave />} />
          <Route path="/hr/leave/*" element={<Leave />} />
          <Route path="/hr/time-tracking" element={<TimeTracking />} />
          <Route path="/hr/time-tracking/*" element={<TimeTracking />} />
          <Route path="/hr/attendance" element={<QRAttendancePage />} />
          <Route path="/hr/settings/attendance" element={<AttendanceSettingsPage />} />
          <Route path="/hr/attendance/classic" element={<Attendance />} />
          <Route path="/hr/attendance/*" element={<QRAttendancePage />} />
          <Route path="/hr/roster" element={<Roster />} />
          <Route path="/hr/roster/*" element={<Roster />} />
          <Route path="/hr/recruitment" element={<Recruitment />} />
          <Route path="/hr/recruitment/*" element={<Recruitment />} />
          <Route path="/hr/onboarding" element={<Onboarding />} />
          <Route path="/hr/onboarding/*" element={<Onboarding />} />
          <Route path="/hr/training" element={<Training />} />
          <Route path="/hr/training/*" element={<Training />} />
          <Route path="/hr/goals" element={<Goals />} />
          <Route path="/hr/goals/*" element={<Goals />} />
          <Route path="/hr/performance" element={<Performance />} />
          <Route path="/hr/performance/*" element={<Performance />} />
          <Route path="/hr/career-development" element={<CareerDevelopment />} />
          <Route path="/hr/career-development/*" element={<CareerDevelopment />} />
          <Route path="/hr/request-desk" element={<RequestDesk />} />
          <Route path="/hr/request-desk/*" element={<RequestDesk />} />
          <Route path="/hr/integrations" element={<Integrations />} />
          <Route path="/hr/integrations/*" element={<Integrations />} />
          <Route path="/hr/survey" element={<Survey />} />
          <Route path="/hr/survey/*" element={<Survey />} />
          <Route path="/hr/employee-voice" element={<EmployeeVoice />} />
          <Route path="/hr/employee-voice/*" element={<EmployeeVoice />} />
          <Route path="/hr/discipline" element={<Discipline />} />
          <Route path="/hr/discipline/*" element={<Discipline />} />

          {/* Legacy redirects */}
          <Route path="/employee-management" element={<LegacyRedirect to="/hr/employee-management" />} />
          <Route path="/employee-management/*" element={<LegacyRedirect to="/hr/employee-management" />} />
          <Route path="/hr-administration" element={<LegacyRedirect to="/hr/hr-administration" />} />
          <Route path="/hr-administration/*" element={<LegacyRedirect to="/hr/hr-administration" />} />
          <Route path="/reports" element={<LegacyRedirect to="/hr/reports" />} />
          <Route path="/reports/*" element={<LegacyRedirect to="/hr/reports" />} />
          <Route path="/leave" element={<LegacyRedirect to="/hr/leave" />} />
          <Route path="/leave/*" element={<LegacyRedirect to="/hr/leave" />} />
          <Route path="/time-tracking" element={<LegacyRedirect to="/hr/time-tracking" />} />
          <Route path="/time-tracking/*" element={<LegacyRedirect to="/hr/time-tracking" />} />
          <Route path="/attendance" element={<LegacyRedirect to="/hr/attendance" />} />
          <Route path="/attendance/*" element={<LegacyRedirect to="/hr/attendance" />} />
          <Route path="/roster" element={<LegacyRedirect to="/hr/roster" />} />
          <Route path="/roster/*" element={<LegacyRedirect to="/hr/roster" />} />
          <Route path="/recruitment" element={<LegacyRedirect to="/hr/recruitment" />} />
          <Route path="/recruitment/*" element={<LegacyRedirect to="/hr/recruitment" />} />
          <Route path="/onboarding" element={<LegacyRedirect to="/hr/onboarding" />} />
          <Route path="/onboarding/*" element={<LegacyRedirect to="/hr/onboarding" />} />
          <Route path="/training" element={<LegacyRedirect to="/hr/training" />} />
          <Route path="/training/*" element={<LegacyRedirect to="/hr/training" />} />
          <Route path="/goals" element={<LegacyRedirect to="/hr/goals" />} />
          <Route path="/goals/*" element={<LegacyRedirect to="/hr/goals" />} />
          <Route path="/performance" element={<LegacyRedirect to="/hr/performance" />} />
          <Route path="/performance/*" element={<LegacyRedirect to="/hr/performance" />} />
          <Route path="/career-development" element={<LegacyRedirect to="/hr/career-development" />} />
          <Route path="/career-development/*" element={<LegacyRedirect to="/hr/career-development" />} />
          <Route path="/request-desk" element={<LegacyRedirect to="/hr/request-desk" />} />
          <Route path="/request-desk/*" element={<LegacyRedirect to="/hr/request-desk" />} />
          <Route path="/integrations" element={<LegacyRedirect to="/hr/integrations" />} />
          <Route path="/integrations/*" element={<LegacyRedirect to="/hr/integrations" />} />
          <Route path="/survey" element={<LegacyRedirect to="/hr/survey" />} />
          <Route path="/survey/*" element={<LegacyRedirect to="/hr/survey" />} />
          <Route path="/employee-voice" element={<LegacyRedirect to="/hr/employee-voice" />} />
          <Route path="/employee-voice/*" element={<LegacyRedirect to="/hr/employee-voice" />} />
          <Route path="/discipline" element={<LegacyRedirect to="/hr/discipline" />} />
          <Route path="/discipline/*" element={<LegacyRedirect to="/hr/discipline" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function BrandingSettingsRoute() {
  return <GenericSettingsPage />;
}
