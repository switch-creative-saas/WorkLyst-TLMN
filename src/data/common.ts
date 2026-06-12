import type { Location, JobTitle, PayGrade, Department, NewsItem, Document, ActionItem, QuickAccessItem, Report, User, AttendanceSheet, AttendanceRecord, Timesheet, OnboardingItem, Course, SurveyCampaign, EmployeeVoiceRecord, DisciplineCase, AppraisalCycle, PerformanceTracker, IDP, RequestDeskItem } from '@/types';

export const locations: Location[] = [
  { id: '1', name: 'Australia office', city: 'Sydney', country: 'Australia', phone: '+61 289903345', employeeCount: 9, eeoEnabled: false },
  { id: '2', name: 'Canadian Development Center', city: 'Toronto', country: 'Canada', phone: '+1 234456789', employeeCount: 14, eeoEnabled: false },
  { id: '3', name: 'France Office', city: 'Paris', country: 'France', phone: '+335974184619', employeeCount: 9, eeoEnabled: false },
  { id: '4', name: 'Germany Office', city: 'Berlin', country: 'Germany', phone: '+491879165198', employeeCount: 12, eeoEnabled: false },
  { id: '5', name: 'India Office', city: 'Bangalore', country: 'India', phone: '+91 11205700', employeeCount: 28, eeoEnabled: false },
  { id: '6', name: 'Jamaica HQ', city: 'Kingston', country: 'Jamaica', phone: '+1 543914274', employeeCount: 11, eeoEnabled: false },
  { id: '7', name: 'Mexico Office', city: 'Mexico City', country: 'Mexico', phone: '+52 97453625', employeeCount: 8, eeoEnabled: false },
  { id: '8', name: 'Philippines call center', city: 'Manila', country: 'Philippines', phone: '+63 659487845', employeeCount: 8, eeoEnabled: false },
  { id: '9', name: 'UK Office', city: 'London', country: 'United Kingdom', phone: '+44 20 7946 0958', employeeCount: 15, eeoEnabled: false },
  { id: '10', name: 'US Office', city: 'New York', country: 'United States', phone: '555-0100', employeeCount: 45, eeoEnabled: false },
];

export const jobTitles: JobTitle[] = [
  { id: '1', title: 'CEO', description: 'Chief Executive Officer', payGrade: 'Executive', specification: 'Leadership' },
  { id: '2', title: 'CFO', description: 'Chief Financial Officer', payGrade: 'Executive', specification: 'Finance' },
  { id: '3', title: 'COO', description: 'Chief Operating Officer', payGrade: 'Executive', specification: 'Operations' },
  { id: '4', title: 'CRO', description: 'Chief Revenue Officer', payGrade: 'Executive', specification: 'Sales' },
  { id: '5', title: 'VP - Human Resources', description: 'Vice President', payGrade: 'Director', specification: 'HR' },
  { id: '6', title: 'Regional HR Manager', description: 'Regional Manager', payGrade: 'Management', specification: 'HR' },
  { id: '7', title: 'HR Executive', description: 'HR Executive', payGrade: 'Professional', specification: 'HR' },
  { id: '8', title: 'Senior Manager Technical Support', description: 'Senior Manager', payGrade: 'Management', specification: 'Technical' },
  { id: '9', title: 'Software Architect', description: 'Architect', payGrade: 'Management', specification: 'Engineering' },
  { id: '10', title: 'Senior Developer', description: 'Senior Developer', payGrade: 'Professional', specification: 'Engineering' },
  { id: '11', title: 'QA Lead', description: 'QA Lead', payGrade: 'Professional', specification: 'QA' },
  { id: '12', title: 'Marketing Manager', description: 'Marketing Manager', payGrade: 'Management', specification: 'Marketing' },
  { id: '13', title: 'Sales Manager', description: 'Sales Manager', payGrade: 'Management', specification: 'Sales' },
  { id: '14', title: 'IT Manager', description: 'IT Manager', payGrade: 'Management', specification: 'IT' },
  { id: '15', title: 'Business Analyst', description: 'Business Analyst', payGrade: 'Professional', specification: 'BA' },
  { id: '16', title: 'DevOps Engineer', description: 'DevOps Engineer', payGrade: 'Professional', specification: 'Engineering' },
  { id: '17', title: 'Product Owner', description: 'Product Owner', payGrade: 'Professional', specification: 'Product' },
  { id: '18', title: 'HR Coordinator', description: 'HR Coordinator', payGrade: 'Entry', specification: 'HR' },
  { id: '19', title: 'Marketing Executive', description: 'Marketing Executive', payGrade: 'Entry', specification: 'Marketing' },
  { id: '20', title: 'Production Co-ordinator', description: 'Production Co-ordinator', payGrade: 'Entry', specification: 'Production' },
];

