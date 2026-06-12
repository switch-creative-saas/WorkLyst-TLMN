export type ProgramStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Closed';
export type ActivityType =
  | 'Community Outreach'
  | 'Training'
  | 'Field Visit'
  | 'Monitoring Visit'
  | 'Sensitization Campaign'
  | 'Workshop'
  | 'Stakeholder Meeting'
  | 'Medical Outreach'
  | 'Research Activity';

export type RequestType =
  | 'Travel'
  | 'Activity'
  | 'Budget'
  | 'Procurement'
  | 'Asset'
  | 'Training'
  | 'Program'
  | 'Leave'
  | 'General';

export type ApprovalStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Revision Requested'
  | 'Approved'
  | 'Rejected'
  | 'Cancelled';

export interface Program {
  id: string;
  name: string;
  code: string;
  status: ProgramStatus;
  budget: number;
  spent: number;
  donor: string;
  location: string;
  startDate: string;
  endDate: string;
  manager: string;
  description: string;
}

export interface Project {
  id: string;
  programId: string;
  name: string;
  status: ProgramStatus;
  budget: number;
  indicators: number;
}

export interface Activity {
  id: string;
  programId: string;
  projectId?: string;
  title: string;
  type: ActivityType;
  status: ApprovalStatus;
  date: string;
  location: string;
  lead: string;
  budget: number;
  participants: number;
  expectedOutcomes: string;
  actualOutcomes?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  category: string;
  location: string;
  programId: string;
}

export interface Donor {
  id: string;
  name: string;
  type: string;
  totalFunding: number;
  activePrograms: number;
}

export interface Partner {
  id: string;
  name: string;
  type: string;
  location: string;
}

export interface NGORequest {
  id: string;
  type: RequestType;
  title: string;
  requester: string;
  department: string;
  amount?: number;
  status: ApprovalStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  submittedAt: string;
  currentStep: string;
  approvalHistory: ApprovalStep[];
}

export interface ApprovalStep {
  id: string;
  role: string;
  approver?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Skipped';
  date?: string;
  comment?: string;
}

export interface NGODocument {
  id: string;
  title: string;
  category: string;
  version: number;
  status: ApprovalStatus;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  programId?: string;
}

export interface NGOReport {
  id: string;
  title: string;
  type: string;
  author: string;
  status: ApprovalStatus;
  period: string;
  programId?: string;
  submittedAt?: string;
}

export interface TimesheetWeek {
  id: string;
  employeeId: string;
  employeeName: string;
  weekStart: string;
  totalHours: number;
  status: ApprovalStatus;
  allocations: { program: string; hours: number }[];
}

export interface AttendanceQRRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkIn: string;
  checkOut?: string;
  location: string;
  late: boolean;
}

export interface AuditItem {
  id: string;
  entityType: string;
  title: string;
  amount?: number;
  status: 'Pending Review' | 'Clarification' | 'Approved' | 'Rejected' | 'Escalated';
  submittedBy: string;
  date: string;
}

export interface BudgetLine {
  id: string;
  programId: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface Grant {
  id: string;
  donorId: string;
  programId: string;
  amount: number;
  utilized: number;
  period: string;
}
