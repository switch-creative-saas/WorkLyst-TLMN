export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  jobTitle: string;
  employmentStatus: 'Full-Time Permanent' | 'Part-Time' | 'Contract' | 'Probation' | 'Full-Time Contract';
  subUnit: string;
  costCenter: string;
  location: string;
  supervisor: string;
  avatar: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  nationality: string;
  maritalStatus: string;
  mobile: string;
  joinedDate: string;
  otherId?: string;
  ssn?: string;
  driversLicenseNumber?: string;
  licenseExpiryDate?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Cancelled' | 'Taken' | 'Scheduled';
  comments: string;
  days: number;
}

export interface LeaveType {
  id: string;
  name: string;
  country: string;
  durationUnit: 'Days' | 'Hours';
  includedInBradford: boolean;
  situational: boolean;
  nominateEmployee: boolean;
  shortTermEntitlement: boolean;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  vacancy: string;
  dateApplied: string;
  stage: 'Application Received' | 'Shortlisted' | 'In Progress' | 'Job Offer' | 'Preboarding' | 'Hired' | 'Rejected' | 'Skills-Based Interview' | 'Technical Interview' | 'HR Interview Round' | 'Reference Check' | '321 Forms Onboarding';
  avatar?: string;
  source?: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  weight: number;
  level: 'Individual' | 'Organizational' | 'Department';
  owner: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Achieved' | 'Not Achieved' | 'On Hold';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  completion: number;
}

export interface Objective {
  id: string;
  name: string;
  description: string;
  weight: number;
  level: 'Individual' | 'Organizational' | 'Department';
  owner: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Achieved' | 'Not Achieved' | 'On Hold';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  completion: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  punchIn: string;
  punchInNote: string;
  punchOut: string;
  punchOutNote: string;
  duration: string;
}

export interface AttendanceSheet {
  id: string;
  employeeName: string;
  supervisors: string[];
  regularTime: string;
  overtime: string;
  doubleTime: string;
  totalLeaveTime: string;
  totalTime: string;
  status: 'Submitted' | 'Not Submitted' | 'Approved' | 'Rejected';
}

export interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  status: 'Submitted' | 'Not Submitted' | 'Approved';
  entries: TimesheetEntry[];
}

export interface TimesheetEntry {
  projectName: string;
  activityName: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  thumbnail: string;
  content: string;
}

export interface Document {
  id: string;
  name: string;
  dateAdded: string;
  type: string;
  size: string;
  addedBy: string;
}

export interface ActionItem {
  id: string;
  title: string;
  count: number;
  type: 'attendance' | 'request' | 'hiring' | 'general';
  country?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface QuickAccessItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: string;
}

export interface Report {
  id: string;
  name: string;
  category: string;
  lastAccessed: string;
  icon: string;
}

export interface User {
  id: string;
  username: string;
  userRoles: string[];
  employeeName: string;
  status: 'Enabled' | 'Disabled';
  region: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  phone: string;
  employeeCount: number;
  eeoEnabled: boolean;
}

export interface JobTitle {
  id: string;
  title: string;
  description: string;
  payGrade: string;
  specification: string;
}

export interface PayGrade {
  id: string;
  name: string;
  currency: string;
  minSalary: number;
  maxSalary: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  manager: string;
  employeeCount: number;
}

export interface OnboardingItem {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  joinedDate: string;
  stage: string;
  preboardingStartDate: string;
  progress: number;
}

export interface Course {
  id: string;
  title: string;
  subunit: string;
  coordinator: string;
  company: string;
  status: 'Active' | 'Inactive';
}

export interface SurveyCampaign {
  id: string;
  campaignId: string;
  name: string;
  template: string;
  dueDate: string;
  anonymity: boolean;
  locations: string[];
  status: 'Initiated' | 'Completed' | 'Draft';
}

export interface EmployeeVoiceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  title: string;
  anonymity: boolean;
  status: 'Submitted' | 'Saved' | 'Resolved';
  locations: string[];
  createdDate: string;
  lastUpdated: string;
}

export interface DisciplineCase {
  id: string;
  caseId: string;
  caseTitle: string;
  caseType: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdBy: string;
  createdDate: string;
}

export interface AppraisalCycle {
  id: string;
  name: string;
  fromDate: string;
  toDate: string;
  dueDate: string;
  status: 'Created' | 'Activated' | 'Closed' | 'Reopened';
}

export interface PerformanceTracker {
  id: string;
  employeeName: string;
  trackerName: string;
  reviewers: string;
  addedDate: string;
  modifiedDate: string;
}

export interface IDP {
  id: string;
  employeeId: string;
  employeeName: string;
  idpName: string;
  coach: string;
  initiatedOn: string;
  closedOn?: string;
  status: 'Initiated' | 'In Progress' | 'Completed' | 'Closed';
}

export interface RequestDeskItem {
  id: string;
  requestId: string;
  title: string;
  requestType: string;
  status: 'Submitted' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Not Urgent' | 'Reasonably Urgent' | 'Urgent';
  employeeName: string;
  submittedDate: string;
  dueDate: string;
}