export const payGrades: PayGrade[] = [
  { id: '1', name: 'Executive', currency: 'USD', minSalary: 200000, maxSalary: 500000 },
  { id: '2', name: 'Director', currency: 'USD', minSalary: 150000, maxSalary: 200000 },
  { id: '3', name: 'Management', currency: 'USD', minSalary: 100000, maxSalary: 150000 },
  { id: '4', name: 'Professional', currency: 'USD', minSalary: 60000, maxSalary: 100000 },
  { id: '5', name: 'Entry', currency: 'USD', minSalary: 40000, maxSalary: 60000 },
];

export const departments: Department[] = [
  { id: '1', name: 'Worklyst', code: 'WLYS', manager: '', employeeCount: 183 },
  { id: '2', name: 'Architecture Team', code: '0008', parentId: '1', manager: 'Tanya Arva', employeeCount: 5 },
  { id: '3', name: 'Engineering', code: '0002', parentId: '1', manager: 'Lukas Bauer', employeeCount: 22 },
  { id: '4', name: 'Finance', code: '0003', parentId: '1', manager: 'Peter Anderson', employeeCount: 8 },
  { id: '5', name: 'Human Resources', code: '0005', parentId: '1', manager: 'Aaron Hamilton', employeeCount: 15 },
  { id: '6', name: 'Information Technology', code: '0001', parentId: '1', manager: 'Brody Alan', employeeCount: 18 },
  { id: '7', name: 'Marketing', code: '0007', parentId: '1', manager: 'Emma Wilson', employeeCount: 12 },
  { id: '8', name: 'Operations', code: '0009', parentId: '1', manager: 'Leah Andrews', employeeCount: 20 },
  { id: '9', name: 'Product', code: '0011', parentId: '1', manager: 'Lisa Wagner', employeeCount: 10 },
  { id: '10', name: 'Quality Assurance', code: '0010', parentId: '1', manager: 'Katarina Skonis', employeeCount: 14 },
  { id: '11', name: 'Sales', code: '0004', parentId: '1', manager: 'Marco Rossi', employeeCount: 16 },
  { id: '12', name: 'Technical Support', code: '0012', parentId: '1', manager: 'Carlos Mendez', employeeCount: 13 },
];

export const newsItems: NewsItem[] = [
  { id: '1', title: 'Toronto Office Celebrates 5th Year Anniversary', date: '2025-03-15', category: 'Company News', thumbnail: '', content: 'Our Toronto office marks 5 years of excellence...' },
  { id: '2', title: 'New Employee Handbook Released', date: '2025-02-28', category: 'HR Updates', thumbnail: '', content: 'The updated employee handbook is now available...' },
  { id: '3', title: 'Q1 Performance Results Exceed Expectations', date: '2025-04-05', category: 'Business', thumbnail: '', content: 'Q1 results show 15% growth...' },
  { id: '4', title: 'Wellness Program Launch', date: '2025-01-20', category: 'Benefits', thumbnail: '', content: 'New wellness initiatives for all employees...' },
  { id: '5', title: 'Annual Company Retreat Announced', date: '2025-05-01', category: 'Events', thumbnail: '', content: 'This year\'s retreat will be held in Bali...' },
];

