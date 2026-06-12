import { programs, activities, projects } from '@/data/ngo/programs';
import { ngoRequests } from '@/data/ngo/requests';
import { ngoDocuments, ngoReports } from '@/data/ngo/documents';
import { budgetLines, grants, auditItems, timesheetWeeks, attendanceRecords } from '@/data/ngo/finance';
import { workflowDefinitions } from '@/data/ngo/workflows';
import { employees } from '@/data/employees';

export const mockDb = {
  programs: [...programs],
  projects: [...projects],
  activities: [...activities],
  requests: [...ngoRequests],
  documents: [...ngoDocuments],
  reports: [...ngoReports],
  budgetLines: [...budgetLines],
  grants: [...grants],
  auditItems: [...auditItems],
  timesheets: [...timesheetWeeks],
  attendance: [...attendanceRecords],
  workflows: [...workflowDefinitions],
  employees: [...employees],
};
