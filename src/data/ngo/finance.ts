import type { BudgetLine, Grant, AuditItem, TimesheetWeek, AttendanceQRRecord } from '@/types/ngo';

export const budgetLines: BudgetLine[] = [
  { id: 'b1', programId: 'prog-1', category: 'Personnel', allocated: 18000000, spent: 11200000, remaining: 6800000 },
  { id: 'b2', programId: 'prog-1', category: 'Activities', allocated: 15000000, spent: 9800000, remaining: 5200000 },
  { id: 'b3', programId: 'prog-1', category: 'Operations', allocated: 12000000, spent: 7500000, remaining: 4500000 },
];

export const grants: Grant[] = [
  { id: 'g1', donorId: 'don-1', programId: 'prog-1', amount: 45000000, utilized: 28500000, period: '2025' },
  { id: 'g2', donorId: 'don-2', programId: 'prog-2', amount: 12000000, utilized: 4200000, period: '2025-2026' },
];

export const auditItems: AuditItem[] = [
  {
    id: 'aud-1',
    entityType: 'Request',
    title: 'Procurement – Training Materials',
    amount: 320000,
    status: 'Pending Review',
    submittedBy: 'Grace Emeka',
    date: '2025-06-01',
  },
  {
    id: 'aud-2',
    entityType: 'Budget',
    title: 'Q3 Budget Revision – DIA Program',
    amount: 2500000,
    status: 'Clarification',
    submittedBy: 'James Adeyemi',
    date: '2025-05-20',
  },
];

export const timesheetWeeks: TimesheetWeek[] = [
  {
    id: 'ts-1',
    employeeId: '9',
    employeeName: 'Aaron Hamilton',
    weekStart: '2025-05-26',
    totalHours: 40,
    status: 'In Review',
    allocations: [
      { program: 'Community Rehabilitation', hours: 28 },
      { program: 'Disability Inclusion', hours: 12 },
    ],
  },
];

export const attendanceRecords: AttendanceQRRecord[] = [
  {
    id: 'att-1',
    employeeId: '9',
    employeeName: 'Aaron Hamilton',
    checkIn: '2025-06-04T08:02:00',
    checkOut: '2025-06-04T17:15:00',
    location: 'HQ – Abuja',
    late: true,
  },
  {
    id: 'att-2',
    employeeId: '3',
    employeeName: 'Grace Emeka',
    checkIn: '2025-06-04T07:55:00',
    location: 'Field – Lafia',
    late: false,
  },
];