export const documents: Document[] = [
  { id: '1', name: 'Acceptable Usage Policy', dateAdded: '2025-01-01', type: 'PDF', size: '245 KB', addedBy: 'Admin' },
  { id: '2', name: 'Remote Work Guidelines', dateAdded: '2025-01-15', type: 'PDF', size: '189 KB', addedBy: 'HR' },
  { id: '3', name: 'Employee Handbook 2025', dateAdded: '2025-02-01', type: 'PDF', size: '2.4 MB', addedBy: 'HR' },
  { id: '4', name: 'Code of Conduct', dateAdded: '2025-01-01', type: 'PDF', size: '156 KB', addedBy: 'Admin' },
  { id: '5', name: 'Health and Safety Policy', dateAdded: '2025-03-01', type: 'PDF', size: '312 KB', addedBy: 'Admin' },
];

export const actionItems: ActionItem[] = [
  { id: '1', title: 'Attendance Sheets to Approve', count: 872, type: 'attendance', country: 'UK', priority: 'high' },
  { id: '2', title: 'Attendance Sheets to Approve', count: 50, type: 'attendance', country: 'Jamaica', priority: 'medium' },
  { id: '3', title: 'Attendance Sheets to Approve', count: 304, type: 'attendance', country: 'USA', priority: 'high' },
  { id: '4', title: 'General Requests to Approve', count: 7, type: 'request', priority: 'medium' },
  { id: '5', title: 'Hiring Requisitions to Approve', count: 2, type: 'hiring', priority: 'low' },
];

export const quickAccessItems: QuickAccessItem[] = [
  { id: '1', label: 'Contract', icon: 'FileText', color: 'bg-green-100 text-green-600', route: '/employee-management/employee-list' },
  { id: '2', label: 'Assign Leave', icon: 'CalendarPlus', color: 'bg-[#82154F]/10 text-[#82154F]', route: '/leave/assign-leave' },
  { id: '3', label: 'Leave List', icon: 'ClipboardList', color: 'bg-blue-100 text-blue-600', route: '/leave/leave-list' },
  { id: '4', label: 'Leave Calendar', icon: 'CalendarDays', color: 'bg-red-100 text-red-600', route: '/leave/leave-list' },
  { id: '5', label: 'General Request', icon: 'MessageSquare', color: 'bg-green-100 text-green-600', route: '/request-desk/requests' },
  { id: '6', label: 'Hiring Requisition', icon: 'UserPlus', color: 'bg-[#82154F]/10 text-[#82154F]', route: '/request-desk/hiring-requests' },
  { id: '7', label: 'Timesheets', icon: 'Clock', color: 'bg-blue-100 text-blue-600', route: '/time-tracking/my-timesheets' },
  { id: '8', label: 'Apply Leave', icon: 'CalendarPlus', color: 'bg-red-100 text-red-600', route: '/leave/apply-leave' },
  { id: '9', label: 'My Leave', icon: 'ClipboardList', color: 'bg-green-100 text-green-600', route: '/leave/my-leave-usage' },
];

export const reports: Report[] = [
  { id: '1', name: 'All Employees', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'Users' },
  { id: '2', name: 'Annual Basic Payment by Location', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'MapPin' },
  { id: '3', name: 'Benefit Info Report', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'Heart' },
  { id: '4', name: 'Data based on sub units (Salary)', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'BarChart3' },
  { id: '5', name: 'Employee Job Details', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'Briefcase' },
  { id: '6', name: 'Employee Retirement Forecast', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'TrendingUp' },
  { id: '7', name: 'Employee Source Report', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'Globe' },
  { id: '8', name: 'Employee Turnover / Termination Report', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'Users' },
  { id: '9', name: 'Employees with Over 5 Years of Service', category: 'Employee Management', lastAccessed: '2025-05-26', icon: 'Award' },
  { id: '10', name: 'Leave Entitlements and Usage Report', category: 'Time Tracking', lastAccessed: '2025-05-26', icon: 'Calendar' },
  { id: '11', name: 'Employee Acknowledgments of News and Documents', category: 'HR Administration', lastAccessed: '2025-05-26', icon: 'CheckCircle' },
];

export const users: User[] = [
  { id: '1', username: 'abrahammaize', userRoles: ['Default ESS', 'Default Supervisor'], employeeName: 'Mazie Abraham', status: 'Enabled', region: '' },
  { id: '2', username: 'adalwinodis', userRoles: ['Default ESS', 'Default Supervisor'], employeeName: 'Odis Adalwin', status: 'Enabled', region: '' },
  { id: '3', username: 'admin', userRoles: ['Admin'], employeeName: 'Admin Admin', status: 'Enabled', region: '' },
  { id: '4', username: 'alanbrody', userRoles: ['Default ESS', 'Default Supervisor'], employeeName: 'Brody Alan', status: 'Enabled', region: '' },
  { id: '5', username: 'aliceduval', userRoles: ['Default ESS', 'Default Supervisor', 'Global Admin'], employeeName: 'Alice Duval', status: 'Enabled', region: '' },
];

export const attendanceSheets: AttendanceSheet[] = [
  { id: '1', employeeName: 'Joseph Freshman', supervisors: ['Isabella Smith'], regularTime: '00h 00m', overtime: '00h 00m', doubleTime: '00h 00m', totalLeaveTime: '00h 00m', totalTime: '00h 00m', status: 'Not Submitted' },
  { id: '2', employeeName: 'Mike Dodsworth', supervisors: ['Cara Camron'], regularTime: '00h 00m', overtime: '00h 00m', doubleTime: '00h 00m', totalLeaveTime: '00h 00m', totalTime: '00h 00m', status: 'Not Submitted' },
  { id: '3', employeeName: 'Rashella Harriot', supervisors: ['Kara Camron'], regularTime: '00h 00m', overtime: '00h 00m', doubleTime: '00h 00m', totalLeaveTime: '00h 00m', totalTime: '00h 00m', status: 'Not Submitted' },
  { id: '4', employeeName: 'Kyle Jimmer', supervisors: ['Paisley Abbott'], regularTime: '00h 00m', overtime: '00h 00m', doubleTime: '00h 00m', totalLeaveTime: '00h 00m', totalTime: '00h 00m', status: 'Not Submitted' },
  { id: '5', employeeName: 'Isaac Newton', supervisors: ['Paisley Abbott'], regularTime: '00h 00m', overtime: '00h 00m', doubleTime: '00h 00m', totalLeaveTime: '00h 00m', totalTime: '00h 00m', status: 'Not Submitted' },
  { id: '6', employeeName: 'Gour Davis', supervisors: ['Kara Camron'], regularTime: '00h 00m', overtime: '00h 00m', doubleTime: '00h 00m', totalLeaveTime: '00h 00m', totalTime: '00h 00m', status: 'Not Submitted' },
  { id: '7', employeeName: 'Ellen Morgan', supervisors: ['Kara Camron'], regularTime: '00h 00m', overtime: '00h 00m', doubleTime: '00h 00m', totalLeaveTime: '00h 00m', totalTime: '00h 00m', status: 'Not Submitted' },
  { id: '8', employeeName: 'Janet Smith', supervisors: ['Kara Camron'], regularTime: '00h 00m', overtime: '00h 00m', doubleTime: '00h 00m', totalLeaveTime: '00h 00m', totalTime: '00h 00m', status: 'Not Submitted' },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: '1', employeeId: '1003', employeeName: 'Terry Lewinsky', date: '2026-06-01', punchIn: '09:00 AM', punchInNote: '', punchOut: '06:00 PM', punchOutNote: '', duration: '9h 00m' },
  { id: '2', employeeId: '1074', employeeName: 'Jaden Li', date: '2026-06-01', punchIn: '08:45 AM', punchInNote: '', punchOut: '05:45 PM', punchOutNote: '', duration: '9h 00m' },
  { id: '3', employeeId: '1050', employeeName: 'Amanda Wolf', date: '2026-06-01', punchIn: '09:15 AM', punchInNote: 'Late due to traffic', punchOut: '06:15 PM', punchOutNote: '', duration: '9h 00m' },
  { id: '4', employeeId: '1118', employeeName: 'Adela Lopez', date: '2026-06-01', punchIn: '09:00 AM', punchInNote: '', punchOut: '06:00 PM', punchOutNote: '', duration: '9h 00m' },
  { id: '5', employeeId: '1143', employeeName: 'Daniela Davis', date: '2026-06-01', punchIn: '08:30 AM', punchInNote: '', punchOut: '05:30 PM', punchOutNote: '', duration: '9h 00m' },
  { id: '6', employeeId: '1124', employeeName: 'Evan Smith', date: '2026-06-01', punchIn: '09:00 AM', punchInNote: '', punchOut: '06:00 PM', punchOutNote: '', duration: '9h 00m' },
  { id: '7', employeeId: '1130', employeeName: 'Gwen Davis', date: '2026-06-01', punchIn: '09:00 AM', punchInNote: '', punchOut: '06:00 PM', punchOutNote: '', duration: '9h 00m' },
  { id: '8', employeeId: '1131', employeeName: 'Helen Martin', date: '2026-06-01', punchIn: '08:45 AM', punchInNote: '', punchOut: '05:45 PM', punchOutNote: '', duration: '9h 00m' },
];

export const timesheets: Timesheet[] = [
  { id: '1', employeeId: '1007', employeeName: 'Aaron Hamilton', period: '2026-06-01 to 2026-06-07', status: 'Not Submitted', entries: [] },
];

export const onboardingItems: OnboardingItem[] = [
  { id: '1', name: 'Leila Yasmin Hassan', email: 'leila.hassan@rushmail.com', contactNumber: '70 555 87761', joinedDate: '2025-04-29', stage: 'Preboarding', preboardingStartDate: '2025-04-29', progress: 50 },
  { id: '2', name: 'Oliver James Smith', email: 'oliver.smith@ang.com', contactNumber: '44 7700 987654', joinedDate: '2025-04-29', stage: 'Preboarding', preboardingStartDate: '2025-04-29', progress: 50 },
  { id: '3', name: 'Jacob James Robinson', email: 'jacobrobinson@mail.com', contactNumber: '1 312 555 6789', joinedDate: '2025-04-29', stage: 'Preboarding', preboardingStartDate: '2025-04-29', progress: 41 },
  { id: '4', name: 'Chloe Marie Bennett', email: 'chloe.bennett@goomail.com', contactNumber: '1 456 455 5067', joinedDate: '2025-04-29', stage: 'Preboarding', preboardingStartDate: '2025-04-29', progress: 58 },
  { id: '5', name: 'Arjun Mehra', email: 'arjun.mehra@tutanota.com', contactNumber: '', joinedDate: '2025-04-29', stage: 'Preboarding', preboardingStartDate: '2025-04-29', progress: 25 },
  { id: '6', name: 'Daniel Lopez', email: 'daniel.lopez@ymail.com', contactNumber: '', joinedDate: '2025-04-29', stage: 'Preboarding', preboardingStartDate: '2025-04-29', progress: 8 },
];

export const courses: Course[] = [
  { id: '1', title: 'Active Listening Techniques', subunit: 'Sales', coordinator: 'Lisa Wagner', company: 'IBM', status: 'Active' },
  { id: '2', title: 'Communication Skills for Technical Support', subunit: 'Technical Support', coordinator: 'Brody Alan', company: 'coursera', status: 'Active' },
  { id: '3', title: 'Customer Service Fundamentals', subunit: 'Sales', coordinator: 'Lisa Wagner', company: 'coursera', status: 'Active' },
  { id: '4', title: 'Effective Communication Skills', subunit: 'Sales', coordinator: 'Lisa Wagner', company: 'coursera', status: 'Active' },
  { id: '5', title: 'Hardware Support', subunit: 'Technical Support', coordinator: 'Brody Alan', company: 'udemy', status: 'Active' },
  { id: '6', title: 'IBM IT Support', subunit: 'Technical Support', coordinator: 'Aaliyah Haq', company: 'IBM', status: 'Active' },
  { id: '7', title: 'Introduction to Human Resources Management', subunit: 'Human Resources', coordinator: 'Odis Adalwin', company: 'IBM', status: 'Active' },
  { id: '8', title: 'Mastering Customer Interactions: Active Listening and Empathy', subunit: 'Sales', coordinator: 'Lisa Wagner', company: 'coursera', status: 'Active' },
];

export const surveyCampaigns: SurveyCampaign[] = [
  { id: '1', campaignId: 'SC000001', name: 'Annual eNPS Survey', template: 'eNPS - Employee Net Promoter Score (eNPS) Survey', dueDate: '2026-03-31', anonymity: true, locations: ['All'], status: 'Initiated' },
  { id: '2', campaignId: 'SC000002', name: 'Employee Engagement & Workplace Culture Survey', template: 'Employee Engagement & Workplace Culture Survey', dueDate: '2026-03-31', anonymity: false, locations: ['All'], status: 'Initiated' },
];

export const employeeVoiceRecords: EmployeeVoiceRecord[] = [
  { id: '1', employeeId: 'EV000001', employeeName: 'Anonymous', type: 'Harassment or bullying', title: 'Physical harassment at office, 2025', anonymity: true, status: 'Resolved', locations: ['All'], createdDate: '2025-12-15', lastUpdated: '2025-12-15' },
  { id: '2', employeeId: 'EV000002', employeeName: 'Anonymous', type: 'Harassment or bullying', title: 'Verbal abuse by co-worker', anonymity: false, status: 'Saved', locations: ['All'], createdDate: '2025-12-15', lastUpdated: '2025-12-15' },
  { id: '3', employeeId: 'EV000003', employeeName: 'Anonymous', type: 'Harassment or bullying', title: 'Mental harassment in workplace, 2025', anonymity: true, status: 'Resolved', locations: ['All'], createdDate: '2025-12-15', lastUpdated: '2025-12-15' },
  { id: '4', employeeId: 'EV000004', employeeName: 'Anonymous', type: 'Harassment or bullying', title: 'Verbal harassment at office', anonymity: true, status: 'Submitted', locations: ['All'], createdDate: '2025-12-15', lastUpdated: '2025-12-15' },
  { id: '5', employeeId: 'EV000007', employeeName: 'Anonymous', type: 'Conflicts with Supervisors or Colleagues', title: '', anonymity: true, status: 'Submitted', locations: ['All'], createdDate: '2025-12-15', lastUpdated: '2025-12-15' },
];

export const disciplineCases: DisciplineCase[] = [
  { id: '1', caseId: 'DC000001', caseTitle: 'Workplace harassment complaint', caseType: 'Misconduct', status: 'Open', createdBy: 'HR Admin', createdDate: '2025-12-01' },
  { id: '2', caseId: 'DC000002', caseTitle: 'Policy violation - attendance', caseType: 'Policy Violation', status: 'In Progress', createdBy: 'Aaron Hamilton', createdDate: '2025-11-15' },
  { id: '3', caseId: 'DC000003', caseTitle: 'Data breach incident', caseType: 'Workplace Harassment', status: 'Open', createdBy: 'IT Manager', createdDate: '2025-12-10' },
];

export const appraisalCycles: AppraisalCycle[] = [
  { id: '1', name: '2025 - Annual Review for All', fromDate: '2025-01-01', toDate: '2025-12-31', dueDate: '2025-12-31', status: 'Created' },
  { id: '2', name: '2025 - Annual Review for HR Department', fromDate: '2025-01-01', toDate: '2025-12-31', dueDate: '2025-12-31', status: 'Created' },
  { id: '3', name: '2025 Annual Appraisal', fromDate: '2025-01-01', toDate: '2025-12-31', dueDate: '2025-12-31', status: 'Created' },
  { id: '4', name: 'Annual review for year 2025', fromDate: '2025-01-01', toDate: '2025-12-31', dueDate: '2025-12-31', status: 'Activated' },
  { id: '5', name: '2024 - Annual Review for All', fromDate: '2024-01-01', toDate: '2024-12-31', dueDate: '2024-12-31', status: 'Created' },
];

export const performanceTrackers: PerformanceTracker[] = [
  { id: '1', employeeName: 'Aaron Hamilton', trackerName: '2024 Review', reviewers: 'Aaron Hamilton', addedDate: '2024-01-01', modifiedDate: '2024-12-31' },
  { id: '2', employeeName: 'Aaron Hamilton', trackerName: 'Annual review for year 2023-Aaron', reviewers: 'Aaron Hamilton', addedDate: '2023-01-01', modifiedDate: '2023-12-31' },
];

export const idps: IDP[] = [
  { id: '1', employeeId: '1061', employeeName: 'Odis Adalwin', idpName: 'Individual Development Plan - Adalwin', coach: 'Jacqueline Wagner', initiatedOn: '2025-03-28', closedOn: '', status: 'Initiated' },
  { id: '2', employeeId: '1055', employeeName: 'Brody Alan', idpName: 'Individual Development Plan - Alan', coach: 'Miguel Mason', initiatedOn: '2025-03-28', closedOn: '', status: 'Initiated' },
  { id: '3', employeeId: '1072', employeeName: 'Tanya Arva', idpName: 'Individual Development Plan - Arva', coach: 'Miguel Mason', initiatedOn: '2025-03-28', closedOn: '', status: 'Initiated' },
  { id: '4', employeeId: '0119', employeeName: 'Caitlyn Bonwick', idpName: 'Individual Development Plan - Caitlyn Bonwick', coach: 'Katarina Skonis', initiatedOn: '2025-03-28', closedOn: '', status: 'Initiated' },
  { id: '5', employeeId: '1110', employeeName: 'Paul Collings', idpName: 'Individual Development Plan - Paul Collings', coach: 'Jackson Smith', initiatedOn: '2025-03-28', closedOn: '', status: 'Initiated' },
  { id: '6', employeeId: '1121', employeeName: 'Andrew Daley', idpName: 'Individual Development Plan - Andrew Daley', coach: 'Aaliyah Haq', initiatedOn: '2025-03-28', closedOn: '', status: 'Initiated' },
  { id: '7', employeeId: '1068', employeeName: 'Alice Duval', idpName: 'Individual Development Plan - Alice Duval', coach: 'Michael Nelson', initiatedOn: '2025-03-28', closedOn: '', status: 'Initiated' },
];

export const requestDeskItems: RequestDeskItem[] = [
  { id: '1', requestId: '000015', title: 'Request Job Confirmation Letter', requestType: 'Employment Confirmation Letter Request', status: 'Submitted', priority: 'Not Urgent', employeeName: 'Odis Adalwin', submittedDate: '2025-04-04', dueDate: '2025-04-30' },
  { id: '2', requestId: '000013', title: 'Driver License Update 2025', requestType: 'Driver License Renewal Submission', status: 'In Progress', priority: 'Not Urgent', employeeName: 'Aaron Hamilton', submittedDate: '2025-04-04', dueDate: '2025-05-30' },
  { id: '3', requestId: '000010', title: 'Transfer Request to Australia office 2025', requestType: 'Transfer Request', status: 'In Progress', priority: 'Reasonably Urgent', employeeName: 'Miguel Mason', submittedDate: '2025-04-04', dueDate: '2025-07-31' },
  { id: '4', requestId: '000011', title: 'CRM access for Martin Garcia 2025', requestType: 'System Access Assistance Query', status: 'Submitted', priority: 'Not Urgent', employeeName: 'Camille Dubois', submittedDate: '2025-04-04', dueDate: '2025-04-30' },
  { id: '5', requestId: '000008', title: 'Device Upgrade or New Laptop Required', requestType: 'Equipment and Supply Request', status: 'Completed', priority: 'Reasonably Urgent', employeeName: 'Fiona Grace', submittedDate: '2025-04-04', dueDate: '2025-04-30' },
];

